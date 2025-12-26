/**
 * CSS Generation Script
 * 
 * This script generates CSS from theme definitions.
 * It can be run with npm scripts or as part of the build process.
 */
import fs from 'fs';
import path from 'path';
import { themes } from '../themes';
import { generateThemeCssFile } from './theme-generator';

// Configuration
const outputDir = path.resolve(process.cwd(), 'src/app');
const outputFile = path.join(outputDir, 'globals.css');
const backupFile = path.join(outputDir, 'globals.css.backup');

// Generate CSS content
const cssContent = generateThemeCssFile(themes);

// Main function to write the CSS file
function writeThemeCss(): void {
  console.log('Generating theme CSS...');
  
  // Create backup if file exists
  if (fs.existsSync(outputFile)) {
    console.log(`Creating backup at ${backupFile}`);
    fs.copyFileSync(outputFile, backupFile);
  }
  
  // Write the new CSS file
  fs.writeFileSync(outputFile, cssContent, 'utf8');
  console.log(`Theme CSS written to ${outputFile}`);
}

// Allow this to be run directly or imported
if (require.main === module) {
  writeThemeCss();
}

export { writeThemeCss }; 