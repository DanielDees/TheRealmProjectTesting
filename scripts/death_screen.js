function drawDeathScreen () {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(playerList[0].ImageArray[0][0], (canvas.width / 2) - 32, 80, 64, 64);

  ctx.font = "28px Palatino";
  ctx.fillStyle = "#888";
  ctx.fillText(playerList[0].name + " was killed", (canvas.width / 3) + 30, 200);
  
  ctx.font = "18px Palatino";
  if (playerList[0].level < playerList[0].MAX_level) { ctx.fillText("Died at level: " + playerList[0].level, 240, 250); }
  else { ctx.fillText("Died with " + playerList[0].glory.toFixed(0) + " renowned Glory", 240, 250); }

  ctx.fillText("Killed by: " + playerList[0].killedBy, 240, 270);

  ctx.fillStyle = "#008888";
  ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);
  
  placeButtonHere("Back to Main", 350, canvas.height - 80, "MAIN_MENU", "25px Palatino", "#222");
}