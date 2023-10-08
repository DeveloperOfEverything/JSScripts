// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://vk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // var noscript = '<noscript><div style="position:absolute;left:-10000px;">\r\n<img src="//top-fwz1.mail.ru/counter?sign=07443a3800f5ae0b78559419496d792467f433cb&id=2579437;pid=33457357;js=na" style="border:0;" height="1" width="1" />\r\n</div></noscript>'
    // var script =

    var strings = ["id=", "/im?sel="];
    var html;
    var exclude;
    var parser = new DOMParser();

    var isDecimal = function(symbol) { return symbol >= "0" && symbol <= "9"; }
    var countOf = function(arr, element)
    {
        let index = 0;
        let count = 0;

        while(true)
        {
            index = arr.indexOf(element, index);
            if (index == -1) return count;
            index++;
            count++;
        }
    }

    function httpGet(theUrl)
    {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send( null );
        return xmlHttp;
    }

    var getDocument = function() { return document.head.outerHTML + document.body.outerHTML; }

    var getStartEnd = function(text)
    {
        let startEnd = new Object();
        startEnd.start = html.indexOf(text);
        startEnd.end = startEnd.start + text.length;
        return startEnd;
    }

    var getExclude = function()
    {
        let noscripts = document.getElementsByTagName('noscript');
        let exclude = [];

        for (let key = 0; key < noscripts.length; key++)
            exclude[exclude.length] = getStartEnd(noscripts[key].outerHTML);

        return exclude;
    }

    var checkExclude = function(index)
    {
        for (let key in exclude)
            if (index >= exclude[key].start && index < exclude[key].end) return exclude[key].end;
        return index;
    }

    var getIndex = function(strings, origin, startPosition = 0)
    {
        let index = -1;
        for (let key in strings)
        {
            let thisIndex = origin.indexOf(strings[key], startPosition);
            if (thisIndex != -1)
            {
                thisIndex += strings[key].length;
                if (index == -1) index = thisIndex;
                else index = Math.min(index, thisIndex);
            }
        }
        return index;
    }

    var getIds = function()
    {
        html = getDocument();
        exclude = getExclude();

        let ids = [];

        let index = 0;

        while (true)
        {
            let excludeIndex = index;

            do
            {
                index = excludeIndex;
                index = html.indexOf("/im?sel=", index);
				if (index == -1) break;
				index += 8;
                excludeIndex = checkExclude(index);
            } while(excludeIndex != index);

            if (index == -1)
			{
				if (ids.length > 0)return ids;
				else break;
			}

            let startIndex = index;
            let endIndex = startIndex;

            while (isDecimal(html[endIndex])) endIndex++;

            if (endIndex != startIndex)
            {
                let id = +html.substring(startIndex, endIndex);
                if (id != vk.id)
                    ids[ids.length] = id;
            }

            index = endIndex;
        }

        index = 0;

        while (true)
        {
            let excludeIndex = index;

            do
            {
                index = excludeIndex;
                //index = Math.min(html.indexOf("id=", index), html.indexOf("/im?sel=", index));
                index = getIndex(strings, html, index);
                excludeIndex = checkExclude(index);
            } while(excludeIndex != index);

            if (index == -1) return ids;

            let startIndex = index;
            let endIndex = startIndex;

            while (isDecimal(html[endIndex])) endIndex++;

            if (endIndex != startIndex)
            {
                let id = +html.substring(startIndex, endIndex);
                if (id != vk.id)
                    ids[ids.length] = id;
            }

            index = endIndex;
        }
    }

    var getId = function()
    {
        let ids = getIds();
        let count = 0;
        let id = 0;

        for (let key in ids)
        {
            let thisCount = countOf(ids, ids[key]);
            if (thisCount > count)
            {
                id = ids[key];
                count = thisCount;
            }
        }

        return id;
    }

    var updateIds = function()
    {
        globalThis.ids = getIds();
    }

    var getUserUrls = function()
    {
        let users = getIds();
        for (let key in users)
            //console.log("https://vk.com/id"+users[key]);
            users[key] = "https://vk.com/id"+users[key];
        return users;
    }

    var getUserUrl = function(id = 0) { if (id == 0) return "https://vk.com/id"+getId(); return "https://vk.com/id"+id;}

    var showUsers = function()
    {
        let users = getUsers();
        for (let key in users)
            console.log(users[key]);
    }

    var showUser = function(id = 0) { if (id == 0) console.log("https://vk.com/id"+getId()); else console.log("https://vk.com/id"+id); }

    var getInfoUrl = function(id = 0) { if (id == 0) return "https://vk.com/foaf.php?id="+getId(); return "https://vk.com/foaf.php?id="+id; }

    var getChildren = function(element)
    {
        let childrenRet = [];
        let children = element.children;

        for (let key=0; key<children.length; key++)
        {
            childrenRet[childrenRet.length] = children[key];
            childrenRet = childrenRet.concat(getChildren(children[key]));
        }

        return childrenRet;
    }

    var getElementByTagName = function(nodes, tag)
    {
        for (let key in nodes)
            if (nodes[key].tagName == tag) return nodes[key];

        return undefined;
    }

    var getUser = function(id)
    {
        let user = new Object();

        if (id == undefined)
            user.ID = getId();
        else
            user.ID = id;
        user.URL = getUserUrl(user.ID);
        user.InfoURL = getInfoUrl(user.ID);

        let response = httpGet(user.InfoURL);

        let xmlDocument = parser.parseFromString(response.responseText, "text/xml");

        let nodes = getChildren(xmlDocument);
        user.InfoXML = nodes;

        user.FirstName = getElementByTagName(nodes, 'ya:firstName').innerHTML;
        user.SecondName = getElementByTagName(nodes, 'ya:secondName').innerHTML;
        user.RegistrationDate = getElementByTagName(nodes, 'ya:created').attributes[0].value;
        user.LastLoggedIn = getElementByTagName(nodes, 'ya:lastLoggedIn').attributes[0].value;

        return user;
    }

    var onLoad = function() {

        document.body.addEventListener("DOMNodeInserted",function(e){ updateIds(); },false);
        //document.body.addEventListener("DOMNodeRemoved",function(e){ elementDeleted(); },false);

        document.body.addEventListener("DOMNodeInsertedIntoDocument",function(e){ updateIds(); },false);
        //document.body.addEventListener("DOMNodeRemovedFromDocument",function(e){ elementDeleted(); },false);

        updateIds();
    };

    window.addEventListener('load', function() {
        globalThis.userControl = new Object();
        globalThis.userControl.getIds = getIds;
        globalThis.userControl.getId = getId;
        globalThis.userControl.updateIds = updateIds;
        globalThis.userControl.getUserUrls = getUserUrls;
        globalThis.userControl.getUrl = getUserUrl;
        globalThis.userControl.showUsers = showUsers;
        globalThis.userControl.showUrl = showUser;
        globalThis.userControl.getUser = getUser;
        //onLoad();
    }, false);
})();
