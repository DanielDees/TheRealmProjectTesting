var options_menu = new Game_options_menu();

function Game_options_menu() {

  this.buttonData = {

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
  };

  this.buttons = {

    main_menu: new button(this.buttonData.main_menu),
    enable_music: new button(this.buttonData.enable_music),
    disable_music: new button(this.buttonData.disable_music),
  };

  this.draw = function() {

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

      this.buttons.enable_music.draw();
    }
    else { 

      this.buttons.disable_music.draw();
    }

    //Main Menu Button
    this.buttons.main_menu.draw();

    //Version Info
    ctx.font = "16px Palatino";
    ctx.fillStyle = "#008888";
    ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);
  };
}