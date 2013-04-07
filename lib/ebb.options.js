/*
Copyright (c) 2013, Jake Hartz. All rights reserved.
Use of this source code is governed by a BSD-style license
that can be found in the LICENSE.txt file.
*/

ebb.options = {
    DEFAULTS: {
        bool: false
    },
    
    plugin: null,
    
    getOption: function (option, pluginname) {
        var val = localStorage.getItem("_OPTION_" + (pluginname || ebb.options.plugin.name) + "_" + option.name) || option.value || (option.type && ebb.options.DEFAULTS[option.type]) || "";
        if (option.type == "bool" && typeof val == "string") val = val == "true";
        return val;
    },
    
    load: function () {
        document.getElementById("options_submit").addEventListener("click", function (event) {
            event.preventDefault();
            ebb.options.save();
        }, false);
        
        document.getElementById("options_reset").addEventListener("click", function (event) {
            event.preventDefault();
            ebb.options.reset();
        }, false);
        
        document.getElementById("options_cancel").addEventListener("click", function (event) {
            event.preventDefault();
            ebb.options.close();
        }, false);
    },
    
    show: function (plugin) {
        ebb.options.plugin = plugin;
        
        document.getElementById("options_name").innerHTML = escHTML(ebb.options.plugin.name);
        var upd_date = localStorage.getItem("_SAVE_TIME_" + ebb.options.plugin.name);
        if (upd_date) {
            document.getElementById("options_updated").innerHTML = "Last Updated: " + (new Date(parseInt(upd_date, 10))).toString().split("GMT")[0];
            document.getElementById("options_updated").style.display = "block";
        } else {
            document.getElementById("options_updated").style.display = "none";
        }
        
        ebb.options.update(function (i) {
            return ebb.options.getOption(ebb.options.plugin.options[i]);
        });
        
        document.getElementById("input").style.display = "none";
        document.getElementById("options").style.display = "block";
    },
    
    update: function (valfunc) {
        document.getElementById("options_options").innerHTML = "";
        for (var i = 0; i < ebb.options.plugin.options.length; i++) {
            var content = '<p>';
            var val = valfunc(i);
            switch (ebb.options.plugin.options[i].type) {
                case "bool":
                    content += '<input type="checkbox" id="options_' + i + '" value="yes"' + (val ? ' checked' : '') + '><label for="options_' + i + '">&nbsp;' + escHTML(ebb.options.plugin.options[i].name) + '</label>';
                    break;
                case "text":
                    content += escHTML(ebb.options.plugin.options[i].name) + ':<br><input type="text" id="options_' + i + '" style="width: 100%;" value="' + escHTML(val) + '">';
                    break;
                case "textarea":
                case "filteredtextarea":
                case "html":
                    content += escHTML(ebb.options.plugin.options[i].name) + ':<br><textarea id="options_' + i + '" style="width: 100%;" rows="20">' + escHTML(val) + '</textarea>';
                    if (ebb.options.plugin.options[i].type == "filteredtextarea") {
                        content += '<br>Use the following syntax to format input: [[b]]<b>bold</b>[[/b]] [[i]]<i>italic</i>[[/i]] [[u]]<u>underline</u>[[/u]] <span class="link">more...</span>';
                    } else if (ebb.options.plugin.options[i].type == "html") {
                        content += '<br><strong>WARNING:</strong> HTML is not escaped in this input. Any HTML entered will be executed when displayed in the presentation.';
                    }
                    break;
            }
            content += '</p>';
            var elem = document.createElement("div");
            elem.innerHTML = content;
            document.getElementById("options_options").appendChild(elem);
        }
    },
    
    save: function () {
        for (var i = 0; i < ebb.options.plugin.options.length; i++) {
            switch (ebb.options.plugin.options[i].type) {
                case "bool":
                    localStorage.setItem("_OPTION_" + ebb.options.plugin.name + "_" + ebb.options.plugin.options[i].name, document.getElementById("options_" + i).checked);
                    break;
                case "text":
                case "textarea":
                case "filteredtextarea":
                case "html":
                    localStorage.setItem("_OPTION_" + ebb.options.plugin.name + "_" + ebb.options.plugin.options[i].name, document.getElementById("options_" + i).value);
                    break;
            }
        }
        localStorage.setItem("_SAVE_TIME_" + ebb.options.plugin.name, (new Date()).getTime());
        
        ebb.options.close();
    },
    
    reset: function () {
        ebb.options.update(function (i) {
            return ebb.options.plugin.options[i].value || (ebb.options.plugin.options[i].type && ebb.options.DEFAULTS[ebb.options.plugin.options[i].type]) || "";
        });
    },
    
    close: function () {
        document.getElementById("options").style.display = "none";
        document.getElementById("input").style.display = "block";
    }
};