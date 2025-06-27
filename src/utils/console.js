/**
 * Console Utilities
 * Enhanced console output with colors and formatting
 */

import chalk from 'chalk';

/**
 * Apply color to text
 * @param {string} text - Text to color
 * @param {string} color - Color name
 * @returns {string} Colored text
 */
function color(text, color) {
    return !color ? chalk.green(text) : chalk.keyword(color)(text);
}

/**
 * Apply background color to text
 * @param {string} text - Text to color
 * @param {string} bgcolor - Background color name
 * @returns {string} Text with background color
 */
function bgcolor(text, bgcolor) {
    return !bgcolor ? chalk.green(text) : chalk.bgKeyword(bgcolor)(text);
}

/**
 * Console log with info level
 * @param {string} message - Message to log
 */
function info(message) {
    console.log(chalk.blue('[INFO]'), message);
}

/**
 * Console log with success level
 * @param {string} message - Message to log
 */
function success(message) {
    console.log(chalk.green('[SUCCESS]'), message);
}

/**
 * Console log with warning level
 * @param {string} message - Message to log
 */
function warn(message) {
    console.log(chalk.yellow('[WARN]'), message);
}

/**
 * Console log with error level
 * @param {string} message - Message to log
 */
function error(message) {
    console.log(chalk.red('[ERROR]'), message);
}

/**
 * Console log with debug level
 * @param {string} message - Message to log
 */
function debug(message) {
    console.log(chalk.magenta('[DEBUG]'), message);
}

export {
    color,
    bgcolor,
    info,
    success,
    warn,
    error,
    debug
};

export default {
    color,
    bgcolor,
    info,
    success,
    warn,
    error,
    debug
}; 