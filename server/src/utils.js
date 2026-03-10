import crypto from 'crypto';

export function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

/* ── snake_case → camelCase row mapper ── */
function toCamel(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function camelRow(row) {
  if (!row || typeof row !== 'object') return row;
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    const camelKey = toCamel(k);
    // Parse JSON fields if they appear to be JSON strings
    if (camelKey === 'documentIds' && typeof v === 'string') {
      try {
        out[camelKey] = JSON.parse(v);
      } catch {
        out[camelKey] = v;
      }
    } else {
      out[camelKey] = v;
    }
  }
  return out;
}

export function camelRows(rows) {
  return rows.map(camelRow);
}

/* ── HMAC-signed token (survives server restarts) ── */
const TOKEN_SECRET = process.env.SESSION_SECRET;
if (!TOKEN_SECRET) {
  throw new Error(
    'FATAL: SESSION_SECRET environment variable is not set. ' +
    'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"'
  );
}

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

export function issueToken(userId, role) {
  const payload = Buffer.from(JSON.stringify({
    sub: userId,
    role,
    iat: Date.now(),
    exp: Date.now() + TOKEN_TTL_MS,
  })).toString('base64url');
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function resolveSession(token) {
  try {
    const parts = (token || '').split('.');
    if (parts.length !== 2) return null;
    const [payload, sig] = parts;
    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
    // Timing-safe comparison
    const sigBuf = Buffer.from(sig, 'utf8');
    const expBuf = Buffer.from(expected, 'utf8');
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    // Enforce token expiry
    if (!data.exp || Date.now() > data.exp) return null;
    return { userId: data.sub, role: data.role };
  } catch {
    return null;
  }
}

export function revokeToken() {
  // Stateless tokens expire after TOKEN_TTL_MS (8 hours).
  // For immediate revocation: add token signature to a DB `revoked_tokens` table
  // and check it in resolveSession before returning the session.
}

export function makeSafeUser(userRow, profile = {}) {
  return {
    id: userRow.id,
    email: userRow.email,
    role: userRow.role,
    profile,
  };
}

/* ── Auth middleware ── */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  const session = resolveSession(token);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
  req.userId = session.userId;
  req.userRole = session.role;
  next();
}
