// ==UserScript==
// @name         VK WALL RENOVATION
// @namespace    http://tampermonkey.net/
// @version      2025-01-20
// @description  try to take over the world!
// @author       You
// @match        https://vk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var buttonStyle =
    "input.renovation_button{"+
        "background:#00000000;"+
        "border-color:#00000000;}"+
    "input.renovation_button:hover{"+
        "background:#4F0000FF;}";

    var RENOVATOR = new Object();

    var wallClass = 'feed_wall--no-islands';
    var pageBlockClass = 'page_block';
    var wallId = 'feed_wall';
    var feedRowClass = "feed_row";

    //var wallSelector = '#feed_wall';
    var wallSelector = '.feed_wall--no-islands';
    var wallModuleSelector = '#public_wall';
    var feedRowSelector = '.feed_row';
    var feedRowsSelector = '#feed_rows';
    var wallPostsSelector = '#page_wall_posts';
    var postRowSelector = '._post.post';
    var postHeaderSelector = '.PostHeader';
    var postContentSelector = '.PostContentContainer__contentContainer--vnF3X';
    var headerSubtitleSelector = '.PostHeaderSubtitle';
    var headerTitleSelector = '.PostHeaderTitle';
    var validPostSubtitleSelector = '.PostHeaderSubtitle__item';
    var postHeaderInfoSelector = '.PostHeaderInfo';
    var postContentPartSelector = '.vkuiDiv';
    var likeButtonSelector = '.PostBottomAction.PostBottomAction--transparent.PostButtonReactions.PostButtonReactions--post';

    var fobosMoonSelector = '.FobosMoon' // Селектор подзаголовка рекламного поста

    var url;
    var doc;

    var wall;

    var fixPost = function(post)
    {
        if (post.querySelectorAll(postHeaderSelector).length == 0) return;
        if (post.className != "feed_row feed_wall--no-islands")
        {
            post.classList.remove(pageBlockClass);
            post.classList.add(wallClass);
            post.style = "";
        }

        var contents = post.querySelectorAll(postContentSelector);
        if (contents.length == 0) return;

        contents.forEach(content => {
            if (content.fixed != undefined) return;
            let parts = [];
            content.querySelectorAll(postContentPartSelector).forEach(p => { if (p.parentElement == content) parts.push(p); })
            if (parts.length > 1)
                content.appendChild(content.querySelector(postContentPartSelector));
            else
                content.appendChild(content.children[0]);
            content.fixed = true;
        });
    }

    var getPosts = function()
    {
        // if (wall == undefined) return [];
        // if (wall.id == wallId)
        //     return wall.querySelectorAll(feedRowSelector);
        // else
        //     return wall.querySelectorAll(postRowSelector);

        let posts = document.querySelectorAll(feedRowSelector);
        if (posts.length > 0) return posts;
        return document.querySelectorAll(postRowSelector);
    }

    var fixPosts = function(arg)
    {
        if (wall == undefined || doc != document || url != document.URL)
        {
//             let wallModule = document.querySelector(wallModuleSelector);

//             if (wallModule == undefined)
                let walls = document.querySelectorAll(wallSelector);
                wall = walls[walls.length-1];
            // else
            //     wall = wallModule.parentElement;

            if (wall == undefined) return;

            doc = document;
            url = document.URL;

            wall.style['backgroundColor'] = "#00000000";
            wall.style['box-shadow'] = "unset";
        }

        getPosts().forEach(fixPost);
    };

    var removeAd1 = function(arg)
    {
        let rows = document.querySelector(feedRowsSelector);
        let posts = getPosts();
        let removed = []

        if (rows != undefined)
            rows.children.forEach(row => {
                if (!row.classList.contains("feed_row"))
                {
                    removed.push(row);
                    row.remove();
                }
            });

        posts.forEach(post => {
            let header = post.querySelector(postHeaderInfoSelector);
            if (header == undefined || post.querySelector(likeButtonSelector) == undefined)
            {
                removed.push(post);
                post.remove();
                return;
            }
            let cnt = 0;
            let headerSubtitle = header.querySelector(headerSubtitleSelector);
            if (headerSubtitle != undefined) cnt++;
            let headerTitle = header.querySelector(headerTitleSelector);
            if (headerTitle != undefined) cnt++;
            if ((headerSubtitle != undefined && (headerSubtitle.querySelector(validPostSubtitleSelector) == undefined || headerSubtitle.querySelector(validPostSubtitleSelector).tagName == 'A')) || header.children.length > cnt)
            {
                removed.push(post);
                post.remove();
            }
        });

        if (removed.length > 0)
        {
            console.log('Removed ad-posts: ' + removed.length);
            console.log(removed);
        }
    };

    var removeAd2 = function(arg)
    {
        let removed = [];

        let posts = getPosts();
        posts.forEach((post) => {
            if (post.querySelectorAll(postHeaderSelector).length > 0 && post.querySelectorAll(likeButtonSelector).length == 0)
            {
                removed.push(post);
                post.remove();
            }
        });

        if (removed.length > 0)
        {
            console.log('Removed ad-posts: ' + removed.length);
            console.log(removed);
        }
    }

    var removeAd = function(arg)
    {
        if (document.URL.indexOf("?w=wall-") != -1) return;
        if (document.URL.indexOf("?section=notifications") != -1) return;
        removeAd2();
    }

    var fixAll = function()
    {
        removeAd();
        fixPosts();
    };

    var addButton = function()
    {
        let button = document.createElement('input');
        button.type = 'button';
        // button.style['position'] = 'fixed';
        // button.style['top'] = '80px';
        // button.style['right'] = '40px';
        button.onclick = fixAll;
        document.querySelector('#top_nav').append(button);
        button.innerText = 'Очистить от смрада';
    }

    RENOVATOR.wallSelector = wallSelector;
    RENOVATOR.wallModuleSelector = wallModuleSelector;
    RENOVATOR.feedRowSelector = feedRowSelector;
    RENOVATOR.postRowSelector = postRowSelector;
    RENOVATOR.postContentSelector = postContentSelector;
    RENOVATOR.wallClass = wallClass;
    RENOVATOR.pageBlockClass = pageBlockClass;
    RENOVATOR.wallId = wallId;
    RENOVATOR.wall = wall;
    RENOVATOR.fixPost = fixPost;
    RENOVATOR.fixPosts = fixPosts;
    RENOVATOR.headerSubtitleSelector = headerSubtitleSelector;
    RENOVATOR.removeAd = removeAd;
    RENOVATOR.fixAll = fixAll;

    RENOVATOR.getPosts = getPosts;

    globalThis.RENOVATOR = RENOVATOR;

    var onLoad = function() {

        const observer = new MutationObserver(mutationList =>
                                              mutationList.filter(m => m.type === 'childList').forEach(m => {
            m.addedNodes.forEach(fixAll);
        }));
        observer.observe(document,{childList: true, subtree: true});

        fixAll();
        addButton();
    };

    window.addEventListener('load', function() {
        onLoad();
    }, false);

})();
