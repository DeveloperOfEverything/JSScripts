// ==UserScript==
// @name         WotSpeakRedirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://wotspeak.org/engine/dwn_just2.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    if (globalThis.myExtensions == null) globalThis.myExtensions = [];
    globalThis.myExtensions[globalThis.myExtensions.length] = "https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/wotspeak_redirect.user.js";

    var scripts = document.getElementsByTagName('script');
    var i=0;

    while (!scripts[i].innerText.startsWith("\n(function() {\n	var i = 10;//время в секундах.")) i++;

    var script = scripts[i].innerText;

    var start = script.indexOf("href=\"")+6;
    var end = script.indexOf("\" class=\"button7\"");

    var src = script.substring(start, end);

    document.location.href = src;

    // Your code here...
})();
