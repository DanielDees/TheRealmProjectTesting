
function drawMainMenu () {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(30, 30, 30, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#696969";
  ctx.fillRect(0, 400, canvas.width, 90);

  //Main Menu Buttons
  placeButtonHere("Play", 340, 423, "CLASS_SELECTION", "35px Palatino", "#696969");
  placeButtonHere("Instructions", 445, 430, "INSTRUCTIONS", "25px Palatino", "#696969");
  placeButtonHere("Options", 220, 430, "OPTIONS", "25px Palatino", "#696969");

  ctx.font = "40px Palatino";
  ctx.fillStyle = "#CC0000";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#000";
  ctx.fillText("The Realm Project", canvas.width / 3.4, 200);
  ctx.shadowBlur = 0;

  ctx.font = "16px Palatino";
  ctx.fillStyle = "#008888";
  ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);
}

/*
  var main_menu_screen = {}

  main_menu_screen.buttonData = {

    play: {

      //Location
      X: 340,
      Y: 423,

      //Text
      text: "Play",
      font: "35px Palatino",
      color: "#696969",

      //Action
      action: function() { screenType = "CLASS_SELECTION"; },
    },
    instructions: {

      //Location
      X: 445,
      Y: 430,

      //Text
      text: "Instructions",
      font: "25px Palatino",
      color: "#FFF",

      //Action
      action: function() { screenType = "INSTRUCTIONS"; },
    },
    options: {

      //Location
      X: 220,
      Y: 430,

      //Text
      text: "Options",
      font: "25px Palatino",
      color: "#696969",

      //Action
      action: function() { screenType = "OPTIONS"; },
    },
  }

  main_menu_screen.buttons = {

    play: new button(buttonData.play),
    instructions: new button(buttonData.instructions),
    options: new button(buttonData.options),
  }

  main_menu_screen.draw = function drawMainMenuScreen () {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(30, 30, 30, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#696969";
    ctx.fillRect(0, 400, canvas.width, 90);

    //Main Menu Buttons
    buttons.play.draw();
    //placeButtonHere("Play", 340, 423, "CLASS_SELECTION", "35px Palatino", "#696969");
    //buttons.instructions.draw();
    placeButtonHere("Instructions", 445, 430, "INSTRUCTIONS", "25px Palatino", "#696969");
    //buttons.options.draw();
    placeButtonHere("Options", 220, 430, "OPTIONS", "25px Palatino", "#696969");

    ctx.font = "40px Palatino";
    ctx.fillStyle = "#CC0000";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#000";
    ctx.fillText("The Realm Project", canvas.width / 3.4, 200);
    ctx.shadowBlur = 0;

    ctx.font = "16px Palatino";
    ctx.fillStyle = "#008888";
    ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);
  }

  return main_menu_screen; */