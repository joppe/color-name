const chalk = require('chalk');
const getColorName = require('./dist/color-blindness.com').getColorName;
const colors = [];
let noSandbox = false;

process.argv.forEach((arg, i) => {
    if (i < 2) {
        return;
    }

    if (arg === '--no-sandbox') {
        noSandbox = true;
    } else {
        colors.push(arg);
    }
});

try {
    getColorName(colors, noSandbox).then((results) => {
        for (const result of results) {
            console.log(chalk.hex(result.hex).bold('\u25A0'), `$${result.name}: #${result.hex};`);
        }
    });
} catch (e) {
    console.log(chalk.red.bold('An error occurred.'));
    console.log(chalk.red.bold(e.toString()));
}
