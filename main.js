// ==UserScript==
// @name         Buff Tools 网易Buff助手
// @namespace    https://github.com/hanpanapn/buff-tools
// @version      0.6.1
// @description  buff tools
// @author       hanpanpan@outlook.com
// @match        https://buff.163.com/*
// @match        https://bbs.tampermonkey.net.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=163.com  
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
//
    function addXMLRequestCallback(callback){
        var oldSend, i;
        if( XMLHttpRequest.callbacks ) {
            // we've already overridden send() so just add the callback
            XMLHttpRequest.callbacks.push( callback );
        } else {
            // create a callback queue
            XMLHttpRequest.callbacks = [callback];
            // store the native send()
            oldSend = XMLHttpRequest.prototype.send;
            // override the native send()
            XMLHttpRequest.prototype.send = function(){
                // process the callback queue
                // the xhr instance is passed into each callback but seems pretty useless
                // you can't tell what its destination is or call abort() without an error
                // so only really good for logging that a request has happened
                // I could be wrong, I hope so...
                // EDIT: I suppose you could override the onreadystatechange handler though
                for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                    XMLHttpRequest.callbacks[i]( this );
                }
                // call the native send()
                oldSend.apply(this, arguments);
            }
        }
    }

    let setBtnPageFun =()=>{
        let page = document.querySelector('.simple-pagination')

        let goodIdDom=document.querySelector('.btn-supply-buy')
        let nav = document.querySelector('.nav ul')
        let switcher = document.getElementById('j_game-switcher')
        if(!goodIdDom||!page||!nav||!switcher){
            return
        }
        switcher.remove()

        let marketName= document.createElement('li')
        marketName.id='u_title'
        let title = document.createElement('a')


        let inT= document.createElement('input')
        inT.id='inT'
        inT.style.width='260px'
        inT.value=document.title.split('_')[0]
        title.appendChild(inT)

        let btnSearch = document.createElement('button')
        btnSearch.innerText='GO'
        btnSearch.style.width='51px'
        btnSearch.style.height='29px'
        btnSearch.onclick=()=>{
            location.href='https://buff.163.com/market/csgo#tab=selling&page_num=1&search='+document.getElementById('inT').value
        }
        title.appendChild(btnSearch)

        marketName.appendChild(title)
        let u_title= document.getElementById('u_title')
        if(u_title){
            nav.removeChild(u_title)
        }
        nav.appendChild(marketName)

        let btn10 = document.createElement('li')
        if(getQueryVariable('page_num')==10){
            btn10.classList.add('active')
        }

        let goodId= goodIdDom.getAttribute('data-goodsid')
        btn10.innerHTML='<a href="https://buff.163.com/goods/'+goodId+'?from=market#tab=selling&page_num=10">第10页</a>'
        page.appendChild(btn10)

        let btn20 = document.createElement('li')
        if(getQueryVariable('page_num')==20){
            btn20.classList.add('active')
        }
        btn20.innerHTML='<a href="https://buff.163.com/goods/'+goodId+'?from=market#tab=selling&page_num=20">第20页</a>'
        page.appendChild(btn20)

        let btn30 = document.createElement('li')
        if(getQueryVariable('page_num')==30){
            btn30.classList.add('active')
        }
        btn30.innerHTML='<a href="https://buff.163.com/goods/'+goodId+'?from=market#tab=selling&page_num=30">第30页</a>'
        page.appendChild(btn30)

        let btn50 = document.createElement('li')
        if(getQueryVariable('page_num')==50){
            btn50.classList.add('active')
        }
        btn50.innerHTML='<a href="https://buff.163.com/goods/'+goodId+'?from=market#tab=selling&page_num=50">第50页</a>'
        page.appendChild(btn50)
    }
    let getQueryVariable =(variable)=>
    {

        var query = window.location.href;

        var vars = query.split("&");

        for (var i=0;i<vars.length;i++) {

            var pair = vars[i].split("=");

            if(pair[0] == variable){return pair[1];}

        }

        return(false);

    }


    let header =document.querySelector('.header')
    header.style.position='fixed'
    header.style.width='100%'
    header.style.zIndex='99'
    header.style.background='#1a2132'



    let setBtnPage = ()=>{
        addXMLRequestCallback( function( xhr ) {
            xhr.addEventListener("load", function(){
                if ( xhr.readyState == 4 && xhr.status == 200 && xhr.responseURL.indexOf('https://buff.163.com/api/market/goods/sell_order?game=csgo')!=-1 ) {

                    setBtnPageFun()
                }
            });

        });



    }

    setBtnPage()
    window.addEventListener('hashchange',
                            function(e)
                            {
        setBtnPageFun()
    },false);

    setTimeout(()=>{
        setBtnPageFun()
    },1000)


})();
