import chalk from 'chalk';

export const logError = (message: string) => {
    console.error(chalk.red.bold(`\n[ERROR] ${message}`));
};

export const logInfo = (message: string) => {
    console.info(chalk.blue(`\n${chalk.bold('[INFO]')} ${message}`));
};

export const logSuccess = (message: string) => {
    console.log(chalk.green.bold(`\n[SUCCESS] ${message}`));
};

export const logWarning = (message: string) => {
    console.warn(chalk.yellow.bold(`\n[WARNING] ${message}`));
};
