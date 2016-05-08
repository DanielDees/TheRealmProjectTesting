//---------------------------------------------------------------------
//Everything related to chat and sending text messages is in this file.
//---------------------------------------------------------------------

//All chat text stored here.
var chatLog = [];

function activateChat () {

  ctx.shadowColor = "#000";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.strokeRect(5 + FRAME_OF_REFERENCE[0], canvas.height - 26 + FRAME_OF_REFERENCE[1], canvas.width - 210, 20);
  ctx.fillStyle = "#FFF";
  ctx.shadowBlur = 10;
  ctx.fillText(str, 10 + FRAME_OF_REFERENCE[0], canvas.height - 10 + FRAME_OF_REFERENCE[1]);
  ctx.shadowBlur = 0;
}
function submitChat (personSpeaking) {

  ctx.shadowColor = "#000";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#FFF";

  //In-game Dev-Tools
  checkDevCommands();
  
  if (str.length > 0) {

    //String, Y, age of text, user who submitted
    chatLog.push([" " + str, 16, 0, personSpeaking]);

    for (var i = 0; i < chatLog.length; i++) { chatLog[i][1] = chatLog[i][1] + 20; };
  };

  str = "";
  ctx.shadowBlur = 0;
}
function displayChat () {

  ctx.shadowColor = "#000";
  ctx.strokeStyle = "#000";
  var i = 0;

  //Text above player
  if (chatLog.length > 0) {

    var textWidth = ctx.measureText(chatLog[chatLog.length - 1][0]).width + 5;

    if (chatLog[chatLog.length - 1][2] <= 200 ) {

      ctx.fillStyle = "#DDDDDD";
      ctx.fillRect(playerList[0].X + (playerList[0].width / 2) - (textWidth / 2), playerList[0].Y - 30, textWidth, 20);
      ctx.fillStyle = "black";
      ctx.lineWidth = 0.7;
      ctx.strokeRect(playerList[0].X + (playerList[0].width / 2) - (textWidth / 2), playerList[0].Y - 30, textWidth, 20);
      ctx.fillText(chatLog[chatLog.length - 1][0], playerList[0].X + (playerList[0].width / 2) - (textWidth / 2), playerList[0].Y - 14);

    };
  };

  //Text at bottom of screen
  ctx.fillStyle = "#FFF";
  ctx.shadowBlur = 10;
  for (var j = 0; j < chatLog.length; j++) {
  
    ctx.fillText(chatLog[i][3] + ": " + chatLog[i][0], 10 + FRAME_OF_REFERENCE[0], canvas.height - chatLog[i][1] + FRAME_OF_REFERENCE[1]);
    chatLog[i][2]++;

    if (chatLog[i][2] > 800) { chatLog.splice(i, 1); i--; };
    i++;

  };
  ctx.shadowBlur = 0;
}
function checkDevCommands () {

  if (str.search("/") == 0) {

    if (str.search("/spawnRate") == 0) { 

      str = str.slice(11, str.length);
      generateEnemies = setInterval(function() { if (screenType == "GAME_SCREEN" && (enemies_remaining_in_realm - enemyList.length) > 0) { spawnEnemy(); } } , parseInt(str));

      console.log("Spawning enemies every: " + (parseInt(str) / 1000) + " seconds.");
      return;
    }
    else if (str.search("/godMode") == 0) { playerList[0].MAX_HP = 9999999; playerList[0].HP = 9999999; }
    else if (str.search("/levelUp") == 0) { playerList[0].levelUP(); playerList[0].EXP = 0; }
    else if (str.search("/level") == 0) { 

      str = str.slice(7, str.length);

      for (var i = playerList[0].level; i < parseInt(str); i++) { playerList[0].levelUP(); };

      playerList[0].EXP = 1;
    }
    else if (str.search("/kill all") == 0) { enemyList = []; }
    else if (str.search("/reset xy") == 0) { 

      playerList[0].X = 4000;
      playerList[0].Y = 4000;
    }
    else if (str.search("/clearAll") == 0) { 

      //Makes sure is empty
      enemies_remaining_in_realm = 100;
      lootBagList = [];
      portalList = [];
      enemyList = [];
      bulletList = [];
      enemyBulletList = [];
    }
    else if (str.search("/renderRange") == 0) {

      str = str.slice(13, str.length);
      if (!parseInt(str)) { console.log("Current renderRange: " + (renderRange / tileSize)) + " tiles"; }
      else { renderRange = parseInt(str) * tileSize; };
    }
    else {

      str = "Command not found!";
    }
  };
}
//-----------------------------
//End file
//-----------------------------