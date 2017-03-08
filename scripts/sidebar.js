
var side_bar = new Game_side_bar();

function Game_side_bar() {

  //Location
  this.X = function() { return playerList[0].X - 250; };
  this.Y = function() { return playerList[0].Y - 300; };

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

  this.drawBg = function() {

    //Side line
    ctx.fillStyle = "#000";
    ctx.fillRect(canvas.width - 200 + this.X(), this.Y(), 2, canvas.height);

    //Box
    ctx.fillStyle = "#333";
    ctx.fillRect(canvas.width - 198  + this.X(), this.Y(), 198, canvas.height);
  };
  this.drawStats = function() {

    //Glory
    ctx.fillStyle = "Orange";
    ctx.shadowBlur = 3;
    ctx.fillText("Glory: " + playerList[0].deathGlory.toFixed(0), canvas.width - 275  + this.X(), 20 + this.Y());
    ctx.shadowBlur = 0;

    //Player Info
    ctx.fillStyle = "#BBB";
    ctx.fillText("Name: " + playerList[0].name, canvas.width - 190  + this.X(), 212 + this.Y());
    ctx.fillText("Level: " + playerList[0].level, canvas.width - 190  + this.X(), 230 + this.Y());

    //Player Stats
    ctx.font = "14px black Palatino";
    ctx.fillText("Attack: " + playerList[0].damage, canvas.width - 185  + this.X(), 320 + this.Y());
    ctx.fillText("Speed: " + playerList[0].speed.toFixed(0), canvas.width - 95  + this.X(), 320 + this.Y());
    ctx.fillText("Wizardry: " + playerList[0].wizardry, canvas.width - 185  + this.X(), 340 + this.Y());
    ctx.fillText("Dexterity: " + playerList[0].dexterity, canvas.width - 95  + this.X(), 340 + this.Y());
    ctx.fillText("Youth: " + playerList[0].youth, canvas.width - 185 + this.X(), 360 + this.Y());
  };
  this.drawStatBars = function() {

    //EXP/HP/MP bars
    ctx.font = "18px Palatino";
    this.progressBars.exp.draw();
    this.progressBars.hp.draw();
    this.progressBars.mana.draw();
  };

  this.draw = function() {

    //Background
    this.drawBg();

    //Mini-Map
    mini_map.draw();

    //Show player stats
    this.drawStats();

    //Show Exp/Hp/Mp bars
    this.drawStatBars();

    //Debug Info
    //drawDebugInfo();
  };
}