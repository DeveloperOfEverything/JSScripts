// ==UserScript==
// @name         Yandex memorandum unblocking
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Yandex memorandum unblocking for pirates
// @author       DeveloperOfEverything
// @match        https://yandex.ru/support/law/memorandum.html*
// @updateUrl    https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/ya_memorandum.user.js
// @downloadUrl  https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/ya_memorandum.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function()
    {
        var el = document.getElementsByClassName('doc-c-memorandum-url doc-c-i-bem doc-c-memorandum-url_js_inited');

        for (var i=0; i < el.length; i++)
        {
            var text = el[i].attributes['data-text'].value;

            el[i].outerHTML = text;
        }
    }
})();
