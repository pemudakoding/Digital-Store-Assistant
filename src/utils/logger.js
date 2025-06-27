import chalk from "chalk";
import fs from "fs";
import path from "path";

class Logger {
    constructor() {
        this.logDir = "./logs";
        this.ensureLogDir();
    }

    ensureLogDir() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    formatTimestamp() {
        return new Date().toISOString();
    }

    writeToFile(level, message, data = null) {
        const timestamp = this.formatTimestamp();
        const logEntry = {
            timestamp,
            level,
            message,
            data
        };

        const logFile = path.join(this.logDir, `${level}.log`);
        const logLine = JSON.stringify(logEntry) + '\n';
        
        fs.appendFileSync(logFile, logLine);
    }

    info(message, data = null) {
        console.log(chalk.blue(`[INFO] ${message}`));
        this.writeToFile('info', message, data);
    }

    warn(message, data = null) {
        console.log(chalk.yellow(`[WARN] ${message}`));
        this.writeToFile('warn', message, data);
    }

    error(message, error = null) {
        console.log(chalk.red(`[ERROR] ${message}`));
        if (error) {
            console.log(chalk.red(error.stack || error));
        }
        this.writeToFile('error', message, error?.stack || error);
    }

    success(message, data = null) {
        console.log(chalk.green(`[SUCCESS] ${message}`));
        this.writeToFile('info', message, data);
    }

    debug(message, data = null) {
        if (process.env.NODE_ENV === 'development') {
            console.log(chalk.gray(`[DEBUG] ${message}`));
            this.writeToFile('debug', message, data);
        }
    }
}

export default new Logger(); 