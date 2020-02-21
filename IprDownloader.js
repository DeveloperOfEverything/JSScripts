// ==UserScript==
// @name         IPR Books Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Данный скрипт позволяет скачивать литературу из библиотеки IPR Books в формате PDF. Для этого необходимо перейти в режим чтения книги и нажать соответствующую кнопку на панели инструментов.
// @author       DeveloperOfEverything
// @match        http://www.iprbookshop.ru/epd-reader*
// @updateUrl    https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/IprDownloader.js
// @downloadUrl  https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/IprDownloader.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

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
