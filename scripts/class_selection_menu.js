var class_selection_menu = {}

class_selection_menu.buttonData = {

  start: {

    //Location
    X: 340,
    Y: 423,

    //Text
    text: "Play",
    font: "35px Palatino",
    color: "#FFF",

    //Action
    action: function() { screenType = "GAME_SCREEN"; },
  },
  main_menu: {

    //Location
    X: 445,
    Y: 430,

    //Text
    text: "Main Menu",
    font: "25px Palatino",
    color: "#FFF",

    //Action
    action: function() { screenType = "MAIN_MENU"; },
  },
  options: {

    //Location
    X: 220,
    Y: 430,

    //Text
    text: "Options",
    font: "25px Palatino",
    color: "#FFF",

    //Action
    action: function() { screenType = "OPTIONS"; },
  },
}

class_selection_menu.buttons = {

  start: new button(class_selection_menu.buttonData.start),
  main_menu: new button(class_selection_menu.buttonData.main_menu),
  options: new button(class_selection_menu.buttonData.options),
}

class_selection_menu.draw = function() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(30, 30, 30, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#696969";
  ctx.fillRect(0, 400, canvas.width, 90);

  //Main Menu Buttons
  class_selection_menu.buttons.start.draw();
  class_selection_menu.buttons.main_menu.draw();
  class_selection_menu.buttons.options.draw();

  //Main Text
  ctx.font = "30px Palatino";
  ctx.fillStyle = "#CC0000";
  ctx.shadowBlur = 10;
  ctx.fillText("Class Selection", 290, 200);
  ctx.shadowBlur = 0;

  //Characters to select from
  for (var i = 0; i < classSelectionPics.length; i++) {

    //If mouse is touching a character
    if (mouse.X > 260 + (i * 90) && mouse.X < 260 + (i * 90) + 64 && mouse.Y > canvas.height / 2 && mouse.Y < (canvas.height / 2) + 64) {

      //Change character highlight color
      ctx.shadowColor = "white";

      //On click
      if (mouse.clicked) { 

        playerList[0].Image = classSelectionPics[i];

        //Player is now that character
        if (i == 0) { playerList[0].ImageArray = warrior_Pics; }
        if (i == 1) { playerList[0].ImageArray = archer_Pics; }
        if (i == 2) { playerList[0].ImageArray = mage_Pics; }

        //Start game
        screenType = "GAME_SCREEN";
      }
    }

    //Show character highlighting
    ctx.shadowBlur = 10;
    ctx.drawImage(classSelectionPics[i], 260 + (i * 90), canvas.height / 2, 64, 64);
    ctx.shadowBlur = 0;
    ctx.shadowColor = "#000";
  }

  //Version Info
  ctx.font = "16px Palatino";
  ctx.fillStyle = "#008888";
  ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);
}