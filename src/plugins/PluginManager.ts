import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { Logger } from '../utils/Logger';
import { Plugin, PluginInfo, PluginLoadResult, PluginUnloadResult, PluginMetadata } from './PluginTypes';
import { PluginSecurityValidator } from './PluginSecurityValidator';

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private pluginInfo: Map<string, PluginInfo> = new Map();
  private pluginPath: string;
  private watchers: Map<string, fsSync.FSWatcher> = new Map();

  constructor(pluginPath: string = './plugins') {
    this.pluginPath = pluginPath;
  }

  async initialize(): Promise<void> {
    Logger.info('PluginManager initializing...', { pluginPath: this.pluginPath });
    
    try {
      await fs.mkdir(this.pluginPath, { recursive: true });
      await this.loadAllPlugins();
      await this.startWatching();
      Logger.info('PluginManager initialized successfully', { 
        pluginsCount: this.plugins.size 
      });
    } catch (error) {
      Logger.error('PluginManager initialization failed', { 
        error: (error as Error).message 
      });
      throw error;
    }
  }

  async loadAllPlugins(): Promise<void> {
    const entries = await fs.readdir(this.pluginPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const pluginDir = path.join(this.pluginPath, entry.name);
        await this.loadPlugin(pluginDir);
      }
    }
  }

  async loadPlugin(pluginDir: string): Promise<PluginLoadResult> {
    try {
      const pluginName = path.basename(pluginDir);
      
      const manifestPath = path.join(pluginDir, 'plugin.json');
      const indexPath = path.join(pluginDir, 'index.js');
      
      const manifestExists = await fs.access(manifestPath).then(() => true).catch(() => false);
      const indexExists = await fs.access(indexPath).then(() => true).catch(() => false);
      
      if (!manifestExists) {
        return { 
          success: false, 
          error: `Plugin manifest not found at ${manifestPath}` 
        };
      }
      
      if (!indexExists) {
        return { 
          success: false, 
          error: `Plugin index not found at ${indexPath}` 
        };
      }

      const manifestContent = await fs.readFile(manifestPath, 'utf-8');
      const metadata: PluginMetadata = JSON.parse(manifestContent);
      
      const manifestValidation = await PluginSecurityValidator.validatePluginManifest(metadata);
      if (!manifestValidation.valid) {
        Logger.error('Plugin manifest validation failed', { 
          errors: manifestValidation.errors 
        });
        return { 
          success: false, 
          error: `Plugin manifest validation failed: ${manifestValidation.errors.join(', ')}` 
        };
      }

      if (manifestValidation.warnings.length > 0) {
        Logger.warn('Plugin manifest validation warnings', { 
          warnings: manifestValidation.warnings 
        });
      }

      const indexCode = await fs.readFile(indexPath, 'utf-8');
      const codeValidation = await PluginSecurityValidator.validatePluginCode(indexCode, metadata);
      
      if (!codeValidation.valid) {
        Logger.error('Plugin code validation failed', { 
          errors: codeValidation.errors 
        });
        return { 
          success: false, 
          error: `Plugin code validation failed: ${codeValidation.errors.join(', ')}` 
        };
      }

      if (codeValidation.warnings.length > 0) {
        Logger.warn('Plugin code validation warnings', { 
          warnings: codeValidation.warnings 
        });
      }
      
      const pluginModule = await import(indexPath);
      const PluginClass = pluginModule.default || pluginModule.Plugin;
      
      if (!PluginClass) {
        return { 
          success: false, 
          error: `Plugin class not found in ${indexPath}` 
        };
      }

      const plugin: Plugin = new PluginClass();
      
      if (plugin.initialize) {
        await plugin.initialize();
      }

      this.plugins.set(metadata.name, plugin);
      this.pluginInfo.set(metadata.name, {
        metadata,
        tools: plugin.getTools ? plugin.getTools() : [],
        loaded: true,
        loadTime: new Date()
      });

      Logger.info('Plugin loaded successfully', { 
        name: metadata.name, 
        version: metadata.version 
      });

      return { success: true, plugin };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.error('Plugin load failed', { error: errorMessage });
      return { 
        success: false, 
        error: `Failed to load plugin: ${errorMessage}` 
      };
    }
  }

  async unloadPlugin(pluginName: string): Promise<PluginUnloadResult> {
    try {
      const plugin = this.plugins.get(pluginName);
      
      if (!plugin) {
        return { 
          success: false, 
          error: `Plugin ${pluginName} not found` 
        };
      }

      if (plugin.destroy) {
        await plugin.destroy();
      }

      this.plugins.delete(pluginName);
      this.pluginInfo.delete(pluginName);

      Logger.info('Plugin unloaded successfully', { name: pluginName });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.error('Plugin unload failed', { error: errorMessage });
      return { 
        success: false, 
        error: `Failed to unload plugin: ${errorMessage}` 
      };
    }
  }

  async reloadPlugin(pluginName: string): Promise<PluginLoadResult> {
    const pluginInfo = this.pluginInfo.get(pluginName);
    
    if (!pluginInfo) {
      return { 
        success: false, 
        error: `Plugin ${pluginName} not found` 
      };
    }

    await this.unloadPlugin(pluginName);
    
    const pluginDir = path.join(this.pluginPath, pluginName);
    return await this.loadPlugin(pluginDir);
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getAllPlugins(): PluginInfo[] {
    return Array.from(this.pluginInfo.values());
  }

  getAllTools(): Map<string, any> {
    const allTools = new Map<string, any>();
    
    for (const [pluginName, plugin] of this.plugins) {
      if (plugin.getTools) {
        const tools = plugin.getTools();
        for (const tool of tools) {
          allTools.set(tool.name, tool);
        }
      }
    }
    
    return allTools;
  }

  private async startWatching(): Promise<void> {
    try {
      const watcher = fsSync.watch(this.pluginPath, { recursive: true }, async (eventType: string, filename: string | null) => {
        if (filename && (filename.endsWith('.js') || filename.endsWith('.json'))) {
          Logger.info('Plugin file changed', { eventType, filename });
          
          const pluginName = path.basename(path.dirname(path.join(this.pluginPath, filename)));
          
          if (this.plugins.has(pluginName)) {
            await this.reloadPlugin(pluginName);
          }
        }
      });

      this.watchers.set('main', watcher);
      Logger.info('Plugin watcher started');
    } catch (error) {
      Logger.error('Failed to start plugin watcher', { 
        error: (error as Error).message 
      });
    }
  }

  async destroy(): Promise<void> {
    Logger.info('PluginManager shutting down...');
    
    for (const watcher of this.watchers.values()) {
      await watcher.close();
    }
    
    for (const [pluginName] of this.plugins) {
      await this.unloadPlugin(pluginName);
    }
    
    this.plugins.clear();
    this.pluginInfo.clear();
    this.watchers.clear();
    
    Logger.info('PluginManager shut down successfully');
  }
}
