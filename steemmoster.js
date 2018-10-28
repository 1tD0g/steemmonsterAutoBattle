// ==UserScript==
// @name         Steem Monster Auto Battle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Battle in Steem Monster automatically
// @author       1tD0g
// @match        https://steemmonsters.com/
// @grant        none
// ==/UserScript==

let PlayerName = "";
let playedGameNum = 0;
let winGame = 0;
let errorResultGame = 0;
let running = false;

(async function() {
    'use strict';

    PlayerName = await getPlayerName(200);
    console.clear()
    console.log(`Hello ${PlayerName}.\nThank you for using this script.`);
    console.log("Starting Script...");

    if(! battleButtonExists()){
        SM.ShowBattleHistory();
        await waitX(2000);
        SM.ShowCreateTeam('Ranked');
    }

    setInterval(async () => {
        if(!running){
            running = true;
            await waitUntilBattleButtonAndClick(500);
            await waitUntilBattleOpponentFound(2000);
            await waitX(2000);
            startFightLoop();
            await waitX(2000);
            btnSkipClick();
            await waitX(2000);
            await waitUntilBattleAgainAndClick();
            running = false;
            playedGameNum++;
            try{
                let winner = await getWinnerUsername(500);
                if(winner == PlayerName) winGame++;
            }catch(e){
                errorResultGame++;
            }
            console.clear()
            console.log(`Player Name: ${PlayerName}\nPlayed Game: ${playedGameNum}\nWin: ${winGame}\nLose: ${playedGameNum - winGame - errorResultGame}\nError: ${errorResultGame}`);
       }
    }, 5000);
})();

function waitX(x){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, x)
    })
}

function getPlayerName(x){
    return new Promise((resolve, reject) => {
        let checkInterval = setInterval(() => {
            console.log("Getting Player name...");
            let sm = SM;
            if(sm == null) return;
            if(sm.Player == null) return;
            if(sm.Player.name == null) return;
            clearInterval(checkInterval);
            return resolve(sm.Player.name);
        }, x)
    })
}

function battleButtonExists(){
    return document.getElementsByClassName("battle-btn").length > 0;
}

function waitUntilBattleButtonAndClick(x){
    return new Promise((resolve, reject) => {
        let checkInterval = setInterval(() => {
            console.log("Waiting Battle! Button...")
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

function getWinnerUsername(x){
    return new Promise((resolve, reject) => {
        let checkInterval = setInterval(() => {
            let result = document.getElementsByClassName("results-player winner");
            if(result == null) return;
            if(result.length < 1) return;
            if(result[0] == null) return;
            let children = result[0].children;
            clearInterval(checkInterval);

            for(var i = 0;i < children.length; i++){
                if(children[i].className != "results-name")continue;
                let name = children[i].innerHTML;
                if(name != null && name != ""){
                    return resolve(name.slice(1)); //Remove the '@' char
                }else{
                    return reject(); //No name in the div.
                }
            }

            return reject(); //Name div not found
        }, x)
    })
}