
//CHECK BROWSER TYPE ============
var mie = (navigator.appName == "Microsoft Internet Explorer")?true:false;
//END CHECK BROWSER TYPE ========

document.onmousemove = mousePos;
document.onmousedown = function () { mouse.clicked = true; };
document.onmouseup = function () { mouse.clicked = false; };
document.onkeypress = keyClick;
document.onkeydown = getKeyDown;
document.onkeyup = keyClear;

//For chat
var str = "";
var strHistory = [""];
var indexHistory = -1;

var keyButton = "";

//Keyboard keys used in game
var keys = {

    W: false,
    A: false,
    S: false,
    D: false,
    T: false,
    B: false,
    ENTER: false,
    SHIFT: false
};

//MOUSE AND KEYBOARD =============
var mouse = {

  //Mouse Location
  X: 0,
  Y: 0,

  //Replacement for Item.beingHeld
  item: null,

  //Replacement for mouseOccupied
  clicked: false,

  //Draw Item being held
  drawItem: function() {

    //Delete mouse item.
    if (!this.clicked) { this.item = null; }

    if (this.item) {

      //Update item location
      this.item.X = mouse.X - (this.item.width / 2);
      this.item.Y = mouse.Y - (this.item.height / 2);

      //Render
      this.item.draw();
    }
  }
}

function mousePos (e) {

  if (!mie) {

    mouse.X = e.pageX + FRAME_OF_REFERENCE[0];
    mouse.Y = e.pageY + FRAME_OF_REFERENCE[1];
  } else {

    e = event || window.event;

    mouse.X = e.clientX + document.body.scrollLeft + FRAME_OF_REFERENCE[0];
    mouse.Y = e.clientY + document.body.scrollTop + FRAME_OF_REFERENCE[1];
  };

  if (e.shiftKey) { keys.SHIFT = true; } else { keys.SHIFT = false; };
}
function keyClear (e) {

  keyButton = getKeyPressed(e);

  //Movement
  if (isEqualTo(keyButton, "W", "A", "S", "D")) { keys[keyButton] = false; };

  if (!keys.ENTER) {
    if (keyButton == "W") { playerList[0].Image = playerList[0].ImageArray[2][0]; };
    if (keyButton == "A") { playerList[0].Image = playerList[0].ImageArray[1][0]; };
    if (keyButton == "S") { playerList[0].Image = playerList[0].ImageArray[3][0]; };
    if (keyButton == "D") { playerList[0].Image = playerList[0].ImageArray[0][0]; };
  }

  if (keyButton == " ") { keys.B = false; };
  if (e.shiftKey) { keys.SHIFT = false; };
}
function getKeyPressed (e) {

  return String.fromCharCode(e.which || e.keyCode).toUpperCase();
}
function getKeyDown (e) {
  if (e) {
    if (e.keyCode == 8 || e.keyCode == 38 || e.keyCode == 40) { keyClick(e); }
  };
}
function keyClick (e) {

  keyButton = getKeyPressed(e);

  if (e.shiftKey) { keys.SHIFT = true; } else { keys.SHIFT = false; };

  if (!keys.ENTER) {

    //Movement
    if (isEqualTo(keyButton, "W", "A", "S", "D")) { keys[keyButton] = true; };
    //Fire Weapon
    if (keyButton == "T" && !keys.T) { keys.T = true; }
    else if (keyButton == "T" && keys.T) { keys.T = false; };
    //Spellbomb
    if (keyButton == " ") { keys.B = true; };
  };

  //Chat bar
  if ((e.which == 13 || e.keyCode == 13 || keyButton == "/") && !keys.ENTER) { keys.ENTER = true; }
    else if ((e.which == 13 || e.keyCode == 13) && keys.ENTER) { keys.ENTER = false; submitChat(playerList[0].userName); };

  if (!(e.which == 13 || e.keyCode == 13) && keys.ENTER && str.length < 50) {
    if (!keys.SHIFT) { str += keyButton.toLowerCase(); }
    else if (keys.SHIFT) { str += keyButton.toUpperCase(); };

    //Look for up arrow and change the text to the history
    if (e.which == 38 || e.keyCode == 38) {
      indexHistory++;
      if (indexHistory >= strHistory.length)
        indexHistory = 0;
      str = strHistory[indexHistory];
    }
    else if (e.which == 40 || e.keyCode == 40) {
      indexHistory--;
      if (indexHistory < 0)
        indexHistory = strHistory.length - 1;
      str = strHistory[indexHistory];
    }

    //Delete key
    if ((e.which == 8 || e.keyCode == 8) && str.length > 0) {

      keyButton = "DELETE";
      str = str.slice(0, str.length - 2);
    };
  };

  e.preventDefault();
}
//END MOUSE AND KEYBOARD =========
