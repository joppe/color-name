import * as puppeteer from 'puppeteer';

const INPUT_ELEMENT_SELECTOR: string = '#cp1_Hex';
const NAME_ELEMENT_SELECTOR: string = '#cp1_ColorNameText';
const HUE_ELEMENT_SELECTOR: string = '#cp1_ColorShadeText';
// tslint:disable-next-line no-http-string
const URL: string = 'http://www.color-blindness.com/color-name-hue-tool/color-name-hue.html';
const HEX_COLOR_RE: RegExp = /^#?[\da-f]{6}$/i;

export function normalizeHue(hue: string): string {
    return hue.toLowerCase();
}

export function normalizeColorName(colorName: string, hue: string): string {
    return colorName
        .toLowerCase()
        .replace(/\s/g, '-')
        .replace(new RegExp(`^${hue}\-?|\-?${hue}$`), '');
}

/**
 * This function creates a nice color name from a given hue and name.
 */
export function createColorName(colorName: string, hue: string): string {
    const normalizedHue: string = normalizeHue(hue);
    const normalizedName: string = normalizeColorName(colorName, normalizedHue);

    if (normalizedName === '' || normalizedHue === normalizedName) {
        return normalizedHue;
    }

    return `${normalizedHue}--${normalizedName}`;
}

/**
 * Check if a color is valid.
 */
export function isValidColor(color: string): boolean {
    return HEX_COLOR_RE.test(color);
}

/**
 * Remove the '#' from a color value and make all characters lowercase.
 */
export function normalizeColor(color: string): string {
    return color.replace('#', '').toLowerCase();
}

export interface IResult {
    hex: string;
    name: string;
}

export async function getColorName(colors: string[], noSandbox: boolean = false): Promise<IResult[]> {
    const args: string[] = noSandbox ? ['--no-sandbox', '--disable-setuid-sandbox'] : [];
    const browser: puppeteer.Browser = await puppeteer.launch({
        args
    });
    const page: puppeteer.Page = await browser.newPage();
    const output: IResult[] = [];

    await page.goto(URL, {
        waitUntil: 'networkidle2'
    });

    for (const color of colors) {
        const normalizedColor: string = normalizeColor(color);

        if (isValidColor(color) === false) {
            throw new Error(`Invalid color "${color}"`);
        }

        await page.$eval(
            INPUT_ELEMENT_SELECTOR,
            (el: HTMLInputElement, c: string): void => {
                el.value = c;
            },
            normalizedColor
        );
        await page.$eval(
            INPUT_ELEMENT_SELECTOR,
            (el: HTMLInputElement): void => {
                el.dispatchEvent(new Event('keyup'));
            }
        );

        // tslint:disable-next-line no-unsafe-any
        const colorName: string = await page.$eval(
            NAME_ELEMENT_SELECTOR,
            (el: HTMLElement): string => {
                return el.textContent;
            }
        );

        // tslint:disable-next-line no-unsafe-any
        const hue: string = await page.$eval(
            HUE_ELEMENT_SELECTOR,
            (el: HTMLElement): string => {
                return el.textContent;
            }
        );

        output.push({
            hex: normalizedColor,
            name: createColorName(colorName, hue)
        });
    }

    await browser.close();

    return output;
}
