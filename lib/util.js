/*
Copyright (c) 2013, Jake Hartz. All rights reserved.
Use of this source code is governed by a BSD-style license
that can be found in the LICENSE.txt file.
*/

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