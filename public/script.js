const firebaseConfig = {
  apiKey: "AIzaSyCJo6UuFTI9M-813L0BHIN-0kDbTfzPdR0",
  authDomain: "cpeg470-scattegories-a4955.firebaseapp.com",
  databaseURL: "https://cpeg470-scattegories-a4955.firebaseio.com",
  projectId: "cpeg470-scattegories-a4955",
  storageBucket: "cpeg470-scattegories-a4955.appspot.com",
  messagingSenderId: "372518034210",
  appId: "1:372518034210:web:fceb7dbe02673231cb637b",
};

let $gameScreenHTML = $(`
<div class="lobby">
  <header class="bg-primary text-white header">
    <h1 class="m-3">Scattegories Party Game</h1>
  </header>
  <section class="categories bg-dark">
    <h3 class="ml-2 mt-1 text-white">Categories</h3>
    <ol class="categoriesList"></ol>
    <div class="ml-4 categoriesAnswers">
      <div class="categoriesCol1">
        <input
          type="text"
          class="categoriesInput form-text"
          id="answer1"
          placeholder="Question 1"
        />
        <input
          type="text"
          class="categoriesInput form-text"
          id="answer2"
          placeholder="Question 2"
        />
        <input
          type="text"
          class="categoriesInput form-text"
          id="answer3"
          placeholder="Question 3"
        />
        <input
          type="text"
          class="categoriesInput form-text"
          id="answer4"
          placeholder="Question 4"
        />
        <input
          type="text"
          class="categoriesInput form-text"
          id="answer5"
          placeholder="Question 5"
        />
      </div>
      <div class="categoriesCol2">
        <input
          type="text"
          class="categoriesInput form-text"
          id="answer6"
          placeholder="Question 6"
        />
        <input
          type="text"
          class="categoriesInput form-text"
          id="answer7"
          placeholder="Question 7"
        />
        <input
          type="text"
          class="categoriesInput form-text"
          id="answer8"
          placeholder="Question 8"
        />
        <input
          type="text"
          class="categoriesInput form-text"
          id="answer9"
          placeholder="Question 9"
        />
        <input
          type="text"
          class="categoriesInput form-text"
          id="answer10"
          placeholder="Question 10"
        />
      </div>
    </div>
  </section>
  <section class="bg-dark text-white letter">
    <h3 class="ml-2">Letter</h3>
    <div class="letterWrapper">
      <span class="theLetter text-primary"></span>
    </div>
  </section>
  <section class="bg-dark text-white timer">
    <h3 class="ml-2">Timer</h3>
    <div class="timerWrapper">
      <span class="theTimer text-primary"></span>
    </div>
  </section>
  <section class="bg-dark text-white leaderboard">
    <h3 class="ml-2">Leaderboard</h3>
    <p class="ml-3 text-white">(Coming soon)</p>
  </section>
  <section class="controls bg-dark">
    <div class="controlWrapper">
      <h4 class="text-center text-white font-weight-bold text-lg" id="gameIdLabel">Game ID: </h4>
      <button class="btn btn-outline-light btn-lg mt-4" id="startBtn">
        Start Game
      </button>
      <button class="btn btn-outline-light btn-lg mt-4" id="leaveBtn">
        Leave Game
      </button>
    </div>
  </section>
</div>
`);

firebase.initializeApp(firebaseConfig);
const myDatabase = firebase.database();
const gamesRef = myDatabase.ref("games");
const categoriesRef = myDatabase.ref("categories");

class GameState {
  constructor(gameJSON){
    this.updateFromJSON(gameJSON);
    console.log(this.gameID);
  }

  updateFromJSON(gameJSON){

    if(gameJSON == undefined){
      this.gameID = Math.floor(Math.random() * (999999 - 100000) + 100000);
      this.gameRunning = false;
      this.players = {};
      this.playerCount = Object.keys(this.players).length;
      this.currentCategories = [];
      this.currentLetter = null;
      this.timeLeft = 10;
    }
    else{
      this.gameID = gameJSON.gameID
      this.gameRunning = gameJSON.gameRunning;
      this.players = gameJSON.players;
      this.playerCount = gameJSON.playerCount;
      this.currentCategories = gameJSON.currentCategories;
      this.currentLetter = gameJSON.currentLetter;
      this.timeLeft = gameJSON.timeLeft;
    }
    this.render();
  };

  toJSON(){
    let gameObj = {};
    gameObj.gameID = this.gameID;
    gameObj.gameRunning = this.gameRunning;
    gameObj.players = this.players;
    gameObj.playerCount = this.playerCount;
    gameObj.currentCategories = this.currentCategories;
    gameObj.currentLetter = this.currentLetter;
    gameObj.timeLeft = this.timeLeft;
    return gameObj;
  };

  //Sets all the necessary CSS for the game screen
  addLobbyCSS(){
    let $lobbyStyle = $("body").find(".lobby");
    $lobbyStyle.css("height", "100vh");
    $lobbyStyle.css("margin", "0");
    $lobbyStyle.css("display", "grid");
    $lobbyStyle.css("gridTemplateColumns", "auto 25% 25%");
    $lobbyStyle.css("gridTemplateRows", "auto 30% 30% 30%");
    $lobbyStyle.css("gridTemplateAreas", '"header header header" "categories letter controls" "categories timer controls" "categories leaderboard controls"');
    $lobbyStyle.css("border", "solid black 1px");

    $("body").find("header").css("gridArea", "header");
    $("body").find("header").css("border", "solid black 1px");

    $("body").find(".categories").css("gridArea", "categories");
    $("body").find(".categories").css("border", "solid black 1px");
    $("body").find(".categoriesAnswers").css("display", "flex");
    $("body").find(".categoriesAnswers").css("flexDirection", "row");
    $("body").find(".categoriesAnswers").css("justifyContent", "flexStart");
    $("body").find(".categoriesCol1").css("display", "flex");
    $("body").find(".categoriesCol1").css("flexDirection", "column");
    $("body").find(".categoriesCol1").css("justifyContent", "spaceEvenly");
    $("body").find(".categoriesCol1").css("padding", "5px");
    $("body").find(".categoriesCol2").css("display", "flex");
    $("body").find(".categoriesCol2").css("flexDirection", "column");
    $("body").find(".categoriesCol2").css("justifyContent", "spaceEvenly");
    $("body").find(".categoriesCol2").css("padding", "5px");
    $("body").find(".categoriesInput").css("margin", "5px 0px 0px 5px");

    $("body").find(".letter").css("gridArea", "letter");
    $("body").find(".letter").css("border", "solid black 1px");
    $("body").find(".letter").css("position", "relative");
    $("body").find(".letterWrapper").css("position", "absolute");
    $("body").find(".letterWrapper").css("top", "50%");
    $("body").find(".letterWrapper").css("left", "50%");
    $("body").find(".letterWrapper").css("transform", "translate(-50%,-50%");
    $("body").find(".theLetter").css("textAlign", "center");
    $("body").find(".theLetter").css("fontSize", "8em");

    $("body").find(".timer").css("gridArea", "timer");
    $("body").find(".timer").css("border", "solid black 1px");
    $("body").find(".timer").css("position", "relative");
    $("body").find(".timerWrapper").css("position", "absolute");
    $("body").find(".timerWrapper").css("top", "50%");
    $("body").find(".timerWrapper").css("left", "50%");
    $("body").find(".timerWrapper").css("transform", "translate(-50%,-50%");
    $("body").find(".theTimer").css("textAlign", "center");
    $("body").find(".theTimer").css("fontSize", "5.5em");

    $("body").find(".leaderboard").css("gridArea", "leaderboard");
    $("body").find(".leaderboard").css("border", "solid black 1px");

    $("body").find(".controls").css("gridArea", "controls");
    $("body").find(".controls").css("border", "solid black 1px");

    $("body").find(".controlWrapper").css("display", "flex");
    $("body").find(".controlWrapper").css("flexDirection", "column");
    $("body").find(".controlWrapper").css("justifyContent", "center");
    $("body").find(".controlWrapper").css("alignItems", "center");
  }

  //Generates a new random list of 10 categories
  genNewList() {
    let gameId = this.gameID;
    let currentCategories = [];
    categoriesRef.once("value", function (dataSnapshot) {
      let allCategories = dataSnapshot.val();
      let randomIdx;
      for(let i = 0; i < 10; i++){
        randomIdx = Math.round(Math.random() * 143);
        currentCategories.push(allCategories[randomIdx]);
      }
      gamesRef.child(gameId).child("currentCategories").set(currentCategories);
    });
    this.currentCategories = currentCategories;
  }

  //Generates a random new letter
  genNewLetter() {
    let alphabet = "ABCDEFGHIJKLMNOPRSTW";
    let idx = Math.round(Math.random() * (alphabet.length - 1));
    let letter = alphabet[idx];
    this.currentLetter = letter;
    gamesRef.child(this.gameID).child("currentLetter").set(this.currentLetter);
  }

  //Starts the timer, and handles what happens when the timer stops
  startTimer() {
    var timeLeft = this.timeLeft;
    var gameId = this.gameID;
    gamesRef.child(this.gameID).child("timeLeft").set(timeLeft);
    let timerFunction = setInterval(function () {
      if (timeLeft <= 0) {
        gamesRef.child(gameId).child("gameRunning").set(false);

        //Disable category inputs when time runs out
        let $categoriesInputs = $("body").find(".categoriesInput");
        for (let i = 0; i < $categoriesInputs.length; i++) {
          $categoriesInputs[i].disabled = true;
        };

        clearInterval(timerFunction);
      }
      
      gamesRef.child(gameId).child("timeLeft").set(timeLeft);
      timeLeft = timeLeft - 1;
    }, 1000);
    this.timeLeft = timeLeft;
  }
  
  //Renders a game screen when joining a game
  render(){
    $("body").html($gameScreenHTML);
    $("body").find("#gameIdLabel").html(`Game ID: ${this.gameID}`);
    $("body").find(".categoriesList").html(this.currentCategories);

    //Leave button code
    let $leaveGameBtn = $("body").find("#leaveBtn");
    $leaveGameBtn.on("click", ()=>{
      renderStartScreen();
    });

    //Listener to update categories everytime it is changed in the database
    gamesRef.child(this.gameID).child("currentCategories").on('value', function(dataSnapshot){
      let categoryArray = dataSnapshot.val();
      console.log(JSON.stringify(categoryArray));
      let categoryElement;
      if(categoryArray != null){
        let $randomCategoriesSet = $("body").find(".categoriesList");
        $randomCategoriesSet.html("");
        for (let i = 0; i < 10; i++) {
          categoryElement = "<li class='category'>" + categoryArray[i] + "</li>";
          $randomCategoriesSet.append(categoryElement);
          $("body").find(".category").css("color", "white");
          $("body").find(".category").css("fontSize", "1em");
        }
      }
    });

    //Listener to update letter everytime it is changed in the database
    gamesRef.child(this.gameID).child("currentLetter").on('value', function(dataSnapshot){
      let letter = dataSnapshot.val();
      $("body").find(".theLetter").text(letter);
    });

    //Listener to update timer as it changes in the database
    gamesRef.child(this.gameID).child("timeLeft").on('value', function(dataSnapshot){
      let timeLeft = dataSnapshot.val();
      $("body").find(".theTimer").text(timeLeft);
    });

    //Initialize the input fields to be disabled
    let $categoriesInputs = $("body").find(".categoriesInput");
    for (let i = 0; i < $categoriesInputs.length; i++) {
      $categoriesInputs[i].disabled = true;
    };

    //Will disable the start button when the game is running
    gamesRef.child(this.gameID).child("gameRunning").on("value", function (dataSnapshot) {
      let isRunning = dataSnapshot.val();
      if (isRunning === true) {
        $("body").find("#startBtn").disabled = true;
      }
      if (isRunning === false) {
        $("body").find("#startBtn").disabled = false;
      }
    });

    //Start button code
    $("body").find("#startBtn").on("click", ()=> {
      gamesRef.child(this.gameID).child("gameRunning").set(true);
      for (let i = 0; i < $categoriesInputs.length; i++) {
        $categoriesInputs[i].disabled = !$categoriesInputs[i].disabled;
      }
      for (let i = 0; i < $categoriesInputs.length; i++) {
        $categoriesInputs[i].value = "";
      }
      this.genNewList();
      this.genNewLetter();
      this.startTimer();
    });

    this.addLobbyCSS();

  }

}

function handleGameIdPrompt(givenGameId){
  gamesRef.once("value", function(dataSnapshot){
    let ssVal = dataSnapshot.val();
    console.log(ssVal);
    if(givenGameId in ssVal){
      console.log("game exists");
      let gameJSON = ssVal[givenGameId];
      let joinableGame = new GameState(gameJSON);
      console.log(JSON.stringify(joinableGame.toJSON()));
    }
    else{
      console.log("game does not exist");
    }
  });
    /*
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
  */
}

function renderStartScreen(){
  $("body").html(`
  <div class="startScreen">
      <header class="bg-primary text-white header">
        <h1 class="m-3">Scattegories Party Game</h1>
      </header>
      <div class="startScreenContent">
        <h1>Welcome!</h1>
        <div class="form">
          <input class="screenNameText" type="text form-text" placeholder="Username">
          <button class="lobbyBtn" id="createGameBtn" >Create Game</button>
          <button class="lobbyBtn" id="joinGameBtn" >Join Game</button>
        </div>
      </div>
  </div>`);

  //TODO: Add all the startScreen CSS through JQuery

  $("body").find("#createGameBtn").on("click", ()=>{
    console.log('Create game button clicked.');
    let newGame = new GameState();
    console.log(JSON.stringify(newGame.toJSON()));
    let newGameRef = gamesRef.child(newGame.gameID);
    newGameRef.set(newGame);
  });

  $("body").find("#joinGameBtn").on("click", ()=>{
    console.log('Join game button clicked.');
    let givenGameId = prompt("Please enter the ID of the game you want to join:");
    handleGameIdPrompt(givenGameId);
  });
  
}


/* ===== Start comment block here for old format
let createGameBtn = document.getElementById("createGameBtn");
let joinGameBtn = document.getElementById("joinGameBtn");
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
  //document.querySelector(".startScreen").style.display = "none";
});

//Click listener for create game button, should create a new game object and add it to database and render game screen
createGameBtn.addEventListener("click", function(event){
  console.log("click recieved");
  let newGame = new LobbyGame();
  console.log(JSON.stringify(newGame.toJSON()));
  myDatabase.ref("games").push(newGame);
});
comment block ends here ====== */

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

//joinGameBtn.disabled = false;
//createGameBtn.disabled = false;

renderStartScreen();