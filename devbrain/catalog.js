export const rulesCatalog = [
  {
    id: "clerk-sso-nextjs",
    title: "Next.js 14 + Clerk SSO Integration",
    description: "Best practices for implementing Clerk Single Sign-On (SSO) in Next.js 14 App Router, including middleware route protection, components, and session handling.",
    framework: "Next.js 14",
    language: "TypeScript",
    tags: ["Authentication", "SSO", "Security"],
    icon: "🔐",
    author: "Senior Auth Architect",
    stars: 142,
    rules: {
      cursorrules: `# Next.js 14 + Clerk SSO Architecture Rules

You are an expert developer helping to implement and maintain Clerk SSO in our Next.js App Router project. Adhere strictly to the following rules:

## Route Protection
1. **Middleware First**: All route protection must happen in \`src/middleware.ts\` (or \`middleware.ts\` at root). Do not write page-level checks unless specifically requested.
2. **Public Routes**: Explicitly define public routes using Clerk's \`authMiddleware\`:
   \`\`\`typescript
   import { authMiddleware } from "@clerk/nextjs";
   export default authMiddleware({
     publicRoutes: ["/", "/api/webhooks(.*)", "/sign-in", "/sign-up"]
   });
   export const config = {
     matcher: ["/((?!.+\\\\.[\\\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
   };
   \`\`\`

## Authentication UI & Components
1. **Clerk Components**: Use standard \`<SignInButton>\`, \`<SignUpButton>\`, and \`<UserButton>\` for auth elements. Avoid custom styled wrappers that hide standard behaviors unless approved.
2. **Redirects**: Always configure post-login/post-signup redirect URLs using environment variables:
   - \`NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in\`
   - \`NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up\`
   - \`NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard\`
   - \`NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding\`

## Session Handling & Server Components
1. **Server Components**: Use \`auth()\` to access userId and session status in React Server Components:
   \`\`\`typescript
   import { auth } from "@clerk/nextjs";
   const { userId } = auth();
   if (!userId) {
     // Handle unauthenticated state
   }
   \`\`\`
2. **Client Components**: Use the \`useAuth()\` or \`useUser()\` hooks in client-side interactive code. Always prefix client files with \`"use client"\`.
3. **Session Cookies**: Never write custom session tokens or cookies. Rely entirely on Clerk's session token and refresh logic.

## Security Practices
- NEVER print user details or Clerk API keys to stdout or debug logs.
- Protect webhooks with secret verification signatures before processing payload.
`,
      agents: `name: Clerk SSO Integration
description: Rules and guidelines for securely managing Clerk SSO in Next.js projects.
rules:
  - "Ensure middleware.ts controls all route access"
  - "Use Clerk's native authentication components rather than custom forms"
  - "Read session identifiers via auth() in Server Components and useAuth() on the Client"
  - "Do not cache session context in localStorage or custom cookies"
`
    }
  },
  {
    id: "redis-sentinel-local",
    title: "Redis Sentinel Local Setup & Connection",
    description: "Standard guidelines for configuring Redis local Sentinel high-availability clusters and writing resilient clients with automatic failover support.",
    framework: "Redis Cluster",
    language: "Any",
    tags: ["Database", "Caching", "DevOps"],
    icon: "🍒",
    author: "Senior DevOps Lead",
    stars: 98,
    rules: {
      cursorrules: `# Redis Local Sentinel Architecture Rules

Guidelines for integrating, testing, and managing local Redis Sentinel setups.

## Ports and Instances
- **Primary Redis Instance**: Runs on port \`6379\`
- **Replica Redis Instance**: Runs on port \`6380\`
- **Sentinel Instance**: Runs on port \`26379\`

## Sentinel Configuration Rules
1. **Master Monitor Configuration**: Sentinels must monitor the master using the group name \`mymaster\`:
   \`\`\`conf
   sentinel monitor mymaster 127.0.0.1 6379 2
   sentinel down-after-milliseconds mymaster 5000
   sentinel failover-timeout mymaster 10000
   \`\`\`
2. **Failover Verification**: When debugging Sentinel setups, verify current master address using:
   \`\`\`bash
   redis-cli -p 26379 SENTINEL get-master-addr-by-name mymaster
   \`\`\`

## Client Connection Resilience
1. **Sentinel-Aware Clients**: Node/Python clients must connect using the Sentinel endpoint (\`127.0.0.1:26379\`) rather than connecting directly to \`6379\` or \`6380\`.
2. **Auto-Reconnect & Retry**: Configured clients must enforce reconnect attempts:
   - Initial retry delay: \`100ms\`
   - Max retry delay: \`3000ms\`
   - Exponential backoff backplane.
`,
      agents: `name: Redis Sentinel Local Sync
description: Connection settings and sentinel failover verification rules for local environments.
rules:
  - "Verify Sentinel group is named 'mymaster'"
  - "Configure clients to connect to Sentinel (26379) rather than directly to Redis ports"
  - "Enforce exponential backoff on client re-connection attempts"
`
    }
  },
  {
    id: "fastapi-clean-architecture",
    title: "FastAPI + Clean Database Architecture",
    description: "Enterprise FastAPI project structures, strict schema validations using Pydantic v2, and resilient database sessions.",
    framework: "FastAPI",
    language: "Python",
    tags: ["API Design", "Pydantic", "Database"],
    icon: "⚡",
    author: "Principal Backend Developer",
    stars: 215,
    rules: {
      cursorrules: `# FastAPI clean database architecture rules

Follow these strict structure and API layout requirements for FastAPI projects.

## Project Structure
Organize your workspace as follows:
- \`app/api/\`: Routes and endpoints grouped by resources (e.g. \`auth.py\`, \`users.py\`)
- \`app/core/\`: Settings, security, config constants
- \`app/models/\`: SQLAlchemy declarative ORM models
- \`app/schemas/\`: Pydantic input/output schemas
- \`app/crud/\`: Basic database query operations

## Dependency Injection & Database Sessions
1. **Session Scope**: Always use \`Depends(get_db)\` for route handlers. Never keep database sessions open across request boundaries.
2. **Async Support**: Use async SQLAlchemy connections wherever possible:
   \`\`\`python
   async def get_db() -> AsyncGenerator[AsyncSession, None]:
       async with async_session_maker() as session:
           yield session
   \`\`\`

## Schema Validation
1. **Pydantic v2**: Use Pydantic v2 features (\`BaseModel\`, \`Field\`, \`model_validator\`). Do not write custom dict assertions.
2. **Response Schemas**: Every router endpoint must declare a \`response_model\` to filter sensitive database columns automatically.
`,
      agents: `name: FastAPI Database Architecture
description: Strict guidelines on project structure, dependency injection, and validations.
rules:
  - "Enforce response_model for all router endpoints"
  - "Never share database sessions outside route handler lifecycles"
  - "Separate SQLAlchemy ORM models from validation schemas"
`
    }
  },
  {
    id: "graphify-cost-optimizer",
    title: "Graphify Codebase Cost Optimizer",
    description: "Guidelines for integrating Graphify to build structured codebase relationship graphs and minimize input token consumption by AI agents.",
    framework: "Graphify",
    language: "Any",
    tags: ["Cost Saving", "AI Agents", "Optimization"],
    icon: "📉",
    author: "AI FinOps Lead",
    stars: 310,
    rules: {
      cursorrules: `# Graphify Codebase Cost Optimization Rules

You are an AI assistant working on a repository that uses Graphify (https://graphify.net/) to manage codebase relationships and reduce API token consumption. Adhere to these guidelines:

## Graph-First Context Retrieval
1. **Query the Graph First**: Before reading full files or traversing deep subdirectories, query the Graphify context index:
   \`\`\`bash
   graphify query "Find references to User authentication or SSO"
   \`\`\`
2. **Avoid Full Directory Scans**: Do not list files or recursively read directory structures using system tools when graph query results are available.

## Graphify Configurations
1. **Keep Index Tidy**: Exclude binary build outputs, package caches, and vendor folders inside \`.graphify.json\`:
   - Exclude: \`node_modules\`, \`.next\`, \`dist\`, \`build\`, \`.git\`, \`venv\`, \`__pycache__\`
2. **Relational Context**: When generating modifications, ask the graph for dependencies of the target files to avoid breaking upstream/downstream integrations.
`,
      agents: `name: Graphify Cost Optimization
description: Core rules for querying local Graphify indices and reducing token tax.
rules:
  - "Use graphify query commands rather than recursively scanning codebase files"
  - "Configure .graphify.json to exclude build directories, node_modules, and cache files"
  - "Check relationships in the graph before editing core components"
`
    }
  }
];
