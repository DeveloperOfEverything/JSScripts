// ==UserScript==
// @name         IPR Books Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Данный скрипт позволяет скачивать литературу из библиотеки IPR Books в формате PDF. Для этого необходимо перейти в режим чтения книги и нажать соответствующую кнопку на панели инструментов.
// @author       DeveloperOfEverything
// @match        http://www.iprbookshop.ru/epd-reader*
// @updateUrl    https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/ipr_downloader.user.js
// @downloadUrl  https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/ipr_downloader.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    if (globalThis.myExtensions == null) globalThis.myExtensions = [];
    globalThis.myExtensions[globalThis.myExtensions.length] = "https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/ipr_downloader.user.js";

    var toolBar = document.getElementById('toolbarViewerRight');

    var saveButton = document.createElement('input');

    var neighborButton = document.createElement('viewBookmark');

    saveButton.type = "Button";
    saveButton.value = "Скачать";
    saveButton.style.height = 35 + "px";
    saveButton.style.marginTop = 6 + "px";

    saveButton.onclick = function()
    {
        PDFViewerApplication.download();
    };

    toolBar.appendChild(saveButton);

})();
