const firebaseConfig = {
  apiKey: "AIzaSyCJo6UuFTI9M-813L0BHIN-0kDbTfzPdR0",
  authDomain: "cpeg470-scattegories-a4955.firebaseapp.com",
  databaseURL: "https://cpeg470-scattegories-a4955.firebaseio.com",
  projectId: "cpeg470-scattegories-a4955",
  storageBucket: "cpeg470-scattegories-a4955.appspot.com",
  messagingSenderId: "372518034210",
  appId: "1:372518034210:web:fceb7dbe02673231cb637b",
};

let uuid = localStorage.getItem("uuid");
if (!uuid){
  uuid = Math.floor(1000000000*Math.random());
  localStorage.setItem("uuid", uuid);
  //alert(`Your likely unique id is ${uuid}`);
}

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
    <p class="ml-3 text-white"><ol class = "leaderboardList"></ol></p>
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

class GameState { //TODO: Clean up this class, some of the code is not being updated, and some of it is unnecessary
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
      this.timeLeft = 120;
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
    let gameId = this.gameID;

    //Listener to remove game instance when there are no more players in it
    //TODO: Remove players when the playerCount hits 0
    //TODO: Make it so that when a game has a certain number of players, the game becomes unjoinable. This can be stored as an attribute in the GameState
    gamesRef.child(this.gameID).child("playerCount").on('value', function(dataSnapshot){
      let playerCount = dataSnapshot.val();
      if(playerCount == 0){
        //remove game from database here
        //gamesRef.child(gameId).remove(); -- currently not working
      }
      else if(playerCount >= 5){
        //make game unjoinable/full here
      }
    });

    //Leave button will take user back to start screen and remove that user from the game's data
    let $leaveGameBtn = $("body").find("#leaveBtn");
    $leaveGameBtn.on("click", ()=>{
      gamesRef.child(this.gameID).child("players").child(uuid).remove();
      renderStartScreen();
    });

    //Listener to update categories everytime it is changed in the database
    gamesRef.child(this.gameID).child("currentCategories").on('value', function(dataSnapshot){
      let categoryArray = dataSnapshot.val();
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
    //TODO: Fix bug where timer will still be ticking for a user if they leave a running game and instantly join another one
    // -a hacky workaround would be to diable the leave game button until the timer is done, but 
    //    that doesn't fix the underlying bug, just traps the user so they can't see it
    gamesRef.child(this.gameID).child("timeLeft").on('value', function(dataSnapshot){
      let timeLeft = dataSnapshot.val();
      $("body").find(".theTimer").text(timeLeft);
    });

    //Listeners to update leaderboard when people leave and join the game
    gamesRef.child(this.gameID).child("players").on('child_added', function(dataSnapshot){ //adds user when joining
      let userObj = dataSnapshot.val();
      let $leaderboardList = $("body").find(".leaderboardList");
      let newUsername = userObj["userName"];
      let newUserLi = $('<li>/</li>').addClass('leaderboardItem');
      newUserLi.text(newUsername);
      newUserLi.attr('id', userObj["userID"]);
      $leaderboardList.append(newUserLi);
      gamesRef.child(gameId).child("playerCount").once('value', function(ss){
        let playerCount = ss.val();
        console.log(playerCount);
        playerCount = playerCount + 1;
        console.log(playerCount);
        gamesRef.child(gameId).child("playerCount").set(playerCount);
      });
    });
    gamesRef.child(gameId).child("players").on('child_removed', function(dataSnapshot){ //removes user when leaving
      console.log("child has been removed!");
      let userObj = dataSnapshot.val();
      console.log(JSON.stringify(userObj));
      let removedUserId = userObj["userID"];
      console.log(removedUserId);
      $("body").find("#"+removedUserId).remove();
      gamesRef.child(gameId).child("playerCount").once('value', function(ss){
        let playerCount = ss.val();
        console.log(playerCount);
        playerCount = playerCount - 1;
        console.log(playerCount);
        gamesRef.child(gameId).child("playerCount").set(playerCount);
      });
    });


    //Initialize the input fields to be disabled
    let $categoriesInputs = $("body").find(".categoriesInput");
    for (let i = 0; i < $categoriesInputs.length; i++) {
      $categoriesInputs[i].disabled = false;
    };

    //Will disable the start button when the game is running
    gamesRef.child(this.gameID).child("gameRunning").on("value", function (dataSnapshot) {
      for (let i = 0; i < $categoriesInputs.length; i++) {
        $categoriesInputs[i].disabled = !$categoriesInputs[i].disabled;
      }
      let isRunning = dataSnapshot.val();
      if (isRunning) {
        $("body").find("#startBtn").disabled = true;
      }
      else{
        $("body").find("#startBtn").disabled = false;
      }
    });

    //Start button code
    //TODO: Make sure that answer input boxes become available for all players when this button is clicked
    //TODO: Make sure this button is disabled or enabled appropraitely for all players when clicked or time runs out
    $("body").find("#startBtn").on("click", ()=> {
      gamesRef.child(this.gameID).child("gameRunning").set(true);
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

//Will check to see if given gameId is a valid Id and either join that game or alert 
// that the Id is invalid; returns true or false if game exists or not
function handleGameIdPrompt(givenGameId, givenUsername){
  gamesRef.once("value", function(dataSnapshot){
    let ssVal = dataSnapshot.val();
    //console.log(ssVal);
    if(givenGameId in ssVal){
      console.log("game exists");
      let gameJSON = ssVal[givenGameId];
      let joinableGame = new GameState(gameJSON);
      let userObj = buildUserObj(givenUsername);
      console.log(JSON.stringify(userObj));
      let thisGameRef = gamesRef.child(givenGameId);
      let newUserRef = thisGameRef.child("players").child(userObj.userID);
      newUserRef.set(userObj);
      //console.log(JSON.stringify(joinableGame.toJSON()));
    }
    else{
      console.log("game does not exist");
      alert("Game with that Game ID does not exist, please try again.");
    }
  });
}

//Creates a user object from a given username
function buildUserObj(givenUsername){
  let userObj = {};
  userObj.userID = uuid;
  userObj.userName = givenUsername;
  userObj.isReady = false;
  userObj.userAnswers = [];
  userObj.currentScore = 0;
  return userObj;
}

//Renders the start screen, its css, and its listeners
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
          <button class="lobbyBtn" id="createGameBtn" disabled>Create Game</button>
          <button class="lobbyBtn" id="joinGameBtn" disabled>Join Game</button>
        </div>
      </div>
  </div>`);

  //All CSS classes being set
  $("body").find(".startScreen").css("display", "block");
  $("body").find(".startScreenContent").css("maxWidth", "600px");
  $("body").find(".startScreenContent").css("margin", "0 auto");
  $("body").find(".startScreenContent").css("padding", "80px 0");
  $("body").find(".startScreenContent").css("height", "400px");
  $("body").find(".startScreenContent").css("textAlign", "center");

  $("body").find(".form").css("padding", "20px 0");
  $("body").find(".form").css("position", "relative");
  $("body").find(".form").css("zIndex", "2");

  $("body").find(".screenNameText").css("display", "block");
  $("body").find(".screenNameText").css("appearance", "none");
  $("body").find(".screenNameText").css("outline", "0");
  $("body").find(".screenNameText").css("border", "1px solid fade(white, 40%)");
  $("body").find(".screenNameText").css("backgroundColor", "fade(white, 20%)");
  $("body").find(".screenNameText").css("borderRadius", "3px");
  $("body").find(".screenNameText").css("padding", "10px 15px");
  $("body").find(".screenNameText").css("margin", "0 auto 10px auto");
  $("body").find(".screenNameText").css("textAlign", "center");
  $("body").find(".screenNameText").css("fontSize", "18px");
  $("body").find(".screenNameText").css("color", "black");
  $("body").find(".screenNameText").css("transitionDuration", "0.25s");
  $("body").find(".screenNameText").css("fontWeight", "300");
  $("body").find(".screenNameText").hover(function(){
    $(this).attr("backgroundColor","fade(white, 40%)");
  });
  $("body").find(".screenNameText").focus(function(){
    $(this).attr("backgroundColor","white");
    $(this).attr("width","300px");
  });

  $("body").find(".lobbyBtn").css("fontWeight", "300");
  $("body").find(".lobbyBtn").css("outline", "0");
  $("body").find(".lobbyBtn").css("backgroundColor", "white");
  $("body").find(".lobbyBtn").css("border", "0");
  $("body").find(".lobbyBtn").css("padding", "10px 15px");
  $("body").find(".lobbyBtn").css("borderRadius", "3px");
  $("body").find(".lobbyBtn").css("width", "250px");
  $("body").find(".lobbyBtn").css("cursor", "pointer");
  $("body").find(".lobbyBtn").css("fontSize", "18px");
  $("body").find(".lobbyBtn").css("transitionDuration", "0.25s");
  $("body").find(".lobbyBtn").hover(function(){
    $(this).attr("backgroundColor","rgb(245, 247, 249)");
  });
  
  let userNameTextBox = $("body").find(".screenNameText");
  let userName;
  userNameTextBox.on("blur", ()=>{
    userName = userNameTextBox.val();
    if(userName === ""){
      $("body").find("#joinGameBtn").prop('disabled', true);
      $("body").find("#createGameBtn").prop('disabled', true);
    }
    else{
      $("body").find("#joinGameBtn").prop('disabled', false);
      $("body").find("#createGameBtn").prop('disabled', false);
    }
  });

  //Click listener for create game button, creates a new game instance and adds the creator to the user list
  $("body").find("#createGameBtn").on("click", ()=>{ 
    //console.log('Create game button clicked.');
    let newGame = new GameState();
    //console.log(JSON.stringify(newGame.toJSON()));
    let newGameRef = gamesRef.child(newGame.gameID);
    newGameRef.set(newGame);
    let userObj = buildUserObj(userName);
    let newUserRef = newGameRef.child("players").child(userObj.userID);
    newUserRef.set(userObj);
  });

  $("body").find("#joinGameBtn").on("click", ()=>{
    console.log('Join game button clicked.');
    let givenGameId = prompt("Please enter the ID of the game you want to join:");
    handleGameIdPrompt(givenGameId, userName);
  });
  
}

renderStartScreen();