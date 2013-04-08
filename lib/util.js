/*
Copyright (c) 2013, Jake Hartz. All rights reserved.
Use of this source code is governed by a BSD-style license
that can be found in the LICENSE.txt file.
*/

function forEach(arr, func) {
    if (typeof arr.forEach == "function") {
        arr.forEach(func);
    } else {
        for (var i = 0; i < arr.length; i++) {
            func(arr[i], i, arr);
        }
    }
}

if (!Array.isArray) {
    // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/isArray#Compatibility
    Array.isArray = function (vArg) {
        return Object.prototype.toString.call(vArg) === "[object Array]";
    };
}

function inArray(needle, haystack) {
    if (Array.prototype.indexOf) {
        return (Array.prototype.indexOf.call(haystack, needle) != -1);
    } else {
        for (var i = 0; i < haystack.length; i++) {
            if (haystack[i] === needle) return true;
        }
        return false;
    }
}

(function () {
    var filterer = function (startTag, endTag, text, replacement) {
        if (text.indexOf(startTag) != -1 && text.indexOf(endTag) > text.indexOf(startTag)) {
            var startIndex = text.indexOf(startTag),
                endIndex = text.indexOf(endTag);
            var before = text.substring(0, startIndex),
                content = text.substring(startIndex + startTag.length, endIndex),
                after = text.substring(endIndex + endTag.length);
            after = filterer(startTag, endTag, after, replacement);
            text = before + replacement.replace("$1", content) + after;
        }
        return text;
    };
    
    var makeTagFilter = function (tagname, replacement) {
        return (function (text) {
            return filterer("[[" + tagname + "]]", "[[/" + tagname + "]]", text, replacement);
        });
    };
    
    var makeBlockTagFilter = function (tagname, replacement) {
        var regex = new RegExp("^\\[\\[" + tagname + "\\]\\]([^\n]*)\\[\\[\\/" + tagname + "\\]\\]$", "gm");
        return [regex, replacement];
    };
    
    var filters = [
        // Escape HTML
        [/&/g, "&amp;"],
        [/</g, "&lt;"],
        [/>/g, "&gt;"],
        [/\"/g, "&quot;"],
        
        // Turn indented newlines into one line
        [/ *\n\t\t[ \t]*/g, " "],
        
        // Collapse extra spacing
        [/\t+/g, " "],
        [/\xA0/g, " "],
        [/[ ]{2,}/g, " "],
        
        // Trim leading/trailing whitespace
        [/^ +/gm, ""],
        [/ +$/gm, ""],
        
        // Trim commands from script
        [/^(anchor|sports)[ 0-9]*:?\s*/igm, ""],
        
        // Convert our special syntax (the [[...]][[/...]] tags) to HTML
        makeTagFilter("b", "<b>$1</b>"),
        makeTagFilter("i", "<i>$1</i>"),
        makeTagFilter("u", "<u>$1</u>"),
        makeBlockTagFilter("center", '<div style="text-align: center;">$1</div>'),
        makeBlockTagFilter("right", '<div style="text-align: right;">$1</div>'),
        makeTagFilter("img", '<img src="$1" style="float: left;">'),
        makeTagFilter("rightimg", '<img src="$1" style="float: right;">'),
        
        // Collapse extra line breaks; convert to <br>
        [/\n\n\n*/g, "\n\n"],
        [/\n/g, "<br>"]
    ];
    
    window.filter = function (text) {
        forEach(filters, function (item) {
            if (typeof item == "function") {
                text = item(text);
            } else {
                text = text.replace(item[0], item[1]);
            }
        });
        return text;
    };
})();

function escHTML(html, convertNewlines) {
    if (typeof html != "string") {
        html = html + "";
    }
    html = html.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt");
    if (convertNewlines) {
        html = html.replace(/\n/g, "<br>");
    }
    return html;
}

function update(data) {
    forEach(data, function (item) {
        forEach(document.getElementsByClassName(item.className), function (elem) {
            var myelem = item.useParent ? elem.parentNode : elem;
            if (item.html) myelem.innerHTML = item.html;
            if (item.text) myelem.innerHTML = escHTML(item.text);
            if (item.attributes) {
                for (var attr in item.attributes) {
                    if (item.attributes.hasOwnProperty(attr)) {
                        myelem.setAttribute(attr, item.attributes[attr]);
                    }
                }
            }
            if (item.style) {
                for (var attr in item.style) {
                    if (item.style.hasOwnProperty(attr)) {
                        myelem.style[attr] = item.style[attr];
                    }
                }
            }
            
            while (myelem) {
                if (myelem.classList && myelem.classList.contains("font-is-adjusted")) myelem.classList.remove("font-is-adjusted");
                myelem = myelem.parentNode;
            }
        });
    });
}