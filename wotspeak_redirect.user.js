// ==UserScript==
// @name         WotSpeakRedirect
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://wotspeak.org/engine/dwn_just2-car.php?xf=*
// @match        https://ya.ru/
// @match        https://vk.com/feed
// @grant        none
// @updateUrl	https://github.com/DeveloperOfEverything/JSScripts/raw/master/wotspeak_redirect.user.js
// @downloadUrl	https://github.com/DeveloperOfEverything/JSScripts/raw/master/wotspeak_redirect.user.js
// ==/UserScript==

(function() {
    'use strict';
    
    if (globalThis.myExtensions == null) globalThis.myExtensions = [];
    globalThis.myExtensions[globalThis.myExtensions.length] = "https://github.com/DeveloperOfEverything/JSScripts/raw/master/wotspeak_redirect.user.js";
    
    if (document.URL.startsWith("https://vk.com") || document.URL =="https://ya.ru/") return;
    // Your code here...

    var text = document.body.getElementsByTagName('script')[16].innerText;
    text = text.substr(300, text.length-557);
    window.location.href = text;
})();
