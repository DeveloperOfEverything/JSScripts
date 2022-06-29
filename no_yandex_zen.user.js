// ==UserScript==
// @name         NoYandexDzen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://yandex.ru/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.ru
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var onLoad = function() {

        document.body.addEventListener("DOMNodeInserted",function(e){ clearRaws(); },false);
        //document.body.addEventListener("DOMNodeRemoved",function(e){ elementDeleted(); },false);

        document.body.addEventListener("DOMNodeInsertedIntoDocument",function(e){ clearRaws(); },false);
        //document.body.addEventListener("DOMNodeRemovedFromDocument",function(e){ elementDeleted(); },false);

        clearRaws();
    };

    window.addEventListener('load', function() {
        globalThis.zenFeed = document.getElementsByClassName('zen-page__feed')[0];
        globalThis.zenDiv = document.getElementsByClassName('feed _column-count_2 _rubbery-type_null _is-morda-desktop _is-desktop-redesign _grid-type_fixed _is-redesign-desktop-cards-has-hover-shadows')[0];
        globalThis.news = document.getElementById('zen-row-0');
        zenFeed.appendChild(news);
        zenFeed.removeChild(zenDiv);
        onLoad();
    }, false);
})();
