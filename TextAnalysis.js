// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        docs.google.com/forms*
// @updateUrl    https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/blob/master/TextAnalysis.js
// @downloadUrl  https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/blob/master/TextAnalysis.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var UI_ID = "AnalysUIBase";

    var sidePanelWidth = "40px";
    var buttonLeft = "10px";
    var buttonWidth = "20px";

    var sidePanelBottom = "50px";

    var pageChanged = function()
    {
        if (document.getElementById(UI_ID) == null)
        {
            //=====[ Основа пользовательского интерефейса ]=====
            var headerBlock = document.getElementsByClassName('no-touch')[0];

            console.log(document.getElementsByClassName('no-touch'));

            var UIBase = document.createElement('div');

            UIBase.id = UI_ID;

            UIBase.style.position = "fixed";
            UIBase.style.right = "0px";
            UIBase.style.top = "118px";
            UIBase.style.bottom = sidePanelBottom;
            UIBase.style.backgroundColor = "#FFFFFF";
            UIBase.style.border = "1px solid rgb(218, 220, 224)";
            UIBase.style.borderBottomLeftRadius = "7px";
            UIBase.style.borderTopLeftRadius = "7px";
            UIBase.style.width = sidePanelWidth;
            UIBase.style.fontFamily = "'Google Sans',Roboto,Arial,sans-serif";
            UIBase.style.boxShadow = "0px 0px 5px #c6c7cb";

            document.body.append(UIBase);

            //=====[ Кнопка скрыть/показать ]=====
            var showButton = document.createElement('div');

            function Show()
            {
                UIBase.style.width = null;
                UIBase.style.left = "12px";
                UIBase.style.bottom = "12px";

                showButton.innerText = ">>";

                showButton.onclick = Hide;

                console.log(getQuestions());
            }

            function Hide()
            {
                UIBase.style.width = sidePanelWidth;
                UIBase.style.left = null;
                UIBase.style.bottom = sidePanelBottom;

                showButton.innerText = "<<";

                showButton.onclick = Show;
            }

            showButton.onclick = Show;

            showButton.style.width = buttonWidth;
            showButton.style.height = "60px";
            showButton.style.left = buttonLeft;
            showButton.style.bottom = "50%";
            showButton.style.position = "absolute";
            showButton.style.backgroundColor = "#673ab7";
            showButton.style.color = "#FFF";
            showButton.style.borderRadius = "4px";
            showButton.style.lineHeight="58px";
            showButton.style.textAlign="center";
            showButton.style.cursor="pointer";

            showButton.innerText = "<<";

            UIBase.append(showButton);

            //=====[ Контейнер пользовательских инструментов ]=====
            var toolsContainer = document.createElement('div');

            toolsContainer.style.position = "absolute";
            toolsContainer.style.left = sidePanelWidth;
            toolsContainer.style.right = sidePanelWidth;
            toolsContainer.style.top = sidePanelWidth;
            toolsContainer.style.bottom = sidePanelWidth;
            toolsContainer.style.backgroundColor = "#f1ecec";
            toolsContainer.style.overflow = "auto";

            UIBase.append(toolsContainer);

            //=====[ Функции анализа ]=====
            var baseElement = document.getElementsByClassName('freebirdFormeditorViewResponsesRecordviewResponseContainer')[0];
        }
    }

    var onLoad = function()
    {
        document.body.addEventListener("DOMNodeInserted",function(e){ pageChanged(); },false);
        document.body.addEventListener("DOMNodeRemoved",function(e){ pageChanged(); },false);

        document.body.addEventListener("DOMNodeInsertedIntoDocument",function(e){ pageChanged(); },false);
        document.body.addEventListener("DOMNodeRemovedFromDocument",function(e){ pageChanged(); },false);
    }

    window.addEventListener('load', function() {
        onLoad();
    }, false);

    //=====[ Формируем список вопросов ]=====

    function getQuestions()
    {
        var qBlocks = document.getElementsByClassName('freebirdFormviewerViewItemsItemItem');

        var questions = [];

        for (var i=0; i<qBlocks.length; i++)
        {
            questions[questions.length] = new Object();
            questions[questions.length-1].q = qBlocks[i].children[0].children[0].innerText;

            var questionType = qBlocks[i].children[1].class;

            switch (questionType)
            {
                case "freebirdFormviewerViewItemsTextShortText freebirdFormviewerViewItemsTextDisabledText freebirdThemedInput": //Открытый вопрос
                    {

                        break;
                    }
                case "appsMaterialWizToggleRadiogroupGroupContainer exportGroupContainer freebirdFormviewerViewItemsRadiogroupRadioGroup": //Вопрос с вариантом ответа
                    {

                        break;
                    }
            }
        }

        return questions;
    }

    //=====[ Вспомогательные функции ]=====
    var getAllElements = function(parentElement = document.body)
    {
        var temp = [];
        temp[temp.length] = parentElement;

        for (var i=0; i<parentElement.children.length; i++)
        {
            temp = temp.concat(getAllElements(parentElement.children[i]));
        }

        return temp;
    }

    globalThis.getAllElements = getAllElements;

    HTMLElement.prototype.getAllElements = function()
    {
        return getAllElements(this);
    }

    HTMLElement.prototype.getElementsByAttributeValue = function(attribute, value)
    {
        var allElements = this.getAllElements();

        var tempList = [];

        for (var i=0; i<allElements.length; i++)
        {
            if (allElements[i].attributes[attribute] != undefined)
            {
                if (allElements[i].attributes[attribute].value == value)
                {
                    tempList[tempList.length] = allElements[i];
                }
            }
        }

        return tempList;
    }

    Array.prototype.contains = function(element)
    {
        if (this.indexOf(element) == -1) return false;
        return true;
    }

    Array.prototype.cross = function(array)
    {
        var temp = [];

        for (var i=0; i<this.length; i++)
        {
            if (array.contains(this[i])) if (!temp.contains(this[i])) temp[temp.length] = this[i];
        }

        return temp;
    }

    Array.prototype.where = function(boolDelegate)
    {
        var temp = [];

        for (var i=0; i<this.length; i++)
        {
            if (boolDelegate(this[i])) temp[temp.length] = this[i];
        }

        return temp;
    }

    HTMLCollection.prototype.indexOf = function(element, fromIndex=0)
    {
        for (var i=fromIndex; i<this.length; i++)
        {
            if (this[i] == element) return i;
        }

        return -1;
    }

    HTMLCollection.prototype.contains = function(element)
    {
        if (this.indexOf(element) == -1) return false;
        return true;
    }

    HTMLCollection.prototype.cross = function(array)
    {
        var temp = [];

        for (var i=0; i<this.length; i++)
        {
            if (array.contains(this[i])) if (!temp.contains(this[i])) temp[temp.length] = this[i];
        }

        return temp;
    }

    HTMLCollection.prototype.where = function(boolDelegate)
    {
        var temp = [];

        for (var i=0; i<this.length; i++)
        {
            if (boolDelegate(this[i])) temp[temp.length] = this[i];
        }

        return temp;
    }

    HTMLCollection.prototype.getElementsByTagName = function(tagName)
    {
        return this.where(function(el) { if (el.tagName.toLowerCase() == tagName.toLowerCase()) return true; return false; });
    }

    globalThis.getElementByXPath = function(path)
    {
        path = path.split("/");
        var element = document.body;
        if (path[2] == 'head') element = document.head;
        for (var i=3; i<path.length; i++)
        {
            var tag = path[i].split('[')[0];
            var num = 0;
            if (path[i][path[i].length-1] == ']') num = (path[i].split('[')[1].split(']')[0]) - 1;

            element = element.children.getElementsByTagName(tag)[num];
        }

        return element;
    }

})();
