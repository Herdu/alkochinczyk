/**
 * Created by Mati on 2017-02-11.
 */

/**
 * https://bitbucket.org/Agred/alcoludo

 https://play.google.com/store/apps/details?id=com.agred.alcoludo
 branch master to android. PHP to PHP, czyli część serwerowa xD
 i nasz backend

 http://alcoludo.elektrokom.com.pl/login
 */



/* api url:
 http://alcoludo.elektrokom.com.pl/api/v1/get-available-languages
 http://alcoludo.elektrokom.com.pl/api/v1/get-tasks-with-translations
 */
var numberOfFields = 50;
var currentLanguage = "pl";
var numberOfPlayers = 2;
var maxNumberOfPlayers = 8;
var currentPlayer = 0;
var roll;

var board = [];
var player = [];
var data = {};


var customColor = [
    "red",
    "yellow",
    "blue",
    "green",
    "aqua",
    "blueviolet",
    "brown",
    "orange"
]



player.goBack = function( num ){
    this.position -= num;
    if (this.position  <0) this.position  = 0;
    move(this, this.position);

}





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
    document.getElementById("roll-button").addEventListener('click', rollClickHandler, false);
    document.getElementById("task-close-button").addEventListener('click', taskCloseClickHandler, false);
    document.getElementById("config-button").addEventListener('click', configClickHandler, false);
    document.getElementById("authors-button").addEventListener('click', authorsClickHandler, false);

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

    //give players their names and colors :

    for (i=0; i<player.length; i++)
    {
        var string = document.getElementById("player-"+(i+1)).value;
        if (string!== "")
            player[i].name = string;

    }





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


    //get number of fields from settings

    var temp = document.getElementById("field-input").value;
    if (isNaN(Number(temp)))
        numberOfFields = 50;
    else
        numberOfFields = Math.floor(Number(temp));



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

    //put players at start
    for (i=0; i<maxNumberOfPlayers; i++)
    {
        document.getElementsByClassName("start-tile")[0].appendChild(player[i].icon);
        player[i].icon.innerHTML = player[i].name;

        if (i<numberOfPlayers)
            player[i].icon.style.display="block";
        else
            player[i].icon.style.display="none";
    }



    document.getElementById("current-player").innerHTML = "Teraz rzuca "+player[currentPlayer].name;



    console.log(board);



}


var newGameButtonClickHandler = function(){
    displaySection("create-players");
};


var initPlayers = function(){
    var container = document.getElementById("players-container");
    
    for (i=0; i<maxNumberOfPlayers; i++)
    {


        player[i] = new Object();
        player[i].name = "Gracz "+(i+1);
        player[i].position = 0; // start tile


        //CREATE PLAYERS SUBMENU
        div = document.createElement("div");
        input = document.createElement("input");
        input.type = "text";
        input.defaultValue = "Gracz "+(i+1);
        input.id = "player-"+(i+1);


        var color = document.createElement("div");
        color.id = "player-"+(i+1)+"-color";
        color.className+="player-color";

        color.style.backgroundColor = customColor[i];

        div.appendChild(input);
        div.appendChild(color);
        div.className+="div-add-player";
        container.appendChild(div);

        //PLAYERS ON GAME-BOARD

        player[i].icon = document.createElement("div");
        player[i].icon.className+="player-icon";
    }





}



var displaySection = function(id){
    for (i=0; i<document.body.children.length; i++)
    {
        document.body.children[i].style.display = "none";
    }
    document.getElementById(id).style.display = "block";
}







var updateCreatePlayers = function(){

    var children = document.getElementsByClassName("div-add-player");

    for (i=0; i<maxNumberOfPlayers; i++)
    {
        if (i<numberOfPlayers)
            children[i].style.display = "block";
        else
            children[i].style.display = "none";

    }



    
}




var updateGame = function(){
    currentPlayer = (currentPlayer++ +1)%numberOfPlayers;
    document.getElementById("current-player").innerHTML = "Teraz rzuca "+player[currentPlayer].name;
}



var move = function(player, field){
    document.getElementById("game-board").children[field].appendChild(player.icon);
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
    initGame();
    displaySection("game");
};

var backButtonClickHandler = function(){
    displaySection("main-menu");

};



var rollClickHandler = function(){

    roll = Math.floor(Math.random()*6)+1;
    console.log("roll: "+roll);
    
    player[currentPlayer].position += roll;
    document.getElementById("task-text").innerHTML ="#"+player[currentPlayer].position +":  "+board[player[currentPlayer].position].task.task;

    move(player[currentPlayer], player[currentPlayer].position);


    var actionData  = board[player[currentPlayer].position].task.actionData;
    var actionId = board[player[currentPlayer].position].task.actionId;
    if (actionId != null)
        doSpecialTask(actionId,actionData);





    var string = player[currentPlayer].name+" wyrzucił "+roll;
    switch(roll){
        case 1:
            string+=" oczko.";
            break;
        case 2:
        case 3:
        case 4:
            string+=" oczka.";
            break;
        case 5:
        case 6:
            string+=" oczek!";
    }



    document.getElementById("roll-result").innerHTML = string;
    document.getElementById("move-result").innerHTML = player[currentPlayer].name+" przechodzi na pole o numerze "+player[currentPlayer].position;
    
    
    document.getElementById("task-window").style.display = "block";

};

var taskCloseClickHandler = function(){
    document.getElementById("task-window").style.display = "none";
    updateGame();
};



var doSpecialTask = function(actionId, actionData){

    console.log("special task: "+actionId+"  "+actionData);
    switch(actionId)
    {
        case "goTo":
            var field;
            if (actionData === "start") field=0;
            else
                field = Number(actionData);

            move(player[currentPlayer],field);
            player[currentPlayer].position = field;
            break;




        case "everyoneGoBack":
            for (i=0; i<player.length; i++)
                player.goBack(1);
            break;

        case "goBack":
            player[currentPlayer].goBack(Number(actionData));
            break;

        case "timer":
            //TODO
            break;
        case "chooseGoTo":
            //TODO
            break;
        case "passTurn":
            //TODO
            break;

        // and about 4 more cases TODO



    };


}

