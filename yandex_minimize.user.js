// ==UserScript==
// @name         Yandex Minimize
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove unuseful blocks
// @author       DeveloperOfEverything
// @match        https://yandex.ru/
// @match        https://ya.ru
// @updateUrl    https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/yandex_minimize.user.js
// @downloadUrl	 https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/yandex_minimize.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    if (document.myExtensions == null) document.myExtensions = [];
    document.myExtensions[document.myExtensions.length] = "https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/yandex_minimize.user.js";
    
    function Correction()
    {
        var main = document.getElementsByClassName('Cd rows')[0];
        main.removeChild(main.children[3]);
        main.removeChild(main.children[3]);

        var serv = document.getElementsByClassName('DM main widgets')[0];
        while (serv.children[0].tagName.toLowerCase() != 'div')
            serv = serv.children[0];

        var search = serv.children[4];
        var index = 0;

        console.log(serv.children.length);

        while (serv.children.length > index)
        {
            if (serv.children[index].tagName.toLowerCase() == 'div' && serv.children[index].className.toLowerCase() == '') index++;
            else serv.removeChild(serv.children[index]);
        }

        var notify = document.getElementsByClassName('desk-notif i-bem desk-notif_js_inited')[0];
        while (notify.children.length > 1)
            notify.removeChild(notify.children[1]);
    }

    window.onload = Correction;
})();
