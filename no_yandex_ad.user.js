// ==UserScript==
// @name         NoYandexAd
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://yandex.ru/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.ru
// @grant        none
// @updateUrl	https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/no_yandex_ad.user.js
// @downloadUrl	https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/no_yandex_ad.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var exclude = [];

    var clearParent = function(elem)
    {
        var parent = elem.parentElement;
        var children = parent.children;

        for (var key in children)
        {
            if (exclude.indexOf(children[key]) == -1)
            {
                try {
                    children[key].remove();
                } catch (error) {

                }
            }
        }

        return parent;
    }

    var home_arrow = document.getElementsByClassName("home-arrow")[0].parentElement.parentElement;
    var tools = document.getElementsByClassName("services-new")[0].parentElement.parentElement;

    var addToExclude = function(shouldBeSave)
    {
        while (shouldBeSave.attributes["role"] == undefined || shouldBeSave.attributes["role"].value != 'main')
        {
            if (exclude.indexOf(shouldBeSave) != -1) return;
            exclude[exclude.length] = shouldBeSave;
            shouldBeSave = shouldBeSave.parentElement;
        }
    }

    addToExclude(home_arrow);
    addToExclude(tools);

    var clearTree = function(shouldBeSave)
    {
        while (shouldBeSave.attributes["role"] == undefined || shouldBeSave.attributes["role"].value != 'main')
        {
            shouldBeSave = clearParent(shouldBeSave);
        }
    }

    clearTree(home_arrow);
    clearTree(tools);
})();
