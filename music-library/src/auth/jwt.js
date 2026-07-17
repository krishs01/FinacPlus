/**
 * Mock JWT utilities.
 *
 * This is NOT real security — it's a base64-encoded JSON payload that mimics
 * JWT structure for demonstration purposes. In production you'd use a real
 * JWT library and validate signatures server-side.
 *
 * Mock users:
 *   admin / admin123  → role: "admin"  (can add/delete songs)
 *   user  / user123   → role: "viewer" (read-only)
 */

const MOCK_USERS = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
  { username: 'user', password: 'user123', role: 'viewer', name: 'Regular User' },
];

const JWT_SECRET = 'music-library-mock-secret';

/**
 * Simulates JWT token creation.
 * Returns a base64-encoded JSON string that looks like a JWT.
 */
export function createMockToken(user) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.username,
    name: user.name,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
  }));
  const signature = btoa(`${header}.${payload}.${JWT_SECRET}`);
  return `${header}.${payload}.${signature}`;
}

/**
 * Decodes the mock JWT and returns the payload.
 * Returns null if the token is malformed or expired.
 */
export function decodeMockToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Authenticates a user with username/password.
 * Returns { token, user } on success, throws on failure.
 */
export function authenticateUser(username, password) {
  const user = MOCK_USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    throw new Error('Invalid username or password');
  }

  const token = createMockToken(user);
  return {
    token,
    user: { username: user.username, name: user.name, role: user.role },
  };
}
