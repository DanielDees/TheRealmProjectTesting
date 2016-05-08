//SAVE AND LOAD GAME ============
function LOAD_GAME () {

  playerList[0] = localStorage["userName"];
  
  alert("Game Loaded!");
}
function SAVE_GAME () {

  localStorage["userName"] = playerList[0];

  alert("Game Saved!");
}
//END SAVE AND LOAD GAME ========