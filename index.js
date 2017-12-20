const chalk = require('chalk');
const getColorName = require('./color-name/color-blindness.com').getColorName;

if (process.argv.length < 2) {
    console.log('Please provide a color in hexadecimal notation.');
    return;
}

if (process.argv.length > 3) {
    console.log(chalk.red.bold('Too many arguments.'));
    return;
}

const color = String(process.argv[2]);

if (color.length !== 6) {
    console.log(chalk.red.bold('Invalid color, use hex notation, 6 characters long.'));
    return;
}
getColorName(color).then((colorName) => {
    console.log(chalk.hex(color).bold(colorName));
});
