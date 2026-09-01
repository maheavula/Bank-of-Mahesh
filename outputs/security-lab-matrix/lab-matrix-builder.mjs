import fs from 'node:fs/promises';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const outputDir = 'D:/Bank of Mahesh/outputs/security-lab-matrix';
const rows = [
  ['Reflected Input Handling', 'Easy', 'A03 Injection', '1. Open /app/transactions statement page.\n2. Enter <img src=x onerror=alert(1)> in search bar.\n3. Observe search feedback banner rendering.\n4. Inspect DOM for unescaped dangerouslySetInnerHTML.\n5. Confirm script payload executes in client session.', 'Credential/session theft\nAltered page content\nPhishing within trusted origin', 'Contextual output encoding\nAvoid string-built HTML\nDeploy a strict CSP'],
  ['No rate limiting', 'Easy', 'A07 Identification & Authentication Failures', '1. Open DevTools or Postman targeting /api/auth/login.\n2. Send 15 rapid POST requests with wrong password in 30s.\n3. Inspect HTTP status codes in Network tab.\n4. Confirm all requests receive HTTP 401 response.\n5. Verify backend processes every attempt without 429 block.', 'Password spraying\nResource exhaustion\nNoisy monitoring signals', 'Per-IP and account limits\nProgressive delays\nAlert on anomalous attempts'],
  ['Weak password policy', 'Easy', 'A07 Identification & Authentication Failures', '1. Navigate to /signup page.\n2. Fill registration form specifying 1-char password "a".\n3. Submit the registration form.\n4. Inspect HTTP 201 response payload in Network tab.\n5. Confirm account creation succeeds without length rejection.', 'Easy guessing\nCredential stuffing success\nAccount takeover', 'Minimum passphrase length\nBlock breached passwords\nMFA for sensitive actions'],
  ['Verbose error messages', 'Easy', 'A05 Security Misconfiguration', '1. Open browser window to /api/lab/debug/error.\n2. Inspect returned JSON response payload.\n3. Check stack property in error object.\n4. Locate internal file paths and module call traces.\n5. Confirm internal directory structure is exposed.', 'Source/path disclosure\nSecret disclosure\nFaster reconnaissance', 'Generic client errors\nServer-only logs\nScrub stack/configuration data'],
  ['Framework Banner Disclosure', 'Easy', 'A05 Security Misconfiguration', '1. Open browser DevTools Network tab on any route.\n2. Perform an API action (e.g. GET /api/customer/profile).\n3. Select network request and view Response Headers.\n4. Locate X-Powered-By response header in list.\n5. Observe X-Powered-By: Express/3.16.0 header disclosure.', 'Known exploit exposure\nUnsupported patch path\nDependency conflicts', 'Remove X-Powered-By headers\nSCA/SBOM scanning\nDeploy strict HTTP header policies'],
  ['Long-lived sessions', 'Medium', 'A07 Identification & Authentication Failures', '1. Sign in to portal as a customer account.\n2. Inspect bm_session cookie in Application tab.\n3. Query GET /api/session or view Security page.\n4. Observe maxAge and expiresAt configured for 7 days.\n5. Confirm session remains active after 24h inactivity.', 'Stolen session reuse\nShared-device exposure\nDelayed access revocation', 'Short idle and absolute TTLs\nRotate tokens\nRevoke sessions on risk events'],
  ['Open Redirect', 'Medium', 'A01 Broken Access Control', '1. Navigate to /login?redirect=https://attacker.com.\n2. Enter valid login credentials.\n3. Submit login form.\n4. Observe browser redirection behavior post-login.\n5. Confirm browser redirects to external attacker URL.', 'Phishing credential theft\nMalicious site redirection\nSession hijack via redirect', 'Validate redirect targets against whitelist\nDisallow absolute external URLs\nUse relative redirect paths'],
  ['Stored XSS', 'Medium', 'A03 Injection', '1. Navigate to /app/transfer page.\n2. Submit transfer specifying <img src=x onerror=alert(1)> in note.\n3. Submit transfer request.\n4. Open /app/transactions statement ledger.\n5. Confirm stored payload executes script in victim context.', 'Persistent session theft\nCross-user defacement\nUnauthorized actions in victim context', 'Encode output\nAvoid dangerouslySetInnerHTML\nSanitize rich text with an allowlist'],
  ['Sensitive data exposure', 'Medium', 'A02 Cryptographic Failures', '1. Send unauthenticated GET request to /api/lab/export.\n2. Inspect returned JSON structure.\n3. Locate users array in response.\n4. Check password field for user records.\n5. Confirm unhashed cleartext passwords are returned.', 'Credential exposure\nSession hijack\nPrivacy/regulatory incident', 'Authenticate and authorize exports\nEncrypt/minimize data\nNever return secrets'],
  ['IDOR Routing', 'Medium', 'A01 Broken Access Control', '1. Log in as Customer A (customer@bankofamr.local).\n2. Obtain target account ID for Customer B (ACC-10002).\n3. Send GET /api/customer/account/ACC-10002/statement.\n4. Inspect HTTP 200 response JSON payload.\n5. Confirm Customer B\'s private statement is returned.', 'Private ledger disclosure\nFraud reconnaissance\nPrivacy breach', 'Server-side ownership checks\nDeny by default\nAuthorization tests'],
  ['Privilege escalation', 'Hard', 'A01 Broken Access Control', '1. Log in as standard customer account.\n2. Send GET request to /api/admin/dashboard.\n3. Add HTTP header "X-AMR-Role: admin" to request.\n4. Observe HTTP status code 200 and response body.\n5. Confirm admin data is returned based on client header.', 'Administrative control\nAccount disruption\nAudit/data compromise', 'Trusted server-side roles only\nSigned claims validation\nCentral authorization policies'],
  ['Hardcoded secret', 'Hard', 'A02 Cryptographic Failures', '1. Open browser DevTools (F12) on application portal.\n2. Navigate to Sources tab or Console window.\n3. Inspect client source file client/src/context/AuthContext.tsx.\n4. Locate HARDCODED_SESSION_SECRET definition or window.__AMR_API_SECRET__.\n5. Confirm client secret "amr_secret_key_client_2026_x89a2b" is exposed.', 'Token forgery\nSecret reuse risk\nClient-side secret disclosure', 'Secret manager\nRuntime environment injection\nNever ship secrets in client bundles'],
  ['Business logic flaw', 'Hard', 'A04 Insecure Design', '1. Open /app/transfer page in customer portal.\n2. Enter recipient account and transfer amount -500.\n3. Submit transfer form and authorize.\n4. Inspect transaction receipt and updated account balance.\n5. Confirm balance increases by 500 without negative check.', 'Balance inflation\nLedger integrity loss\nFinancial reporting errors', 'Strictly positive amounts\nDouble-entry invariants\nAbuse-case tests'],
  ['Unsigned State Import', 'Hard', 'A08 Software and Data Integrity Failures', '1. Craft modified state JSON payload with elevated balance/role.\n2. Send POST /api/lab/restore with state JSON payload.\n3. Inspect HTTP 200 response message.\n4. Query GET /api/customer/profile or GET /api/admin/dashboard.\n5. Confirm state is restored without cryptographic signature check.', 'Arbitrary state tampering\nUnauthorized role escalation\nLedger corruption', 'Cryptographic payload signing\nSchema validation\nStrict state import authorization'],
  ['Server-Side Request Forgery', 'Hard', 'A10 Server-Side Request Forgery', '1. Open DevTools or Postman targeting /api/lab/fetch-avatar.\n2. Set url query param to internal loopback http://127.0.0.1:5000/api/admin/dashboard.\n3. Issue GET /api/lab/fetch-avatar?url=http://127.0.0.1:5000/api/admin/dashboard.\n4. Inspect HTTP 200 response body.\n5. Confirm backend fetches internal service and returns admin payload.', 'Internal service access\nCloud metadata retrieval\nBypass network perimeters', 'URL destination whitelist\nDisable internal IP fetching\nNetwork layer egress rules'],
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
try {
  await output.save(`${outputDir}/bank-of-amr-security-vulnerability-matrix.xlsx`);
} catch (err) {
  console.warn('Could not save bank-of-amr-security-vulnerability-matrix.xlsx:', err.message);
}
try {
  await output.save(`D:/Bank of Mahesh/outputs/security-lab-matrix.xlsx`);
} catch (err) {
  console.warn('Could not save security-lab-matrix.xlsx:', err.message);
}
