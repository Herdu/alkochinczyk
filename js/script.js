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
var roll = 0;

var board = [];
var player = [];
var data = {};



var customColor = [
    "15d33e", //green
    "0012cb", //blue
    "e88c29", //orange
    "c529b1", //purple
    "ff001b", //red
    "ccda1f", //yellow
    "69e6b0", //aqua
    "7c3600"  //brown
]



var goBack = function(player, num ){
    player.position -= num;
    if (player.position  <0) player.position  = 0;
    move(player, player.position);

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
    document.getElementById("exit-button").addEventListener('click', backButtonClickHandler, false);

    var backButton = document.getElementsByClassName("back-button");
    for (i=0; i<backButton.length; i++)
    {
        backButton[i].addEventListener('click', backButtonClickHandler, false);
    }





}


window.onload = function(){

    if (detectMob())
        console.log("mobile");


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

        player[i].icon.style.backgroundColor = document.getElementById("player-"+(i+1)+"-color").style.backgroundColor;
        player[i].icon.style.color = document.getElementById("player-"+(i+1)+"-color").style.color;



    }


    //clear data from previous game:

    var myNode = document.getElementById("game-board");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    };

    for (i=0; i<player.length; i++)
    {
        player[i].position = 0;
    }


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
        a.text = "#"+(i+1);
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



    document.getElementById("current-player").innerHTML = player[currentPlayer].name;



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




        var colorButton = document.createElement("button");
        colorButton.className = "player-color jscolor {valueElement:null,value:'"+customColor[i]+"'}";
        colorButton.id = "player-"+(i+1)+"-color";


        //addEventListener('onFineChange', updateColor(i), false);

        colorButton.style.backgroundColor = customColor[i];
        div.appendChild(colorButton);


        div.appendChild(input);
        div.className+="div-add-player";
        container.appendChild(div);

        //PLAYERS ON GAME-BOARD

        player[i].icon = document.createElement("div");
        player[i].icon.className+="player-icon";
    }



    // add script dynamically
    var my_awesome_script = document.createElement('script');
    my_awesome_script.setAttribute('src','js/jscolor.js');
    document.head.appendChild(my_awesome_script);

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
}



var move = function(player, field){
    document.getElementById("game-board").children[field].appendChild(player.icon);
}




var findPlayer = function(actionData){

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




    //color fields

    var children =  document.getElementById("game-board").children;
    for (i=1; i<=numberOfFields; i++)
    {
        if (children[i].children.length < 2)
            children[i].style.backgroundColor = "white";
        else
            children[i].style.backgroundColor = "#fff8b7";

    }




    document.getElementById("dice").src = "resources/"+roll+"dice.png";
    //document.getElementById("move-result").innerHTML = player[currentPlayer].name+" przechodzi na pole o numerze "+player[currentPlayer].position;

    updateGame();
    document.getElementById("task-window").style.display = "block";

};

var taskCloseClickHandler = function(){

    document.getElementById("task-window").style.display = "none";
    document.getElementById("current-player").innerHTML = player[currentPlayer].name;
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
                goBack(player[i],1);

            break;

        case "goBack":
            goBack(player[currentPlayer],Number(actionData));
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

        case "findPlayer":
                findPlayer(actionData);
            break;



    };


}




function detectMob() {
    if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ){
        return true;
    }
    else {
        return false;
    }
}



















