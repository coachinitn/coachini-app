/**
 * File Manager
 * 
 * Handles file operations for the design tokens plugin,
 * including backup creation and safe file writing.
 */

import * as fs from 'fs';
import * as path from 'path';

export class FileManager {
  private outputDir: string;
  private createBackups: boolean;

  constructor(outputDir: string, createBackups = true) {
    this.outputDir = outputDir;
    this.createBackups = createBackups;
  }

  /**
   * Write content to a file with optional backup
   */
  async writeFile(relativePath: string, content: string): Promise<void> {
    const fullPath = path.join(this.outputDir, relativePath);
    const dir = path.dirname(fullPath);

    // Ensure directory exists
    await this.ensureDirectory(dir);

    // Create backup if file exists and backups are enabled
    if (this.createBackups && fs.existsSync(fullPath)) {
      await this.createBackup(fullPath);
    }

    // Write the file
    await fs.promises.writeFile(fullPath, content, 'utf8');
  }

  /**
   * Read file content
   */
  async readFile(relativePath: string): Promise<string> {
    const fullPath = path.join(this.outputDir, relativePath);
    return fs.promises.readFile(fullPath, 'utf8');
  }

  /**
   * Check if file exists
   */
  fileExists(relativePath: string): boolean {
    const fullPath = path.join(this.outputDir, relativePath);
    return fs.existsSync(fullPath);
  }

  /**
   * Get file modification time
   */
  async getFileStats(relativePath: string): Promise<fs.Stats | null> {
    try {
      const fullPath = path.join(this.outputDir, relativePath);
      return await fs.promises.stat(fullPath);
    } catch {
      return null;
    }
  }

  /**
   * Create backup of existing file
   */
  private async createBackup(filePath: string): Promise<void> {
    const backupPath = `${filePath}.backup`;
    
    try {
      await fs.promises.copyFile(filePath, backupPath);
    } catch (error) {
      console.warn(`⚠️ [File Manager] Failed to create backup for ${filePath}:`, error);
    }
  }

  /**
   * Ensure directory exists
   */
  private async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await fs.promises.access(dirPath);
    } catch {
      await fs.promises.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Get all files in a directory matching pattern
   */
  async getFiles(relativePath: string, pattern?: RegExp): Promise<string[]> {
    const fullPath = path.join(this.outputDir, relativePath);
    
    try {
      const files = await fs.promises.readdir(fullPath);
      
      if (pattern) {
        return files.filter(file => pattern.test(file));
      }
      
      return files;
    } catch {
      return [];
    }
  }

  /**
   * Delete file
   */
  async deleteFile(relativePath: string): Promise<void> {
    const fullPath = path.join(this.outputDir, relativePath);
    
    try {
      await fs.promises.unlink(fullPath);
    } catch (error) {
      console.warn(`⚠️ [File Manager] Failed to delete ${fullPath}:`, error);
    }
  }

  /**
   * Clean up old backup files
   */
  async cleanupBackups(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    const now = Date.now();
    
    const cleanupDir = async (dirPath: string) => {
      try {
        const files = await fs.promises.readdir(dirPath, { withFileTypes: true });
        
        for (const file of files) {
          const fullPath = path.join(dirPath, file.name);
          
          if (file.isDirectory()) {
            await cleanupDir(fullPath);
          } else if (file.name.endsWith('.backup')) {
            const stats = await fs.promises.stat(fullPath);
            const age = now - stats.mtime.getTime();
            
            if (age > maxAge) {
              await fs.promises.unlink(fullPath);
              console.log(`🗑️ [File Manager] Cleaned up old backup: ${file.name}`);
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️ [File Manager] Failed to cleanup directory ${dirPath}:`, error);
      }
    };

    await cleanupDir(this.outputDir);
  }
}
