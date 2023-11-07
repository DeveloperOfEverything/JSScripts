// ==UserScript==
// @name         VK_USER_DATA_PARSER
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://vk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @updateUrl    https://github.com/DeveloperOfEverything/JSScripts/raw/master/vk_data_parser.user.js
// @downloadUrl  https://github.com/DeveloperOfEverything/JSScripts/raw/master/vk_data_parser.user.js
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
    var rootClass = "ProfileFullInfoModal-module__content--HDJKl";

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

    var getIdOld = function()
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

    var getId = function()
    {
        let metas = document.getElementsByTagName('meta');
        for (let i=0; i<metas.length; i++)
            if ((metas[i].attributes["property"] != undefined) && (metas[i].attributes["property"].value == "og:url"))
                return Number.parseInt(metas[i].attributes["content"].value.split("/")[3].substr(2));
        return 0;
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

    var getNodeValue = function(node)
    {
        if (node.textContent == "")
        {
            if (node.attributes.length == 0) return undefined;
            return node.attributes[0].nodeValue;
        }
        else
            return node.textContent;
    }

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

    var getChildrenObj = function(element)
    {
        let childrenRet = new Object();

        let arr = getChildren(element)

        for (let key in arr)
        {
            let value = getNodeValue(arr[key]);
            if (value != undefined)
                childrenRet[arr[key].nodeName] = value;
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

        let nodes = getChildrenObj(xmlDocument);
        user.InfoXML = nodes;

        //user.FirstName = getElementByTagName(nodes, 'ya:firstName').innerHTML;
        //user.SecondName = getElementByTagName(nodes, 'ya:secondName').innerHTML;
        //user.RegistrationDate = getElementByTagName(nodes, 'ya:created').attributes[0].value;
        //user.LastLoggedIn = getElementByTagName(nodes, 'ya:lastLoggedIn').attributes[0].value;

        user.FirstName = nodes['ya:firstName'];
        user.SecondName = nodes['ya:secondName'];
        user.Active = nodes['ya:profileState'] == "active";

        if (!user.Active) return user;

        user.LastLoggedIn = nodes["ya:lastLoggedIn"];
        user.RegistrationDate = nodes["ya:created"];
        user.Modified = nodes["ya:modified"];
        user.Other = nodes;

        return user;
    }

    var onLoad = function() {

        document.body.addEventListener("DOMNodeInserted",function(e){ updateIds(); },false);
        //document.body.addEventListener("DOMNodeRemoved",function(e){ elementDeleted(); },false);

        document.body.addEventListener("DOMNodeInsertedIntoDocument",function(e){ updateIds(); },false);
        //document.body.addEventListener("DOMNodeRemovedFromDocument",function(e){ elementDeleted(); },false);

        updateIds();
    };

    var createSeparator = function()
    {
        let separatorContainer = document.createElement("div");
        separatorContainer.className = "vkuiSeparator vkuiSeparator--padded vkuiGroup__separator vkuiGroup__separator--separator";
        let separator = document.createElement("hr");
        separator.className = "vkuiSeparator__in";
        return separatorContainer;
    }

    var createInfoBlock = function(info, title)
    {
        let section = document.createElement("section");
        section.className = "vkuiInternalGroup vkuiGroup vkuiGroup--mode-plain vkuiInternalGroup--mode-plain vkuiGroup--padding-m Group-module__group--lRMIn Group-module__groupPaddingM--qj3wo"

        let profileModalMiniInfoCell = document.createElement('div');
        profileModalMiniInfoCell.className = "ProfileModalMiniInfoCell";

        let profileModalMiniInfoCell_in = document.createElement('div');
        profileModalMiniInfoCell_in.className = "ProfileModalMiniInfoCell_in";

        let span = document.createElement('span');
        span.className = "ProfileFullCommonInfo__caption";

        if (title != undefined) span.innerText = "" + title + ": ";
        span.innerText += info;

        profileModalMiniInfoCell_in.appendChild(span);
        profileModalMiniInfoCell.appendChild(profileModalMiniInfoCell_in);
        section.appendChild(profileModalMiniInfoCell);
        return section;
    }

    var createLinkBlock = function(url, title, text)
    {
        let section = document.createElement("section");
        section.className = "vkuiInternalGroup vkuiGroup vkuiGroup--mode-plain vkuiInternalGroup--mode-plain vkuiGroup--padding-m Group-module__group--lRMIn Group-module__groupPaddingM--qj3wo"

        let profileModalMiniInfoCell = document.createElement('div');
        profileModalMiniInfoCell.className = "ProfileModalMiniInfoCell";

        let profileModalMiniInfoCell_in = document.createElement('div');
        profileModalMiniInfoCell_in.className = "ProfileModalMiniInfoCell_in";

        let span = document.createElement('span');
        span.className = "ProfileFullCommonInfo__caption";

        let a = document.createElement('a');
        a.className = "vkuiLink Link-module__link--V7bkY vkuiTappable vkuiInternalTappable vkuiTappable--hasActive";
        a.href = url;
        if (text != undefined)
            a.innerText = text;
        else
            a.innerText = url;

        if (title != undefined) span.innerText = "" + title + ": ";

        span.appendChild(a);
        profileModalMiniInfoCell_in.appendChild(span);
        profileModalMiniInfoCell.appendChild(profileModalMiniInfoCell_in);
        section.appendChild(profileModalMiniInfoCell);
        return section;
    }

    var drawOverlay = function()
    {
        var rootBlockArr = document.getElementsByClassName(rootClass);
        if (rootBlockArr.length == 0) return;

        var rootBlock = rootBlockArr[0];

        if (document.getElementById("VK_USER_DATA_PARSER_BLOCK") != undefined) return;

        let userId = getId();
        if (userId == 0) return;

        let user = getUser(userId);
        if (!user.Active) return;

        //document.body.appendChild(baseDiv);
        //document.getElementById("side_bar_inner").appendChild(baseDiv);

        var separator = createSeparator();
        separator.id = "VK_USER_DATA_PARSER_BLOCK";
        rootBlock.appendChild(separator);

        rootBlock.appendChild(createLinkBlock(user.URL, "ID", "id"+userId));
        rootBlock.appendChild(createSeparator());
        rootBlock.appendChild(createInfoBlock(user.RegistrationDate, "Дата регистрации"));
        rootBlock.appendChild(createSeparator());
        if (user.Modified != undefined)
        {
            rootBlock.appendChild(createInfoBlock(user.Modified, "Дата изменения страницы"));
            rootBlock.appendChild(createSeparator());
        }
        rootBlock.appendChild(createInfoBlock(user.LastLoggedIn, "Дата последнего входа"));
        rootBlock.appendChild(createSeparator());
        rootBlock.appendChild(createLinkBlock(user.InfoURL, undefined, "Больше информации"));
    }

    window.addEventListener('load', function() {
        if (getId() == 0) return;
        globalThis.userControl = new Object();
        globalThis.userControl.getIds = getIds;
        globalThis.userControl.getId = getId;
        globalThis.userControl.updateIds = updateIds;
        globalThis.userControl.getUserUrls = getUserUrls;
        globalThis.userControl.getUrl = getUserUrl;
        globalThis.userControl.showUsers = showUsers;
        globalThis.userControl.showUrl = showUser;
        globalThis.userControl.getUser = getUser;


        document.body.addEventListener("DOMNodeInserted",function(e){ drawOverlay(); },false);
        //document.body.addEventListener("DOMNodeRemoved",function(e){ elementDeleted(); },false);

        document.body.addEventListener("DOMNodeInsertedIntoDocument",function(e){ drawOverlay(); },false);
        //document.body.addEventListener("DOMNodeRemovedFromDocument",function(e){ elementDeleted(); },false);

        //drawOverlay();
        //onLoad();
    }, false);
})();
