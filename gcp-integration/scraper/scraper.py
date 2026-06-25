import json
import time
from playwright.sync_api import sync_playwright

def scrape_noon():
    print("Starting Playwright scraper for noon.com...")
    
    with sync_playwright() as p:
        # Launch browser in non-headless mode initially so we can see what's happening
        # Noon might use bot protection, so running headed often helps pass initial checks
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800}
        )
        page = context.new_page()
        
        # We will search for 'laptops'
        search_query = "laptops"
        url = f"https://www.noon.com/uae-en/search/?q={search_query}"
        
        print(f"Navigating to {url}...")
        page.goto(url, wait_until="domcontentloaded")
        
        # Give it a few seconds to let JS execute and load the product grid
        print("Waiting for products to load...")
        time.sleep(5) 
        
        # Scroll a bit to trigger lazy loading if needed
        page.evaluate("window.scrollBy(0, 500)")
        time.sleep(2)
        
        # Product containers on Noon often have a specific structure. 
        # We'll try to find generic product wrappers.
        # Usually they are inside a grid and have links wrapping the whole card.
        print("Extracting products...")
        products = []
        
        # This selector tries to match noon's product grid items
        product_elements = page.query_selector_all('div[data-qa^="product-name"]')
        
        if not product_elements:
            print("Could not find elements by data-qa. Trying alternative fallback selectors...")
            # Fallback if their DOM changed
            product_elements = page.query_selector_all('a[href*="/p/"]')
            
        print(f"Found {len(product_elements)} potential product elements.")
        
        for i, el in enumerate(product_elements[:10]): # Limit to top 10
            try:
                # Get the parent container to find price and other details
                # In Noon, the <a> tag usually contains the title and price
                title = el.get_attribute("title")
                
                # If title is missing, try to get text content
                if not title:
                    title = el.inner_text().split('\n')[0]
                
                # Find price. Noon usually puts it near the title.
                # Since DOM changes frequently, we look for AED or SAR text nearby.
                parent = el.evaluate_handle('el => el.closest("a")')
                if parent:
                    url_path = parent.get_attribute("href")
                    full_url = f"https://www.noon.com{url_path}" if url_path else ""
                    
                    price_text = parent.inner_text()
                    
                    # Store raw data
                    products.append({
                        "id": i + 1,
                        "title": title.strip() if title else "Unknown",
                        "raw_card_text": price_text.replace('\n', ' | '),
                        "url": full_url
                    })
            except Exception as e:
                print(f"Error extracting an item: {e}")
                
        browser.close()
        
        # Save to file
        with open("noon_products.json", "w") as f:
            json.dump(products, f, indent=2)
            
        print(f"Successfully scraped {len(products)} products and saved to noon_products.json")

if __name__ == "__main__":
    scrape_noon()
