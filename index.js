const chalk = require('chalk');
const getColorName = require('./dist/color-blindness.com').getColorName;
const colors = process.argv.slice(2);
const config = require('./config/config.json');

try {
    getColorName(colors, config.noSandbox).then((results) => {
        for (const result of results) {
            console.log(chalk.hex(result.hex).bold('\u25A0'), `$${result.name}: #${result.hex};`);
        }
    });
} catch (e) {
    console.log(chalk.red.bold('An error occurred.'));
    console.log(chalk.red.bold(e.toString()));
}
