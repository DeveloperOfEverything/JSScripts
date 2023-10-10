// ==UserScript==
// @name         GitFix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://skgit:8080/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.skgit
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function replaceInValue(element, oldText, newText) { element.value = element.value.replace(oldText, newText); }
    function replaceLocalIp(element) { replaceInValue(element, '192.168.1.99', 'skgit'); }
    function replaceRemoteIp(element) { replaceInValue(element, '46.146.212.153', 'skgit'); }
    function addHttpPort(element) { replaceInValue(element, 'skgit/', 'skgit:8080/'); }

    function getElement(name) { return document.getElementsByName(name)[0]; }

    function fixElement(name)
    {
        let element = getElement(name);
        if (element == undefined) return;
        replaceLocalIp(element);
        replaceRemoteIp(element);
        addHttpPort(element);
    }

    window.addEventListener('load', function() {
        fixElement('ssh_project_clone');
        fixElement('http_project_clone');
    }, false);
})();
