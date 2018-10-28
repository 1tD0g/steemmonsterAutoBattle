// ==UserScript==
// @name         Steem Monster Auto Battle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Battle in Steem Monster automatically
// @author       1tD0g
// @match        https://steemmonsters.com/
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';
    let running = false;
    setInterval(async () => {
        if(!running){
            try{
                console.log("Starting Script...");
                running = true;
                await waitUntilBattleButtonAndClick(200);
                await waitUntilBattleOpponentFound(2000);
                await waitX(2000);
                startFightLoop();
                await waitX(2000);
                btnSkipClick();
                await waitX(2000);
                await waitUntilBattleAgainAndClick();
                running = false;
                console.log("1 Round Finished")
            }catch(e){
                console.log("Error from Script: ", e);
            }
       }
    }, 5000);
})();

function waitX(x){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, x)
    })
}

function waitUntilBattleButtonAndClick(x){
    return new Promise((resolve, reject) => {
        let checkInterval = setInterval(() => {
            let battleButtons = document.getElementsByClassName("battle-btn");
            if(battleButtons == null) return;
            if(battleButtons.length < 1) return;
            if(battleButtons[0] == null) return;
            clearInterval(checkInterval);
            battleButtons[0].click();
            return resolve();
        }, x)
    })
}

function waitUntilBattleOpponentFound(x){
    return new Promise((resolve, reject) => {
        let intervv = setInterval(() => {
            let dialog = document.getElementById("find_opponent_dialog");
            if(dialog != null && dialog.style.display == "none"){
                clearInterval(intervv);
                return resolve();
            }
        }, x)
    })
}

function waitUntilBattleAgainAndClick(x){
    return new Promise((resolve, reject) => {
        let checkInterval = setInterval(() => {
            let battleAgain = document.getElementById("btn_again");
            if(battleAgain == null) return;
            clearInterval(checkInterval);
            battleAgain.click();
            return resolve();
        }, x)
    })
}