var death_menu = new Game_death_menu();

function Game_death_menu() {

  this.buttonData = {

    main_menu: {

      //Location
      X: function() { return 350; },
      Y: function() { return 520; },

      //Text
      text: "Main Menu",
      font: "25px Palatino",
      color: "#FFF",

      //Button
      bgColor: "#222",

      //Action
      action: function() { screenType = "MAIN_MENU"; },
    },
  };

  this.buttons = {

    main_menu: new button(this.buttonData.main_menu),
  };

  this.draw = function() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Player Sprite
    ctx.drawImage(playerList[0].ImageArray[0][0], (canvas.width / 2) - 32, 80, 64, 64);

    //Death message
    ctx.font = "28px Palatino";
    ctx.fillStyle = "#888";
    ctx.fillText(playerList[0].name + " was killed", (canvas.width / 3) + 30, 200);
    
    //Death message
    ctx.font = "18px Palatino";
    if (playerList[0].level < playerList[0].MAX_level) { ctx.fillText("Died at level: " + playerList[0].level, 240, 250); }
    else { ctx.fillText("Died with " + playerList[0].glory() + " renowned Glory", 240, 250); }

    //Death message
    ctx.fillText("Killed by: " + playerList[0].killedBy, 240, 270);

    //Main Menu button
    death_menu.buttons.main_menu.draw();

    //Version Info
    ctx.font = "16px Palatino";
    ctx.fillStyle = "#008888";
    ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);
  };
}