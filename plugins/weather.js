PLUGIN_weather_showalerts = false;

ebb.plugins.push({
    name: "Weather",
    type: "html",
    content: [
        '<div class="title PLUGIN_weather_currentconditions" style="font-size: 97px;">Current Conditions</div>' +
        '<div style="text-align: center; font-size: 95px;"><img class="img PLUGIN_weather_icon"><br><span class="PLUGIN_weather_status">DNE</span><br><span class="PLUGIN_weather_temp">DNE</span>&deg;</span></div>',
        
        '<div class="title PLUGIN_weather_nextfewhours"" style="font-size: 97px;">Next Few Hours</div>' +
        '<table class="pretty tri"><tbody>' +
        '<tr><th><span class="PLUGIN_weather_hourly_title1">1</span></th><th><span class="PLUGIN_weather_hourly_title2">2</span></th><th><span class="PLUGIN_weather_hourly_title3">3</span></th></tr>' +
        '<tr><td><div style="max-height: 290px; overflow: hidden; text-overflow: ellipsis;"><img class="img PLUGIN_weather_hourly_img1"><br><span class="PLUGIN_weather_hourly_status1">DNE</span></div></td><td><div style="max-height: 290px; overflow: hidden; text-overflow: ellipsis;"><img class="img PLUGIN_weather_hourly_img2"><br><span class="PLUGIN_weather_hourly_status2">DNE</span></div></td><td><div style="max-height: 290px; overflow: hidden; text-overflow: ellipsis;"><img class="img PLUGIN_weather_hourly_img3"><br><span class="PLUGIN_weather_hourly_status3">DNE</span></div></td></tr>' +
        '<tr><td><span class="PLUGIN_weather_hourly_temp1">DNE</span>&deg;<span class="PLUGIN_weather_hourly_feelslike_container1"><br>Feels like: <span class="PLUGIN_weather_hourly_feelslike1">DNE</span>&deg;</span></td><td><span class="PLUGIN_weather_hourly_temp2">DNE</span>&deg;<span class="PLUGIN_weather_hourly_feelslike_container2"><br>Feels like: <span class="PLUGIN_weather_hourly_feelslike2">DNE</span>&deg;</span></td><td><span class="PLUGIN_weather_hourly_temp3">DNE</span>&deg;<span class="PLUGIN_weather_hourly_feelslike_container3"><br>Feels like: <span class="PLUGIN_weather_hourly_feelslike3">DNE</span>&deg;</span></td></tr>' +
        '</tbody></table>',
        
        '<div class="title PLUGIN_weather_nextfewdays" style="font-size: 97px;">Next Few Days</div>' +
        '<table class="pretty tri"><tbody>' +
        '<tr><th><span class="PLUGIN_weather_forecast_day1">1</span></th><th><span class="PLUGIN_weather_forecast_day2">2</span></th><th><span class="PLUGIN_weather_forecast_day3">3</span></th></tr>' +
        '<tr><td><div style="max-height: 340px; overflow: hidden; text-overflow: ellipsis;"><img class="img PLUGIN_weather_forecast_img1"><br><span class="PLUGIN_weather_forecast_status1">DNE</span></div></td><td><div style="max-height: 340px; overflow: hidden; text-overflow: ellipsis;"><img class="img PLUGIN_weather_forecast_img2"><br><span class="PLUGIN_weather_forecast_status2">DNE</span></div></td><td><div style="max-height: 340px; overflow: hidden; text-overflow: ellipsis;"><img class="img PLUGIN_weather_forecast_img3"><br><span class="PLUGIN_weather_forecast_status3">DNE</span></div></td></tr>' +
        '<tr class="midget"><td><span style="float: left;">High: <span class="PLUGIN_weather_forecast_high1">DNE</span>&deg;</span> <span style="float: right;">Low: <span class="PLUGIN_weather_forecast_low1">DNE</span>&deg;</span></td><td><span style="float: left;">High: <span class="PLUGIN_weather_forecast_high2">DNE</span>&deg;</span> <span style="float: right;">Low: <span class="PLUGIN_weather_forecast_low2">DNE</span>&deg;</span></td><td><span style="float: left;">High: <span class="PLUGIN_weather_forecast_high3">DNE</span>&deg;</span> <span style="float: right;">Low: <span class="PLUGIN_weather_forecast_low3">DNE</span>&deg;</span></td></tr>' +
        '</tbody></table>',
        
        '<div class="title" style="font-size: 97px;">Radar</div>' +
        '<div style="position: relative;"><div style="position: relative; overflow: hidden; width: 880px; height: 506px;"><img class="PLUGIN_weather_radar" style="margin-top: -40px;"></div><div style="position: absolute; left: 676px; top: 300px" class="not-in-preview"><img src="marker.png"></div></div>'
    ],
    className: "no-font-adjust",
    options: [
        {
            name: "Show Severe Weather Alerts (yes/no)",
            type: "text",
            value: "yes"
        }
    ],
    update: function (options) {
        PLUGIN_weather_showalerts = options["Show Severe Weather Alerts (yes/no)"].toLowerCase() == "yes";
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://api.wunderground.com/api/" + PLUGIN_weather_apikey + "/alerts/conditions/forecast/hourly/q/" + PLUGIN_weather_location + ".json?callback=PLUGIN_weather_jsonp";
        document.getElementsByTagName("head")[0].appendChild(script);
        
        ebb.send_update([
            {
                className: "PLUGIN_weather_radar",
                attributes: {
                    src: "http://api.wunderground.com/api/" + PLUGIN_weather_apikey + "/animatedradar/q/" + PLUGIN_weather_location + ".gif?radius=131&width=1365&height=785&rainsnow=1&timelabel=1&timelabel.x=50&timelabel.y=500&newmaps=1&timestamp_so_no_cache=" + (new Date()).getTime()
                }
            }
        ]);
    },
    update_interval: 5 * 60 * 1000  // 5 min
});

if (typeof head != "undefined" && typeof head.js == "function") {
    head.js("../custom/weather-settings.js");
}

function PLUGIN_weather_jsonp(data) {
    if (data.alerts.length > 0 && PLUGIN_weather_showalerts) {
        // severe weather alerts
        var alertness = '<marquee bgcolor="red" style="width: 100%;">';
        var nostarted = true;
        for (var alert_i = 0; alert_i < data.alerts.length; alert_i++) {
            if (nostarted) {
                nostarted = false;
            } else {
                alertness += ';&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            }
            alertness += '<strong>' + escHTML(data.alerts[alert_i].description) + ':&nbsp;</strong>' + escHTML(data.alerts[alert_i].message);
        }
        alertness += '</marquee>';
        ebb.send_update([
            {
                className: "lbn-weather-alerts",
                html: alertness,
                style: {
                    display: "block"
                }
            }
        ]);
    } else {
        ebb.send_update([
            {
                className: "lbn-weather-alerts",
                html: "",
                style: {
                    display: "none"
                }
            }
        ]);
    }
    
    // Indexes in data.forecast.txt_forecast.forecastday (since it includes nights too)
    var forecast_indexes = [];
    var forecast_index = 1;  // skip the first one (today or tonight)
    for (var i = 1; i <= 3; i++) {
        while (data.forecast.txt_forecast.forecastday[forecast_index].title.toLowerCase().indexOf("night") != -1) {
            forecast_index++;
        }
        forecast_indexes.push([forecast_index, data.forecast.txt_forecast.forecastday[forecast_index].title.toLowerCase()]);
        forecast_index++;
    }
    var txt_forecast1 = forecast_indexes[0][0],
        txt_forecast2 = forecast_indexes[1][0],
        txt_forecast3 = forecast_indexes[2][0];
    
    // Indexes in data.forecast.simpleforecast.forecastday
    // (sync them up to txt_forecast indexes)
    var simpleforecast_indexes = [];
    for (var j = 0; j < data.forecast.simpleforecast.forecastday.length; j++) {
        var myday = data.forecast.simpleforecast.forecastday[j].date.weekday.toLowerCase();
        for (var k = 0; k < forecast_indexes.length; k++) {
            if (forecast_indexes[k][1] == myday) {
                simpleforecast_indexes.push(j);
            }
        }
    }
    var simpleforecast1 = simpleforecast_indexes[0],
        simpleforecast2 = simpleforecast_indexes[1],
        simpleforecast3 = simpleforecast_indexes[2];
    
    // Update background images
    PLUGIN_weather_bgimg(data.current_observation.weather, "PLUGIN_weather_currentconditions", data.current_observation.icon);
    //PLUGIN_weather_bgimg("next few hours", "PLUGIN_weather_nextfewhours");
    //PLUGIN_weather_bgimg(data.forecast.simpleforecast.forecastday[simpleforecast1].conditions, "PLUGIN_weather_nextfewdays", data.forecast.simpleforecast.forecastday[simpleforecast1].icon);
    
    // Update slide data
    ebb.send_update([
        // current observations
        {
            className: "PLUGIN_weather_icon",
            attributes: {
                src: data.current_observation.icon_url
            }
        },
        {
            className: "PLUGIN_weather_status",
            text: data.current_observation.weather
        },
        {
            className: "PLUGIN_weather_temp",
            text: data.current_observation.temp_f
        },
        
        // hourly forecast
        {
            className: "PLUGIN_weather_hourly_title1",
            text: data.hourly_forecast[0].FCTTIME.civil
        },
        {
            className: "PLUGIN_weather_hourly_title2",
            text: data.hourly_forecast[1].FCTTIME.civil
        },
        {
            className: "PLUGIN_weather_hourly_title3",
            text: data.hourly_forecast[2].FCTTIME.civil
        },
        
        {
            className: "PLUGIN_weather_hourly_img1",
            attributes: {
                src: data.hourly_forecast[0].icon_url
            }
        },
        {
            className: "PLUGIN_weather_hourly_img2",
            attributes: {
                src: data.hourly_forecast[1].icon_url
            }
        },
        {
            className: "PLUGIN_weather_hourly_img3",
            attributes: {
                src: data.hourly_forecast[2].icon_url
            }
        },
        
        {
            className: "PLUGIN_weather_hourly_status1",
            text: data.hourly_forecast[0].wx || data.hourly_forecast[0].condition
        },
        {
            className: "PLUGIN_weather_hourly_status2",
            text: data.hourly_forecast[1].wx || data.hourly_forecast[1].condition
        },
        {
            className: "PLUGIN_weather_hourly_status3",
            text: data.hourly_forecast[2].wx || data.hourly_forecast[2].condition
        },
        
        {
            className: "PLUGIN_weather_hourly_temp1",
            text: data.hourly_forecast[0].temp.english
        },
        {
            className: "PLUGIN_weather_hourly_temp2",
            text: data.hourly_forecast[1].temp.english
        },
        {
            className: "PLUGIN_weather_hourly_temp3",
            text: data.hourly_forecast[2].temp.english
        },
        
        {
            className: "PLUGIN_weather_hourly_feelslike1",
            text: data.hourly_forecast[0].feelslike.english
        },
        {
            className: "PLUGIN_weather_hourly_feelslike2",
            text: data.hourly_forecast[1].feelslike.english
        },
        {
            className: "PLUGIN_weather_hourly_feelslike3",
            text: data.hourly_forecast[2].feelslike.english
        },
        
        {
            className: "PLUGIN_weather_hourly_feelslike_container1",
            style: {
                display: (data.hourly_forecast[0].feelslike.english && data.hourly_forecast[0].feelslike.english != data.hourly_forecast[0].temp.english) ? "" : "none"
            }
        },
        
        {
            className: "PLUGIN_weather_hourly_feelslike_container2",
            style: {
                display: (data.hourly_forecast[1].feelslike.english && data.hourly_forecast[1].feelslike.english != data.hourly_forecast[1].temp.english) ? "" : "none"
            }
        },
        
        {
            className: "PLUGIN_weather_hourly_feelslike_container3",
            style: {
                display: (data.hourly_forecast[2].feelslike.english && data.hourly_forecast[2].feelslike.english != data.hourly_forecast[2].temp.english) ? "" : "none"
            }
        },
        
        // 3-day forecast
        {
            className: "PLUGIN_weather_forecast_day1",
            text: data.forecast.txt_forecast.forecastday[txt_forecast1].title
        },
        {
            className: "PLUGIN_weather_forecast_day2",
            text: data.forecast.txt_forecast.forecastday[txt_forecast2].title
        },
        {
            className: "PLUGIN_weather_forecast_day3",
            text: data.forecast.txt_forecast.forecastday[txt_forecast3].title
        },
        
        {
            className: "PLUGIN_weather_forecast_img1",
            attributes: {
                src: data.forecast.txt_forecast.forecastday[txt_forecast1].icon_url
            }
        },
        {
            className: "PLUGIN_weather_forecast_img2",
            attributes: {
                src: data.forecast.txt_forecast.forecastday[txt_forecast2].icon_url
            }
        },
        {
            className: "PLUGIN_weather_forecast_img3",
            attributes: {
                src: data.forecast.txt_forecast.forecastday[txt_forecast3].icon_url
            }
        },
        
        {
            className: "PLUGIN_weather_forecast_status1",
            text: data.forecast.txt_forecast.forecastday[txt_forecast1].fcttext.substring(0, data.forecast.txt_forecast.forecastday[txt_forecast1].fcttext.indexOf("."))
        },
        {
            className: "PLUGIN_weather_forecast_status2",
            text: data.forecast.txt_forecast.forecastday[txt_forecast2].fcttext.substring(0, data.forecast.txt_forecast.forecastday[txt_forecast2].fcttext.indexOf("."))
        },
        {
            className: "PLUGIN_weather_forecast_status3",
            text: data.forecast.txt_forecast.forecastday[txt_forecast3].fcttext.substring(0, data.forecast.txt_forecast.forecastday[txt_forecast3].fcttext.indexOf("."))
        },
        
        {
            className: "PLUGIN_weather_forecast_high1",
            text: data.forecast.simpleforecast.forecastday[simpleforecast1].high.fahrenheit
        },
        {
            className: "PLUGIN_weather_forecast_high2",
            text: data.forecast.simpleforecast.forecastday[simpleforecast2].high.fahrenheit
        },
        {
            className: "PLUGIN_weather_forecast_high3",
            text: data.forecast.simpleforecast.forecastday[simpleforecast3].high.fahrenheit
        },
        
        
        {
            className: "PLUGIN_weather_forecast_low1",
            text: data.forecast.simpleforecast.forecastday[simpleforecast1].low.fahrenheit
        },
        {
            className: "PLUGIN_weather_forecast_low2",
            text: data.forecast.simpleforecast.forecastday[simpleforecast2].low.fahrenheit
        },
        {
            className: "PLUGIN_weather_forecast_low3",
            text: data.forecast.simpleforecast.forecastday[simpleforecast3].low.fahrenheit
        },
        
    ]);
}

function PLUGIN_weather_bgimg(condition, className, alternate) {
    var s = function (img) {
        ebb.send_update([
            {
                className: className,
                useParent: 1,
                style: {
                    backgroundColor: "white",
                    backgroundImage: "url(../custom/weather-images/" + img + ".jpg)",
                    backgroundRepeat: "repeat-x"
                }
            }
        ]);
    };
    condition = condition.toLowerCase();
    if (condition.substring(0, 6) == "light " || condition.substring(0, 6) == "heavy ") condition = condition.substring(6);
    // http://www.wunderground.com/weather/api/d/docs?d=resources/phrase-glossary
    switch (condition) {
        case "drizzle":
        case "rain":
        case "rain mist":
        case "rain showers":
        case "hail showers":
        case "small hail showers":
        case "thunderstorms with hail":
        case "thunderstorms with small hail":
            s("rainy");
            break;
        case "thunderstorms and snow":
        case "thunderstorms and ice pellets":
            s("wintmix");
            break;
        case "small hail":
        case "snow":
        case "snow grains":
        case "low drifting snow":
        case "blowing snow":
        case "snow showers":
        case "snow blowing":
        case "snow mist":
        case "snow blowing snow mist":
            s("snow");
            break;
        case "ice crystals":
        case "ice pellets":
        case "ice pellet showers":
        case "freezing drizzle":
        case "freezing rain":
        case "freezing fog":
        case "sleet":
            s("icy");
            break;
        case "fog":
        case "fog patches":
        case "haze":
        case "patches of fog":
        case "shallow fog":
        case "partial fog":
            s("foggy");
            break;
        case "thunderstorm":
        case "thunderstorms":
        case "thunderstorms and rain":
            s("thunder");
            break;
        case "clear":
        case "sunny":
            s("clear");
            break;
        case "overcast":
        case "cloudy":
            s("cloudy");
            break;
        case "partly cloudy":
        case "mostly sunny":
        case "scattered clouds":
            s("ptcloudy");
            break;
        case "mostly cloudy":
        case "partly sunny":
        case "flurries":
            s("mcloudy");
            break;
        default:
            if (alternate) {
                PLUGIN_weather_bgimg(alternate, className);
            } else {
                ebb.send_update([
                    {
                        className: className,
                        useParent: 1,
                        style: {
                            backgroundColor: "",
                            backgroundImage: "",
                            backgroundRepeat: ""
                        }
                    }
                ]);
            }
    }
}