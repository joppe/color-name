# Color Name

I am a big fan of [zss](https://github.com/zicht/zss), by convention you are not allowed to use a hexadecimal value for 
a color. Every color needs to be converted to a name. I am used to consult the website color-blindness.com for this. As 
an exercise to get acquainted with `puppeteer`, I created this script to get the name of a color using the commandline.

This script uses the form on [www.color-blindness.com](http://www.color-blindness.com/color-name-hue-tool/color-name-hue.html) 
to get the name of a color.


## Install

The script requires `nodejs >= 8`. Install the script `npm install git+https://github.com/joppe/color-name.git`. The 
script can now be used by typing `node_modules/.bin/color-name f03455`.
