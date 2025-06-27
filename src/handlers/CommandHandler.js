import logger from "../utils/logger.js";

class CommandHandler {
    constructor() {
        this.commands = new Map();
        this.aliases = new Map();
        this.middlewares = [];
    }

    /**
     * Register a command
     */
    register(name, config, handler) {
        if (typeof config === 'function') {
            handler = config;
            config = {};
        }

        const command = {
            name,
            handler,
            description: config.description || '',
            usage: config.usage || name,
            category: config.category || 'general',
            ownerOnly: config.ownerOnly || false,
            adminOnly: config.adminOnly || false,
            groupOnly: config.groupOnly || false,
            privateOnly: config.privateOnly || false,
            premiumOnly: config.premiumOnly || false
        };

        this.commands.set(name, command);

        // Register aliases
        if (config.aliases) {
            config.aliases.forEach(alias => {
                this.aliases.set(alias, name);
            });
        }

        logger.debug(`Registered command: ${name}`);
    }

    /**
     * Add middleware
     */
    use(middleware) {
        this.middlewares.push(middleware);
    }

    /**
     * Get command by name or alias
     */
    getCommand(name) {
        const commandName = this.aliases.get(name) || name;
        return this.commands.get(commandName);
    }

    /**
     * Execute command
     */
    async execute(commandName, context) {
        try {
            const command = this.getCommand(commandName);
            if (!command) {
                return false;
            }

            // Run middlewares
            for (const middleware of this.middlewares) {
                const result = await middleware(context, command);
                if (result === false) {
                    return false;
                }
            }

            // Execute command
            await command.handler(context);
            return true;
        } catch (error) {
            logger.error(`Error executing command ${commandName}`, error);
            await context.messageService.sendError(context.from, 'general', context.msg);
            return false;
        }
    }

    /**
     * Get all commands
     */
    getCommands() {
        return Array.from(this.commands.values());
    }

    /**
     * Get commands by category
     */
    getCommandsByCategory(category) {
        return this.getCommands().filter(cmd => cmd.category === category);
    }

    /**
     * Check if text is a command
     */
    isCommand(text, prefix = "#") {
        return text.startsWith(prefix);
    }

    /**
     * Parse command from text
     */
    parseCommand(text, prefix = "") {
        if (!this.isCommand(text, prefix)) {
            return null;
        }

        const parts = text.slice(prefix.length).trim().split(/\s+/);
        const command = parts[0].toLowerCase();
        const fullArgs = parts.slice(1).join(' ');
        
        // Parse arguments using | separator
        let args = [];
        if (fullArgs.includes('|')) {
            args = fullArgs.split('|').map(arg => arg.trim());
        } else {
            // Fallback to space-separated for backward compatibility
            args = parts.slice(1);
        }

        return {
            command,
            args,
            fullArgs
        };
    }

    /**
     * Parse command from text without prefix
     */
    parseCommandWithoutPrefix(text) {
        if (!text || typeof text !== 'string') {
            return null;
        }

        const parts = text.trim().split(/\s+/);
        const command = parts[0].toLowerCase();
        
        // Check if the first word is a registered command
        if (this.getCommand(command)) {
            const fullArgs = parts.slice(1).join(' ');
            
            // Parse arguments using | separator
            let args = [];
            if (fullArgs.includes('|')) {
                args = fullArgs.split('|').map(arg => arg.trim());
            } else {
                // Fallback to space-separated for backward compatibility
                args = parts.slice(1);
            }
            
            return {
                command,
                args,
                fullArgs
            };
        }

        return null;
    }

    /**
     * Parse arguments with pipe separator
     * Example: "key1|value1|value2" -> ["key1", "value1", "value2"]
     */
    parsePipeArguments(text) {
        if (!text || typeof text !== 'string') {
            return [];
        }
        
        return text.split('|').map(arg => arg.trim()).filter(arg => arg.length > 0);
    }

    /**
     * Parse key-value pair with pipe separator
     * Example: "productname|description here" -> { key: "productname", value: "description here" }
     */
    parseKeyValue(text) {
        if (!text || typeof text !== 'string' || !text.includes('|')) {
            return null;
        }
        
        const parts = text.split('|');
        const key = parts[0].trim();
        const value = parts.slice(1).join('|').trim(); // Join back in case there are multiple pipes
        
        return {
            key,
            value
        };
    }

    /**
     * Parse command with multiple pipe-separated arguments
     * Example: "addlist product1|description|price|category" 
     */
    parseMultipleArgs(text, expectedCount = null) {
        const args = this.parsePipeArguments(text);
        
        if (expectedCount && args.length !== expectedCount) {
            return {
                success: false,
                args: [],
                error: `Expected ${expectedCount} arguments, got ${args.length}`
            };
        }
        
        return {
            success: true,
            args,
            error: null
        };
    }
}

export default CommandHandler; 