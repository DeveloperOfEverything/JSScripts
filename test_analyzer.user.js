// ==UserScript==
// @name         TestAnalyzer
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Скрипт анализа тестов.
// @author       URE_Community
// @match        docs.google.com/forms*
// @updateUrl    https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/test_analyzer.meta.js
// @downloadUrl  https://raw.githubusercontent.com/DeveloperOfEverything/JSScripts/master/test_analyzer.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var UI_ID = "AnalysUIBase";

    var sidePanelWidth = "40px";
    var buttonLeft = "10px";
    var buttonWidth = "20px";
    var fullWidth = "150px";

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
            var hideButton = document.createElement('div');

            function ShowFull()
            {
                toolsContainer.hidden = false;

                UIBase.style.width = null;
                UIBase.style.left = "12px";
                UIBase.style.bottom = "12px";

                hideButton.onclick = Show;
            }

            function Show()
            {
                toolsContainer.hidden = false;

                UIBase.style.width = fullWidth;//null;
                UIBase.style.left = null;
                UIBase.style.bottom = "12px";

                showButton.onclick = ShowFull;
                hideButton.onclick = Hide;
            }

            function Hide()
            {
                toolsContainer.hidden = true;

                UIBase.style.width = sidePanelWidth;
                UIBase.style.left = null;
                UIBase.style.bottom = sidePanelBottom;

                showButton.onclick = Show;
            }

            showButton.onclick = Show;
            hideButton.onclick = Hide;

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

            hideButton.style.width = buttonWidth;
            hideButton.style.height = "60px";
            hideButton.style.left = buttonLeft;
            hideButton.style.top = "50%";
            hideButton.style.position = "absolute";
            hideButton.style.backgroundColor = "#673ab7";
            hideButton.style.color = "#FFF";
            hideButton.style.borderRadius = "4px";
            hideButton.style.lineHeight="58px";
            hideButton.style.textAlign="center";
            hideButton.style.cursor="pointer";

            hideButton.innerText = ">>";

            UIBase.append(showButton);

            UIBase.append(hideButton);

            //=====[ Контейнер пользовательских инструментов ]=====
            var toolsContainer = document.createElement('div');

            toolsContainer.style.position = "absolute";
            //toolsContainer.style.padding = "20px";
            toolsContainer.style.left = sidePanelWidth;
            toolsContainer.style.right = "0px";//sidePanelWidth;
            toolsContainer.style.top = sidePanelWidth;
            toolsContainer.style.bottom = sidePanelWidth;
            toolsContainer.style.backgroundColor = "#f1ecec";
            //toolsContainer.style.overflow = "auto";

            //=====[ Элементы интерфейса ]=====
            var help = document.createElement('div');

            help.id = "help";
            help.innerText = "Перетащите файл ключей";

            help.style.textAlign = "center";
            help.style.marginTop = "10px";
            help.style.marginBottom = "10px";

            var getPatternBtn = document.createElement('div');

            getPatternBtn.className = "appsMaterialWizButtonEl appsMaterialWizButtonPaperbuttonEl appsMaterialWizButtonPaperbuttonFilled freebirdFormeditorViewHeaderHeaderMenu freebirdFormeditorViewHeaderSendButton isUndragged";
            getPatternBtn.style.paddingLeft = "10px";
            getPatternBtn.style.paddingRight = "10px";
            getPatternBtn.style.marginTop = "10px";
            getPatternBtn.style.marginBottom = "10px";
            getPatternBtn.innerText = "Получить шаблон";
            getPatternBtn.onclick = savePattern;

            toolsContainer.append(getPatternBtn);
            toolsContainer.append(help);

            var resContainer = document.createElement('div');

            resContainer.style.width = "100%";

            toolsContainer.append(resContainer);

            //=====[ Функции анализа ]=====

            var checkQuestion = function(u, l)
            {
                var ans = u.answer;

                //Обработка действий default
                for (var i=0; i<l.default.length; i++)
                {
                    var v = l.default[i].variable;
                    eval("globalThis.testActionHandler = function() { return " + l.default[i].action + ";}")

                    if (res[v] == undefined) res[v] = testActionHandler();
                    else res[v] += testActionHandler();
                }

                for (var j=0; j<l.answers.length; j++)
                {
                    if (l.answers[j].answer == ans)
                    {
                        for (var k=0; k<l.answers[j].actions.length; k++)
                        {
                            var va = l.answers[j].actions[k].variable;
                            eval("globalThis.testActionHandler = function() { return " + l.answers[j].actions[k].action + ";}");

                            if (res[va] == undefined) res[va] = testActionHandler();
                            else res[va] += testActionHandler();
                        }
                    }
                }
            }

            var ta;
            var sb;

            var start = function()
            {
                if (ta != undefined)
                    resContainer.removeChild(ta);

                if (sb != undefined)
                    resContainer.removeChild(sb);

                var q_u = getQuestions();
                var q_l = rules.questions;

                if (q_u.length != q_l.length)
                {
                    alert("Число вопросов в тесте ("+q_u.length+") не совпадает с числом в файле ключей ("+q_l.length+").");
                    return;
                }

                globalThis.res = new Object();

                for (var i=0; i<q_u.length; i++)
                {
                    checkQuestion(q_u[i], q_l[i]);
                }

                var textArea = document.createElement('textarea');

                ta = textArea;

                textArea.style.margin = "10px";
                textArea.style.width = "-webkit-fill-available";
                textArea.style.resize = "vertical";

                resContainer.append(textArea);

                textArea.value = "Результат\r\n";

                for (var keys in res)
                {
                    textArea.value += keys + "\t" + res[keys] + "\r\n";
                }

                textArea.value += "\r\nОтветы\r\n";

                for (var j=0; j<q_u.length; j++)
                {
                    textArea.value += (j+1) + "\t" + q_u[j].question + "\t" + q_u[j].answer + "\r\n";
                }

                var saveBtn = document.createElement('div');

                sb = saveBtn;

                saveBtn.className = "appsMaterialWizButtonEl appsMaterialWizButtonPaperbuttonEl appsMaterialWizButtonPaperbuttonFilled freebirdFormeditorViewHeaderHeaderMenu freebirdFormeditorViewHeaderSendButton isUndragged";
                saveBtn.style.paddingLeft = "10px";
                saveBtn.style.paddingRight = "10px";
                saveBtn.style.marginTop = "10px";
                saveBtn.style.marginBottom = "10px";
                saveBtn.innerText = "Сохранить результат";
                saveBtn.onclick = function()
                {
                    var dataLine = "";

                    for (var keys in res)
                    {
                        dataLine += keys + ";" + res[keys] + "\r\n";
                    }

                    dataLine += "\r\n";

                    for (var j=0; j<q_u.length; j++)
                    {
                        dataLine += (j+1) + ";" + q_u[j].question + ";" + q_u[j].answer + "\r\n";
                    }

                    saveWinData("result.csv",dataLine);
                }

                resContainer.append(saveBtn);
            }

            var loadTestRules = function(test)
            {
                resContainer.removeChildren(resContainer.children);

                var testName = document.createElement('div');

                resContainer.append(testName);

                globalThis.rules = JSON.parse(test);

                testName.innerText = rules.name;
                testName.style.textAlign = "center";
                testName.style.marginTop = "10px";
                testName.style.marginBottom = "10px";

                var startBtn = document.createElement('div');

                startBtn.className = "appsMaterialWizButtonEl appsMaterialWizButtonPaperbuttonEl appsMaterialWizButtonPaperbuttonFilled freebirdFormeditorViewHeaderHeaderMenu freebirdFormeditorViewHeaderSendButton isUndragged";
                startBtn.style.paddingLeft = "10px";
                startBtn.style.paddingRight = "10px";
                startBtn.style.marginTop = "10px";
                startBtn.style.marginBottom = "10px";
                startBtn.innerText = "Запустить анализ";
                startBtn.onclick = start;

                resContainer.append(startBtn);
            }

            var loadFile = function(file)
            {
                file.text().then(loadTestRules);
            }

            toolsContainer.addEventListener("dragover", function(event) {
                event.preventDefault(); // отменяем действие по умолчанию
            }, false);
            toolsContainer.addEventListener("drop", function(event) {
                // отменяем действие по умолчанию
                event.preventDefault();
                var files = event.dataTransfer.files;

                loadFile(files[0]);
            }, false);

            UIBase.append(toolsContainer);

            var clearToolbox = function()
            {
                resContainer.removeChildren(resContainer.children);
            }
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

    globalThis.getQuestions = function()
    {
        var qBlocks = document.getElementsByClassName('freebirdFormviewerViewItemsItemItem');

        var questions = [];

        for (var i=0; i<qBlocks.length; i++)
        {
            if (qBlocks[i].offsetHeight != 0 || qBlocks[i].offsetWidth != 0)
            {
                questions[questions.length] = new Object();

                var question = qBlocks[i].children[0].children[0].innerText;

                if (question.endsWith(' *')) question = question.substr(0,question.length-2)

                questions[questions.length-1].question = question;

                var ansContainer = qBlocks[i].children[1].children[0]
                var questionType = ansContainer.className;

                switch (questionType)
                {
                    case "freebirdFormviewerViewItemsTextShortText freebirdFormviewerViewItemsTextDisabledText freebirdThemedInput": //Открытый вопрос
                        {
                            questions[questions.length-1].answer = ansContainer.innerText;
                            break;
                        }
                    case "appsMaterialWizToggleRadiogroupGroupContainer exportGroupContainer freebirdFormviewerViewItemsRadiogroupRadioGroup": //Вопрос с вариантом ответа
                        {
                            questions[questions.length-1].answer = ansContainer.attributes['data-value'].value;
                            break;
                        }
                }
            }
        }

        return questions;
    }

    //=====[ Собираем шаблон ключей ]=====

    globalThis.getPattern = function()
    {
        var test = new Object();
        test.name = "";

        var qBlocks = document.getElementsByClassName('freebirdFormviewerViewItemsItemItem');

        var questions = [];

        for (var i=0; i<qBlocks.length; i++)
        {
            if (qBlocks[i].offsetHeight != 0 || qBlocks[i].offsetWidth != 0)
            {
                var question = qBlocks[i].children[0].children[0].innerText;

                var q = new Object();

                if (question.endsWith(' *')) question = question.substr(0,question.length-2)

                q.question = question;
                q.answers = [];

                var ansContainer = qBlocks[i].children[1].children[0]
                var questionType = ansContainer.className;

                if (questionType == "appsMaterialWizToggleRadiogroupGroupContainer exportGroupContainer freebirdFormviewerViewItemsRadiogroupRadioGroup") //Вопрос с вариантом ответа
                {
                    var answers = ansContainer.getElementsByClassName('freebirdFormviewerViewItemsRadioOptionContainer');

                    for (var j=0; j<answers.length; j++)
                    {
                        q.answers[q.answers.length] = new Object();
                        q.answers[q.answers.length-1].answer = answers[j].innerText//ansContainer.attributes['data-value'].value;
                    }
                }

                questions[questions.length] = q;
            }
        }

        test.questions = questions;

        return test;
    }

    globalThis.decodeCP1251 = function(string)
    {
        function decodeChar(s, p)
        {
            var cp1251 = 'ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—�™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬*®Ї°±Ііґµ¶·\
ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя';//Эта переменная отображается тут неверна, см. ее ниже!
            p = parseInt(p, 16);
            return p < 128 ? String.fromCharCode(p) : cp1251[p - 128];
        }
        var str = string;
        return str.replace(/%(..)/g,decodeChar);
    }

    globalThis.encodeCP1251 = function (string)
    {
        function encodeChar(c)
        {
            var isKyr = function (str)
            {
                return /[а-я]/i.test(str);
            }
            var cp1251 = 'ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—�™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬*®Ї°±Ііґµ¶·\
ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя';//Эта переменная записана неверно, см. ее ниже!

            var p = isKyr(c) ? (cp1251.indexOf(c) + 128) : c.charCodeAt(0);
            var h = p.toString(16);
            return '%' + h;
        }

        var res = '';
        for (var i = 0; i < string.length; i++)
        {
            res += encodeChar(string.charAt(i)) //ну или string[i]
        }
        return res;
    }

    globalThis.saveWinData = function(fileName, string)
    {
        var csvString = encodeCP1251(string);
        while (csvString.indexOf('%d%a') > -1)
            csvString = csvString.replace('%d%a','%0D%0A');
        while (csvString.indexOf('%401') > -1)
            csvString = csvString.replace('%401','%A8');
        while (csvString.indexOf('%451') > -1)
            csvString = csvString.replace('%451','%B8');
        var a = document.createElement('a');
        a.href = 'data:attachment/csv,' + csvString;
        a.target = '_blank';
        a.download = fileName;

        document.body.appendChild(a);
        a.click();
    }

    globalThis.saveData = function(fileName, string)
    {
        var csv = string;
        var csvData = 'data:application/json;charset=utf-8,' + encodeURIComponent(csv);
        var a = document.createElement('a');
        a.href = csvData;
        a.target = '_blank';
        a.download = fileName;
        a.click();
    }

    globalThis.savePattern = function()
    {
        var pattern = getPattern();
        var patternLine = JSON.stringify(pattern);
        globalThis.saveData("pattern.json", patternLine);
    }

    //=====[ Вспомогательные функции ]=====

    function stringToFunction(string)
    {
        eval("function tempFunction(){ return" + string + ";}");

        return tempFunction;
    }

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

    HTMLElement.prototype.removeChildren = function(children)
    {
        while(children.length > 0)
            this.removeChild(children[0]);
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
