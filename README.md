# LBN Electronic Bulletin Board

<!-- NOTE: Be sure to update the version number in lib/util.js when you update it here!! -->

*Version 1.0.0pre*

https://github.com/jhartz/lbn-ebb

The LBN Electronic Bulletin Board is a browser-based system for creating a beautiful and dynamic information slideshow, perfect for showing on a public TV or display. Start with the example content, then modify or create your own plugins to customize it to fit your needs!

Because the LBN Electornic Bulletin Board is written entirely using HTML, CSS, and JavaScript, it works on any computer with a web browser; you don't have to worry about specific operating system requirements, and there is no special software required for the Bulletin Board to work!

## Basic Usage

Open the `bulletinboard.html` file. Enter options, then click "Go". If you use a second desktop or monitor for presenting, set up the second window in your second desktop. When ready and fullscreen, click "Continue". If the presentation window is in a separate desktop from the original window, you can control the presentation using the controls in the original window.

## Plugins

Plugins are modules that define the slides on the LBN Electronic Bulletin Board. Each plugin is defined by a JavaScript file in the `plugins` directory. The `plugins.js` file defines the enabled plugins and their order in the Bulletin Board.

For more info on the plugin definition files, see `plugins/README.md`.

## Settings

Files you need to add yourself:

- `custom/logo.png` - your logo (shown in corner of presentation); must be approximately square
- `custom/title.png` - a title slide; should be about 720x540
- `custom/weather-settings.js` - settings for the weather plugin (location, API key); see below
- `custom/weather-images/...` (clear.jpg, cloudy.jpg, foggy.jpg, icy.jpg, mcloudy.jpg, ptcloudy.jpg, rainy.jpg, snow.jpg, thunder.jpg, wintmix.jpg) - backgrounds for the "Current Conditions" slide (changes automatically based on current conditions); you can modify the `PLUGIN_weather_bgimg` function in `plugins/weather.js` to change this around, depending on your image set

`custom/weather-settings.js` should look something like this:

    // wunderground.com API KEY (required)
    // See http://www.wunderground.com/weather/api/d/login.html
    // For normal usage, the free API is plenty
    var PLUGIN_weather_apikey = "...";
    
    // location zip code (required)
    var PLUGIN_weather_location = "12345";
    
    // off-hours (optional)
    // if (new Date()).getHours() is in this array, don't update weather (can save on API usage)
    var PLUGIN_weather_offhours = [22, 23, 0, 1, 2, 3, 4, 5];

For other radar map-related settings, you'll have to change them directly in `plugins/weather.js`.
