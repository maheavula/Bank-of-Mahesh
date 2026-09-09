# Bank of AMR — Secure Banking Portal


## Credentials to login

| **Customer** | AMR Kumar  | `customer@bankofamr.local` | `AmrCust#2026!Kumar` |
---

## Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Install Dependencies
Run from the root directory to install root, client, and server dependencies:
```bash
npm run install:all
```

### 2. Start Development Server
Launches both Express backend (`localhost:5000`) and Vite React frontend (`localhost:5173`) concurrently:
```bash
npm run dev
```

Open your browser to: **`http://localhost:5173`**

### 3. Run Automated API Tests
Executes Vitest integration tests for Auth, Transactions, Admin controls, and Persistence safety:
```bash
npm test
```

### 4. Build Production Bundle
```bash
npm run build
```

---
