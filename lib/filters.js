/*
Copyright (c) 2013, Jake Hartz. All rights reserved.
Use of this source code is governed by a BSD-style license
that can be found in the LICENSE.txt file.
*/

var filters = [
    [/&/g, "&amp;"],
    [/</g, "&lt;"],
    [/>/g, "&gt;"],
    [/\"/g, "&quot;"],
    [/___*/g, "__"],
    [/^[ \t]*/gm, ""],
    [/[ \t]*$/gm, ""],
    [/^(anchor|weather|sports)[ \t]*[0-9]*:?\s*/igm, ""],
    //[/^now,? *(over to|let.s take a look) [^\n]+/igm, ""],
    //[/^\[cut[^\n]*weather\]\s*/igm, "*Weather*\n"],
    //[/^\[cut[^\n]*sports\]\s*/igm, "*Sports*\n"],
    [/^\[[^\n]*\]\s*/gm, ""],
    [/^\*([^\n]*)\*$/gm, "<u>$1</u>"],
    [/\n\n\n*/g, "\n\n"],
    [/\n/g, "<br>"]
];