// ==UserScript==
// @name         IPR Books Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  Данный скрипт позволяет скачивать литературу из библиотеки IPR Books в формате PDF. Для этого необходимо перейти в режим чтения книги и нажать соответствующую кнопку на панели инструментов.
// @author       DeveloperOfEverything
// @match        http://www.iprbookshop.ru/epd-reader*
// @match        https://ya.ru/
// @match        https://vk.com/feed
// @updateUrl    https://github.com/DeveloperOfEverything/JSScripts/raw/master/ipr_downloader.user.js
// @downloadUrl  https://github.com/DeveloperOfEverything/JSScripts/raw/master/ipr_downloader.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    if (globalThis.myExtensions == null) globalThis.myExtensions = [];
    globalThis.myExtensions[globalThis.myExtensions.length] = "https://github.com/DeveloperOfEverything/JSScripts/raw/master/ipr_downloader.user.js";
    
    if (document.URL.startsWith("https://vk.com") || document.URL =="https://ya.ru/") return;

    var toolBar = document.getElementById('toolbarViewerRight');

    var saveButton = document.createElement('input');

    var neighborButton = document.createElement('viewBookmark');

    saveButton.type = "Button";
    saveButton.value = "Скачать";
    saveButton.style.height = 35 + "px";
    saveButton.style.marginTop = 6 + "px";

    saveButton.onclick = function()
    {
        //PDFViewerApplication.download();

        var fileName = document.getElementsByClassName('text-title')[0].innerText;
        var dataPromise = PDFViewerApplication.pdfDocument.getData()
        dataPromise.then(
            result =>
            {
                PDFViewerApplication.downloadManager.downloadData(result, fileName + ".pdf", 'application/pdf')
            },
            error =>
            {
                console.log('Ошибка получения содержимого файла');
            }
            );
    };

    toolBar.appendChild(saveButton);

})();
