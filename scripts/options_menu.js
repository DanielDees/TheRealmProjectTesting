var options_menu = {}

options_menu.buttonData = {

  main_menu: {

    //Location
    X: function() { return 320; },
    Y: function() { return 360; },

    //Text
    text: "Main Menu",
    font: "25px Palatino",
    color: "#FFF",

    //Action
    action: function() { screenType = "MAIN_MENU"; },
  },
  enable_music: {

    //Location
    X: function() { return 310; },
    Y: function() { return 260; },

    //Text
    text: "Enable Music",
    font: "25px Palatino",
    color: "#FFF",

    //Action
    action: unMuteGame,
  },
  disable_music: {

    //Location
    X: function() { return 305; },
    Y: function() { return 260; },

    //Text
    text: "Disable Music",
    font: "25px Palatino",
    color: "#FFF",

    //Action
    action: muteGame,
  },
}

options_menu.buttons = {

  main_menu: new button(options_menu.buttonData.main_menu),
  enable_music: new button(options_menu.buttonData.enable_music),
  disable_music: new button(options_menu.buttonData.disable_music),
}

options_menu.draw = function() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(30, 30, 30, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#696969";
  ctx.fillRect(233, 130, 310, 300);
  
  //Main Text
  ctx.font = "30px Palatino";
  ctx.fillStyle = "#DDD";
  ctx.fillText("OPTIONS", (canvas.width / 3) + 55, 200);
  
  //Music Controls
  if (gameBackgroundMusic.volume < 0.1) {

    options_menu.buttons.enable_music.draw();
  }
  else { 

    options_menu.buttons.disable_music.draw();
  }

  //Main Menu Button
  options_menu.buttons.main_menu.draw();

  //Version Info
  ctx.font = "16px Palatino";
  ctx.fillStyle = "#008888";
  ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);
}