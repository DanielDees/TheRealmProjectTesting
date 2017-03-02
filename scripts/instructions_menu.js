var instructions_menu = {};

instructions_menu.buttonData = {

  main_menu: {

    //Location
    X: 320,
    Y: 360,

    //Text
    text: "Main Menu",
    font: "25px Palatino",
    color: "#FFF",

    //Action
    action: function() { screenType = "MAIN_MENU"; },
  },
}

instructions_menu.buttons = {

  main_menu: new button(instructions_menu.buttonData.main_menu),
}

instructions_menu.draw = function() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(30, 30, 30, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //Instructions menu background
  ctx.fillStyle = "#696969";
  ctx.fillRect( 233, 130, 310, 300);

  //Main Text
  ctx.font = "30px Palatino";
  ctx.fillStyle = "#DDD";
  ctx.fillText("INSTRUCTIONS", (canvas.width / 3) + 10, 200);
  
  //Instructions Text
  ctx.font = "16px Palatino";
  ctx.fillText("'WASD' to move, Special is 'SpaceBar'", 258, 250);
  ctx.fillText("Click to fire, 'T' is autofire", 295, 290);
  ctx.fillText("'ENTER' to chat.", 330, 330);
  
  //Main Menu button
  instructions_menu.buttons.main_menu.draw();
  
  //Version Info
  ctx.font = "16px Palatino";
  ctx.fillStyle = "#008888";
  ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);
}