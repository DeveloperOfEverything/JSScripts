// ==UserScript==
// @name         NoYandexDzen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://yandex.ru/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.ru
// @updateUrl    https://github.com/DeveloperOfEverything/JSScripts/raw/master/no_yandex_zen.user.js
// @downloadUrl  https://github.com/DeveloperOfEverything/JSScripts/raw/master/no_yandex_zen.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    
    if (globalThis.myExtensions == null) globalThis.myExtensions = [];
    globalThis.myExtensions[globalThis.myExtensions.length] = "https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/no_yandex_zen.user.js";

    window.addEventListener('load', function() {
        globalThis.zenFeed = document.getElementsByClassName('zen-page__feed')[0];
        globalThis.zenDiv = document.getElementsByClassName('feed _column-count_2 _rubbery-type_null _is-morda-desktop _is-desktop-redesign _grid-type_fixed _is-redesign-desktop-cards-has-hover-shadows')[0];
        globalThis.news = document.getElementById('zen-row-0');
        zenFeed.appendChild(news);
        zenFeed.removeChild(zenDiv);
    }, false);
})();
