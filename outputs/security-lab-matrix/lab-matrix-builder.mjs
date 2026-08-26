import fs from 'node:fs/promises';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const outputDir = 'D:/Bank of Mahesh/outputs/security-lab-matrix';
const rows = [
  ['Reflected XSS', 'Easy', 'A03 Injection', '1. Visit /api/lab/reflect?message=<img src=x onerror=alert(1)> in browser.\n2. Inspect response HTML body and DOM tree.\n3. Verify unsanitized input executes inline JavaScript script.', 'Credential/session theft\nAltered page content\nPhishing within trusted origin', 'Contextual output encoding\nAvoid string-built HTML\nDeploy a strict CSP'],
  ['No rate limiting', 'Easy', 'A07 Identification & Authentication Failures', '1. Send >10 rapid POST requests to /api/auth/login within 60s.\n2. Check Network tab for HTTP 429 status codes.\n3. Verify all requests process without delay or IP throttling.', 'Password spraying\nResource exhaustion\nNoisy monitoring signals', 'Per-IP and account limits\nProgressive delays\nAlert on anomalous attempts'],
  ['Weak password policy', 'Easy', 'A07 Identification & Authentication Failures', '1. Submit POST /api/auth/signup with 1-character password (e.g. "a").\n2. Inspect API response code and error payload.\n3. Confirm account creation succeeds without length enforcement.', 'Easy guessing\nCredential stuffing success\nAccount takeover', 'Minimum passphrase length\nBlock breached passwords\nMFA for sensitive actions'],
  ['Verbose error messages', 'Easy', 'A05 Security Misconfiguration', '1. Send GET request to /api/lab/debug/error.\n2. Inspect API JSON response payload.\n3. Verify full stack trace, module paths, and server details are exposed.', 'Source/path disclosure\nSecret disclosure\nFaster reconnaissance', 'Generic client errors\nServer-only logs\nScrub stack/configuration data'],
  ['Outdated framework baseline', 'Easy', 'A06 Vulnerable and Outdated Components', '1. Inspect client/package.json for framework version pins.\n2. Cross-reference dependencies against vulnerability databases.\n3. Verify legacy versions contain unpatched advisories.', 'Known exploit exposure\nUnsupported patch path\nDependency conflicts', 'Supported release cadence\nSCA/SBOM scanning\nPatch SLAs and upgrade tests'],
  ['Long-lived sessions', 'Medium', 'A07 Identification & Authentication Failures', '1. Authenticate via POST /api/auth/login and capture session cookie.\n2. Query GET /api/session to inspect expiresAt timestamp.\n3. Verify session TTL is set to 7 days of inactivity without cap.', 'Stolen session reuse\nShared-device exposure\nDelayed access revocation', 'Short idle and absolute TTLs\nRotate tokens\nRevoke sessions on risk events'],
  ['Outdated server packages', 'Medium', 'A06 Vulnerable and Outdated Components', '1. Inspect server/package.json dependency declarations.\n2. Run dependency audit against vulnerability databases.\n3. Verify backend relies on outdated packages with known CVEs.', 'Public CVEs\nTransitive compromise\nCompliance failures', 'Pin supported versions\nAutomate dependency updates\nDeploy security patches promptly'],
  ['Stored XSS', 'Medium', 'A03 Injection', '1. Submit POST /api/transactions/transfer with JS payload in description.\n2. Navigate to /app/transactions or GET /api/transactions/:id.\n3. Verify raw payload executes in victim browser context.', 'Persistent session theft\nCross-user defacement\nUnauthorized actions in victim context', 'Encode output\nAvoid dangerouslySetInnerHTML\nSanitize rich text with an allowlist'],
  ['Sensitive data exposure', 'Medium', 'A02 Cryptographic Failures', '1. Issue unauthenticated GET request to /api/lab/export.\n2. Inspect response JSON structure and headers.\n3. Verify raw user records, session tokens, and passwords are returned.', 'Credential exposure\nSession hijack\nPrivacy/regulatory incident', 'Authenticate and authorize exports\nEncrypt/minimize data\nNever return secrets'],
  ['IDOR', 'Medium', 'A01 Broken Access Control', '1. Log in as Customer A and identify Customer B\'s transaction ID.\n2. Submit GET /api/transactions/:id using Customer A\'s session.\n3. Verify API returns Customer B\'s details without ownership check.', 'Private ledger disclosure\nFraud reconnaissance\nPrivacy breach', 'Server-side ownership checks\nDeny by default\nAuthorization tests'],
  ['Privilege escalation', 'Hard', 'A01 Broken Access Control', '1. Log in as a standard customer account.\n2. Send GET /api/admin/dashboard with header "X-AMR-Role: admin".\n3. Verify admin data is returned solely based on client header.', 'Administrative control\nAccount disruption\nAudit/data compromise', 'Trusted server-side roles only\nSigned claims validation\nCentral authorization policies'],
  ['Hardcoded secret', 'Hard', 'A02 Cryptographic Failures', '1. Inspect server/src/config.ts source code.\n2. Search for SESSION_SECRET configuration key.\n3. Verify signing secret is hardcoded in plaintext.', 'Token forgery\nSecret reuse risk\nRepository-wide disclosure', 'Secret manager\nRuntime environment injection\nRotate leaked secrets'],
  ['Business-logic flaw', 'Hard', 'A04 Insecure Design', '1. Submit POST /api/transactions/transfer with negative amount (e.g. -500).\n2. Inspect sender and recipient balances post-transaction.\n3. Verify sender balance increases while recipient balance decreases.', 'Balance inflation\nLedger integrity loss\nFinancial reporting errors', 'Strictly positive amounts\nDouble-entry invariants\nAbuse-case tests'],
  ['Plaintext password storage', 'Hard', 'A02 Cryptographic Failures', '1. Register a new user via POST /api/auth/signup.\n2. Inspect data/runtime.json or GET /api/lab/export user record.\n3. Verify password field contains unhashed, plaintext string.', 'Immediate credential compromise\nPassword reuse fallout\nLegal/compliance exposure', 'Argon2id or bcrypt with salts\nNever return password fields\nCredential-handling reviews'],
  ['No authentication logging', 'Hard', 'A09 Security Logging & Monitoring Failures', '1. Authenticate via POST /api/auth/login.\n2. Query GET /api/admin/audit or inspect audit log data store.\n3. Verify no LOGIN action event is generated or persisted.', 'Undetected account takeover\nWeak incident timelines\nFailed forensic/compliance review', 'Safely log auth success/failure\nCentral immutable logs\nAlert on suspicious patterns'],
];

const workbook = Workbook.create();
const sheet = workbook.worksheets.add('Vulnerability Matrix');
sheet.showGridLines = false;
sheet.mergeCells('A1:F1');
sheet.getRange('A1').values = [['Bank of AMR — Security Vulnerability Matrix']];
sheet.getRange('A2:F2').merge();
sheet.getRange('A2').values = [['Local CTF training reference only — do not deploy these vulnerabilities outside an isolated lab.']];
sheet.getRange('A4:F4').values = [['Vulnerability / Issue', 'Difficulty', 'OWASP Category', 'Verification Steps', 'Business / Security Impacts', 'Defensive Remediation']];
sheet.getRange(`A5:F${rows.length + 4}`).values = rows;

sheet.getRange('A1:F1').format = { fill: '#0F172A', font: { bold: true, color: '#FFFFFF', size: 16 }, horizontalAlignment: 'center', verticalAlignment: 'center' };
sheet.getRange('A2:F2').format = { fill: '#FDE68A', font: { italic: true, color: '#713F12' }, horizontalAlignment: 'center', verticalAlignment: 'center', wrapText: true };
sheet.getRange('A4:F4').format = { fill: '#0F766E', font: { bold: true, color: '#FFFFFF' }, horizontalAlignment: 'center', verticalAlignment: 'center', wrapText: true };
sheet.getRange(`A5:F${rows.length + 4}`).format = { verticalAlignment: 'top', wrapText: true, borders: { preset: 'inside', style: 'thin', color: '#CBD5E1' } };
sheet.getRange(`A5:A${rows.length + 4}`).format.font = { bold: true, color: '#0F172A' };
sheet.getRange(`B5:B${rows.length + 4}`).format.horizontalAlignment = 'center';
sheet.getRange(`A5:F${rows.length + 4}`).format.rowHeight = 72;
sheet.getRange('A:A').format.columnWidth = 28;
sheet.getRange('B:B').format.columnWidth = 12;
sheet.getRange('C:C').format.columnWidth = 32;
sheet.getRange('D:D').format.columnWidth = 55;
sheet.getRange('E:E').format.columnWidth = 34;
sheet.getRange('F:F').format.columnWidth = 38;
sheet.getRange('A1:F1').format.rowHeight = 30;
sheet.getRange('A2:F2').format.rowHeight = 30;
sheet.getRange('A4:F4').format.rowHeight = 35;
sheet.freezePanes.freezeRows(4);
sheet.getRange(`B5:B${rows.length + 4}`).conditionalFormats.add('containsText', { text: 'Easy', format: { fill: '#DCFCE7', font: { color: '#166534', bold: true } } });
sheet.getRange(`B5:B${rows.length + 4}`).conditionalFormats.add('containsText', { text: 'Medium', format: { fill: '#FEF3C7', font: { color: '#92400E', bold: true } } });
sheet.getRange(`B5:B${rows.length + 4}`).conditionalFormats.add('containsText', { text: 'Hard', format: { fill: '#FEE2E2', font: { color: '#991B1B', bold: true } } });

sheet.getRange('A22:F22').merge();
sheet.getRange('A22').values = [['Instructor reset checklist: keep the lab isolated; use only disposable data; remove /api/lab and restore security controls before reuse.']];
sheet.getRange('A22:F22').format = { fill: '#E2E8F0', font: { italic: true, color: '#334155' }, wrapText: true, verticalAlignment: 'center' };
sheet.getRange('A22:F22').format.rowHeight = 32;

const check = await workbook.inspect({ kind: 'table', range: 'Vulnerability Matrix!A1:F22', include: 'values,formulas', tableMaxRows: 22, tableMaxCols: 6 });
console.log(check.ndjson);
const errors = await workbook.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A', options: { useRegex: true, maxResults: 30 }, summary: 'formula error scan' });
console.log(errors.ndjson);
const preview = await workbook.render({ sheetName: 'Vulnerability Matrix', range: 'A1:F22', scale: 1, format: 'png' });
await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(`${outputDir}/preview.png`, new Uint8Array(await preview.arrayBuffer()));
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(`${outputDir}/bank-of-amr-security-vulnerability-matrix.xlsx`);
