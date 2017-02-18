/**
 * Created by Mati on 2017-02-18.
 */
var defaultName = "gracz";
var defaultBackButton = "Wyjdź";

var translateElem = function(id,text){
    document.getElementById(id).innerHTML = text;
}

var translateBackButton = function(string){
    buttons = document.getElementsByClassName("back-button");
    for (i=0; i<buttons.length; i++)
    {
        buttons[i].innerHTML = string;
    }
}


var translate = function (lang){




    switch(lang){
        case "pl":
            defaultBackButton = "Wyjdź";
            defaultName = "Gracz";
            translateElem("new-game-button","Nowa gra");
            translateElem("settings-button","Ustawienia");
            translateElem("authors-button","Autorzy");
            translateElem("start-game-button","Graj!");
            translateElem("translators-label","Tłumaczenia: ");
            translateElem("number-of-field-label", "Ilość pól: ");
            break;

        case "en":
            defaultBackButton = "Exit";
            defaultName = "player";
            translateElem("new-game-button","New game");
            translateElem("settings-button","Settings");
            translateElem("authors-button","Authors");
            translateElem("start-game-button","Play!");
            translateElem("translators-label","Translations: ");
            translateElem("number-of-field-label", "Number of fields: ");
            break;



        case "de":
            defaultBackButton = "Verlassen";
            defaultName = "Spieler";
            translateElem("new-game-button","Neues Spiel");
            translateElem("settings-button","Einstellungen");
            translateElem("authors-button","Autoren");
            translateElem("start-game-button","spielen!");
            translateElem("translators-label","Übersetzungen: ");
            translateElem("number-of-field-label", "Anzahl der Felder: ");
            break;

        case "ru":
            defaultBackButton = "Выход";
            defaultName = "игрок";
            translateElem("new-game-button","Новая игра");
            translateElem("settings-button","настройки");
            translateElem("authors-button","Авторы");
            translateElem("start-game-button","Играть!");
            translateElem("translators-label","Переводы: ");
            translateElem("number-of-field-label", "Количество полей: ");
            break;

        case "uk":
            defaultBackButton = "ВХІД";
            defaultName = "гравець";
            translateElem("new-game-button","Нова гра");
            translateElem("settings-button","настройки");
            translateElem("authors-button","авторів");
            translateElem("start-game-button","Грати!");
            translateElem("translators-label","переклади: ");
            translateElem("number-of-field-label", "кількість полів: ");
            break;



        default:
            return;
            break;
    }


    translateBackButton(defaultBackButton);
}

