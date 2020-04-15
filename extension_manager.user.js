// ==UserScript==
// @name         ExtensionManager
// @namespace    http://tampermonkey.net/
// @version      0.1.5
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
            if (this.document.URL.startsWith("https://vk.com"))
            {
                try
                {
                    var a = vkopt;
                }
                catch(err)
                {
                    window.open("https://raw.githubusercontent.com/VkOpt/VkOpt/master/builds/vkopt_script.user.js");
                }
            }

            if (this.document.myExtensions == undefined) this.document.myExtensions =[];
            var logInfo = "ExtensionManager\r\nLoaded " + this.document.myExtensions.length + " extensions:\r\n";
            for (var key in this.document.myExtensions)
            {
                logInfo += this.document.myExtensions[key] + "\r\n";
            }

            console.log(logInfo);

            for (var key1 in extensions)
            {
                if (this.document.myExtensions.indexOf(extensions[key1]) == -1)
                {
                    window.open(extensions[key1]);
                }
            }
        }

        this.isReady = true;
    }

    globalThis.extensionManager = new ExtensionManager(document);

    window.onload = function()
    {
        try
        {
            setTimeout(globalThis.extensionManager.Check(), 1000);
        }
        catch(err)
        {
        }
    }

})();
