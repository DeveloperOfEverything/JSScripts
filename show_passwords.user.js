// ==UserScript==
// @name         ShowPasswords
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Отображает скрытые сохраненные в браузере пароля по щелчук колесика мыши по полю ввода пароля.
// @author       DeveloperOfEverything
// @match       *://*.com/*
// @match       *://*.me/*
// @match       *://*.net/*
// @match       *://*.ru/*
// @match       *://*.org/*
// @match       *://*.info/*
// @match       *://*.nz/*
// @match       *://*.en/*
// @match       *://*.cn/*
// @match       *://*.kz/*
// @match       *://*.ua/*
// @match       chrome://newtab
// @updateUrl	https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/show_passwords.user.js
// @downloadUrl	https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/show_passwords.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    if (document.myExtensions == null) document.myExtensions = [];
    document.myExtensions[document.myExtensions.length] = "https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/show_passwords.user.js";

    var inputs = [];
    var passInputs = [];
    var showed = false;

    var elementDeleted = function()
    {
        inputs = [];
        for (var i=0; i<passInputs.length; i++)
        {
            if (passInputs[i].parentElement != null)
            {
                inputs[inputs.length]=passInputs[i];
                passInputs[i].button.style.left = passInputs[i].offsetLeft + passInputs[i].offsetWidth + "px";
                passInputs[i].button.style.top = passInputs[i].offsetTop + "px";
            }
            else
            {
                if (passInputs[i].button.parentElement != null)
                {
                    passInputs[i].button.parentElement.removeChild(passInputs[i].button);
                }
            }
        }
        passInputs = inputs;

        console.log("Found " + passInputs.length);
    }

    var elementAdded = function()
    {
        inputs = document.getElementsByTagName('input');
        for (var i=0; i<inputs.length; i++)
        {
            if (inputs[i].type=="password")
            {
                if (passInputs.indexOf(inputs[i]) == -1)
                {
                    passInputs[passInputs.length] = inputs[i];
                    inputs[i].onmousedown = function(arg)
                    {
                        if (arg.button == 1)
                        {
                            arg.srcElement.pressed = true;
                            var cancel = function() { arg.srcElement.pressed = false; };

                            setTimeout(cancel, 1000);
                        }
                    }

                    inputs[i].onmouseup = function(arg)
                    {
                        if (arg.button == 1)
                        {
                            if (arg.srcElement.pressed == true)
                            {
                                if (arg.srcElement.type == "password")
                                {
                                    arg.srcElement.type = "text";
                                }
                                else
                                {
                                    arg.srcElement.type = "password";
                                }
                            }
                            arg.srcElement.pressed == false;
                        }
                    }
                }
            }
        }
    }

    var onLoad = function() {

        document.body.addEventListener("DOMNodeInserted",function(e){ elementAdded(); },false);
        document.body.addEventListener("DOMNodeRemoved",function(e){ elementDeleted(); },false);

        document.body.addEventListener("DOMNodeInsertedIntoDocument",function(e){ elementAdded(); },false);
        document.body.addEventListener("DOMNodeRemovedFromDocument",function(e){ elementDeleted(); },false);

        elementAdded();
    };

    window.addEventListener('load', function() {
        onLoad();
    }, false);

})();
