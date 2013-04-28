# LBN Electronic Bulletin Board

The LBN Electronic Bulletin Board is a browser-based system for creating a beautiful and dynamic information slideshow, perfect for showing on a public TV or display. Start with the example content, then modify or create your own plugins to customize it to fit your needs!

## Basic Usage

Open the `bulletinboard.html` file. Enter options, then click "Go". If you use a second desktop or monitor for presenting, set up the second window in your second desktop. When ready and fullscreen, click "Continue". If the presentation window is in a separate desktop from the original window, you can control the presentation using the controls in the original window.

## Plugins

Plugins are modules that define the slides on the LBN Electronic Bulletin Board. Each plugin is defined by a JavaScript file in the `plugins` directory. The `plugins.js` file defines the enabled plugins and their order in the Bulletin Board.

For more info on the plugin definition files, see `plugins/README.md`.

## Settings

Files you need to add yourself:

- `custom/logo.png` - your logo (shown in corner of presentation); should be about 200x200 or thereabouts
- `custom/title.png` - a title slide; should be about 720x540
- `custom/weather-settings.js` - settings for the weather info (location, API key); see below
- `custom/weather-images/...` (clear.jpg, cloudy.jpg, foggy.jpg, icy.jpg, mcloudy.jpg, ptcloudy.jpg, rainy.jpg, snow.jpg, thunder.jpg, wintmix.jpg) - backgrounds for the "Current Conditions" slide (changes automatically based on current conditions); you can modify the `PLUGIN_weather_bgimg` function in `plugins/weather.js` to change this around, depending on your image set
- `custom/LBN EBB Optionifier.zip` - a compiled version of the LBN EBB Optionifier (if you choose to use it). This is linked to in `lib/ebb.html`; to disable the link and info, set `ebb.input.LEO_INPUT_ENABLED` to `false` in `lib/ebb.input.js`. See [github.com/jhartz/lbn-ebb-optionifier](https://github.com/jhartz/lbn-ebb-optionifier) for more on the LBN EBB Optionifier.

`custom/weather-settings.js` should look something like this:

    // wunderground.com API KEY (required)
    var PLUGIN_weather_apikey = "...";
    
    // location zip code (required)
    var PLUGIN_weather_location = "12345";
    
    // off-hours (optional)
    // if (new Date()).getHours() is in this array, don't update weather (can save on API usage)
    var PLUGIN_weather_offhours = [22, 23, 0, 1, 2, 3, 4, 5];

For other radar map-related settings, you'll have to change them directly in `plugins/weather.js`.

NOTE: If you are not using the weather plugin, `custom/weather-settings.js` must exist (even if it is just an empty file), unless you remove `weather.js` from the `plugins.js` file.