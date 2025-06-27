import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../../utils/logger.js';
import { commandsConfig, getCommandConfig } from './commandsConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class CommandRegistry {
    constructor(commandHandler) {
        this.commandHandler = commandHandler;
        this.commandsPath = path.join(__dirname, '..', '..');
        this.loadedCommands = new Map();
    }

    /**
     * Automatically discover and load all commands from the commands directory
     */
    async loadAllCommands() {
        try {
            logger.info('Starting command discovery...');
            
            const categories = await this.getCommandCategories();
            let totalLoaded = 0;

            for (const category of categories) {
                const categoryPath = path.join(this.commandsPath, category);
                const commandFiles = await this.getCommandFiles(categoryPath);
                
                logger.debug(`Loading ${commandFiles.length} commands from category: ${category}`);
                
                for (const file of commandFiles) {
                    try {
                        await this.loadCommand(category, file);
                        totalLoaded++;
                    } catch (error) {
                        logger.error(`Failed to load command ${file} from ${category}:`, error);
                    }
                }
            }

            logger.info(`Successfully loaded ${totalLoaded} commands from ${categories.length} categories`);
            return totalLoaded;
        } catch (error) {
            logger.error('Error during command discovery:', error);
            throw error;
        }
    }

    /**
     * Get all command categories (subdirectories)
     */
    async getCommandCategories() {
        try {
            const items = await fs.readdir(this.commandsPath, { withFileTypes: true });
            const validCategories = ['general', 'admin', 'owner', 'store', 'calculator'];
            return items
                .filter(item => 
                    item.isDirectory() && 
                    !item.name.startsWith('.') && 
                    validCategories.includes(item.name)
                )
                .map(item => item.name);
        } catch (error) {
            logger.error('Error reading command categories:', error);
            return [];
        }
    }

    /**
     * Get all command files from a category directory
     */
    async getCommandFiles(categoryPath) {
        try {
            const files = await fs.readdir(categoryPath);
            return files
                .filter(file => file.endsWith('.js') && file !== 'index.js')
                .map(file => file.replace('.js', ''));
        } catch (error) {
            logger.error(`Error reading command files from ${categoryPath}:`, error);
            return [];
        }
    }

    /**
     * Load a single command from its file
     */
    async loadCommand(category, commandName) {
        try {
            const commandPath = `../${category}/${commandName}.js`;
            const commandModule = await import(commandPath);
            
            if (!commandModule.default) {
                throw new Error(`Command ${commandName} does not export a default function`);
            }

            // Get command metadata from the module
            const metadata = this.extractCommandMetadata(commandModule, category, commandName);
            
            // Register the command
            this.commandHandler.register(
                metadata.name,
                {
                    description: metadata.description,
                    category: metadata.category,
                    aliases: metadata.aliases,
                    adminOnly: metadata.adminOnly,
                    ownerOnly: metadata.ownerOnly,
                    groupOnly: metadata.groupOnly,
                    privateOnly: metadata.privateOnly
                },
                commandModule.default
            );

            this.loadedCommands.set(metadata.name, {
                ...metadata,
                path: commandPath,
                module: commandModule
            });

            logger.debug(`Loaded command: ${metadata.name} (${category})`);
        } catch (error) {
            logger.error(`Error loading command ${commandName} from ${category}:`, error);
            throw error;
        }
    }

    /**
     * Extract command metadata from the module and configuration
     */
    extractCommandMetadata(commandModule, category, commandName) {
        // Get metadata from configuration file
        const configMetadata = getCommandConfig(category, commandName);
        
        // Try to get metadata from the module export (if any)
        const moduleMetadata = commandModule.metadata || {};
        
        // Merge configurations with priority: config file > module metadata > defaults
        return {
            name: configMetadata.name || moduleMetadata.name || commandName,
            description: configMetadata.description || moduleMetadata.description || `${commandName} command`,
            category: configMetadata.category || moduleMetadata.category || category,
            aliases: configMetadata.aliases || moduleMetadata.aliases || [],
            adminOnly: configMetadata.adminOnly || moduleMetadata.adminOnly || false,
            ownerOnly: configMetadata.ownerOnly || moduleMetadata.ownerOnly || false,
            groupOnly: configMetadata.groupOnly || moduleMetadata.groupOnly || false,
            privateOnly: configMetadata.privateOnly || moduleMetadata.privateOnly || false,
            ...moduleMetadata, // Allow any additional metadata from module
            ...configMetadata  // Config file takes precedence
        };
    }

    /**
     * Reload a specific command
     */
    async reloadCommand(commandName) {
        try {
            const commandInfo = this.loadedCommands.get(commandName);
            if (!commandInfo) {
                throw new Error(`Command ${commandName} not found`);
            }

            // Unregister current command
            this.commandHandler.unregister(commandName);
            this.loadedCommands.delete(commandName);

            // Reload the command
            const pathParts = commandInfo.path.split('/');
            const category = pathParts[pathParts.length - 2];
            const fileName = pathParts[pathParts.length - 1].replace('.js', '');
            
            await this.loadCommand(category, fileName);
            logger.info(`Reloaded command: ${commandName}`);
        } catch (error) {
            logger.error(`Error reloading command ${commandName}:`, error);
            throw error;
        }
    }

    /**
     * Get information about loaded commands
     */
    getLoadedCommands() {
        return Array.from(this.loadedCommands.values());
    }

    /**
     * Get commands by category
     */
    getCommandsByCategory(category) {
        return Array.from(this.loadedCommands.values())
            .filter(cmd => cmd.category === category);
    }

    /**
     * Hot reload all commands (useful for development)
     */
    async hotReloadAllCommands() {
        try {
            logger.info('Starting hot reload of all commands...');
            
            // Clear current commands
            this.commandHandler.clearAll();
            this.loadedCommands.clear();
            
            // Reload all commands
            const totalLoaded = await this.loadAllCommands();
            
            logger.info(`Hot reload completed. ${totalLoaded} commands reloaded.`);
            return totalLoaded;
        } catch (error) {
            logger.error('Error during hot reload:', error);
            throw error;
        }
    }
} 