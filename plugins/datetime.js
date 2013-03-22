var PLUGIN_datetime_days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var PLUGIN_datetime_months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

ebb.plugins.push({
    name: "Date/Time",
    type: "html",
    content: '<span class="PLUGIN_datetime_date" style="float: left;"></span> <span class="PLUGIN_datetime_time" style="white-space: nowrap; float: right;"></span>',
    className: "mini no-font-adjust front",
    position: {
        x: 800,
        y: -3600,
        z: 10050,
        scale: 8,
        //"rotate-x": 40,
        //"rotate-y": -50
    },
    update: function () {
        var d = new Date();
        var hour = d.getHours();
        var pm = false;
        if (hour >= 12) {
            hour -= 12;
            pm = true;
        }
        if (hour == 0) hour = 12;
        var min = d.getMinutes() + "";
        if (min.length == 1) min = "0" + min;
        ebb.send_update([
            {
                className: "PLUGIN_datetime_date",
                text: PLUGIN_datetime_days[d.getDay()] + ", " + PLUGIN_datetime_months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() + " "
            },
            {
                className: "PLUGIN_datetime_time",
                text: " " + hour + ":" + min + " " + (pm ? "PM" : "AM")
            }
        ]);
    },
    update_interval: 60000
});