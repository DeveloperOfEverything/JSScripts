// ==UserScript==
// @name         ExtensionManager
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  ExtensionManager for downloading JS scripts
// @author       DeveloperOfEverything
// @match        https://ya.ru
// @match        https://vk.com/feed
// @updateUrl    https://github.com/DeveloperOfEverything/JSScripts/raw/master/extension_manager.user.js
// @downloadUrl  https://github.com/DeveloperOfEverything/JSScripts/raw/master/extension_manager.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var extensions = [
            "https://github.com/DeveloperOfEverything/JSScripts/raw/master/show_passwords.user.js", //ShowPassword
            "https://github.com/DeveloperOfEverything/JSScripts/raw/master/ipr_downloader.user.js", //IPR Downloader
            "https://github.com/DeveloperOfEverything/JSScripts/raw/master/ya_memorandum.user.js", //Yandex memorandum unblocking
            "https://github.com/DeveloperOfEverything/JSScripts/raw/master/wotspeak_redirect.user.js", //Disable timer on download page
            "https://github.com/DeveloperOfEverything/JSScripts/raw/master/no_yandex_zen.user.js"
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

            if (globalThis.myExtensions == undefined) globalThis.myExtensions =[];
            var logInfo = "ExtensionManager\r\nLoaded " + globalThis.myExtensions.length + " extensions:\r\n";
            for (var key in globalThis.myExtensions)
            {
                logInfo += globalThis.myExtensions[key] + "\r\n";
            }

            console.log(logInfo);

            for (var key1 in extensions)
            {
                if (globalThis.myExtensions.indexOf(extensions[key1]) == -1)
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
