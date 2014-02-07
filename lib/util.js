/*
Copyright (c) 2014, Jake Hartz. All rights reserved.
Use of this source code is governed by a BSD-style license
that can be found in the LICENSE.txt file.
*/

// Version number for the LBN Electronic Bulletin Board
var EBB_VERSION = "1.0.0pre";

// Version number for the LEO file format used by this version
var EBB_LEO_FORMAT_VERSION = 1;


if (typeof ebb == "undefined") var ebb = {};
if (typeof ebb.util == "undefined") ebb.util = {};


/*
    isArray shim
*/
if (!Array.isArray) {
    // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/isArray#Compatibility
    Array.isArray = function (vArg) {
        return Object.prototype.toString.call(vArg) === "[object Array]";
    };
}


/*
    forEach - iterate over arrays or array-like objects
    arr (array): array over which to iterate
    func (function): callback function for each item in array (same parameters as Array.forEach)
*/
ebb.util.forEach = function (arr, func) {
    if (typeof arr.forEach == "function") {
        arr.forEach(func);
    } else {
        for (var i = 0; i < arr.length; i++) {
            func(arr[i], i, arr);
        }
    }
};


/*
    inArray - test if object is a member of an array
    (returns boolean)
    needle (string): what we're looking for
    haystack (array): the array in which we're looking
*/
ebb.util.inArray = function (needle, haystack) {
    if (Array.prototype.indexOf) {
        return (Array.prototype.indexOf.call(haystack, needle) != -1);
    } else {
        for (var i = 0; i < haystack.length; i++) {
            if (haystack[i] === needle) return true;
        }
        return false;
    }
};


/*
    filter - modify block of text based on our filter system (see `filters` array below)
    (returns string)
    text (string): the original block of text
*/
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
        
        // Trim commands and comments from script
        [/^(anchor|sports)[ 0-9]*:?\s*/igm, ""],
        [/^####[^\n]*$/gm, ""],
        
        // Convert our special syntax (the [[...]][[/...]] tags) to HTML
        // (NOTE: Update help text in ebb.html when you update this)
        makeTagFilter("b", "<b>$1</b>"),
        makeTagFilter("i", "<i>$1</i>"),
        makeTagFilter("u", "<u>$1</u>"),
        makeTagFilter("small", '<span style="font-size: 65%;">$1</span>'),
        makeTagFilter("big", '<span style="font-size: 150%;">$1</span>'),
        makeBlockTagFilter("center", '<div style="text-align: center;">$1</div>'),
        makeBlockTagFilter("right", '<div style="text-align: right;">$1</div>'),
        makeTagFilter("img", '<img src="$1" style="float: left;">'),
        makeTagFilter("rightimg", '<img src="$1" style="float: right;">'),
        
        // Collapse extra line breaks; convert to <br>
        [/\n\n\n*/g, "\n\n"],
        [/\n/g, "<br>"]
    ];
    
    ebb.util.filter = function (text) {
        ebb.util.forEach(filters, function (item) {
            if (typeof item == "function") {
                text = item(text);
            } else {
                text = text.replace(item[0], item[1]);
            }
        });
        return text;
    };
})();


/*
    escHTML - escape a string to make it safe to inject into an HTML document
    (returns string)
    html (string): string that possibly contains HTML code that we need to escape
    convertNewlines (boolean): whether to convert newlines to <br> tags
*/
ebb.util.escHTML = function (html, convertNewlines) {
    if (typeof html != "string") {
        html = html + "";
    }
    html = html.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt");
    if (convertNewlines) {
        html = html.replace(/\n/g, "<br>");
    }
    return html;
};


/*
    update - update some data
    data (array): TODO put a descriptive description here
*/
ebb.util.update = function (data) {
    ebb.util.forEach(data, function (item) {
        ebb.util.forEach(document.getElementsByClassName(item.className), function (elem) {
            var myelem = item.useParent ? elem.parentNode : elem;
            if (item.html) myelem.innerHTML = item.html;
            if (item.text) myelem.innerHTML = ebb.util.escHTML(item.text);
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
};


/*
    browseFile - browse for a file
    type (string): image, json, ArrayBuffer, BinaryString, DataURL, Text
*/
head.ready(document, function () {
    var testinput = document.createElement("input");
    testinput.type = "file";
    testinput.id = "testinput";
    
    var testdiv = document.createElement("div");
    testdiv.style.display = "none";
    testdiv.appendChild(testinput);
    document.body.appendChild(testdiv);
    
    if (typeof FileReader != "undefined" && typeof testinput.click == "function") {
        var fileType, fileReturn, fileExt, fileCallback;
        
        testinput.addEventListener("change", function (event) {
            if (event.target.files && event.target.files.length > 0 && fileReturn && typeof fileCallback == "function") {
                var file = event.target.files[0];
                var ext = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
                if (fileExt && ext != fileExt) {
                    alert("Invalid file!\nPlease select a *." + fileExt + " file.");
                } else {
                    var reader = new FileReader();
                    reader.onload = function () {
                        if (reader.result) {
                            if (fileType == "json") {
                                var result;
                                try {
                                    result = JSON.parse(reader.result);
                                } catch (err) {}
                                if (result) {
                                    fileCallback(result);
                                } else {
                                    alert("Error reading file!\nDetails: Could not parse JSON.");
                                }
                            } else if (fileType == "image") {
                                // ...
                            } else {
                                fileCallback(result);
                            }
                        } else {
                            alert("Error reading file!\nDetails: File is empty or unreadable.");
                        }
                    };
                    
                    reader.onerror = function () {
                        alert("Error reading file!\nDetails: " + reader.error);
                    };
                    
                    if (typeof reader["readAs" + fileReturn] == "function") {
                        reader["readAs" + fileReturn](file);
                    } else {
                        alert("Error reading file!\nDetails: readAs" + fileReturn + " does not exist.");
                    }
                }
            }
        }, false);
        
        ebb.util.browseFile = function (type, ext, callback) {
            type = type.toLowerCase();
            fileType = null;
            fileReturn = "";
            if (type == "image") {
                fileType = "image";
                fileReturn = "DataURL";
            } else if (type == "json") {
                fileType = "json";
                fileReturn = "Text";
            } else if (type == "arraybuffer") {
                fileReturn = "ArrayBuffer";
            } else if (type == "binarystring") {
                fileReturn = "BinaryString";
            } else if (type == "dataurl") {
                fileReturn = "DataURL";
            } else if (type == "text") {
                fileReturn = "Text";
            }
            
            fileExt = ext;
            fileCallback = callback;
            
            testinput.click();
        };
    }
});
