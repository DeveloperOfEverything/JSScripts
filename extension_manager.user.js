// ==UserScript==
// @name         ExtensionManager
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ExtensionManager for downloading JS scripts
// @author       DeveloperOfEverything
// @match        https://ya.ru
// @match        https://vk.com/*
// @updateUrl    https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/extension_manager.user.js
// @downloadUrl  https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/extension_manager.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var extensions = [
            "https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/show_passwords.user.js", //ShowPassword
            "https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/ipr_downloader.user.js", //IPR Downloader
            "https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/ya_memorandum.user.js"  //Yandex memorandum unblocking
        ];

    var ExtensionManager = function(document)
    {
        this.document = document;

        this.Define = function(URI)
        {
            if (this.document.myExtensions == undefined) this.document.myExtensions = [];
            this.document.myExtensions[this.document.myExtensions.length] = URI;
        }

        this.Check = function()
        {
            if (this.document.URL.startWith("https://vk.com"))
            {
                if (vkopt == undefined) window.open("https://raw.githubusercontent.com/VkOpt/VkOpt/master/builds/vkopt_script.user.js");
            }

            if (this.document.myExtensions != undefined)
            {
                for (var key in extensions)
                {
                    if (this.document.myExtensions.indexOf(extensions[key]) == -1)
                    {
                        window.open(extensions[key]);
                    }
                }
            }
        }

        this.isReady = true;
    }

    globalThis.extensionManager = new ExtensionManager(document);

    try
    {
        setTimeout(globalThis.extensionManager.Check(), 1000);
    }
    catch(err)
    {
    }

})();