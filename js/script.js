/**
 * Created by Mati on 2017-02-11.
 */


/* api url:
 http://alcoludo.elektrokom.com.pl/api/v1/get-available-languages
 http://alcoludo.elektrokom.com.pl/api/v1/get-tasks-with-translations
 */
var numberOfFields = 80;
var currentLanguage = "pl";

var gameDiv;
var menuDiv;

var board = [];


var data = {};


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
        menuDiv.style.display="block";
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




window.onload = function(){

    menuDiv = document.getElementById("main-menu");
    gameDiv = document.getElementById("game");

    gameDiv.style.display="none";
    menuDiv.style.display="none";

    data.getLanguages();

    document.getElementById("new-game-button").addEventListener('click', newGameButtonClickHandler, false);
    document.getElementById("back-button").addEventListener('click', backButtonClickHandler, false);

}




var initGame = function(){

    //clear board from previous game:

    var myNode = document.getElementById("game-board");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    };


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

        tile.div.className+="Tile";
        tile.div.setAttribute("title",(i+1)+": "+tile.task.task);

    }


    console.log(board);



}




var newGameButtonClickHandler = function(){
    gameDiv.style.display = "block";
    menuDiv.style.display = "none";

    initGame();
};

var backButtonClickHandler = function(){
    gameDiv.style.display = "none";
    menuDiv.style.display = "block";
};



