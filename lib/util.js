/*
Copyright (c) 2013, Jake Hartz. All rights reserved.
Use of this source code is governed by a BSD-style license
that can be found in the LICENSE.txt file.
*/

var filters = [
    // escape HTML
    [/&/g, "&amp;"],
    [/</g, "&lt;"],
    [/>/g, "&gt;"],
    [/\"/g, "&quot;"],
    
    // Collapse extra underscores
    [/___*/g, "__"],
    
    // Trim leading/trailing whitespace
    [/^[ \t]*/gm, ""],
    [/[ \t]*$/gm, ""],
    
    // Trim commands from script
    [/^(anchor|weather|sports)[ \t]*[0-9]*:?\s*/igm, ""],
    //[/^now,? *(over to|let.s take a look) [^\n]+/igm, ""],
    //[/^\[cut[^\n]*weather\]\s*/igm, "*Weather*\n"],
    //[/^\[cut[^\n]*sports\]\s*/igm, "*Sports*\n"],
    
    // Trim [...] from script
    [/^\[[^\n]*\]\s*/gm, ""],
    
    // Convert our special syntax to HTML
    /*
        [[b]]bold[[/b]]
        [[i]]italic[[/i]]
        [[u]]underline[[/u]]
        [[center]]centered text[[/center]]      (must be entire line)
        [[right]]right-aligned text[[/right]]   (must be entire line)
        [[img]]url here[[/img]]
        [[rightimg]]url here[[/rightimg]]
    */
    [/\[\[b\]\]([^\n]*)\[\[\/b\]\]/g, "<b>$1</b>"],
    [/\[\[i\]\]([^\n]*)\[\[\/b\]\]/g, "<i>$1</i>"],
    [/\[\[u\]\]([^\n]*)\[\[\/u\]\]/g, "<u>$1</u>"],
    [/^\[\[center\]\]([^\n]*)\[\[\/center\]\]$/gm, '<span style="text-align: center;">$1</span>'],
    [/^\[\[right\]\]([^\n]*)\[\[\/right\]\]$/gm, '<span style="text-align: right;">$1</span>'],
    [/\[\[img\]\]([^\n]*)\[\[\/img\]\]/g, '<img src="$1" style="float: left;">'],
    [/\[\[rightimg\]\]([^\n]*)\[\[\/rightimg\]\]/g, '<img src="$1" style="float: right;">'],
    
    // Collapse extra line breaks; convert to <br>
    [/\n\n\n*/g, "\n\n"],
    [/\n/g, "<br>"]
];

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

function forEach(arr, func) {
    if (typeof arr.forEach == "function") {
        arr.forEach(func);
    } else {
        for (var i = 0; i < arr.length; i++) {
            func(arr[i], i, arr);
        }
    }
}

function filter() {
    forEach(filters, function (item) {
        text = text.replace(item[0], item[1]);
    });
    return text;
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