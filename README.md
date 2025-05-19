# Payout Automation Demo

## Setup
1. Copy \`.env.example\` to \`.env\` and fill in credentials.
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Run servers:
   \`\`\`
   npm run dev:api   # Express + Socket.io on :4000
   npm run dev:web   # Next.js on :3000
   \`\`\`

## Structure
- \`web/\`: Next.js frontend  
- \`api/\`: Express + Socket.io backend  
- \`shared/\`: Shared TS & Zod types  
- \`scripts/\`: Seed & utilities
