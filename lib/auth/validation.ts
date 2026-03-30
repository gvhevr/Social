const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,24}$/;

export function validateUsername(username: string): string | null {
  const u = username.trim();
  if (!u) return "Username is required.";
  if (!USERNAME_PATTERN.test(u)) {
    return "Use 3–24 characters: letters, numbers, or underscore.";
  }
  return null;
}

export function validateRegisterPassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return null;
}

const MAX_AVATAR_DATA_URL = 2_500_000;

export function validateAvatarInput(value: string): string | null {
  const s = value.trim();
  if (!s) return null;
  if (s.startsWith("data:image/")) {
    if (s.length > MAX_AVATAR_DATA_URL) return "Image is too large.";
    return null;
  }
  try {
    const u = new URL(s);
    if (u.protocol === "http:" || u.protocol === "https:") return null;
  } catch {}
  return "Use a valid https image URL or upload a picture.";
}
