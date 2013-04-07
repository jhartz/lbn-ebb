/*
Copyright (c) 2013, Jake Hartz. All rights reserved.
Use of this source code is governed by a BSD-style license
that can be found in the LICENSE.txt file.
*/

var initialized = false;
var started = false;
var sequence;
var api;
var timerequests = [];
var runningload = false;

function msg(cmd, data) {
    switch (cmd) {
        case "showmsg":
            document.getElementById("msg").style.display = "block";
            break;
        case "go":
            go();
            break;
        case "load":
            load(data);
            break;
        case "reload":
            location.reload();
            break;
        case "prev":
            if (api) api.prev();
            break;
        case "next":
            if (api) api.next();
            break;
        case "goto":
            if (api) api.goto(data - 1);
            break;
        case "update":
            update(data);
            break;
        case "timerequest":
            var a = 0, b = timerequests.length;
            forEach(timerequests, function (callback) {
                a++;
                callback(data);
                if (a == b) timerequests = [];
            });
            break;
        case "doneloading":
            runningload = false;
            document.getElementById("loading").style.display = "none";
            break;
    }
}

function send(cmd, data) {
    window.opener.postMessage(JSON.stringify({
        cmd: cmd,
        data: data
    }), "*");
}

window.onload = function () {
    window.location.hash = "";
    
    window.addEventListener("message", function (event) {
        var data = JSON.parse(event.data);
        msg(data.cmd, data.data);
    }, false);
    
    document.getElementById("msg_btn").addEventListener("click", function () {
        go();
    }, false);
    
    document.getElementById("lbn-corner").addEventListener("dblclick", function () {
        var elem = document.body;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen();
        }
    }, false);
    
    send("ready");
};

function go() {
    initialized = true;
    document.getElementById("msg").style.display = "none";
    if (sequence) load();
}

function makeElem(seq) {
    var elem = document.createElement("div");
    if (seq.id) elem.id = seq.id;
    elem.className = "step " + (seq.className || "");
    if (seq.data) {
        for (var prop in seq.data) {
            if (seq.data.hasOwnProperty(prop)) {
                elem.setAttribute("data-" + prop, seq.data[prop]);
            }
        }
    }
    elem.innerHTML = "<div>" + seq.content + "</div>";
    
    document.getElementById("impress").appendChild(elem);
}

function load(newsequence) {
    if (newsequence) sequence = newsequence;
    if (initialized && sequence && !started) {
        started = true;
        
        forEach(sequence, function (seq) {
            makeElem(seq);
        });
        
        api = impress();
        api.init();
        
        document.getElementById("impress").addEventListener("impress:stepenter", function (event) {
            var active = document.getElementsByClassName("active")[0];
            var step = Number(active.id.substring(5));
            if (!active.classList.contains("font-is-adjusted") && !active.classList.contains("no-font-adjust")) fontSize(step);
            if (active.classList.contains("scroll-me") && !runningload) {
                timerequests.push(function (timeavailable) {
                    var beginningwait;
                    if (timeavailable >= 17) {
                        beginningwait = 5;
                    } else if (timeavailable >= 8) {
                        beginningwait = 3;
                    } else if (timeavailable <= 3) {
                        beginningwait = 0;
                    } else {
                        beginningwait = 2;
                    }
                    var elem = active.childNodes[0];
                    var className = "SCROLLER_CLASS_" + (new Date()).getTime();
                    var animheight = active.scrollHeight - active.clientHeight;
                    var style = document.createElement("style");
                    style.type = "text/css";
                    var time = (timeavailable - beginningwait) - 2;
                    style.innerHTML = "." + className + " {-webkit-transition: margin-top " + time + "s; -moz-transition: margin-top " + time + "s; transition: margin-top " + time + "s;}\n." + className + "_ADDED {margin-top:-" + animheight + "px}";
                    document.getElementsByTagName("head")[0].appendChild(style);
                    elem.classList.add(className);
                    
                    beginningwait = (beginningwait * 1000) || 10;
                    setTimeout(function () {
                        elem.classList.add(className + "_ADDED");
                        setTimeout(function () {
                            elem.classList.remove(className + "_ADDED");
                            elem.classList.remove(className);
                        }, (timeavailable * 1000) - beginningwait + 500);
                    }, beginningwait);
                });
                send("timerequest");
            }
            send("stepenter", step);
        }, false);
        document.getElementById("impress").addEventListener("impress:stepleave", function (event) {
            send("stepleave", !document.getElementsByClassName("future").length);
        }, false);
        
        runningload = true;
        document.getElementById("loading").style.display = "block";
        send("loadme");
    }
}

function fontSize(step) {
    var elem = document.getElementById("step-" + step);
    // Make text as big as possible
    var cur = 50;
    elem.style.fontSize = cur + "px";
    while (cur < 130 && elem.scrollHeight <= elem.clientHeight && elem.scrollWidth <= elem.clientWidth) {
        cur += 2;
        elem.style.fontSize = cur + "px";
    }
    cur -= 2;
    elem.style.fontSize = cur + "px";
    while (cur < 130 && elem.scrollHeight <= elem.clientHeight && elem.scrollWidth <= elem.clientWidth) {
        cur += 1;
        elem.style.fontSize = cur + "px";
    }
    cur -= 1;
    elem.style.fontSize = cur + "px";
    elem.classList.add("font-is-adjusted");
    
    // If we're still not small enough to fit everything...
    if (elem.scrollHeight > elem.clientHeight) {
        send("enableExtraTime", {step: step, time: Math.round((elem.scrollHeight - elem.clientHeight) / 46)});
        elem.classList.add("scroll-me");
    }
}