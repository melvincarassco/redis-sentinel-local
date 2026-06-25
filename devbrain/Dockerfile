FROM nginx:alpine

# Copy static frontend assets and the CLI script into the Nginx document root
COPY index.html style.css app.js catalog.js devbrain.py /usr/share/nginx/html/

# Expose HTTP port
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
