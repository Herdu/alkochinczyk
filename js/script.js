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
var numberOfFields = 30;
var currentLanguage = "pl";
var numberOfPlayers = 4;
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


data.getDataFromFile = function(){
    data.languages = JSON.parse(languagesJSON);
    data.tasks = JSON.parse(tasksJSON);
    splitTasksByLanguage(data.tasks);
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
        console.log(JSON.stringify(tasks));
        splitTasksByLanguage(tasks);
    };
    r.send(null);
};


var setLanguage = function(){

    currentLanguage = this.language;
    translate(currentLanguage);
    console.log("language set to: "+currentLanguage);
}

var splitTasksByLanguage = function(tasks){



    data.tasks = {};


    // Create an array and flag button for every language

    for (i=0; i<data.languages.languages.length; i++)
    {
        console.log(data.languages.languages[i].shortName);
        data.tasks[data.languages.languages[i].shortName] = [];


        var button = document.createElement("img");
        button.src = "resources/"+data.languages.languages[i].shortName+".png";
        button.language = data.languages.languages[i].shortName;
        button.addEventListener('click', setLanguage, false);

        document.getElementById("languages").appendChild(button);



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
    document.getElementById("settings-button").addEventListener('click', settingsClickHandler, false);
    document.getElementById("authors-button").addEventListener('click', authorsClickHandler, false);
    document.getElementById("exit-button").addEventListener('click', backButtonClickHandler, false);

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
    data.getDataFromFile();
    //data.getLanguages();
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
    board = [];

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
        //tile.div.setAttribute("title",(i+1)+": "+tile.task.task);

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
    for (i=0; i<maxNumberOfPlayers; i++) {
        var input = document.getElementById("player-" + (i + 1));
        input.defaultValue = defaultName + " " + (i + 1);
    }
    displaySection("create-players");
};


var initPlayers = function(){
    var container = document.getElementById("players-container");
    
    for (i=0; i<maxNumberOfPlayers; i++)
    {


        player[i] = new Object();
        player[i].name = defaultName+" "+(i+1);
        player[i].position = 0; // start tile
        player[i].passTurn = false;


        //CREATE PLAYERS SUBMENU
        div = document.createElement("div");
        input = document.createElement("input");
        input.type = "text";
        input.defaultValue = defaultName+" "+(i+1);
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

    if (player[currentPlayer].passTurn)
    {
        player[currentPlayer].passTurn = false;
        currentPlayer = (currentPlayer++ +1)%numberOfPlayers;
    }

}



var move = function(player, field){


    document.getElementById("game-board").children[field].appendChild(player.icon);
    player.position = field;


    //color fields

    var children =  document.getElementById("game-board").children;
    for (i=1; i<=numberOfFields; i++)
    {
        if (children[i].children.length < 2)
            children[i].style.backgroundColor = "#e3eced";
        else
            children[i].style.backgroundColor = "#fff8b7";

    }




}




var findNearest = function(){

    var nearest = numberOfFields;
    var string = "(";

    for (i=0; i<numberOfPlayers; i++)
    {
        if (i=== currentPlayer) continue;


        if (Math.abs(player[i].position - player[currentPlayer].position) < nearest)
        {
            nearest = Math.abs(player[i].position - player[currentPlayer].position);
        }

    }

    for (i=0; i<numberOfPlayers; i++)
    {
        if (i=== currentPlayer) continue;

        if (Math.abs(player[i].position - player[currentPlayer].position) === nearest)

            string+=player[i].name + ", ";


    }

    string = string.slice(0, string.length-2);
    string+=")";

    document.getElementById("task-text").innerHTML += "<h2"+">"+string + "</h2"+">";



}

var findFarthest = function(){


    var farthest = 0;
    var string = "(";

    for (i=0; i<numberOfPlayers; i++)
    {
        if (i=== currentPlayer) continue;


        if (Math.abs(player[i].position - player[currentPlayer].position) > farthest)
        {
            farthest = Math.abs(player[i].position - player[currentPlayer].position);
        }

    }

    for (i=0; i<numberOfPlayers; i++)
    {
        if (i=== currentPlayer) continue;

        if (Math.abs(player[i].position - player[currentPlayer].position) === farthest)

            string+=player[i].name + ", ";


    }

    string = string.slice(0, string.length-2);
    string+=")";

    document.getElementById("task-text").innerHTML += "<h2"+">"+string + "</h2"+">";

}


var findFarthestFromFinish = function(){
    console.log("finding");
    var farthest = numberOfFields+2;
    var string = "(";

    for (i=0; i<numberOfPlayers; i++)
    {
        if (player[i].position < farthest)
        {
            farthest = player[i].position;
        }

    }

    for (i=0; i<numberOfPlayers; i++){
        if (player[i].position === farthest)
            string+=player[i].name + ", ";
    }
    string = string.slice(0, string.length-2);
    string+=")";


    document.getElementById("task-text").innerHTML += "<h2"+">"+string + "</h2"+">";

}





var findPlayer = function(actionData){

    switch(actionData){
        case "nearest":
            findNearest();
            break;
        case "farthest":
            findFarthest();
            break;
        case "farthestFromFinish":
            findFarthestFromFinish();
            break;
    }

}


var displayDice = function(roll){
    var dice = document.getElementsByClassName("dice");
    for (i=0; i<dice.length; i++)
        dice[i].style.display = "none";

    document.getElementById(roll+"dice").style.display = "block";

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

    if (player[currentPlayer].position > numberOfFields)
    {
        endOfGame(player[currentPlayer]);
    }

    document.getElementById("task-text").innerHTML ="#"+player[currentPlayer].position +":  "+board[player[currentPlayer].position].task.task;

    move(player[currentPlayer], player[currentPlayer].position);



    var actionData  = board[player[currentPlayer].position].task.actionData;
    var actionId = board[player[currentPlayer].position].task.actionId;




    if (actionId != null)
        doSpecialTask(actionId,actionData);








    displayDice(roll);


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

            break;


        case "everyoneGoBack":
            for (i=0; i<player.length; i++)
                goBack(player[i],1);

            break;

        case "goBack":
            goBack(player[currentPlayer],Number(actionData));
            break;

        case "timer":
            setTimer(player[currentPlayer], actionData);
            break;
        case "chooseGoTo":
            chooseGoTo(actionData);
            break;
        case "passTurn":
            player[currentPlayer].passTurn = true;
            break;

        case "findPlayer":
            findPlayer(actionData);
            break;
        case "swapPlaces":
            swapPlaces();
            break;



    };


}


var swapPlaces = function() {



    var farthestPlayerId = null;
    var farthestPlayerPosition = -1;
    for (i = 0; i < numberOfPlayers; i++) {

        if (player[i].position > farthestPlayerPosition) {
            farthestPlayerPosition = player[i].position;
            farthestPlayerId = i;

        }
    }


        var string =  "<h2"+">"+"("+player[farthestPlayerId].name+")"+"</h2"+">";
        document.getElementById("task-text").innerHTML += string;

        move(player[farthestPlayerId], player[currentPlayer].position);
            move(player[currentPlayer], farthestPlayerPosition);





}



//** CHOOSE_GO_TO TASK

var chooseGoToEventHandler = function(){
    console.log(this.actionData);
    console.log("it's happening!: "+this.playerId);

    move(player[this.playerId], Number(this.actionData));
    document.getElementById("task-close-button").disabled = false;
    document.getElementById("choose-player").style.display = "none";
}

var chooseGoToEventAssign = function(elem,actionData,i){
    elem.actionData = actionData;
    elem.playerId = i;
    elem.addEventListener('click', chooseGoToEventHandler, false);
}

var chooseGoTo = function(actionData){
    document.getElementById("task-close-button").disabled = true;
    var div = document.getElementById("choose-player");
    div.style.display = "inline-block";


    while (div.firstChild) {
        div.removeChild(div.firstChild);
    };


    for (i=0; i<numberOfPlayers; i++){
        if (i!=currentPlayer)
        {
            var playerIcon = player[i].icon.cloneNode(true);
            playerIcon.style.display = "inline-block";
            div.appendChild(playerIcon);
            chooseGoToEventAssign(playerIcon,actionData,i);
        }

    }


}


//*=========================================================




var endOfGame = function(player){
    document.getElementById("winner").innerHTML = player.name;
    displaySection("end-of-game");
}
















var settingsClickHandler = function(){
    console.log("settings");
    displaySection("settings");
}

var authorsClickHandler = function(){
    console.log("authors");
    displaySection("authors");
}





var setTimer = function(player, time){

    var minutes = Number(time);

    console.log(player.name + " waits " + minutes + " minutes");

    var timer = document.createElement("div");
    timer.className+="timer";


    var p = document.createElement("p");
    p.innerHTML = player.name;


    var timeLeft = document.createElement("p");
    timeLeft.minutesLeft = minutes;
    timeLeft.className+="time-left";
    timeLeft.innerHTML = timeLeft.minutesLeft + "min";


    timer.appendChild(p);



    var i = document.createElement("i");
    i.className += "fa fa-clock-o timer-icon";
    i.setAttribute("arria-hidden","true");
    timer.appendChild(i);



    timer.appendChild(timeLeft);

    document.getElementById("timer-container").appendChild(timer);

    var updateTime = function(){
        timeLeft.minutesLeft--;
        timeLeft.innerHTML = timeLeft.minutesLeft + "min";
        if (timeLeft.minutesLeft > 0)
            setTimeout(updateTime,1000*60);
    }

    setTimeout(updateTime, 60*1000);

    setTimeout(function(){
        document.getElementById("timer-container").removeChild(timer);
        console.log(timers.toString());
    }, minutes*60*1000);

}
























