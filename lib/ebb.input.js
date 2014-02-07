/*
Copyright (c) 2014, Jake Hartz. All rights reserved.
Use of this source code is governed by a BSD-style license
that can be found in the LICENSE.txt file.
*/

ebb.input = {
    pluginboxes: {},
    
    load: function () {
        var add_listener = [];
        var content = '';
        var pluginoptions_elems = [];
        for (var i = 0; i < ebb.plugins.length; i++) {
            content += '<tr>';
            content += '<td><input type="checkbox" class="pluginbox" id="pluginbox' + i + '" checked></td>';
            content += '<td><label for="pluginbox' + i + '">' + ebb.util.escHTML(ebb.plugins[i].name) + '</label></td>';
            ebb.input.pluginboxes[ebb.plugins[i].name] = "pluginbox" + i;
            if (ebb.plugins[i].options) {
                content += '<td><button type="button" id="pluginoptions' + i + '" data-i="' + i + '">Options</button></td>';
                pluginoptions_elems.push("pluginoptions" + i);
            }
            content += '</tr>';
        }
        document.getElementById("input_plugins").innerHTML = content;
        
        for (var j = 0; j < ebb.plugins.length; j++) {
            if (document.getElementById("pluginbox" + j) && localStorage.getItem("_DISABLED_" + ebb.plugins[j].name) == "YES") {
                document.getElementById("pluginbox" + j).checked = false;
            }
        }
        
        ebb.util.forEach(pluginoptions_elems, function (elem) {
            document.getElementById(elem).addEventListener("click", function (event) {
                event.preventDefault();
                ebb.options.show(ebb.plugins[Number(this.dataset.i)]);
            }, false);
        });
        
        document.getElementById("input_submit").addEventListener("click", function (event) {
            event.preventDefault();
            document.getElementById("input").style.display = "none";
            
            for (var i = 0; i < ebb.plugins.length; i++) {
                if (document.getElementById("pluginbox" + i)) {
                    localStorage.setItem("_DISABLED_" + ebb.plugins[i].name, document.getElementById("pluginbox" + i).checked ? "NO" : "YES");
                }
            }
            
            ebb.control.start();
        }, false);
        
        if (typeof ebb.util.browseFile != "function" || typeof btoa != "function") {
            document.getElementById("input_leo").style.display = "none";
        } else {
            document.getElementById("input_leo_import_btn").addEventListener("click", function (event) {
                event.preventDefault();
                ebb.util.browseFile("json", "leo", function (result) {
                    if (result.leo_version != EBB_LEO_FORMAT_VERSION) {
                        alert("Error reading file!\nDetails: This leo file was created using an incompatible version of the LBN Electronic Bulletin Board.");
                    } else if (result.plugins) {
                        for (var plugin in result.plugins) {
                            if (result.plugins.hasOwnProperty(plugin)) {
                                if (ebb.input.pluginboxes[plugin]) {
                                    document.getElementById(ebb.input.pluginboxes[plugin]).checked = result.plugins[plugin].enabled;
                                }
                                if (result.plugins[plugin].options) {
                                    ebb.util.forEach(result.plugins[plugin].options, function (option) {
                                        localStorage.setItem("_OPTION_" + plugin + "_" + option.name, option.value);
                                    });
                                    localStorage.setItem("_SAVE_TIME_" + plugin, (new Date()).getTime());
                                }
                            }
                        }
                    } else {
                        alert("Error reading file!\nDetails: No plugin data.");
                    }
                });
            }, false);
            
            document.getElementById("input_leo_export_btn").addEventListener("click", function (event) {
                event.preventDefault();
                var d = new Date();
                
                var exporting = {
                    version: EBB_VERSION,
                    leo_version: EBB_LEO_FORMAT_VERSION,
                    time: d.getTime(),
                    plugins: {}
                };
                ebb.util.forEach(ebb.plugins, function (plugin) {
                    exporting.plugins[plugin.name] = {
                        enabled: ebb.input.pluginboxes[plugin.name] ? document.getElementById(ebb.input.pluginboxes[plugin.name]).checked : false,
                        options: []
                    };
                    if (plugin.options) {
                        ebb.util.forEach(plugin.options, function (option) {
                            exporting.plugins[plugin.name].options.push({
                                name: option.name,
                                value: ebb.options.getOption(option, plugin.name)
                            });
                        });
                    }
                });
                
                var dlbtn = document.getElementById("popup_input_leo_export_btn");
                dlbtn.setAttribute("download", "LBN Electronic Bulletin Board Export " + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ".leo");
                dlbtn.setAttribute("href", "data:application/json;base64," + btoa(JSON.stringify(exporting)));
                popup("popup_input_leo_export");
            }, false);
            
            if (typeof document.createElement("a").download == "undefined") {
                document.getElementById("popup_input_leo_export_info").style.display = "block";
            }
        }
    },
    
    start: function () {
        document.getElementById("input").style.display = "block";
    }
};