import CryptoJS from 'crypto-js';
import LZString from 'lz-string';

type EncryptedData = string;
type DecryptedData = Record<string, any>;

const secretKey =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'your-secure-encryption-key-min-32-chars';

// Function to encrypt a JSON object
export const encryptData = (data: Record<string, any>): EncryptedData => {
  try {
    const jsonString: string = JSON.stringify(data);
    const compressedString: string = LZString.compressToUTF16(jsonString);
    const encrypted = CryptoJS.AES.encrypt(compressedString, secretKey).toString();
    const base64Encrypted: string = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(encrypted),
    );

    return base64Encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
};

// Function to decrypt the data
export const decryptData = (encryptedData: EncryptedData): DecryptedData | null => {
  if (!encryptedData) return {};

  try {
    const decryptedBase64 = CryptoJS.enc.Base64.parse(encryptedData).toString(CryptoJS.enc.Utf8);
    const decrypted = CryptoJS.AES.decrypt(decryptedBase64, secretKey);
    const compressedString = decrypted.toString(CryptoJS.enc.Utf8);
    const jsonString = LZString.decompressFromUTF16(compressedString);
    const data: DecryptedData = JSON.parse(jsonString);

    return data;
  } catch (error) {
    console.error('Decryption failed:', error);
    // throw error;

    return null;
  }
};
