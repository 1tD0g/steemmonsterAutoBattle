// ==UserScript==
// @name         SteemMonster Auto Battler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Battle in Steem Monster automatically
// @author       1tD0g
// @match        https://steemmonsters.com/
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @grant        none
// ==/UserScript==
const statDiv = "currentScriptStatDiv";
const mainDivUsernameDiv = "scriptUsernameDiv"
const statusDiv = "currentScriptStatusDiv";
const mainDiv = "scriptDiv";
const mainDivHeight = 290;
const mainDivWidth = 300;

const ownDiv = `
<div id="${mainDiv}" style="left: 0px; top: 0px; z-index: 9999999999; width: ${mainDivWidth}px; height: ${mainDivHeight}px; position:fixed; background-color: black; border: 2px solid white; color: white">
    <center>
        <p style="color: red">Steemmonster Auto Battler v1.0</p><span>Author: itD0g</span><hr>
    </center>
</div>`;

let PlayerName = "";
let playedGameNum = 0;
let winGame = 0;
let errorResultGame = 0;
let running = false;

(async function() {
    'use strict';

    $("body").append(ownDiv);
    $(`#${mainDiv}`).append(`<p id="${mainDivUsernameDiv}">Username: ${PlayerName}</p><span id="${statDiv}"></span><hr><span id="${statusDiv}"></span>`);
    updateStatDiv();
    $(`#${mainDiv}`).draggable();

    PlayerName = await getPlayerName(200);
    $(`#${mainDivUsernameDiv}`).html(`Username: ${PlayerName}`);

    updateStatusDiv("Starting Script...");
    
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

            updateStatDiv();    
        }
    }, 5000);
})();

function waitX(x){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, x)
    })
}

function updateStatusDiv(txt){
    $(`#${statusDiv}`).html(`Status: <b>${txt}</b>`);
}

function updateStatDiv(){
    $(`#${statDiv}`).html(`Played Game: <b>${playedGameNum}</b><br>Win: <b>${winGame}</b><br>Lose: <b>${playedGameNum - winGame - errorResultGame}</b><br>Error: <b>${errorResultGame}</b>`);
}

function getPlayerName(x){
    return new Promise((resolve, reject) => {
        let checkInterval = setInterval(() => {
            updateStatusDiv("Getting Player name...");
            let sm = SM;
            if(sm == null) return;
            if(sm.Player == null) return;
            if(sm.Player.name == null) return;
            updateStatusDiv("Got Player name !");
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
            updateStatusDiv("Waiting Battle Button...")
            let battleButtons = document.getElementsByClassName("battle-btn");
            if(battleButtons == null) return;
            if(battleButtons.length < 1) return;
            if(battleButtons[0] == null) return;
            clearInterval(checkInterval);
            updateStatusDiv("Battle Button Clicked !")
            battleButtons[0].click();
            return resolve();
        }, x)
    })
}

function waitUntilBattleOpponentFound(x){
    return new Promise((resolve, reject) => {
        let intervv = setInterval(() => {
            updateStatusDiv("Waiting Opponent...");
            let dialog = document.getElementById("find_opponent_dialog");
            if(dialog != null && dialog.style.display == "none"){
                updateStatusDiv("Opponent Found !")
                clearInterval(intervv);
                return resolve();
            }
        }, x)
    })
}

function waitUntilBattleAgainAndClick(x){
    return new Promise((resolve, reject) => {
        let checkInterval = setInterval(() => {
            updateStatusDiv("Waiting Battle Again Button...")
            let battleAgain = document.getElementById("btn_again");
            if(battleAgain == null) return;
            clearInterval(checkInterval);
            updateStatusDiv("Battle Again...")
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
