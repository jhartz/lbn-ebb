/*
Copyright (c) 2013, Jake Hartz. All rights reserved.
Use of this source code is governed by a BSD-style license
that can be found in the LICENSE.txt file.
*/

ebb.control = {
    DEFAULT_TIME: 8,
    
    topspace: 0,
    time: 0,
    timeint: null,
    started: false,
    paused: false,
    update_intervals: [],
    winref: null,
    timerequested: false,
    runningload: false,
    numberSteps: 0,
    autodisable: {
        hour: 0,
        minute: 0,
        minute_padded: 0,
        timeout: null
    },
    
    load: function () {
        window.onunload = window.onbeforeunload = function () {
            try {
                if (ebb.control.winref) ebb.control.winref.close();
            } catch (err) {}
            ebb.control.winref = null;
        };
        
        window.addEventListener("message", function (event) {
            var data = JSON.parse(event.data);
            ebb.control.msg(data.cmd, data.data);
        }, false);
        
        document.getElementById("control_basetime").value = ebb.control.DEFAULT_TIME;
        
        document.getElementById("control_basetime").addEventListener("keyup", function (event) {
            event.which = event.which || event.keyCode;
            if (event.which == 13) {
                // Enter key
                event.preventDefault();
                var basetime = parseInt(document.getElementById("control_basetime").value, 10);
                if (basetime > 1) ebb.control.setDefaultTime(basetime);
            }
        }, false);
        
        document.getElementById("control_basetime_set").addEventListener("click", function (event) {
            event.preventDefault();
            var basetime = parseInt(document.getElementById("control_basetime").value, 10);
            if (basetime > 1) ebb.control.setDefaultTime(basetime);
        }, false);
        
        document.getElementById("control_prev").addEventListener("click", function (event) {
            event.preventDefault();
            ebb.control.stopTimer();
            ebb.control.send("prev");
        }, false);
        
        document.getElementById("control_next").addEventListener("click", function (event) {
            event.preventDefault();
            ebb.control.stopTimer();
            ebb.control.send("next");
        }, false);
        
        document.getElementById("control_play").addEventListener("click", function (event) {
            event.preventDefault();
            ebb.control.startTimer();
        }, false);
        
        document.getElementById("control_pause").addEventListener("click", function (event) {
            event.preventDefault();
            ebb.control.stopTimer(true);
        }, false);
        
        document.getElementById("control_reset").addEventListener("click", function (event) {
            event.preventDefault();
            if (!ebb.control.send("reload")) {
                location.reload();
            }
        }, false);
        
        document.getElementById("control_autodisable_enable").addEventListener("click", function (event) {
            document.getElementById("control_autodisable_enable").style.display = "none";
            document.getElementById("control_autodisable_time").style.display = "inline";
        }, false);
        
        document.getElementById("control_autodisable_time_set").addEventListener("click", function (event) {
            var hour = parseInt(document.getElementById("control_autodisable_time_hour").value, 10);
            var minute = parseInt(document.getElementById("control_autodisable_time_minute").value, 10);
            if (hour < 0 || hour > 23) {
                alert("Hour must be a number from 0 to 23.");
            } else if (minute < 0 || minute > 59) {
                alert("Minute must be a number from 0 to 59.");
            } else {
                ebb.control.setAutoDisable(hour, minute);
            }
        }, false);
        
        document.getElementById("control_autodisable_status_cancel").addEventListener("click", function (event) {
            ebb.control.cancelAutoDisable();
        }, false);
        
        document.getElementById("control_autodisable_status_help").addEventListener("click", function (event) {
            alert("Check the \"Auto-Disable\" checkbox above a slide to make it automatically disable at " + ebb.control.autodisable.hour + ":" + ebb.control.autodisable.minute_padded);
        }, false);
        
        var emptyTextNodes = [];
        forEach(document.querySelectorAll("#header > ul"), function (elem) {
            forEach(elem.childNodes, function (child) {
                if (child.nodeName.toLowerCase() != "li") {
                    emptyTextNodes.push([child, elem]);
                }
            });
        });
        forEach(emptyTextNodes, function (item) {
            item[1].removeChild(item[0]);
        });
        
        window.onresize = function () {
            document.getElementById("headerHeightPadding").style.height = (document.getElementById("header").offsetHeight + 10) + "px";
        };
        
        ebb.send_update = function (data) {
            update(data);
            ebb.control.send("update", data);
        };
    },
    
    start: function () {
        ebb.control.started = false;
        if (!ebb.control.winref) {
            ebb.control.winref = window.open("popup.html", "", "width=640,height=" + Math.floor(800 * (screen.height / screen.width)) + ",menubar=no,toolbar=no,location=no,personalbar=no,status=no");
        } else {
            //ebb.control.send("showmsg");
            ebb.control.go(true);
        }
        document.getElementById("control_loading").style.display = "block";
        document.getElementById("control_loading_content").innerHTML = "Waiting...";
    },
    
    getOption: function (pluginname, option) {
        var varcontent = ebb.options.getOption(option, pluginname);
        switch (option.type) {
            case "text":
                varcontent = escHTML(varcontent);
                break;
            case "textarea":
                varcontent = escHTML(varcontent, true);
                break;
            case "filteredtextarea":
                varcontent = filter(varcontent);
                break;
        }
        return varcontent;
    },
    
    msg: function (cmd, data) {
        switch (cmd) {
            case "ready":
                if (ebb.control.started) {
                    ebb.control.stopTimer();
                    document.getElementById("control").style.display = "none";
                    document.getElementById("control_loading").style.display = "none";
                    ebb.input.start();
                } else {
                    ebb.control.send("showmsg");
                    ebb.control.go();
                }
                break;
            case "loadme":
                document.getElementById("control_loading").style.display = "block";
                document.getElementById("control_loading_content").innerHTML = "Loading...";
                // Make sure everything is freshly updated
                forEach(ebb.control.update_intervals, function (i) {
                    i.update();
                });
                // Make sure all slides are showing as they should
                ebb.control.runningload = true;
                break;
            case "stepenter":
                if (ebb.control.runningload) {
                    if (data == 1 && ebb.control.numberSteps == 1) {
                        // Spoof final "stepleave" event
                        ebb.control.msg("stepleave", {doneLoading: true});
                    } else {
                        ebb.control.send("nextload", data + 1);
                    }
                } else {
                    ebb.control.setTimer(data);
                    document.getElementById("control_title_step" + data).classList.add("active");
                }
                break;
            case "stepleave":
                if (ebb.control.runningload) {
                    if (data.doneLoading) {
                        ebb.control.runningload = false;
                        ebb.control.send("doneloading");
                        document.getElementById("control_loading").style.display = "none";
                        document.getElementById("control").style.display = "block";
                        window.onresize();
                        ebb.control.paused = false;
                    }
                } else {
                    ebb.control.stopTimer();
                    forEach(document.getElementsByClassName("active"), function (item) {
                        item.classList.remove("active");
                    });
                    if (data.nextStep && data.direction) {
                        var nextStep = data.nextStep;
                        for (;;) {
                            if (!document.getElementById("control_slideenabled_step" + nextStep)) {
                                nextStep = data.direction == "next" ? 1 : ebb.control.numberSteps;
                            }
                            var next = document.getElementById("control_slideenabled_step" + nextStep);
                            if (next && next.checked === false) {
                                if (data.direction == "next") {
                                    ebb.control.send("next");
                                    nextStep++;
                                } else {
                                    ebb.control.send("prev");
                                    nextStep--;
                                }
                            } else {
                                break;
                            }
                        }
                    }
                }
                break;
            case "timerequest":
                ebb.control.timerequested = true;
                break;
            case "enableExtraTime":
                ebb.control.modifyTime(data.step, data.time);
                break;
        }
    },
    
    send: function (cmd, data) {
        if (ebb.control.winref && ebb.control.winref.closed != true) {
            ebb.control.winref.postMessage(JSON.stringify({
                cmd: cmd,
                data: data
            }), "*");
            return true;
        } else {
            return false;
        }
    },
    
    render: function (plugin) {
        var sequence = [];
        
        if (!plugin.position) ebb.control.topspace += 900;
        if (!plugin.className) plugin.className = "";
        
        var pusher = function (content, position) {
            sequence.push({
                name: plugin.name,
                content: content,
                className: (plugin.noborder ? "" : "slide ") + plugin.className,
                time: plugin.time || ebb.control.DEFAULT_TIME,
                data: plugin.position || position || {
                    y: ebb.control.topspace
                }
            });
        };
        
        var variables = {};
        if (plugin.options) {
            forEach(plugin.options, function (option) {
                if (option.variable) {
                    variables[option.variable] = ebb.control.getOption(plugin.name, option);
                }
            });
        }
        
        if (Array.isArray(plugin.content)) {
            var left = -950;
            forEach(plugin.content, function (content) {
                if (content) {
                    left += 950;
                    for (var variable in variables) {
                        if (variables.hasOwnProperty(variable) && content.indexOf(variable) != -1) {
                            content = content.split(variable).join(variables[variable]);
                        }
                    }
                    pusher(content, {
                        x: left,
                        y: ebb.control.topspace
                    });
                }
            });
        } else if (plugin.content && plugin.content.template && plugin.content.variable && variables.hasOwnProperty(plugin.content.variable)) {
            var left = -950;
            var allcontent = variables[plugin.content.variable];
            forEach(allcontent.split("<br><br>"), function (varcontent) {
                var content = plugin.content.template.split(plugin.content.variable).join(varcontent);
                for (var variable in variables) {
                    if (variables.hasOwnProperty(variable) && variable != plugin.content.variable && content.indexOf(variable) != -1) {
                        content = content.split(variable).join(variables[variable]);
                    }
                }
                while (content.indexOf("<br>") == 0) {
                    content = content.substring(4).trim();
                }
                if (content) {
                    left += 950;
                    content = content.trim();
                    pusher(content, {
                        x: left,
                        y: ebb.control.topspace
                    });
                }
            });
        }
        
        if (sequence.length == 0) {
            // Nothing added, so remove extra topspace
            if (!plugin.position) ebb.control.topspace -= 900;
        } else if (plugin.update && plugin.update_interval) {
            var updateoptions = {};
            if (plugin.options) {
                forEach(plugin.options, function (option) {
                    updateoptions[option.name] = ebb.control.getOption(plugin.name, option);
                });
            }
            var updatefunc = function () {
                plugin.update(updateoptions);
            };
            ebb.control.update_intervals.push({
                interval: setInterval(updatefunc, plugin.update_interval),
                update: updatefunc,
                update_interval: plugin.update_interval
            });
        }
        
        return sequence;
    },
    
    go: function (startAfterLoad) {
        ebb.control.started = true;
        
        var sequence = [];
        ebb.control.topspace = -900;
        for (var i = 0; i < ebb.plugins.length; i++) {
            if (document.getElementById("pluginbox" + i) && document.getElementById("pluginbox" + i).checked) {
                sequence = sequence.concat(ebb.control.render(ebb.plugins[i]));
            }
        }
        
        // Remove all old slides
        for (var j = document.getElementById("control_slides").childNodes.length - 1; j >= 0; j--) {
            var elem = document.getElementById("control_slides").childNodes[j];
            if (elem && (elem.tagName || elem.nodeName || "").toLowerCase() == "tr") {
                document.getElementById("control_slides").removeChild(elem);
            }
        }
        
        // Show all new slides
        var oldtopspace;
        var content = '';
        var step = 0;
        forEach(sequence, function (seq) {
            if (typeof seq.data.y == "number" && seq.data.y != oldtopspace) {
                oldtopspace = seq.data.y;
                if (content) content += '</tr>';
                content += '<tr>';
                content += '<td style="min-width: 0; vertical-align: middle;">' + seq.name + '</td>';
            }
            step++;
            ebb.control.numberSteps = step;
            content += '<td data-step="' + step + '" id="control_step' + step + '">';
            content += '<table style="width: 100%;"><tbody><tr><td class="notpretty">Time: <input type="number" class="control_slidetime" size="3" value="' + seq.time + '" min="1" max="60"> seconds</td><td class="notpretty" style="text-align: right;"><input type="checkbox" class="control_slideenabled" id="control_slideenabled_step' + step + '" checked><label for="control_slideenabled_step' + step + '"> Enabled</label><span class="control_slideautodisable_container" style="display: none;"><br><input type="checkbox" class="control_slideautodisable" id="control_slideautodisable_step' + step + '" data-step="' + step + '"><label for="control_slideautodisable_step' + step + '"> Auto-Disable</label></span></td></tr></tbody></table>';
            content += '<div class="pretty_title" id="control_title_step' + step + '">' + seq.content + '</div>';
            content += '</td>';
        });
        content += '</tr>';
        document.getElementById("control_slides").innerHTML += content;
        
        var add_cbox_event = function (checkbox) {
            checkbox.addEventListener("change", function () {
                var somethingenabled = false;
                forEach(document.getElementsByClassName("control_slideenabled"), function (cbox) {
                    if (cbox.checked) somethingenabled = true;
                });
                if (!somethingenabled) {
                    checkbox.checked = true;
                }
            }, false);
        };
        
        for (var l = 1; l <= step; l++) {
            var elem = document.getElementById("control_step" + l);
            if (elem && elem.dataset.step) {
                // click-to-move-to-slide
                document.getElementById("control_title_step" + elem.dataset.step).addEventListener("click", function () {
                    ebb.control.send("goto", Number(this.parentNode.dataset.step));
                }, false);
                // enabled checkbox
                var enabled_cbox = elem.getElementsByClassName("control_slideenabled");
                if (enabled_cbox && enabled_cbox.length > 0) {
                    add_cbox_event(enabled_cbox[0]);
                }
            }
        }
        
        ebb.control.send("load", sequence);
        
        if (startAfterLoad) {
            ebb.control.send("go");
        }
    },
    
    setDefaultTime: function (basetime) {
        ebb.control.DEFAULT_TIME = basetime;
        document.getElementById("control_basetime").value = ebb.control.DEFAULT_TIME;
        forEach(document.getElementsByClassName("control_slidetime"), function (slidetime) {
            var extra = parseInt(slidetime.dataset.extra || "", 10) || 0;
            slidetime.value = ebb.control.DEFAULT_TIME + extra;
        });
    },
    
    modifyTime: function (step, extratime) {
        var elem = document.getElementById("control_step" + step);
        var slidetime = elem.getElementsByClassName("control_slidetime")[0] || {};
        var oldtime = parseInt(slidetime.value, 10);
        if (isNaN(oldtime)) oldtime = ebb.control.DEFAULT_TIME;
        slidetime.dataset.extra = extratime;
        slidetime.value = oldtime + extratime;
    },
    
    setAutoDisable: function (hour, minute) {
        var now = new Date();
        var then = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
        var diff = then.getTime() - now.getTime();
        if (diff < 1000) {
            then = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, hour, minute, 0, 0);
        }
        diff = then.getTime() - now.getTime();
        
        ebb.control.autodisable.hour = then.getHours();
        ebb.control.autodisable.minute = then.getMinutes();
        ebb.control.autodisable.minute_padded = (then.getMinutes() < 10 ? "0" : "") + then.getMinutes();
        
        if (ebb.control.autodisable.timeout) clearTimeout(ebb.control.autodisable.timeout);
        ebb.control.autodisable.timeout = setTimeout(function () {
            ebb.control.cancelAutoDisable();
            forEach(document.getElementsByClassName("control_slideautodisable"), function (elem) {
                if (elem.checked && elem.dataset.step) {
                    document.getElementById("control_slideenabled_step" + elem.dataset.step).checked = false;
                }
            });
        }, diff);
        
        document.getElementById("control_autodisable_status_hour").innerHTML = ebb.control.autodisable.hour;
        document.getElementById("control_autodisable_status_minute").innerHTML = ebb.control.autodisable.minute_padded;
        document.getElementById("control_autodisable_status_month").innerHTML = then.getMonth() + 1;
        document.getElementById("control_autodisable_status_day").innerHTML = then.getDate();
        document.getElementById("control_autodisable_time").style.display = "none";
        document.getElementById("control_autodisable_status").style.display = "inline";
        
        forEach(document.getElementsByClassName("control_slideautodisable_container"), function (elem) {
            elem.style.display = "inline";
        });
    },
    
    cancelAutoDisable: function () {
        if (ebb.control.autodisable.timeout) clearTimeout(ebb.control.autodisable.timeout);
        ebb.control.autodisable.timeout = null;
        
        document.getElementById("control_autodisable_status").style.display = "none";
        document.getElementById("control_autodisable_enable").style.display = "inline";
        
        forEach(document.getElementsByClassName("control_slideautodisable_container"), function (elem) {
            elem.style.display = "none";
        });
    },
    
    setTimer: function (step) {
        var elem = document.getElementById("control_step" + step);
        var slidetime = elem.getElementsByClassName("control_slidetime")[0] || {};
        ebb.control.time = parseInt(slidetime.value, 10);
        if (isNaN(ebb.control.time)) {
            ebb.control.time = ebb.control.DEFAULT_TIME;
        }
        slidetime.value = ebb.control.time;
        ebb.control.time++;
        if (!ebb.control.paused) ebb.control.startTimer();
        if (ebb.control.timerequested) {
            ebb.control.send("timerequest", ebb.control.time);
            ebb.control.timerequested = false;
        }
    },
    
    startTimer: function () {
        ebb.control.paused = false;
        document.getElementById("control_play_container").style.display = "none";
        document.getElementById("control_pause_container").style.display = "inline";
        
        ebb.control.stopTimer();
        var intfunc = function () {
            ebb.control.time--;
            document.getElementById("control_timer").innerHTML = ebb.control.time;
            if (ebb.control.time <= 0) {
                ebb.control.stopTimer();
                ebb.control.send("next");
            }
        };
        ebb.control.timeint = setInterval(intfunc, 999);
        intfunc();
    },
    
    stopTimer: function (pause) {
        clearInterval(ebb.control.timeint);
        ebb.control.timeint = null;
        if (pause) {
            ebb.control.paused = true;
            document.getElementById("control_play_container").style.display = "inline";
            document.getElementById("control_pause_container").style.display = "none";
        }
    }
};