/**
 * Token Loader
 * 
 * Handles loading and compiling TypeScript design tokens without
 * creating temporary files. Uses TypeScript compiler API directly.
 */

import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';

export interface DesignTokens {
  colors: Record<string, any>;
  themes: Array<any>;
  theme: Record<string, any>;
}

export class TokenLoader {
  private tokensDir: string;
  private compilerOptions: ts.CompilerOptions;

  constructor(tokensDir: string) {
    this.tokensDir = tokensDir;
    this.compilerOptions = {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: false,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
    };
  }

  /**
   * Load all design tokens from TypeScript files
   */
  async loadTokens(): Promise<DesignTokens> {
    try {
      const colors = await this.loadColorsTokens();
      const themes = await this.loadThemesTokens();
      const theme = await this.loadThemeTokens();

      return { colors, themes, theme };
    } catch (error) {
      console.warn('⚠️ [Token Loader] Failed to load tokens, using fallbacks:', error);
      return this.getFallbackTokens();
    }
  }

  /**
   * Get list of token files for webpack watching
   */
  getTokenFiles(): string[] {
    const files = [
      'colors.ts',
      'themes.ts',
      'theme.ts',
      'types.ts',
    ];

    return files
      .map(file => path.join(this.tokensDir, file))
      .filter(file => fs.existsSync(file));
  }

  /**
   * Load colors from colors.ts
   */
  private async loadColorsTokens(): Promise<Record<string, any>> {
    const colorsFile = path.join(this.tokensDir, 'colors.ts');
    if (!fs.existsSync(colorsFile)) {
      throw new Error(`Colors file not found: ${colorsFile}`);
    }

    const result = this.compileAndExecute(colorsFile);
    return result.colors || {};
  }

  /**
   * Load themes from themes.ts
   */
  private async loadThemesTokens(): Promise<Array<any>> {
    const themesFile = path.join(this.tokensDir, 'themes.ts');
    if (!fs.existsSync(themesFile)) {
      return [];
    }

    const result = this.compileAndExecute(themesFile);
    return result.themes || [];
  }

  /**
   * Load theme configuration from theme.ts
   */
  private async loadThemeTokens(): Promise<Record<string, any>> {
    const themeFile = path.join(this.tokensDir, 'theme.ts');
    if (!fs.existsSync(themeFile)) {
      return {};
    }

    const result = this.compileAndExecute(themeFile);
    return result.theme || {};
  }

  /**
   * Compile TypeScript file and execute it in memory
   */
  private compileAndExecute(filePath: string): any {
    const sourceCode = fs.readFileSync(filePath, 'utf8');
    
    // Create a TypeScript program
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceCode,
      ts.ScriptTarget.ES2020,
      true
    );

    // Transpile to JavaScript
    const result = ts.transpileModule(sourceCode, {
      compilerOptions: this.compilerOptions,
    });

    // Create a module context and execute
    const moduleContext = this.createModuleContext();
    const compiledFunction = new Function('module', 'exports', 'require', '__filename', '__dirname', result.outputText);
    
    try {
      compiledFunction.call(
        moduleContext.exports,
        moduleContext.module,
        moduleContext.exports,
        moduleContext.require,
        filePath,
        path.dirname(filePath)
      );
      
      return moduleContext.module.exports;
    } catch (error) {
      throw new Error(`Failed to execute compiled TypeScript: ${error}`);
    }
  }

  /**
   * Create a minimal module context for executing compiled code
   */
  private createModuleContext() {
    const moduleExports = {};
    const moduleContext = {
      exports: moduleExports,
      module: { exports: moduleExports },
      require: (id: string) => {
        // Handle relative imports within the tokens directory
        if (id.startsWith('./') || id.startsWith('../')) {
          const resolvedPath = path.resolve(this.tokensDir, id);
          if (fs.existsSync(resolvedPath + '.ts')) {
            return this.compileAndExecute(resolvedPath + '.ts');
          }
          if (fs.existsSync(resolvedPath + '.js')) {
            return require(resolvedPath + '.js');
          }
        }
        
        // For external modules, use regular require
        try {
          return require(id);
        } catch {
          return {};
        }
      },
    };

    return moduleContext;
  }

  /**
   * Fallback tokens when loading fails
   */
  private getFallbackTokens(): DesignTokens {
    return {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          500: '#6b7280',
          900: '#111827',
        },
      },
      themes: [
        {
          id: 'light',
          name: 'Light',
          type: 'light',
          colors: {
            background: '#ffffff',
            foreground: '#000000',
          },
        },
        {
          id: 'dark',
          name: 'Dark',
          type: 'dark',
          colors: {
            background: '#000000',
            foreground: '#ffffff',
          },
        },
      ],
      theme: {
        extend: {
          fontFamily: {
            sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          },
        },
      },
    };
  }
}
