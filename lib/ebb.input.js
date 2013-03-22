/*
Copyright (c) 2013, Jake Hartz. All rights reserved.
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
            content += '<td><label for="pluginbox' + i + '">' + escHTML(ebb.plugins[i].name) + '</label></td>';
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
        
        forEach(pluginoptions_elems, function (elem) {
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
        
        if (typeof FileReader != "undefined" && typeof document.getElementById("input_load_file_input").click == "function") {
            document.getElementById("input_load").style.display = "block";
            
            document.getElementById("input_load_file_btn").addEventListener("click", function (event) {
                event.preventDefault();
                document.getElementById("input_load_file_input").click();
            }, false);
            
            document.getElementById("input_load_file_info_link").addEventListener("click", function (event) {
                document.getElementById("input_load_file_info_link_container").style.display = "none";
                document.getElementById("input_load_file_info").style.display = "block";
            }, false);
            
            document.getElementById("input_load_file_input").addEventListener("change", function (event) {
                if (event.target.files && event.target.files.length > 0) {
                    var file = event.target.files[0];
                    var ext = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
                    if (ext != "leo") {
                        alert("Invalid file!\nPlease select a *.leo file.");
                    } else {
                        var reader = new FileReader();
                        reader.onload = function () {
                            if (reader.result) {
                                var result;
                                try {
                                    result = JSON.parse(reader.result);
                                } catch (err) {}
                                if (result) {
                                    for (var plugin in result) {
                                        if (result.hasOwnProperty(plugin)) {
                                            if (ebb.input.pluginboxes[plugin]) {
                                                document.getElementById(ebb.input.pluginboxes[plugin]).checked = result[plugin].enabled;
                                            }
                                            if (result[plugin].options) {
                                                forEach(result[plugin].options, function (option) {
                                                    localStorage.setItem("_OPTION_" + plugin + "_" + option.name, option.value);
                                                });
                                                localStorage.setItem("_SAVE_TIME_" + plugin, (new Date()).getTime());
                                            }
                                        }
                                    }
                                } else {
                                    alert("Error reading file!\nDetails: Could not parse JSON.");
                                }
                            } else {
                                alert("Error reading file!\nDetails: File is empty or unreadable.");
                            }
                        };
                        reader.onerror = function () {
                            alert("Error reading file!\nDetails: " + reader.error);
                        };
                        reader.readAsText(file);
                    }
                }
            }, false);
        }
    },
    
    start: function () {
        document.getElementById("input").style.display = "block";
    }
};