// ==UserScript==
// @name         qlyuker.io
// @namespace    http://tampermonkey.net/
// @version      2024-12-16
// @description  try to take over the world!
// @author       You
// @match        https://qlyuker.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qlyuker.io
// @updateUrl    https://github.com/DeveloperOfEverything/JSScripts/raw/master/qlyuker.user.js
// @downloadUrl  https://github.com/DeveloperOfEverything/JSScripts/raw/master/qlyuker.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var event = new PointerEvent("pointerdown")

    var click = function()
    {
        try
        {
            let clicker = document.querySelector(".clicker");
            clicker.dispatchEvent(event);
        } catch {}
    }

    globalThis.clk = click;

    var onLoad = function() {
        setInterval("clk()", 100);
    };

    window.addEventListener('load', function() {
        onLoad();
    }, false);
})();
