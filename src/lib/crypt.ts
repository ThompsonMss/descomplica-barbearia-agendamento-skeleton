import crypto from "crypto";

const algorithm = "aes-256-cbc";

const key = crypto
  .createHash("sha512")
  .update("secretKey")
  .digest()
  .subarray(0, 32); // Usa buffer diretamente

const iv = crypto
  .createHash("sha512")
  .update("secretIV")
  .digest()
  .subarray(0, 16); // Usa buffer diretamente

export function encryptData(data: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(data, "utf8"), cipher.final()]);
  return encrypted.toString("base64"); // Somente base64, sem hex
}

export function decryptData(encryptedData: string): string {
  const encryptedBuffer = Buffer.from(encryptedData, "base64");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
  return decrypted.toString("utf8");
}
