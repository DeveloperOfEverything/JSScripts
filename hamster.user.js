// ==UserScript==
// @name         Hamster Clicker
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       NONE_NAME
// @match        https://hamsterkombatgame.io/*
// @icon         https://hamsterkombatgame.io/favicon.ico
// @updateUrl    https://github.com/DeveloperOfEverything/JSScripts/raw/master/hamster.user.js
// @downloadUrl  https://github.com/DeveloperOfEverything/JSScripts/raw/master/hamster.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    Array.prototype.indexOf = function(value)
    {
        if (this.length == 3
            && this[0] == "android"
            && this[1] == "android_x"
            && this[2] == "ios")
            return 1;

        for (var key in this)
            if (this[key] == value) return parseInt(key);
        return -1;
    };

    var btn;
    var switchBtn;
    var found = false;
    var doClicks = false;
    var stopValue = 200;
    var stepSize = 100;

    var getEnergy = function()
    {
        return document.querySelector(".user-tap-energy").querySelector("p").innerHTML.split('/');
    }

    var getButton = function()
    {
        var btns = document.getElementsByClassName('user-tap-button button');
        if (btns.length > 0) return btns[0];
        return undefined;
    }

    var getMaxEnergy = function()
    {
        return parseInt(getEnergy()[1]);
    }

    var getCurrentEnergy = function()
    {
        return parseInt(getEnergy()[0]);
    }

    var getState = function()
    {
        return localStorage.getItem('enableClicker') == "true";
    }

    var setState = function(state)
    {
        localStorage.setItem('enableClicker', state);
        updateSwitchText();
    }

    var switchState = function()
    {
        if (getState()) stopClicker();
        else startClicker();

        alert(getState() ? "Кликер запущен" : "Кликер остановлен");
        switchBtn.innerHTML = getState() ? "Стоп" : "Старт"
    }

    globalThis.stopClicker = function()
    {
        setState(false);
    }

    globalThis.startClicker = function()
    {
        if (!getState())
        {
            setState(true);
            clicker();
        }
    }

    var updateSwitchText = function()
    {
        if (switchBtn == undefined) return;
        if (getState()) switchBtn.innerText = "Стоп";
        else switchBtn.innerText = "Старт";
    }

    var clicker = function()
    {
        updateSwitchText();

        if (!getState())
            return;

        var btn = getButton();
        if (btn != undefined && getCurrentEnergy() > stopValue)
            for (var i=0; i<stepSize; i++)
                btn.dispatchEvent(new PointerEvent('pointerup'));

        setTimeout(function() { clicker(); }, 250);
    }

    var onLoad = function() {
        var page = document.querySelector(".page");
        if (page == undefined)
        {
            setTimeout(onLoad, 1000);
            return;
        }

        switchBtn = document.createElement('button');
        switchBtn.style["position"] = "absolute";
        switchBtn.style["left"] = "20px";
        switchBtn.style["top"] = "250px";
        switchBtn.style["width"] = "50px";
        switchBtn.style["height"] = "50px";
        switchBtn.onclick = switchState;
        document.querySelector(".page").appendChild(switchBtn);
        updateSwitchText();
    };

    window.addEventListener('load', function() {
        if (getState()) clicker();
        onLoad();
    }, false);
})();
