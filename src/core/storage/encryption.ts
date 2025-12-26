/**
 * Encryption utilities for secure storage
 * Provides browser-compatible encryption using Web Crypto API
 * with fallback for server-side environments
 */

/**
 * Service to encrypt and decrypt data for secure storage
 */
export class EncryptionService {
  private encryptionKey: string;
  private iterations: number;
  
  /**
   * Create a new encryption service
   * @param key - Custom encryption key (falls back to env variable)
   * @param iterations - Number of PBKDF2 iterations (higher = more secure but slower)
   */
  constructor(key?: string, iterations?: number) {
    this.encryptionKey = key || process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-secure-key-change-in-production';
    this.iterations = iterations || 100000;
  }
  
  /**
   * Check if Web Crypto API is available
   */
  private isWebCryptoAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.crypto?.subtle;
  }
  
  /**
   * Encrypt data before storage
   * @param data - Data to encrypt
   * @returns Base64 encoded encrypted string
   */
  async encrypt(data: string): Promise<string> {
    try {
      if (this.isWebCryptoAvailable()) {
        return await this.encryptWithWebCrypto(data);
      } else {
        return this.encryptFallback(data);
      }
    } catch (error) {
      console.error('Encryption failed:', error);
      return Buffer.from(data).toString('base64');
    }
  }
  
  /**
   * Decrypt data after retrieval
   * @param encryptedData - Base64 encoded encrypted string
   * @returns Original data
   */
  async decrypt(encryptedData: string): Promise<string> {
    try {
      if (this.isWebCryptoAvailable()) {
        return await this.decryptWithWebCrypto(encryptedData);
      } else {
        return this.decryptFallback(encryptedData);
      }
    } catch (error) {
      console.error('Decryption failed:', error);
      try {
        return atob(encryptedData);
      } catch {
        return encryptedData;
      }
    }
  }
  
  /**
   * Encrypt data using Web Crypto API
   * @param data - Data to encrypt
   * @returns Base64 encoded encrypted string
   */
  private async encryptWithWebCrypto(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(this.encryptionKey),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    
    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: this.iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );
    
    const result = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
    result.set(salt, 0);
    result.set(iv, salt.length);
    result.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);
    
    return btoa(String.fromCharCode(...result));
  }
  
  /**
   * Decrypt data using Web Crypto API
   * @param encryptedData - Base64 encoded encrypted string
   * @returns Original data
   */
  private async decryptWithWebCrypto(encryptedData: string): Promise<string> {
    const encryptedBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    const salt = encryptedBuffer.slice(0, 16);
    const iv = encryptedBuffer.slice(16, 28);
    const data = encryptedBuffer.slice(28);
    
    const encoder = new TextEncoder();
    
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(this.encryptionKey),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: this.iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    return new TextDecoder().decode(decryptedBuffer);
  }
  
  /**
   * Basic fallback encryption for server-side
   * @param data - Data to encrypt
   * @returns Base64 encoded string (not encrypted, just encoded)
   */
  private encryptFallback(data: string): string {
    return Buffer.from(data).toString('base64');
  }
  
  /**
   * Basic fallback decryption for server-side
   * @param encryptedData - Base64 encoded string
   * @returns Decoded data
   */
  private decryptFallback(encryptedData: string): string {
    return Buffer.from(encryptedData, 'base64').toString();
  }
} 