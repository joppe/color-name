"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require("puppeteer");
const INPUT_ELEMENT_SELECTOR = '#cp1_Hex';
const NAME_ELEMENT_SELECTOR = '#cp1_ColorNameText';
const HUE_ELEMENT_SELECTOR = '#cp1_ColorShadeText';
const URL = 'http://www.color-blindness.com/color-name-hue-tool/color-name-hue.html';
const HEX_COLOR_RE = /^#?[\da-f]{6}$/i;
function normalizeHue(hue) {
    return hue.toLowerCase();
}
exports.normalizeHue = normalizeHue;
function normalizeColorName(colorName, hue) {
    return colorName
        .toLowerCase()
        .replace(/\s/g, '-')
        .replace(new RegExp(`^${hue}\-?|\-?${hue}$`), '');
}
exports.normalizeColorName = normalizeColorName;
/**
 * This function creates a nice color name from a given hue and name.
 */
function createColorName(colorName, hue) {
    const normalizedHue = normalizeHue(hue);
    const normalizedName = normalizeColorName(colorName, normalizedHue);
    if (normalizedName === '' || normalizedHue === normalizedName) {
        return normalizedHue;
    }
    return `${normalizedHue}--${normalizedName}`;
}
exports.createColorName = createColorName;
/**
 * Check if a color is valid.
 */
function isValidColor(color) {
    return HEX_COLOR_RE.test(color);
}
exports.isValidColor = isValidColor;
/**
 * Remove the '#' from a color value and make all characters lowercase.
 */
function normalizeColor(color) {
    return color.replace('#', '').toLowerCase();
}
exports.normalizeColor = normalizeColor;
function getColorName(colors, noSandbox = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const args = noSandbox ? ['--no-sandbox', '--disable-setuid-sandbox'] : [];
        const browser = yield puppeteer.launch({
            args
        });
        const page = yield browser.newPage();
        const output = [];
        yield page.goto(URL, {
            waitUntil: 'networkidle2'
        });
        for (const color of colors) {
            if (isValidColor(color) === false) {
                throw new Error(`Invalid color "${color}"`);
            }
            yield page.$eval(INPUT_ELEMENT_SELECTOR, (el, c) => {
                el.value = c;
            }, normalizeColor(color));
            yield page.$eval(INPUT_ELEMENT_SELECTOR, (el) => {
                el.dispatchEvent(new Event('keyup'));
            });
            const colorName = yield page.$eval(NAME_ELEMENT_SELECTOR, (el) => {
                return el.textContent;
            });
            const hue = yield page.$eval(HUE_ELEMENT_SELECTOR, (el) => {
                return el.textContent;
            });
            output.push({
                hex: color,
                name: createColorName(colorName, hue)
            });
        }
        yield browser.close();
        return output;
    });
}
exports.getColorName = getColorName;
