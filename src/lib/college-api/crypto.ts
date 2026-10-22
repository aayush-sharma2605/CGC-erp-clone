import crypto from "crypto";

const DEFAULT_KEY = "mas1238642194151ter561321soft703";
const DEFAULT_IV = "2194151ter561321";

/**
 * Encrypts plaintext credentials using AES-256-CBC with PKCS7 padding and Base64 output,
 * matching the exact MasterSoft CGCL mobile client contract.
 */
export function encryptCredential(
  plaintext: string,
  key = process.env.COLLEGE_API_AES_KEY || DEFAULT_KEY,
  iv = process.env.COLLEGE_API_AES_IV || DEFAULT_IV
): string {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key, "utf8"),
    Buffer.from(iv, "utf8")
  );

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  return encrypted.toString("base64");
}

/**
 * Decrypts AES-256-CBC ciphertext (useful for testing and verifying test vectors).
 */
export function decryptCredential(
  ciphertextBase64: string,
  key = process.env.COLLEGE_API_AES_KEY || DEFAULT_KEY,
  iv = process.env.COLLEGE_API_AES_IV || DEFAULT_IV
): string {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "utf8"),
    Buffer.from(iv, "utf8")
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(ciphertextBase64, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
