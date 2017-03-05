
var side_bar = new Game_side_bar();

function Game_side_bar() {

  this.progressBarData = {

    exp: {

      X: function() { return canvas.width + playerList[0].X - 440; },
      Y: function() { return playerList[0].Y - 60; },

      textX: function() { return canvas.width + playerList[0].X - 390; },
      textY: function() { return playerList[0].Y - 44; },

      barColor: function() {

        //Exp Bar
        if (playerList[0].level < playerList[0].MAX_level) { return "#0A0"; }

        //Glory Bar
        else { return "orange"; }
      },

      min: function() { 

        playerList[0].glory = playerList[0].EXP / 2000;

        //Exp Bar
        if (playerList[0].level < playerList[0].MAX_level) { return playerList[0].EXP; }

        //Glory Bar
        else { return playerList[0].glory.toFixed(0); }
      },
      max: function() { 

        playerList[0].glory = playerList[0].EXP / 2000;

        //Exp Bar
        if (playerList[0].level < playerList[0].MAX_level) { return playerList[0].levelExpReq; }

        //Glory Bar
        else { return playerList[0].glory.toFixed(0); }
      },  
    },
    hp: {

      X: function() { return canvas.width + playerList[0].X - 440; },
      Y: function() { return playerList[0].Y - 40; },

      textX: function() { return canvas.width + playerList[0].X - 390; },
      textY: function() { return playerList[0].Y - 24; },

      barColor: function() { return "#CD3333"; },

      min: function() { return playerList[0].HP.toFixed(0); },
      max: function() { return playerList[0].MAX_HP.toFixed(0); },
    },
    mana: {

      X: function() { return canvas.width + playerList[0].X - 440; },
      Y: function() { return playerList[0].Y - 20; },

      textX: function() { return canvas.width + playerList[0].X - 390; },
      textY: function() { return playerList[0].Y - 4; },

      barColor: function() { return "#05C"; },

      min: function() { return playerList[0].MP.toFixed(0); },
      max: function() { return playerList[0].MAX_MP.toFixed(0); },
    },
  };

  this.progressBars = {

    exp: new progressBar(this.progressBarData.exp),
    hp: new progressBar(this.progressBarData.hp),
    mana: new progressBar(this.progressBarData.mana),
  };

  this.draw = function() {

    //Top left of player screen
    var absX = playerList[0].X - 250;
    var absY = playerList[0].Y - 300;

    //Lines for box of displaying stats
    ctx.fillStyle = "#000";
    ctx.fillRect(canvas.width - 200 + absX, 0 + absY, 2, canvas.height);
    ctx.fillStyle = "#333";
    ctx.fillRect(canvas.width - 198  + absX, 0 + absY, 198, canvas.height);

    //MINIMAP
    ctx.fillStyle = "#000000";
    ctx.fillRect(canvas.width - 195  + absX, 5 + absY, 190, 190);

    //Glory
    ctx.fillStyle = "Orange";
    ctx.shadowBlur = 3;
    ctx.fillText("Glory: " + playerList[0].deathGlory, canvas.width - 275  + absX, 20 + absY);
    ctx.shadowBlur = 0;

    //Player Info
    ctx.fillStyle = "#BBB";
    ctx.fillText("Name: " + playerList[0].name, canvas.width - 190  + absX, 212 + absY);
    ctx.fillText("Level: " + playerList[0].level, canvas.width - 190  + absX, 230 + absY);

    //Player Stats
    ctx.font = "14px black Palatino";
    ctx.fillText("Attack: " + playerList[0].damage, canvas.width - 185  + absX, 320 + absY);
    ctx.fillText("Speed: " + playerList[0].speed.toFixed(0), canvas.width - 95  + absX, 320 + absY);
    ctx.fillText("Wizardry: " + playerList[0].wizardry, canvas.width - 185  + absX, 340 + absY);
    ctx.fillText("Dexterity: " + playerList[0].dexterity, canvas.width - 95  + absX, 340 + absY);
    ctx.fillText("Youth: " + playerList[0].youth, canvas.width - 185 + absX, 360 + absY);

    //Debug Info
    drawDebugInfo(absX, absY);

    //EXP/HP/MP bars
    ctx.font = "18px Palatino";
    this.progressBars.exp.draw();
    this.progressBars.hp.draw();
    this.progressBars.mana.draw();
  };
}