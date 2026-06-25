#!/usr/bin/env python3
import os
import sys
import argparse
import json

# ANSI Color Codes for Premium Console Design
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

# Embedded Rules Database for complete single-file portability
RULES_DATABASE = {
    "clerk-sso-nextjs": {
        "title": "Next.js 14 + Clerk SSO Integration",
        "framework": "Next.js 14",
        "language": "TypeScript",
        "tags": ["Authentication", "SSO", "Security"],
        "cursorrules": """# Next.js 14 + Clerk SSO Architecture Rules

You are an expert developer helping to implement and maintain Clerk SSO in our Next.js App Router project. Adhere strictly to the following rules:

## Route Protection
1. **Middleware First**: All route protection must happen in `src/middleware.ts` (or `middleware.ts` at root). Do not write page-level checks unless specifically requested.
2. **Public Routes**: Explicitly define public routes using Clerk's `authMiddleware`:
   ```typescript
   import { authMiddleware } from "@clerk/nextjs";
   export default authMiddleware({
     publicRoutes: ["/", "/api/webhooks(.*)", "/sign-in", "/sign-up"]
   });
   export const config = {
     matcher: ["/((?!.+\\\\.[\\\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
   };
   ```

## Authentication UI & Components
1. **Clerk Components**: Use standard `<SignInButton>`, `<SignUpButton>`, and `<UserButton>` for auth elements. Avoid custom styled wrappers that hide standard behaviors unless approved.
2. **Redirects**: Always configure post-login/post-signup redirect URLs using environment variables:
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding`

## Session Handling & Server Components
1. **Server Components**: Use `auth()` to access userId and session status in React Server Components:
   ```typescript
   import { auth } from "@clerk/nextjs";
   const { userId } = auth();
   if (!userId) {
     // Handle unauthenticated state
   }
   ```
2. **Client Components**: Use the `useAuth()` or `useUser()` hooks in client-side interactive code. Always prefix client files with `"use client"`.
3. **Session Cookies**: Never write custom session tokens or cookies. Rely entirely on Clerk's session token and refresh logic.

## Security Practices
- NEVER print user details or Clerk API keys to stdout or debug logs.
- Protect webhooks with secret verification signatures before processing payload.
""",
        "agents": """name: Clerk SSO Integration
description: Rules and guidelines for securely managing Clerk SSO in Next.js projects.
rules:
  - "Ensure middleware.ts controls all route access"
  - "Use Clerk's native authentication components rather than custom forms"
  - "Read session identifiers via auth() in Server Components and useAuth() on the Client"
  - "Do not cache session context in localStorage or custom cookies"
"""
    },
    "redis-sentinel-local": {
        "title": "Redis Sentinel Local Setup & Connection",
        "framework": "Redis Cluster",
        "language": "Any",
        "tags": ["Database", "Caching", "DevOps"],
        "cursorrules": """# Redis Local Sentinel Architecture Rules

Guidelines for integrating, testing, and managing local Redis Sentinel setups.

## Ports and Instances
- **Primary Redis Instance**: Runs on port `6379`
- **Replica Redis Instance**: Runs on port `6380`
- **Sentinel Instance**: Runs on port `26379`

## Sentinel Configuration Rules
1. **Master Monitor Configuration**: Sentinels must monitor the master using the group name `mymaster`:
   ```conf
   sentinel monitor mymaster 127.0.0.1 6379 2
   sentinel down-after-milliseconds mymaster 5000
   sentinel failover-timeout mymaster 10000
   ```
2. **Failover Verification**: When debugging Sentinel setups, verify current master address using:
   ```bash
   redis-cli -p 26379 SENTINEL get-master-addr-by-name mymaster
   ```

## Client Connection Resilience
1. **Sentinel-Aware Clients**: Node/Python clients must connect using the Sentinel endpoint (`127.0.0.1:26379`) rather than connecting directly to `6379` or `6380`.
2. **Auto-Reconnect & Retry**: Configured clients must enforce reconnect attempts:
   - Initial retry delay: `100ms`
   - Max retry delay: `3000ms`
   - Exponential backoff backplane.
""",
        "agents": """name: Redis Sentinel Local Sync
description: Connection settings and sentinel failover verification rules for local environments.
rules:
  - "Verify Sentinel group is named 'mymaster'"
  - "Configure clients to connect to Sentinel (26379) rather than directly to Redis ports"
  - "Enforce exponential backoff on client re-connection attempts"
"""
    },
    "fastapi-clean-architecture": {
        "title": "FastAPI + Clean Database Architecture",
        "framework": "FastAPI",
        "language": "Python",
        "tags": ["API Design", "Pydantic", "Database"],
        "cursorrules": """# FastAPI clean database architecture rules

Follow these strict structure and API layout requirements for FastAPI projects.

## Project Structure
Organize your workspace as follows:
- `app/api/`: Routes and endpoints grouped by resources (e.g. `auth.py`, `users.py`)
- `app/core/`: Settings, security, config constants
- `app/models/`: SQLAlchemy declarative ORM models
- `app/schemas/`: Pydantic input/output schemas
- `app/crud/`: Basic database query operations

## Dependency Injection & Database Sessions
1. **Session Scope**: Always use `Depends(get_db)` for route handlers. Never keep database sessions open across request boundaries.
2. **Async Support**: Use async SQLAlchemy connections wherever possible:
   ```python
   async def get_db() -> AsyncGenerator[AsyncSession, None]:
       async with async_session_maker() as session:
           yield session
   ```

## Schema Validation
1. **Pydantic v2**: Use Pydantic v2 features (`BaseModel`, `Field`, `model_validator`). Do not write custom dict assertions.
2. **Response Schemas**: Every router endpoint must declare a `response_model` to filter sensitive database columns automatically.
""",
        "agents": """name: FastAPI Database Architecture
description: Strict guidelines on project structure, dependency injection, and validations.
rules:
  - "Enforce response_model for all router endpoints"
  - "Never share database sessions outside route handler lifecycles"
  - "Separate SQLAlchemy ORM models from validation schemas"
"""
    },
    "graphify-cost-optimizer": {
        "title": "Graphify Codebase Cost Optimizer",
        "framework": "Graphify",
        "language": "Any",
        "tags": ["Cost Saving", "AI Agents", "Optimization"],
        "cursorrules": """# Graphify Codebase Cost Optimization Rules

You are an AI assistant working on a repository that uses Graphify (https://graphify.net/) to manage codebase relationships and reduce API token consumption. Adhere to these guidelines:

## Graph-First Context Retrieval
1. **Query the Graph First**: Before reading full files or traversing deep subdirectories, query the Graphify context index:
   ```bash
   graphify query "Find references to User authentication or SSO"
   ```
2. **Avoid Full Directory Scans**: Do not list files or recursively read directory structures using system tools when graph query results are available.

## Graphify Configurations
1. **Keep Index Tidy**: Exclude binary build outputs, package caches, and vendor folders inside `.graphify.json`:
   - Exclude: `node_modules`, `.next`, `dist`, `build`, `.git`, `venv`, `__pycache__`
2. **Relational Context**: When generating modifications, ask the graph for dependencies of the target files to avoid breaking upstream/downstream integrations.
""",
        "agents": """name: Graphify Cost Optimization
description: Core rules for querying local Graphify indices and reducing token tax.
rules:
  - "Use graphify query commands rather than recursively scanning codebase files"
  - "Configure .graphify.json to exclude build directories, node_modules, and cache files"
  - "Check relationships in the graph before editing core components"
"""
    }
}

def print_logo():
    logo = f"""{Colors.OKBLUE}
     ____             ____            _
    |  _ \\  _____   _| __ ) _ __ __ _(_)_ __
    | | | |/ _ \\ \\ / /  _ \\| '__/ _` | | '_ \\
    | |_| |  __/\\ V /| |_) | | | (_| | | | | |
    |____/ \\___| \\_/ |____/|_|  \\__,_|_|_| |_| {Colors.OKCYAN}(CLI Client){Colors.ENDC}
    """
    print(logo)

def list_rules():
    print(f"{Colors.BOLD}Available AI Rules Templates in Catalog:{Colors.ENDC}\n")
    header = f"{'Rule ID':<28} | {'Title':<40} | {'Framework':<15} | {'Language':<12}"
    print(header)
    print("-" * len(header))
    for rid, rule in RULES_DATABASE.items():
        print(f"{Colors.OKGREEN}{rid:<28}{Colors.ENDC} | {rule['title']:<40} | {rule['framework']:<15} | {rule['language']:<12}")
    print(f"\n{Colors.OKBLUE}Tip: Run 'python3 devbrain.py sync [rule-id]' to write config files to your project.{Colors.ENDC}")

def sync_rule(rule_id, target_format):
    if rule_id not in RULES_DATABASE:
        print(f"{Colors.FAIL}Error: Rule ID '{rule_id}' not found in catalog.{Colors.ENDC}")
        list_rules()
        sys.exit(1)
    
    rule = RULES_DATABASE[rule_id]
    cwd = os.getcwd()
    
    print(f"{Colors.OKBLUE}Syncing rule: {Colors.BOLD}{rule['title']}{Colors.ENDC}")
    
    sync_count = 0
    
    if target_format in ['all', 'cursor']:
        filepath = os.path.join(cwd, '.cursorrules')
        with open(filepath, 'w') as f:
            f.write(rule['cursorrules'])
        print(f"{Colors.OKGREEN}[SUCCESS]{Colors.ENDC} Wrote .cursorrules file to {Colors.BOLD}{filepath}{Colors.ENDC}")
        sync_count += 1
        
    if target_format in ['all', 'agents']:
        agents_dir = os.path.join(cwd, '.agents')
        if not os.path.exists(agents_dir):
            os.makedirs(agents_dir, exist_ok=True)
            
        filepath = os.path.join(agents_dir, 'AGENTS.md')
        with open(filepath, 'w') as f:
            f.write(rule['agents'])
        print(f"{Colors.OKGREEN}[SUCCESS]{Colors.ENDC} Wrote AGENTS.md file to {Colors.BOLD}{filepath}{Colors.ENDC}")
        sync_count += 1
        
    print(f"\n{Colors.BOLD}{Colors.OKGREEN}Synced {sync_count} rule file(s) successfully!{Colors.ENDC}")

def init_custom_rule():
    print(f"{Colors.HEADER}=== Interactive Rule Architect ==={Colors.ENDC}")
    print("Answer a few quick prompts to scaffold custom rules for your team.\n")
    
    title = input(f"Enter Project / Rule Title {Colors.OKCYAN}[e.g. My Next Auth]{Colors.ENDC}: ").strip()
    if not title:
        title = "My Project Rules"
        
    framework = input(f"Framework / Language {Colors.OKCYAN}[e.g. React/Go]{Colors.ENDC}: ").strip()
    if not framework:
        framework = "Generic Stack"
        
    print("\nEnforced Directory / Folder Rules (Type empty line to finish):")
    folder_rules = []
    while True:
        rule_in = input(f"- ").strip()
        if not rule_in:
            break
        folder_rules.append(rule_in)
        
    print("\nEnforced Coding Guidelines & Code Patterns (Type empty line to finish):")
    code_rules = []
    while True:
        rule_in = input(f"- ").strip()
        if not rule_in:
            break
        code_rules.append(rule_in)
        
    # Generate cursorrules text
    cursorrules_content = f"""# {title} Architecture Rules

Target Stack: {framework}

## Project Directory & Structure Requirements
"""
    if folder_rules:
        for fr in folder_rules:
            cursorrules_content += f"- {fr}\n"
    else:
        cursorrules_content += "- Keep core logic separated by module domains.\n"
        
    cursorrules_content += "\n## Code Guidelines & Coding Patterns\n"
    if code_rules:
        for cr in code_rules:
            cursorrules_content += f"- {cr}\n"
    else:
        cursorrules_content += "- Ensure strict types and clean error handling.\n"
        
    cwd = os.getcwd()
    filepath = os.path.join(cwd, '.cursorrules')
    with open(filepath, 'w') as f:
        f.write(cursorrules_content)
        
    print(f"\n{Colors.OKGREEN}[SUCCESS] Custom rules initialized!{Colors.ENDC}")
    print(f"File created: {Colors.BOLD}{filepath}{Colors.ENDC}")

def setup_graphify():
    import shutil
    print(f"{Colors.HEADER}=== Graphify Integration Setup ==={Colors.ENDC}\n")
    
    # 1. Check if graphify command exists
    graphify_path = shutil.which("graphify")
    if graphify_path:
        print(f"{Colors.OKGREEN}[FOUND]{Colors.ENDC} Local Graphify binary found at: {Colors.BOLD}{graphify_path}{Colors.ENDC}")
    else:
        print(f"{Colors.WARNING}[NOTICE]{Colors.ENDC} Graphify CLI binary was not found in your current path.")
        print(f"To install, run: {Colors.BOLD}npm install -g @graphify/cli{Colors.ENDC} or visit {Colors.UNDERLINE}https://graphify.net/{Colors.ENDC}\n")
        
    # 2. Write default configuration .graphify.json
    cwd = os.getcwd()
    config_path = os.path.join(cwd, ".graphify.json")
    
    default_config = {
        "excludes": [
            "node_modules",
            ".next",
            "dist",
            "build",
            ".git",
            "venv",
            "__pycache__",
            ".gemini",
            ".agents",
            "*.log"
        ],
        "includeMedia": False,
        "maxFileSizeKb": 1024
    }
    
    try:
        with open(config_path, 'w') as f:
            json.dump(default_config, f, indent=2)
        print(f"{Colors.OKGREEN}[SUCCESS]{Colors.ENDC} Initialized standard {Colors.BOLD}.graphify.json{Colors.ENDC} config in this repository.")
    except Exception as e:
        print(f"{Colors.FAIL}Error writing config: {e}{Colors.ENDC}")
        return
        
    print(f"\n{Colors.BOLD}Next Steps to index your repository:{Colors.ENDC}")
    print(f"1. Run {Colors.OKCYAN}graphify index{Colors.ENDC} in this folder to build the knowledge graph.")
    print(f"2. Your AI agent can now navigate relationships using {Colors.OKCYAN}graphify query \"...\" {Colors.ENDC}saving you token costs!")

def main():
    parser = argparse.ArgumentParser(description="DevBrain: AI-First Rules Generator and Sync Client.")
    subparsers = parser.add_subparsers(dest="command", help="Commands to execute")
    
    # List Command
    subparsers.add_parser("list", help="List all rules in catalog")
    
    # Sync Command
    sync_parser = subparsers.add_parser("sync", help="Synchronize a rule to your local directory")
    sync_parser.add_argument("rule_id", type=str, help="ID of the rule (e.g. clerk-sso-nextjs)")
    sync_parser.add_argument("--format", type=str, choices=['cursor', 'agents', 'all'], default='all', 
                             help="Target file format to write (default: all)")
    
    # Init Command
    subparsers.add_parser("init", help="Interactively generate a new .cursorrules file")
    
    # Graphify Command
    subparsers.add_parser("graphify", help="Configure Graphify settings and generate .graphify.json")
    
    args = parser.parse_args()
    
    print_logo()
    
    if args.command == "list":
        list_rules()
    elif args.command == "sync":
        sync_rule(args.rule_id, args.format)
    elif args.command == "init":
        init_custom_rule()
    elif args.command == "graphify":
        setup_graphify()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
