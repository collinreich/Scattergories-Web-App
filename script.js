const firebaseConfig = {
  apiKey: "AIzaSyCJo6UuFTI9M-813L0BHIN-0kDbTfzPdR0",
  authDomain: "cpeg470-scattegories-a4955.firebaseapp.com",
  databaseURL: "https://cpeg470-scattegories-a4955.firebaseio.com",
  projectId: "cpeg470-scattegories-a4955",
  storageBucket: "cpeg470-scattegories-a4955.appspot.com",
  messagingSenderId: "372518034210",
  appId: "1:372518034210:web:fceb7dbe02673231cb637b",
};

firebase.initializeApp(firebaseConfig);
const myDatabase = firebase.database();

//Initialize the gameRunnin ref to be false
myDatabase.ref("gameRunning").set(false);

const categoriesRef = myDatabase.ref("categories");

//Initialize the input fields to be disabled
var categoriesInputs = document.querySelectorAll(".categoriesInput");
for (let i = 0; i < categoriesInputs.length; i++) {
  categoriesInputs[i].disabled = true;
}

//Helper function just to disable / enable the input fields for categories
function changeCategoriesInputs() {
  for (let i = 0; i < categoriesInputs.length; i++) {
    categoriesInputs[i].disabled = !categoriesInputs[i].disabled;
  }
}

//Helper function that clears input fields for categories
function clearCategoriesInputs() {
  for (let i = 0; i < categoriesInputs.length; i++) {
    categoriesInputs[i].value = "";
  }
}

//Generates a new random list of 10 categories
function genNewList() {
  categoriesRef.once("value", function (dataSnapshot) {
    let allCategories = dataSnapshot.val();
    let randomCategoriesSet = document.querySelector(".categoriesList");
    randomCategoriesSet.innerHTML = "";
    let randomIdx;
    let categoryElement;
    for (let i = 0; i < 10; i++) {
      randomIdx = Math.round(Math.random() * 143);
      categoryElement =
        "<li class='category'>" + allCategories[randomIdx] + "</li>";
      randomCategoriesSet.innerHTML += categoryElement;
    }
  });
}

//Generates a random new letter
function genNewLetter() {
  let alphabet = "ABCDEFGHIJKLMNOPRSTW";
  let idx = Math.round(Math.random() * (alphabet.length - 1));
  let letter = alphabet[idx];
  document.querySelector(".theLetter").textContent = letter;
}

//Starts the timer, and handles what happens when the timer stops
function startTimer() {
  //var timeLeft = document.querySelector('.theTimer').innerHTML;
  var timeLeft = 120;
  let timerFunction = setInterval(function () {
    if (timeLeft <= 0) {
      myDatabase.ref("gameRunning").set(false);
      changeCategoriesInputs();
      clearInterval(timerFunction);
    }
    document.querySelector(".theTimer").textContent = timeLeft;
    timeLeft = timeLeft - 1;
  }, 1000);
}

//Helper funciton - will disable the start button when the game is running
myDatabase.ref("gameRunning").on("value", function (dataSnapshot) {
  let isRunning = dataSnapshot.val();
  if (isRunning === true) {
    document.getElementById("startBtn").disabled = true;
  }
  if (isRunning === false) {
    document.getElementById("startBtn").disabled = false;
  }
});

document.getElementById("startBtn").addEventListener("click", function (event) {
  myDatabase.ref("gameRunning").set(true);
  changeCategoriesInputs();
  clearCategoriesInputs();
  genNewList();
  genNewLetter();
  startTimer();
});

let gameDemo = {
  "created" : "2020-10-02T12:49:00.000Z",
  "gameRunning" : false,
  "maxPlayers" : 5,
  "playerCount" : 1,
  "players" : {
      "player1IdHere" : {
          "userID" : 1564861535486,
          "screenName" : "Collin",
          "isReady" : false,
          "answers" : [],
          "currentScore" : 0
      }
  },
  "status" : "Waiting 1/5",
};

class LobbyGame {
  constructor(gameJSON){
    this.updateFromJSON(gameJSON);
  }

  updateFromJSON(gameJSON){

    if(gameJSON == undefined){
      this.gameID = Math.floor(Math.random()*100000);
      this.created = new Date().toLocaleString();
      this.gameRunning = false;
      this.maxPlayers = 5;
      this.players = {};
      this.playerCount = Object.keys(this.players).length;
      this.status = "Waiting " + Object.keys(this.players).length + "/" + this.maxPlayers;
    }
    else{
      this.gameID = gameJSON.gameID || Math.floor(Math.random()*100000);
      this.created = gameJSON.created || new Date().toLocaleString();
      this.gameRunning = gameJSON.gameRunning || false;
      this.maxPlayers = gameJSON.maxPlayers || 5;
      this.players = gameJSON.players || {};
      this.playerCount = gameJSON.playerCount || Object.keys(this.players).length;
      this.status = gameJSON.status || "Waiting " + Object.keys(this.players).length + "/" + this.maxPlayers;
    }
    this.render();
    
  };

  toJSON(){
    let gameObj = {};
    gameObj.gameID = this.gameID;
    gameObj.created = this.created;
    gameObj.gameRunning = this.gameRunning;
    gameObj.maxPlayers = this.maxPlayers;
    gameObj.playerCount = this.playerCount;
    gameObj.players = this.players;
    gameObj.status = this.status;
    return gameObj;
  };

  //Sets all the necessary CSS for the game screen
  addLobbyCSS(){
    let lobbyStyle = document.querySelector(".lobby").style;
    lobbyStyle.height = "100vh";
    lobbyStyle.margin = "0";
    lobbyStyle.display = "grid";
    lobbyStyle.gridTemplateColumns = "auto 25% 25%";
    lobbyStyle.gridTemplateRows = "auto 30% 30% 30%";
    lobbyStyle.gridTemplateAreas = ' "header header header" "categories letter controls" "categories timer controls" "categories leaderboard controls"';
    lobbyStyle.border = "solid black 1px";
  }

  //Removes all the CSS for the game screen
  removeLobbyCSS(){
    let lobbyStyle = document.querySelector(".lobby").style;
    lobbyStyle.height = "";
    lobbyStyle.margin = "";
    lobbyStyle.display = "none";
    lobbyStyle.gridTemplateColumns = "";
    lobbyStyle.gridTemplateRows = "";
    lobbyStyle.gridTemplateAreas = "";
    lobbyStyle.border = "";
  }
  
  //Renders a game screen when joining a game
  render(){ //TODO: check for zombie click listeners
    document.getElementById("gameIdLabel").innerHTML = "Game ID: " + this.gameID;
    this.addLobbyCSS();
    document.querySelector(".startScreen").style.display = "none";
  }

}

/*
let aGame = new LobbyGame(gameDemo);
console.log(JSON.stringify(aGame.toJSON()));
*/

let joinGameBtn = document.getElementById("joinGameBtn");
let createGameBtn = document.getElementById("createGameBtn");
let leaveGameBtn = document.getElementById("leaveBtn");
let userNameTextBox = document.querySelector(".screenNameText");


function handleGameIdPrompt(givenGameId){
  myDatabase.ref("games").once("value", function(dataSnapshot){
    let ssVal = dataSnapshot.val();
    let games = Object.values(ssVal);
    console.log(games);
    for(let i = 0; i < Object.keys(games).length; i++){
      let currentGameId = games[i].gameID;
      if(givenGameId == currentGameId){
        console.log("true");
        return true;
      }
    }
    console.log("false");
    return false;
  });
}

//Click listener for join game button, should render game screen and remove start screen
joinGameBtn.addEventListener("click", function(event){
  let givenGameId = prompt("Please enter the ID of the game you want to join:");
  handleGameIdPrompt(givenGameId);
  //aGame.render();
  document.querySelector(".startScreen").style.display = "none";
});

//Click listener for create game button, should create a new game object and add it to database and render game screen
createGameBtn.addEventListener("click", function(event){
  console.log("click recieved");
  let newGame = new LobbyGame();
  console.log(JSON.stringify(newGame.toJSON()));
  myDatabase.ref("games").push(newGame);
});

//Click listener for leave game button, should render start screen and remove game screen
leaveGameBtn.addEventListener("click", function(event){
  //aGame.removeLobbyCSS();
  document.querySelector(".startScreen").style.display = "block";
});

//Enables and disables the create game and join game button base on if there is current user input or not
//Commented out for faster debugging:
/*
userNameTextBox.addEventListener("blur" , function(event){
  let userName = userNameTextBox.value;
  if(userName === ""){
    joinGameBtn.disabled = true;
    createGameBtn.disabled = true;
  }
  else{
    joinGameBtn.disabled = false;
    createGameBtn.disabled = false;
  }
});
*/

joinGameBtn.disabled = false;
createGameBtn.disabled = false;