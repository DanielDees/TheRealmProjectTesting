var main_menu = new Game_main_menu();

function Game_main_menu() {

  this.buttonData = {

    play: {

      //Location
      X: function() { return 340; },
      Y: function() { return 423; },

      //Text
      text: "Play",
      font: "35px Palatino",
      color: "#FFF",

      //Action
      action: function() { screenType = "CLASS_SELECTION"; },
    },
    instructions: {

      //Location
      X: function() { return 445; },
      Y: function() { return 430; },

      //Text
      text: "Instructions",
      font: "25px Palatino",
      color: "#FFF",

      //Action
      action: function() { screenType = "INSTRUCTIONS"; },
    },
    options: {

      //Location
      X: function() { return 220; },
      Y: function() { return 430; },

      //Text
      text: "Options",
      font: "25px Palatino",
      color: "#FFF",

      //Action
      action: function() { screenType = "OPTIONS"; },
    },
  };

  this.buttons = {

    play: new button(this.buttonData.play),
    instructions: new button(this.buttonData.instructions),
    options: new button(this.buttonData.options),
  };

  this.draw = function () {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(30, 30, 30, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#696969";
    ctx.fillRect(0, 400, canvas.width, 90);

    //Main Menu Buttons
    this.buttons.play.draw();
    this.buttons.instructions.draw();
    this.buttons.options.draw();

    //Game Title
    ctx.font = "40px Palatino";
    ctx.fillStyle = "#CC0000";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#000";
    ctx.fillText("The Realm Project", canvas.width / 3.4, 200);
    ctx.shadowBlur = 0;

    //Version Info
    ctx.font = "16px Palatino";
    ctx.fillStyle = "#008888";
    ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);
  };
}