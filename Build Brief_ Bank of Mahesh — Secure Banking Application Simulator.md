# Build Brief: Bank of Mahesh — Secure Banking Application Simulator

## 1. ROLE

You are a senior full-stack engineer, software architect, UI/UX designer, security engineer, and QA engineer.

Build a complete, runnable, end-to-end **banking application simulator** called:

# Bank of Mahesh

This is a **simulation/demo application**, not a real banking system. It must not connect to real banks, payment gateways, card networks, financial institutions, or external financial APIs.

The application should feel like a polished modern banking product while remaining completely self-contained.

Do not create a prototype with fake buttons or incomplete screens. Every major UI interaction must work end-to-end against the backend and persistent runtime data.

---

# 2. PRIMARY OBJECTIVE

Create a full-stack banking simulator with:

- Customer registration
- Customer login using email/password
- Admin login
- Session management
- Customer dashboard
- Account/balance simulation
- Transaction history
- Money transfer simulation
- Customer profile management
- Admin dashboard
- Admin customer management
- Admin account management
- Admin transaction visibility
- Role-based authorization
- Persistent data using `runtime.json`
- Secure password handling
- Secure session handling
- Input validation
- Error handling
- Responsive Spatial UI design
- Exactly **6 API groups**
- Seed/demo data
- Logout
- Protected routes
- Loading/error/empty states

The application must run locally with one command after dependency installation.

---

# 3. IMPORTANT SECURITY BOUNDARY

This is a banking **simulator**.

Do NOT implement:

- Real payment processing
- Real bank integrations
- Real card processing
- Real UPI integration
- Real SWIFT/NEFT/RTGS
- Real financial transactions
- Real OTP delivery
- Real email delivery
- Real KYC verification
- Real government identity verification
- Real credit-card processing

Any money movement must only modify simulated balances stored in `runtime.json`.

Clearly label the application internally as:

> Bank of Mahesh — Banking Simulator

Do not claim that it is suitable for production banking.

---

# 4. RECOMMENDED TECHNOLOGY

Use a modern full-stack JavaScript/TypeScript architecture.

Preferred stack:

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React or equivalent icon library
- React Router
- Modern component architecture

### Backend
- Node.js
- Express
- TypeScript

### Persistence
- `runtime.json`

### Authentication
- Password hashing using Argon2 or bcrypt
- Server-side sessions
- Secure HTTP-only cookies
- Session expiration
- Role-based authorization

Do not introduce a database unless absolutely necessary.

`runtime.json` must be the source of truth for application data.

---

# 5. PROJECT STRUCTURE

Create a clean structure similar to:

```text
bank-of-mahesh/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── types/
│   │   ├── utils/
│   │   └── App.tsx
│   │
│   └── ...
│
├── server/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── auth/
│   ├── routes/
│   └── server.ts
│
├── data/
│   └── runtime.json
│
├── package.json
├── README.md
└── ...
```

You may improve the structure if there is a better architectural approach.

Keep frontend and backend concerns clearly separated.

---

# 6. ONLY SIX API GROUPS

The backend must expose exactly **six logical API groups**.

Do not create unnecessary APIs.

## API 1 — Authentication

```text
/api/auth
```

Responsibilities:

- Sign up
- Login
- Logout
- Get current authenticated session

Operations should cover:

```text
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

Signup should create a customer account.

Login should authenticate using:

- Email
- Password

Return only the minimum required user/session information.

Never return password hashes.

---

# 7. API 2 — Customer

```text
/api/customer
```

Responsibilities:

- Get own profile
- Update own profile
- Get own account information
- Get own dashboard data

Example operations:

```text
GET /api/customer/profile
PUT /api/customer/profile
GET /api/customer/account
```

A customer must only be able to access their own information.

---

# 8. API 3 — Transactions

```text
/api/transactions
```

Responsibilities:

- Get customer's transactions
- Get transaction details
- Create simulated transfer

Example:

```text
GET  /api/transactions
GET  /api/transactions/:id
POST /api/transactions/transfer
```

Transfer behavior:

1. Authenticate the user.
2. Validate sender.
3. Validate recipient.
4. Validate amount.
5. Ensure amount is positive.
6. Ensure sufficient simulated balance.
7. Debit sender.
8. Credit recipient.
9. Create transaction record.
10. Generate unique transaction ID.
11. Record timestamp.
12. Persist changes to `runtime.json`.
13. Return transaction result.

Transfers are purely simulated.

Use atomic file-writing logic so that concurrent writes do not corrupt `runtime.json`.

---

# 9. API 4 — Admin

```text
/api/admin
```

Only users with:

```text
role: "admin"
```

may access this API.

Responsibilities:

- Admin dashboard statistics
- Customer list
- Customer details
- Customer status management
- Account overview
- Transaction overview

Example operations:

```text
GET /api/admin/dashboard
GET /api/admin/customers
GET /api/admin/customers/:id
PATCH /api/admin/customers/:id/status
GET /api/admin/transactions
```

Admin must NOT be able to see customer passwords or password hashes.

---

# 10. API 5 — Session

```text
/api/session
```

Responsibilities:

- Session validation
- Session refresh
- Session expiration information

Example:

```text
GET  /api/session
POST /api/session/refresh
```

Implement server-side sessions.

Do not store authentication state only in localStorage.

Use secure cookies wherever possible.

Session requirements:

- HTTP-only
- SameSite protection
- Expiration
- Session ID rotation after login
- Logout invalidation
- Role stored server-side
- Session lookup against runtime state

For local development, configure security flags appropriately without making the application impossible to run over HTTP.

---

# 11. API 6 — System

```text
/api/system
```

Responsibilities:

- Health check
- Simulator metadata
- Application status

Example:

```text
GET /api/system/health
GET /api/system/info
```

Return information such as:

```json
{
  "application": "Bank of Mahesh",
  "mode": "simulation",
  "status": "online"
}
```

Do not expose sensitive server information.

---

# 12. IMPORTANT API CONSTRAINT

The application must contain exactly these six logical API domains:

1. `/api/auth`
2. `/api/customer`
3. `/api/transactions`
4. `/api/admin`
5. `/api/session`
6. `/api/system`

If additional internal functions are required, implement them as backend services/helpers rather than additional public API groups.

Document every endpoint in the README.

---

# 13. RUNTIME.JSON DATA MODEL

Use:

```text
/data/runtime.json
```

as the application's persistence layer.

Example structure:

```json
{
  "users": [],
  "accounts": [],
  "transactions": [],
  "sessions": [],
  "auditLogs": [],
  "metadata": {
    "application": "Bank of Mahesh",
    "version": "1.0.0"
  }
}
```

### User

```json
{
  "id": "USR-10001",
  "name": "Mahesh Kumar",
  "email": "mahesh@example.com",
  "passwordHash": "...",
  "role": "customer",
  "status": "active",
  "phone": "+91XXXXXXXXXX",
  "createdAt": "...",
  "updatedAt": "..."
}
```

Roles:

```text
customer
admin
```

Statuses:

```text
active
suspended
```

### Account

```json
{
  "id": "ACC-10001",
  "userId": "USR-10001",
  "accountNumber": "BMXXXXXXXXXXXX",
  "accountType": "Savings",
  "currency": "INR",
  "balance": 125000.50,
  "status": "active",
  "createdAt": "..."
}
```

### Transaction

```json
{
  "id": "TXN-10001",
  "senderAccountId": "ACC-10001",
  "receiverAccountId": "ACC-10002",
  "amount": 2500,
  "currency": "INR",
  "type": "transfer",
  "status": "completed",
  "description": "Monthly transfer",
  "createdAt": "..."
}
```

### Session

```json
{
  "id": "SESSION-...",
  "userId": "USR-10001",
  "createdAt": "...",
  "expiresAt": "...",
  "lastActivityAt": "..."
}
```

Do not store plaintext passwords.

---

# 14. SEED DATA

On first startup, automatically create demo data if `runtime.json` does not exist or is empty.

Create:

### Admin

```text
Email:
admin@bankofmahesh.local

Password:
Admin@12345
```

### Demo Customer

```text
Email:
customer@bankofmahesh.local

Password:
Customer@12345
```

Create several simulated customers and accounts so the admin dashboard and transaction pages are populated.

Clearly mark these as demo credentials in the login UI.

Do not expose passwords through APIs.

---

# 15. LOGIN EXPERIENCE

Create a premium login screen.

Layout:

- Bank of Mahesh logo/wordmark
- Secure login card
- Email input
- Password input
- Show/hide password
- Remember this device UI if appropriate
- Login button
- Sign-up link
- Demo credentials section
- Security messaging

Example copy:

> Welcome back to Bank of Mahesh

> Secure access to your banking simulator.

Use realistic validation.

Examples:

```text
Invalid email format
Password is required
Invalid credentials
Account suspended
Session expired
```

Never reveal whether a specific email exists during inappropriate authentication errors.

---

# 16. SIGN-UP EXPERIENCE

Create a multi-step or polished signup page.

Fields:

- Full name
- Email
- Phone
- Password
- Confirm password

Validation:

- Required fields
- Valid email
- Password minimum length
- Password confirmation
- Duplicate email prevention
- Basic phone validation

On successful signup:

1. Create user.
2. Create simulated savings account.
3. Generate account number.
4. Assign customer role.
5. Start authenticated session or redirect to login.
6. Persist to `runtime.json`.

---

# 17. CUSTOMER DASHBOARD

After login, customers should see:

### Header

- Bank of Mahesh logo
- Search
- Notifications icon
- Profile menu
- Logout

### Sidebar

```text
Overview
My Account
Transactions
Transfer Money
Profile
Security
```

### Dashboard cards

Display:

- Available balance
- Account number
- Account type
- Recent transactions
- Monthly simulated spending
- Incoming transfers
- Outgoing transfers

Example:

```text
₹1,25,000.50
Available Balance

Savings Account
•••• 4821
```

Use Indian Rupee formatting.

---

# 18. ACCOUNT PAGE

Display:

- Account number
- Account type
- Current balance
- Currency
- Account status
- Account creation date

Provide actions such as:

```text
Transfer Money
View Transactions
```

Never display sensitive information unnecessarily.

---

# 19. TRANSFER MONEY PAGE

Create a polished transfer form.

Fields:

```text
Recipient Account Number
Amount
Description
```

Before submitting:

- Validate amount
- Validate recipient
- Show available balance
- Prevent self-transfer unless intentionally supported
- Require confirmation

Show confirmation modal:

```text
Confirm Transfer

You are about to transfer

₹5,000.00

to

BM••••••4821

Do you want to continue?
```

After successful transaction:

Display:

- Success state
- Transaction ID
- Amount
- Recipient
- Date/time
- New balance

Provide:

```text
View Transaction
Back to Dashboard
```

---

# 20. TRANSACTION HISTORY

Create a professional transaction table.

Columns:

```text
Date
Transaction ID
Description
Type
Amount
Status
```

Types:

- Incoming
- Outgoing

Statuses:

- Completed
- Failed
- Pending

Add:

- Search
- Filter
- Date filter
- Transaction type filter
- Status filter
- Pagination if necessary

Responsive mobile behavior must be handled elegantly.

---

# 21. PROFILE PAGE

Customers can view/update:

- Name
- Email
- Phone

Email should not be casually changed without an appropriate simulated security flow.

Display:

```text
Account Created
Last Login
Account Status
Customer ID
```

---

# 22. SECURITY PAGE

Create a security center.

Display:

- Current session status
- Last login
- Session expiration
- Password change UI
- Active session information

Because this is a simulator, clearly distinguish simulated security functionality from production security infrastructure.

---

# 23. ADMIN DASHBOARD

Admins should have a completely different navigation experience.

Sidebar:

```text
Dashboard
Customers
Accounts
Transactions
System
Audit Logs
```

Dashboard cards:

```text
Total Customers
Active Customers
Suspended Customers
Total Simulated Balance
Transactions Today
Total Transactions
```

Add visual analytics:

- Customer growth
- Transaction volume
- Transaction status distribution
- Simulated balance overview

Use data from `runtime.json`.

---

# 24. ADMIN CUSTOMER MANAGEMENT

Create a customer management table.

Columns:

```text
Customer
Email
Account
Balance
Status
Created
Actions
```

Actions:

```text
View
Suspend
Activate
```

Admin should be able to suspend/activate customer accounts.

Suspended users:

- Cannot log in
- Existing sessions should become invalid
- Cannot perform transfers

Do not delete users permanently from the UI.

---

# 25. ADMIN CUSTOMER DETAILS

Show:

- Customer ID
- Name
- Email
- Phone
- Role
- Status
- Account
- Balance
- Transaction count
- Created date
- Last login

Do not expose password hashes.

---

# 26. ADMIN TRANSACTION VIEW

Admins can view all simulated transactions.

Include:

- Search
- Filter
- Status
- Amount
- Date
- Sender
- Receiver

Provide a transaction detail drawer/modal.

---

# 27. AUDIT LOGGING

Create internal audit logs in `runtime.json`.

Record important actions:

```text
LOGIN
LOGOUT
SIGNUP
TRANSFER
PROFILE_UPDATE
ADMIN_STATUS_CHANGE
SESSION_EXPIRED
```

Example:

```json
{
  "id": "AUDIT-10001",
  "userId": "USR-10001",
  "action": "TRANSFER",
  "timestamp": "...",
  "metadata": {
    "transactionId": "TXN-10001"
  }
}
```

Never log passwords.

Avoid logging sensitive authentication secrets.

---

# 28. SESSION MANAGEMENT

Implement real server-side session handling.

Requirements:

- Login creates session.
- Session ID stored in secure cookie.
- Backend resolves session.
- Protected API requests validate session.
- Session expires automatically.
- Logout destroys session.
- Suspended users' sessions become invalid.
- Session IDs should be unpredictable.
- Rotate session ID after successful authentication.
- Do not trust client-provided roles.

Frontend should automatically handle:

```text
401 Unauthorized
403 Forbidden
```

For expired sessions:

```text
Your session has expired.

Please sign in again.
```

Then redirect to login.

---

# 29. ROLE-BASED ACCESS CONTROL

Implement middleware:

```text
requireAuth()
requireRole("customer")
requireRole("admin")
```

Rules:

### Customer

Can:

- View own account
- View own transactions
- Transfer simulated money
- Update own profile
- Manage own session

Cannot:

- Access admin APIs
- View other customers
- Modify balances directly
- Modify roles
- Modify transaction records

### Admin

Can:

- View customer data
- View simulated accounts
- View transactions
- Suspend/activate customers
- View system statistics

Do not automatically give admins permission to impersonate customers.

---

# 30. SPATIAL UI DESIGN

The visual design is extremely important.

Create a premium **Spatial UI** inspired by modern fintech dashboards and futuristic operating-system interfaces.

Avoid generic Bootstrap-style banking screens.

### Visual language

Use:

- Deep layered backgrounds
- Floating glass surfaces
- Soft gradients
- Large rounded cards
- Depth
- Subtle shadows
- Blur
- Ambient lighting
- Thin borders
- Spacious layouts
- Floating navigation
- Large typography
- Micro-interactions
- Smooth transitions
- Data visualization
- Elegant icons

The interface should feel like:

> A futuristic private banking terminal combined with modern spatial computing UI.

Do NOT overuse glassmorphism.

The UI must remain readable and professional.

---

# 31. COLOR SYSTEM

Primary visual direction:

- Deep midnight/near-black background
- White/soft-white typography
- Cool neutral surfaces
- Emerald/teal banking accent
- Subtle blue secondary accent
- Muted gray text

Use semantic colors for:

```text
Success
Warning
Error
Info
```

Do not make the entire application neon.

The result should feel expensive and restrained.

---

# 32. SPATIAL COMPONENTS

Create reusable components such as:

```text
SpatialCard
GlassPanel
BalanceCard
AccountCard
TransactionRow
TransactionTable
StatCard
Sidebar
TopBar
CommandSearch
Modal
Drawer
Toast
ConfirmationDialog
StatusBadge
Avatar
ChartCard
EmptyState
LoadingState
ErrorState
```

Use consistent spacing, radius, typography, and interaction behavior.

---

# 33. MICRO-INTERACTIONS

Add subtle animations:

- Card hover depth
- Button press feedback
- Sidebar transitions
- Modal entrance
- Transaction success animation
- Balance refresh animation
- Loading skeletons
- Toast notifications
- Page transitions

Animations must not become distracting.

Respect:

```text
prefers-reduced-motion
```

where practical.

---

# 34. RESPONSIVE DESIGN

The application must work on:

- Desktop
- Laptop
- Tablet
- Mobile

Desktop:

- Spatial sidebar
- Large dashboard
- Multi-column cards

Mobile:

- Collapsible navigation
- Stacked cards
- Mobile-friendly transaction list
- Bottom navigation if appropriate
- Full-screen dialogs where necessary

Do not simply shrink the desktop UI.

Design responsive layouts intentionally.

---

# 35. FRONTEND STATE MANAGEMENT

Use a clean state-management strategy.

Maintain:

- Authentication state
- Current user
- Session state
- Account state
- Transaction state
- Admin state
- Loading state
- Error state

Avoid unnecessary global state.

Create reusable API service functions.

---

# 36. ERROR HANDLING

Backend must return consistent error structures.

Example:

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient simulated balance."
  }
}
```

Frontend must show useful human-readable messages.

Handle:

- Invalid credentials
- Expired session
- Suspended account
- Invalid recipient
- Insufficient balance
- Invalid amount
- Duplicate email
- Missing fields
- Server errors
- Runtime file errors

Never expose stack traces to the browser in production mode.

---

# 37. INPUT VALIDATION

Validate both:

### Frontend

For immediate UX feedback.

### Backend

For actual security.

Never trust frontend validation.

Validate:

- Email
- Password
- Name
- Phone
- Account number
- Amount
- Transaction description
- IDs

Sanitize appropriate text fields.

---

# 38. FILE PERSISTENCE SAFETY

Because `runtime.json` is the database:

Implement safe persistence.

Do NOT perform careless concurrent writes.

Create a small persistence service that:

1. Reads runtime state.
2. Modifies state in memory.
3. Serializes changes.
4. Writes atomically.
5. Prevents malformed JSON.
6. Handles missing file.
7. Creates backup/recovery behavior if appropriate.

For example, use temporary-file replacement rather than directly truncating the main file.

Keep implementation simple and reliable.

---

# 39. MONEY HANDLING

Do not use floating-point arithmetic carelessly for financial calculations.

Represent simulated monetary values safely.

Preferred:

```text
integer paise
```

For example:

```text
₹1,250.50

125050 paise
```

Convert to formatted INR only at the UI/API presentation layer.

Implement helpers:

```text
formatINR()
parseMoney()
addMoney()
subtractMoney()
```

Never allow negative transfer amounts.

---

# 40. ACCOUNT NUMBER GENERATION

Generate unique simulated Bank of Mahesh account numbers.

Example:

```text
BM001XXXXXXXX
```

Requirements:

- Unique
- Non-sequential if practical
- Never expose internal user IDs as account numbers
- Validate recipient account numbers server-side

---

# 41. TRANSACTION ID GENERATION

Generate unique IDs:

```text
TXN-XXXXXXXX
```

Use sufficiently unpredictable identifiers.

---

# 42. SECURITY REQUIREMENTS

Implement reasonable application-level security:

- Password hashing
- HTTP-only cookies
- SameSite cookies
- Session expiration
- Session rotation
- Authorization middleware
- Server-side role validation
- Input validation
- Rate limiting for login if practical
- Generic authentication errors
- No password logging
- No password hashes in API responses
- No sensitive data in frontend localStorage
- Safe JSON persistence
- Security headers
- CORS configured appropriately
- Environment variables for configurable secrets
- Production error handling

Use a server-side session secret from an environment variable.

Provide:

```text
.env.example
```

Do not commit real secrets.

---

# 43. ACCESSIBILITY

Follow good accessibility practices.

Include:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible form labels
- ARIA labels where required
- Sufficient contrast
- Screen-reader-friendly status messages
- Reduced-motion support

Do not sacrifice accessibility for visual effects.

---

# 44. LOADING STATES

Every asynchronous page must have a deliberate loading state.

Examples:

```text
Dashboard skeleton
Transaction skeleton
Customer table skeleton
Account loading state
```

Avoid blank white/black screens while requests are running.

---

# 45. EMPTY STATES

Design useful empty states.

Example:

> No transactions yet

> Your simulated transaction history will appear here after your first transfer.

Provide an appropriate CTA.

---

# 46. TOAST SYSTEM

Create reusable toast notifications.

Examples:

```text
Transfer completed
Profile updated
Session expired
Customer suspended
Customer activated
Login successful
```

Do not rely on browser `alert()`.

---

# 47. ROUTING

Create routes similar to:

```text
/login
/signup

/app
/app/account
/app/transactions
/app/transfer
/app/profile
/app/security

/admin
/admin/customers
/admin/customers/:id
/admin/accounts
/admin/transactions
/admin/audit
/admin/system
```

Protect routes according to authentication and role.

Unauthenticated users attempting to access protected routes should be redirected to login.

Customers attempting to access admin pages should receive an appropriate forbidden state or redirect.

---

# 48. LANDING PAGE

Create a polished public landing page.

Hero:

```text
Bank of Mahesh

Banking, reimagined for the digital age.
```

CTA:

```text
Sign In
Open a Simulated Account
```

Include:

- Feature highlights
- Security messaging
- Modern banking visualization
- Simulator disclaimer
- Footer

Do not make claims that imply real financial services.

---

# 49. BANK BRANDING

Use:

# Bank of Mahesh

Create a simple modern wordmark/logo treatment.

Possible visual concept:

- Minimal geometric bank emblem
- BM monogram
- Abstract architectural banking symbol

Keep branding original.

Do not imitate an existing bank's logo.

---

# 50. UX COPY

Use polished financial-product copy.

Avoid robotic labels such as:

```text
CLICK HERE
SUBMIT FORM
DATA FOUND
```

Prefer:

```text
Continue
Transfer Money
View Account
Review Transfer
Confirm Transfer
View Details
```

---

# 51. ADMIN UX

The admin UI should feel like an operations console.

Use:

- Dense but readable tables
- Statistics
- Filters
- Status indicators
- Detail drawers
- Confirmation dialogs
- Audit history

Do not make admin pages visually identical to customer pages.

---

# 52. DEMO MODE

Clearly indicate the simulator nature of the application.

Use a subtle badge:

```text
SIMULATOR
```

or:

```text
DEMO ENVIRONMENT
```

Do not repeatedly interrupt the user with disclaimers.

---

# 53. TESTING

Create automated tests for critical backend behavior.

At minimum test:

### Authentication

- Signup
- Duplicate email
- Login
- Invalid password
- Logout
- Session expiration

### Authorization

- Customer accessing own data
- Customer blocked from admin
- Admin access
- Suspended customer blocked

### Transactions

- Valid transfer
- Insufficient balance
- Invalid recipient
- Negative amount
- Zero amount
- Balance updates
- Transaction creation

### Persistence

- Runtime JSON loading
- Runtime JSON writing
- Persistence after restart

---

# 54. END-TO-END USER FLOWS

Verify these flows completely.

## Flow 1 — Customer Signup

```text
Landing
→ Signup
→ Fill details
→ Create account
→ Simulated savings account created
→ Login/dashboard
```

## Flow 2 — Customer Login

```text
Login
→ Email/password
→ Session created
→ Dashboard
```

## Flow 3 — Transfer

```text
Dashboard
→ Transfer
→ Enter recipient
→ Enter amount
→ Review
→ Confirm
→ Balance updated
→ Transaction created
→ Success screen
```

## Flow 4 — Logout

```text
Dashboard
→ Logout
→ Session destroyed
→ Login
→ Back button cannot restore authenticated access
```

## Flow 5 — Admin

```text
Admin Login
→ Admin Dashboard
→ Customer list
→ Customer details
→ Suspend customer
→ Customer cannot log in
```

## Flow 6 — Persistence

```text
Create user
→ Create transaction
→ Stop server
→ Restart server
→ Data still exists
```

---

# 55. API DOCUMENTATION

Create a README containing:

- Architecture
- Installation
- Development commands
- Build commands
- Environment variables
- Demo credentials
- API list
- Data model
- Security architecture
- Session architecture
- Runtime JSON structure
- Testing instructions
- Simulator limitations

Include a concise API table:

| Group | Purpose |
|---|---|
| `/api/auth` | Authentication |
| `/api/customer` | Customer data |
| `/api/transactions` | Simulated transactions |
| `/api/admin` | Admin operations |
| `/api/session` | Session management |
| `/api/system` | Health/system information |

---

# 56. DEVELOPMENT EXPERIENCE

Provide scripts such as:

```text
npm install
npm run dev
npm run build
npm run start
npm run test
```

If frontend and backend require separate processes, use a root development script that starts both.

The developer should be able to clone the project, install dependencies, and run it with minimal configuration.

---

# 57. CODE QUALITY

Use:

- TypeScript
- Strong typing
- Reusable components
- Small services
- Clear naming
- Environment configuration
- Centralized error handling
- Centralized API client
- Centralized authentication logic
- Reusable validation schemas
- Comments only where useful

Do not create giant components.

Do not put business logic directly inside React components.

Do not duplicate API logic.

---

# 58. IMPORTANT IMPLEMENTATION RULES

Do not:

- Fake API responses in the frontend
- Store the application's main data only in React state
- Store passwords in plaintext
- Store authentication tokens in localStorage
- Trust a client-provided role
- Allow customers to modify balances
- Add random APIs beyond the six API groups
- Hardcode customer data into UI components
- Use browser alerts
- Leave buttons without functionality
- Leave navigation links pointing nowhere
- Build screens that cannot communicate with the backend
- Use placeholder lorem ipsum in the final UI

---

# 59. DEFINITION OF DONE

The project is complete only when:

- The frontend runs.
- The backend runs.
- Signup works.
- Login works.
- Logout works.
- Sessions work.
- Session expiration works.
- Customer role works.
- Admin role works.
- Customer dashboard works.
- Account page works.
- Transfer works.
- Transaction history works.
- Profile works.
- Security page works.
- Admin dashboard works.
- Customer management works.
- Customer suspension works.
- Admin transaction view works.
- Audit logging works.
- Runtime JSON persistence works.
- Data survives server restart.
- Six API groups are implemented.
- Protected routes work.
- Error states work.
- Loading states work.
- Responsive UI works.
- Spatial UI design is consistently applied.
- Tests for critical functionality pass.
- README is complete.
- No major button or navigation element is non-functional.

---

# 60. FINAL AI IDE INSTRUCTION

Do not stop after generating the initial files.

Work through the implementation systematically:

1. Analyze the architecture.
2. Create the project.
3. Implement the runtime persistence layer.
4. Implement authentication/session management.
5. Implement the six API groups.
6. Implement authorization.
7. Implement customer functionality.
8. Implement transaction functionality.
9. Implement admin functionality.
10. Build the Spatial UI design system.
11. Build all frontend pages.
12. Connect every page to the real backend.
13. Add validation and error handling.
14. Add seed data.
15. Add tests.
16. Run the application.
17. Test all major user flows.
18. Fix all runtime/build/type errors.
19. Review for security mistakes.
20. Review responsive behavior.
21. Review visual consistency.
22. Update README.

If you encounter a design or implementation decision that is not explicitly specified, choose the option that produces the most maintainable, secure, simple, and professional banking simulator.

Do not ask for confirmation for routine implementation decisions.

The final result should feel like a **premium, futuristic, production-quality banking simulator**, while remaining technically simple enough to run locally using `runtime.json` as its persistence layer.

## Product Name

**Bank of Mahesh**

## Product Type

**Secure Banking Application Simulator**

## Persistence

**runtime.json**

## API Limit

**Exactly 6 API groups**

## Primary Design Direction

**Premium Spatial UI / Futuristic Fintech**