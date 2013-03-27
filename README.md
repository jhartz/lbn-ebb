# LBN Electronic Bulletin Board

## Usage

Open the `bulletinboard.html` file. Enter settings, then click "Go". If you use a second desktop or monitor for presenting, set up the second window in your second desktop. When ready and fullscreen, click "Continue". If the presentation window is in a separate desktop from the original window, you can control the presentation using the controls in the original window.

## Settings

Files you need to add yourself:

- `custom/logo.png` - your logo (shown in corner of presentation); should be about 200x200 or thereabouts
- `custom/title.png` - a title slide; should be about 720x540
- `custom/weather-settings.js` - settings for the weather info (location, API key)
- `custom/weather-images/...` (clear.jpg, cloudy.jpg, foggy.jpg, icy.jpg, mcloudy.jpg, ptcloudy.jpg, rainy.jpg, snow.jpg, thunder.jpg, wintmix.jpg) - backgrounds for the "Current Conditions" slide (changes automatically based on current conditions)
- `custom/LBN EBB Optionifier.zip` - a compiled version of the LBN EBB Optionifier (if you choose to use it); this is linked to in ebb.html; see [github.com/jhartz/lbn-ebb-optionifier](https://github.com/jhartz/lbn-ebb-optionifier)

`custom/weather-settings.js` should look something like this:

    // wunderground.com API KEY
    var PLUGIN_weather_apikey = "...";
    // location zip code
    var PLUGIN_weather_location = "...";

For other radar map-related settings, you'll have to change them directly in plugins/weather.js