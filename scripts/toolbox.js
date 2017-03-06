//RANDOM TOOLS
function hitboxIntersectCheck (a, b) {

  //If error, ensure items have this.height / this.width.
  if (a.bottom() > b.top() && a.top() < b.bottom() && a.left() < b.right() && a.right() > b.left()) {

    return true;
  }

  return false;
}
function mouseIsTouching (item) {

  //If error, ensure items have this.height / this.width.
  try {
    if (mouse.Y < item.bottom() && mouse.Y > item.top() && mouse.X > item.left() && mouse.X < item.right()) {

      return true;
    }
  }
  catch (err) { throw "mouseIsTouching() can't evaluate: " + item; }

  return false;
}
function drawItemDescription (myThingy) {

  if (mouseIsTouching(myThingy)) {

    //Box
    ctx.fillStyle = "#AAA";
    ctx.fillRect(mouse.X, mouse.Y, -200, -280);

    //Box outline
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 3;
    ctx.strokeRect(mouse.X, mouse.Y, -200, -280);

    //Text
    ctx.fillStyle = "#111";

    var nameData = {

      //Location
      X: mouse.X - 190,
      Y: mouse.Y - 260,

      //Text
      text: myThingy.itemName,
    }
    var effectData = {

      //Location
      X: mouse.X - 200,
      Y: mouse.Y - 230,

      //Text
      text: myThingy.itemEffectText,
    }
    var descriptionData = {

      //Location
      X: mouse.X - 200,
      Y: mouse.Y - 200,

      //Text
      text: myThingy.itemDescription,
    }

    var name = new textbox(nameData);
    var effect = new textbox(effectData);
    var description = new textbox(descriptionData);
    
    name.draw();

    ctx.font = "14px Palatino";
    effect.draw();
    description.draw();
  }
}
function isEqualTo () {

  //Check if item is not equal to any other being passed.
  for (var i = 1; i < arguments.length; i++) {

    if (arguments[0] == arguments[i]) { return true; }
  }

  return false;
}
var lastKnownLocation = [playerList[0].X, playerList[0].isViewingLoot];
function swapItems(a, b) {

  //Javascript only passes objects by reference.
  //Everything else is passed by value. 
  //So don't directly swap items.
  var temp = a.item;

  a.item = b.item;
  b.item = temp;
}
function getMouseAngle(type) {

  //Calculate center of player.
  var deltaX = playerList[0].X + (playerList[0].width / 2) - mouse.X;
  var deltaY = playerList[0].Y + (playerList[0].height / 2) - mouse.Y;

  //Find angle in Rad
  var angle = Math.atan2(deltaY, deltaX);

  //Convert from Rad to Degrees
  angle *= (180 / Math.PI);

  //Make angle positive on 360 degree values
  angle += 180;

  //Convert to Rad if necessary
  if (type == "rad") { angle *= (Math.PI / 180); }
  
  return angle;
}
function getAngleTo(entityFrom, entityTo, type) {

  //Calculate center of player.
  var deltaX = entityFrom.X + (entityFrom.width / 2) - entityTo.X;
  var deltaY = entityFrom.Y + (entityFrom.height / 2) - entityTo.Y;

  //Find angle in Rad
  var angle = Math.atan2(deltaY, deltaX);

  //Convert from Rad to Degrees
  angle *= (180 / Math.PI);

  //Make angle positive on 360 degree values
  angle += 180;

  //Convert to Rad if necessary
  if (type == "rad") { angle *= (Math.PI / 180); }

  //Return angle in Degrees
  return angle;
}
function drawDebugInfo(absX, absY) {

  //FOR BUG TESTING
  ctx.fillStyle = "red";

  var mouseItem;
  if (mouse.item) { mouseItem = mouse.item.itemName; }

  //Comment/uncomment to hide/show
  var info = [
    //["Portals", portalList.length], 
    //["LootBags", lootBagList.length], 
    //["ViewingLoot", playerList[0].isViewingLoot], 
    //["X", playerList[0].X.toFixed(0)], 
    //["Y", playerList[0].Y.toFixed(0)],
    ["Slot", whichSlot],
    //["ScreenType", screenType], 
    //["FRAME_OF_REFERENCE", FRAME_OF_REFERENCE[0].toFixed(0) + "x | " + FRAME_OF_REFERENCE[1].toFixed(0) + "y"],
    //["mouse.clicked", mouse.clicked],
    //["mouse.item", mouseItem],
    //["mouse.X", mouse.X.toFixed(0)],
    //["mouse.Y", mouse.Y.toFixed(0)],
    //["mouseAngle", getMouseAngle().toFixed(0) + "°"],
    //["mouseAngle", getMouseAngle("rad").toFixed(2) + " Rad"],
  ];

  for (var i = 0; i < info.length; i++) {
    
    ctx.fillText(info[i][0] + ": " + info[i][1], 20 + absX, 30 + (20 * i) + absY);
  }
}
function findNearestPlayer(entity) {

  var closest = {

    name: "Nobody Nearby",

    X: 9999999,
    Y: 9999999,

    distance: 999999,
    angle: 999,
  };

  for (var i = 0; i < playerList.length; i++) {
    
    var Xdistance = entity.X - playerList[i].X;
    var Ydistance = entity.Y - playerList[i].Y;

    var totalDistance = Xdistance + Ydistance;

    if (totalDistance < closest.distance && entity.name != playerList[i].name) {

      closest.name = playerList[i].name;
      closest.X = playerList[i].X;
      closest.Y = playerList[i].Y;
      closest.distance = totalDistance;
    }
  }

  return closest;
}
//END RANDOM TOOLS