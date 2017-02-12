/**
 * Created by Mati on 2017-02-11.
 */


/* api url:
 http://alcoludo.elektrokom.com.pl/api/v1/get-available-languages
 http://alcoludo.elektrokom.com.pl/api/v1/get-tasks-with-translations
 */
var numberOfFields = 80;
var currentLanguage = "pl";
var numberOfPlayers = 2;
var maxNumberOfPlayers = 8;

var gameDiv;
var menuDiv;

var board = [];
var player = [];
var data = {};


var color = [
    "red",
    "yellow",
    "blue",
    "green",
    "aqua",
    "blueviolet"
]









data.getLanguages = function(){
    var r = new XMLHttpRequest();
    r.open("GET","http://alcoludo.elektrokom.com.pl/api/v1/get-available-languages", true);
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;
        data.languages = JSON.parse(r.response);
        data.getTasks();
    };
    r.send(null);
};


data.getTasks = function(){
    var r = new XMLHttpRequest();
    r.open("GET","http://alcoludo.elektrokom.com.pl/api/v1/get-tasks-with-translations", true);
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;
        var tasks = JSON.parse(r.response);
        console.log(tasks);
        splitTasksByLanguage(tasks);
    };
    r.send(null);
};


var splitTasksByLanguage = function(tasks){



    data.tasks = {};

    // Create an array for every language

    for (i=0; i<data.languages.languages.length; i++)
    {
        console.log(data.languages.languages[i].shortName);
        data.tasks[data.languages.languages[i].shortName] = [];
    }
    console.log(data);


    //Push tasks to arrays

    var len = tasks.translations.length;
    for (i=0; i<len; i++)
    {

        data.tasks[tasks.translations[i].language].push(tasks.translations[i]);

    }

    //console.log(data.tasks);

}

var initButtons = function(){
    document.getElementById("new-game-button").addEventListener('click', newGameButtonClickHandler, false);
    document.getElementById("add-player-button").addEventListener('click', addPlayerClickHandler, false);
    document.getElementById("remove-player-button").addEventListener('click', removePlayerClickHandler, false);
    document.getElementById("start-game-button").addEventListener('click', startGameClickHandler, false);



    var backButton = document.getElementsByClassName("back-button");
    for (i=0; i<backButton.length; i++)
    {
        backButton[i].addEventListener('click', backButtonClickHandler, false);
    }





}


window.onload = function(){
    initButtons();
    initPlayers();
    updateCreatePlayers();
    data.getLanguages();
    displaySection("main-menu");

}




var initGame = function(){

    //clear board from previous game:

    var myNode = document.getElementById("game-board");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    };


    //Start tile
    div = document.createElement("div");
    div.className+="tile start-tile";
    var a = document.createElement("a");
    a.text = "start";
    div.appendChild(a);
    document.getElementById("game-board").appendChild(div);


    for (i=0; i<numberOfFields; i++)
    {
        var tile = new Object();
        //add task to tile
        var temp = Math.floor((Math.random()*data.tasks[currentLanguage].length));
        tile.task =  data.tasks[currentLanguage][temp];
        board.push(tile);
        //add div to tile
        tile.div = document.createElement("div");
        document.getElementById("game-board").appendChild(tile.div);
        var a = document.createElement("a");
        a.text = "nr "+(i+1);
        tile.div.appendChild(a);

        tile.div.className+="tile";
        tile.div.setAttribute("title",(i+1)+": "+tile.task.task);

    }


    //Finish tile
    div = document.createElement("div");
    div.className+="tile finish-tile";
    var a = document.createElement("a");
    a.text = "meta";
    div.appendChild(a);
    document.getElementById("game-board").appendChild(div);


    console.log(board);



}


var newGameButtonClickHandler = function(){
    initGame();
    displaySection("create-players");
};


var initPlayers = function(){
    var container = document.getElementById("players-container");
    for (i=0; i<maxNumberOfPlayers; i++)
    {
        player[i] = new Object();
        player[i].name = "Gracz "+(i+1);

        div = document.createElement("div");
        input = document.createElement("input");
        input.type = "text";
        input.defaultValue = "Gracz "+(i+1);
        div.appendChild(input);
        div.className+="div-add-player";
        container.appendChild(div);
    }
}



var displaySection = function(id){
    for (i=0; i<document.body.children.length; i++)
    {
        document.body.children[i].style.display = "none";
    }
    document.getElementById(id).style.display = "block";
}




var backButtonClickHandler = function(){
    displaySection("main-menu");

};


var updateCreatePlayers = function(){

    var children = document.getElementsByClassName("div-add-player");

    for (i=0; i<maxNumberOfPlayers; i++)
    {
        if (i<numberOfPlayers)
            children[i].style.display = "block";
        else
            children[i].style.display = "none";

    }

    document.getElementById("number-of-players-text").innerHTML = numberOfPlayers;

    
}




var addPlayerClickHandler = function(){
    if (numberOfPlayers>=maxNumberOfPlayers) return;
    console.log("add player");
    numberOfPlayers++;
    updateCreatePlayers();
};

var removePlayerClickHandler = function(){
    if (numberOfPlayers <3) return;
    console.log("remove player");
    numberOfPlayers--;
    updateCreatePlayers();
};


var startGameClickHandler = function(){
    displaySection("game");
};


