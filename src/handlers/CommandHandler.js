import logger from "../utils/logger.js";
import { queueHelpers } from "../utils/queue.js";

class CommandHandler {
    constructor() {
        this.commands = new Map();
        this.aliases = new Map();
        this.middlewares = [];
        this.commandStats = new Map(); // Track command usage for debugging
    }

    /**
     * Register a command with enhanced validation
     */
    register(name, config, handler) {
        if (typeof config === 'function') {
            handler = config;
            config = {};
        }

        // Validate command name
        if (!name || typeof name !== 'string') {
            logger.error('Command registration failed: Invalid command name');
            return false;
        }

        // Validate handler
        if (!handler || typeof handler !== 'function') {
            logger.error(`Command registration failed: Invalid handler for ${name}`);
            return false;
        }

        const command = {
            name,
            handler,
            description: config.description || 'No description available',
            usage: config.usage || name,
            category: config.category || 'general',
            ownerOnly: config.ownerOnly || false,
            adminOnly: config.adminOnly || false,
            groupOnly: config.groupOnly || false,
            privateOnly: config.privateOnly || false,
            premiumOnly: config.premiumOnly || false,
            aliases: config.aliases || []
        };

        this.commands.set(name, command);

        // Register aliases
        if (config.aliases && Array.isArray(config.aliases)) {
            config.aliases.forEach(alias => {
                if (this.aliases.has(alias)) {
                    logger.warn(`Alias '${alias}' already exists, overwriting`);
                }
                this.aliases.set(alias, name);
            });
        }

        // Initialize stats
        this.commandStats.set(name, {
            executions: 0,
            errors: 0,
            lastUsed: null
        });

        logger.debug(`Registered command: ${name}`);
        return true;
    }

    /**
     * Add middleware
     */
    use(middleware) {
        if (typeof middleware !== 'function') {
            logger.error('Middleware must be a function');
            return false;
        }
        this.middlewares.push(middleware);
        return true;
    }

    /**
     * Unregister a command and its aliases
     */
    unregister(name) {
        if (!name || typeof name !== 'string') {
            logger.error('Command unregistration failed: Invalid command name');
            return false;
        }

        const command = this.commands.get(name);
        if (!command) {
            logger.warn(`Command not found for unregistration: ${name}`);
            return false;
        }

        // Remove aliases
        if (command.aliases && Array.isArray(command.aliases)) {
            command.aliases.forEach(alias => {
                this.aliases.delete(alias);
            });
        }

        // Remove command and stats
        this.commands.delete(name);
        this.commandStats.delete(name);

        logger.debug(`Unregistered command: ${name}`);
        return true;
    }

    /**
     * Clear all commands and aliases
     */
    clearAll() {
        const commandCount = this.commands.size;
        this.commands.clear();
        this.aliases.clear();
        this.commandStats.clear();
        
        logger.debug(`Cleared ${commandCount} commands`);
        return commandCount;
    }

    /**
     * Get command by name or alias with fallback
     */
    getCommand(name) {
        if (!name || typeof name !== 'string') {
            return null;
        }
        
        const commandName = this.aliases.get(name.toLowerCase()) || name.toLowerCase();
        return this.commands.get(commandName);
    }

    /**
     * Execute command with enhanced error handling and retries
     */
    async execute(commandName, context) {
        const startTime = Date.now();
        
        try {
            const command = this.getCommand(commandName);
            if (!command) {
                logger.debug(`Command not found: ${commandName}`);
                return false;
            }

            // Update stats
            const stats = this.commandStats.get(command.name);
            if (stats) {
                stats.lastUsed = new Date();
                stats.executions++;
            }

            // Enhanced context validation
            if (!this.validateContext(context)) {
                logger.error(`Invalid context for command ${commandName}`);
                await this.sendContextError(context);
                return false;
            }

            // Run middlewares with timeout
            for (const middleware of this.middlewares) {
                try {
                    const result = await Promise.race([
                        middleware(context, command),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Middleware timeout')), 5000)
                        )
                    ]);
                    
                    if (result === false) {
                        logger.debug(`Middleware blocked command execution: ${commandName}`);
                        return false;
                    }
                } catch (middlewareError) {
                    logger.error(`Middleware error for ${commandName}:`, middlewareError);
                    
                    if (middlewareError.message === 'Middleware timeout') {
                        await context.messageService.reply(
                            context.from,
                            "⏱️ Proses validasi memakan waktu terlalu lama. Silakan coba lagi.",
                            context.msg
                        );
                    }
                    return false;
                }
            }

            // Execute command with retry mechanism
            const commandResult = await queueHelpers.retryOperation(
                async () => {
                    return await Promise.race([
                        command.handler(context),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Command timeout')), 20000)
                        )
                    ]);
                },
                2, // Max 2 retries
                1000 // 1 second base delay
            );

            const executionTime = Date.now() - startTime;
            logger.info(`Command ${commandName} executed successfully in ${executionTime}ms`);
            
            return true;
            
        } catch (error) {
            const executionTime = Date.now() - startTime;
            
            // Update error stats
            const stats = this.commandStats.get(commandName);
            if (stats) {
                stats.errors++;
            }
            
            logger.error(`Error executing command ${commandName} (${executionTime}ms):`, error);
            
            // Send appropriate error message based on error type
            try {
                await this.handleCommandError(context, commandName, error);
            } catch (responseError) {
                logger.error("Failed to send command error response:", responseError);
            }
            
            return false;
        }
    }

    /**
     * Validate command execution context
     */
    validateContext(context) {
        const requiredFields = ['messageService', 'from', 'sender', 'msg'];
        
        for (const field of requiredFields) {
            if (!context[field]) {
                logger.error(`Missing required context field: ${field}`);
                return false;
            }
        }
        
        return true;
    }

    /**
     * Send context validation error
     */
    async sendContextError(context) {
        try {
            if (context?.messageService && context?.from && context?.msg) {
                await context.messageService.reply(
                    context.from,
                    "❌ Terjadi kesalahan sistem. Silakan coba lagi atau hubungi admin.",
                    context.msg
                );
            }
        } catch (error) {
            logger.error("Failed to send context error:", error);
        }
    }

    /**
     * Handle different types of command errors
     */
    async handleCommandError(context, commandName, error) {
        let errorMessage;
        
        if (error.message === 'Command timeout') {
            errorMessage = `⏱️ Perintah *${commandName}* memakan waktu terlalu lama. Silakan coba lagi.`;
        } else if (error.message?.includes('timeout')) {
            errorMessage = `⏱️ Koneksi timeout saat menjalankan *${commandName}*. Silakan coba lagi.`;
        } else if (error.message?.includes('rate limit')) {
            errorMessage = `🚫 Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.`;
        } else if (error.message?.includes('permission')) {
            errorMessage = `❌ Anda tidak memiliki izin untuk menjalankan perintah ini.`;
        } else {
            errorMessage = `❌ Terjadi kesalahan saat menjalankan *${commandName}*. Silakan coba lagi.`;
        }
        
        await context.messageService.reply(context.from, errorMessage, context.msg);
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
     * Get command statistics for monitoring
     */
    getCommandStats() {
        const stats = {};
        for (const [name, data] of this.commandStats.entries()) {
            stats[name] = { ...data };
        }
        return stats;
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