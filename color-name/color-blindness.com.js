const puppeteer = require('puppeteer');

const INPUT_ELEMENT_SELECTOR = '#cp1_Hex';
const NAME_ELEMENT_SELECTOR = '#cp1_ColorNameText';
const HUE_ELEMENT_SELECTOR = '#cp1_ColorShadeText';
const URL = 'http://www.color-blindness.com/color-name-hue-tool/color-name-hue.html';

/**
 * This function creates a nice color name from a given hue and name.
 * 
 * @param {string} name 
 * @param {string} hue 
 * @returns {string}
 */
function createColorName(name, hue) {
    let normalizedHue = hue.toLowerCase();
    let normalizedName = name
        .toLowerCase()
        .replace(/\s/, '-')
        .replace(new RegExp(`^${normalizedHue}\-?|\-?${normalizedHue}$`), '');

    if (normalizedName === '' || normalizedHue === normalizedName) {
        return normalizedHue;
    }

    return `${normalizedHue}--${normalizedName}`;
}

/**
 * @param {string} color, hexadecimal notation of a color
 * @returns {string}
 */
module.exports.getColorName = async function (color) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const test = 'TEST';

    await page.goto(URL, {
        waitUntil: 'networkidle2'
    });

    await page.$eval(INPUT_ELEMENT_SELECTOR, (el, c) => {
        el.value = c;
    }, color);
    await page.$eval(INPUT_ELEMENT_SELECTOR, (el) => {
        el.dispatchEvent(new Event('keyup'));
    });

    const name = await page.$eval(NAME_ELEMENT_SELECTOR, (el) => {
        return el.textContent;
    });

    const hue = await page.$eval(HUE_ELEMENT_SELECTOR, (el) => {
        return el.textContent;
    });

    await browser.close();

    return createColorName(name, hue);
};
