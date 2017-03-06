//---------------------------------------------------------------------
//Everything related to chat and sending text messages is in this file.
//---------------------------------------------------------------------

// All chat text stored here.
var chatLog = [];

function activateChat () {

  //Outline for text box while user is typing
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.strokeRect(5 + FRAME_OF_REFERENCE[0], canvas.height - 26 + FRAME_OF_REFERENCE[1], canvas.width - 210, 20);

  //Hold str value for display in box
  var strShown = str;

  //Cut off any characters that push length over 200px in box
  for (var i = 0; i < 300; i++) {
    if (ctx.measureText(strShown).width >= 500) {

      strShown = strShown.slice(1, strShown.length);
    }
    else { break; }
  }
  
  //Text displayed while user is typing
  ctx.fillStyle = "#FFF";
  ctx.shadowBlur = 10;
  ctx.fillText(strShown, 10 + FRAME_OF_REFERENCE[0], canvas.height - 10 + FRAME_OF_REFERENCE[1]);
  ctx.shadowBlur = 0;
}
function submitChat (personSpeaking) {

  if (str.length > 0) {

    //Push text to beginning of history
    strHistory.unshift(str);

    //Default -1, it's changed on keypress so index -1 is never searched for
    indexHistory = -1;

    //Keeps a maximum of 10 logs
    if (strHistory.length > 10) {

      strHistory = strHistory.slice(0, 10);
    }

    //In-game Dev-Tools
    checkDevCommands();

    //If not dev command
    if (str.length > 0) {

      var messageData = {

        text: str,
        Y: 16,
        age: 0,
        speaker: personSpeaking,
      }

      //Message info
      /*
      var messageData2 = {

        //Location
        X: 10 + FRAME_OF_REFERENCE[0],
        Y: 16,

        //Dimensions
        width: 300,

        //Text
        text: personSpeaking + ": " + str,
      };

      var chatMessage = new textbox(globalChatData);
      */

      chatLog.push(messageData);

      //Increase Ypos of text on left of screen.
      for (var i = 0; i < chatLog.length; i++) { chatLog[i].Y += 20; }
    }
  }

  str = "";
}
function displayChat () {

  ctx.strokeStyle = "#000";

  //Text above player
  if (chatLog.length > 0 && chatLog[chatLog.length - 1].age < 400) {

    //Message info
    var textBubbleData = {

      //Location
      X: playerList[0].X + (playerList[0].width / 2) - 100,
      Y: playerList[0].Y - 10,

      //Background
      bg: true,

      //Text
      text: chatLog[chatLog.length - 1].text,
    }

    //Create new text bubble
    var textBubble = new textbox(textBubbleData);

    //Overlay text on background.
    textBubble.draw();
  }

  //Text on left of screen
  ctx.fillStyle = "#FFF";
  ctx.shadowBlur = 10;
  for (var i = 0; i < chatLog.length; i++) {

    //Message info
    var globalChatData = {

      //Location
      X: 10 + FRAME_OF_REFERENCE[0],
      Y: canvas.height - chatLog[i].Y + FRAME_OF_REFERENCE[1],

      //Dimensions
      width: 300,

      //Text
      text: chatLog[i].speaker + ": " + chatLog[i].text,
    };

    var globalChatMessage = new textbox(globalChatData);

    ctx.fillStyle = "white";
    //globalChatMessage.draw();

    //Display text on left of screen
    ctx.fillText(chatLog[i].speaker + ": " + chatLog[i].text, 10 + FRAME_OF_REFERENCE[0], canvas.height - chatLog[i].Y + FRAME_OF_REFERENCE[1]);

    //Increase age of text
    chatLog[i].age++;

    //Delete text if more than 800 age
    if (chatLog[i].age > 800) { chatLog.splice(i, 1); }
  }

  ctx.shadowBlur = 0;
}
function checkDevCommands () {

  if (str.search("/") == 0) {

    if (str.search("/spawnRate") == 0) {

      str = str.slice(11, str.length);

      generateEnemies = setInterval(function() { if (screenType == "GAME_SCREEN" && (enemies_remaining_in_realm - enemyList.length) > 0) { spawnEnemy(); } } , parseInt(str));

      console.log("Spawning enemies every: " + (parseInt(str) / 1000) + " seconds.");
    }
    else if (str.search("/godMode") == 0) { playerList[0].MAX_HP = 9999999; playerList[0].HP = 9999999; }
    else if (str.search("/levelUp") == 0) { playerList[0].playerList[0].EXP = playerList[0].levelExpReq; }
    else if (str.search("/level") == 0) {

      str = str.slice(7, str.length);

      for (var i = playerList[0].level; i < parseInt(str); i++) { playerList[0].levelUP(); playerList[0].EXP = 0; }
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
      console.log("Current renderRange: " + (renderRange / tileSize)) + " tiles";

      if (parseInt(str)) { renderRange = parseInt(str) * tileSize; }
    }
    else {

      str = "Command not found!";
      return;
    }

    //Clear chat
    str = "";
  }
}
function getWrapedText(text, maxWidth) {

  var arr = [];
  var currentLine = '';

  //Loop through text passed
  for (var i = 0; i < text.length; i++) {

    var lineTest = currentLine + text.charAt(i) + '';
    var lineWidth = ctx.measureText(lineTest).width;

    //Once text in line is >= max line width
    if (lineWidth > maxWidth - 5) {

      //Add - if a word is being broken
      if (text.charAt(i) !== " ") { currentLine += "-" ; }

      //Push line to array
      arr.push(currentLine);

      //Start new line
      currentLine = " " + text.charAt(i);
    }
    else {

      currentLine = lineTest;
    }
  }

  //Push line to array
  arr.push(currentLine);

  return arr;
}

//-----------------------------
//End file
//-----------------------------
