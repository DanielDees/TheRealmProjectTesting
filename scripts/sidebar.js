"use strict";

var side_bar = new Game_side_bar();

function Game_side_bar() {

  //Location
  this.X = function() { return FRAME_OF_REFERENCE[0] + canvas.width - 200; };
  this.Y = function() { return FRAME_OF_REFERENCE[1]; };

  this.progressBarData = {

    exp: {

      X: function() { return side_bar.X() + 10; },
      Y: function() { return playerList[0].Y - 60; },

      textX: function() { return side_bar.X() + 60; },
      textY: function() { return playerList[0].Y - 44; },

      barColor: function() {

        //Exp Bar
        if (playerList[0].level < playerList[0].MAX_level) { return "#0A0"; }

        //Glory Bar
        else { return "#DA9009FF"; }
      },

      min: function() { 

        //Exp Bar
        if (playerList[0].level < playerList[0].MAX_level) { return playerList[0].EXP; }

        //Glory Bar
        else { return playerList[0].glory(); }
      },
      max: function() { 

        //Exp Bar
        if (playerList[0].level < playerList[0].MAX_level) { return playerList[0].levelExpReq; }

        //Glory Bar
        else { return playerList[0].glory(); }
      },  
    },
    hp: {

      X: function() { return side_bar.X() + 10; },
      Y: function() { return playerList[0].Y - 40; },

      textX: function() { return side_bar.X() + 60; },
      textY: function() { return playerList[0].Y - 24; },

      barColor: function() { return "#CD443B"; },

      min: function() { return playerList[0].HP.toFixed(0); },
      max: function() { return playerList[0].MAX_HP.toFixed(0); },
    },
    mp: {

      X: function() { return side_bar.X() + 10; },
      Y: function() { return playerList[0].Y - 20; },

      textX: function() { return side_bar.X() + 60; },
      textY: function() { return playerList[0].Y - 4; },

      barColor: function() { return "#1581C8"; },

      min: function() { return playerList[0].MP.toFixed(0); },
      max: function() { return playerList[0].MAX_MP.toFixed(0); },
    },
  };
  this.progressBars = {

    exp: new progressBar(this.progressBarData.exp),
    hp: new progressBar(this.progressBarData.hp),
    mp: new progressBar(this.progressBarData.mp),
  };

  this.drawBg = function() {

    //Side line
    ctx.fillStyle = "#000";
    ctx.fillRect(this.X(), this.Y(), 2, canvas.height);

    //Box
    ctx.fillStyle = "#333";
    ctx.fillRect(this.X() + 2, this.Y(), 198, canvas.height);
  };
  this.drawStats = function() {

    //Glory
    ctx.fillStyle = "orange";
    ctx.shadowBlur = 3;
    ctx.fillText("Glory: " + playerList[0].deathGlory, this.X() - 75, this.Y() + 20);
    ctx.shadowBlur = 0;

    //Player Info
    ctx.fillStyle = "#B8B8B8";
    ctx.fillText("Name: "  + playerList[0].name,  this.X() + 20, this.Y() + 213);
    ctx.fillText("Level: " + playerList[0].level, this.X() + 20, this.Y() + 233);

    //Player Stats
    ctx.font = "16px Courier";
    ctx.fillText("EXP", this.progressBars.hp.X() + 3, this.progressBars.exp.Y() + 14);
    ctx.fillText("HP", this.progressBars.hp.X() + 3, this.progressBars.hp.Y() + 14);
    ctx.fillText("MP", this.progressBars.mp.X() + 3, this.progressBars.mp.Y() + 14);
    ctx.font = "14px Courier";
    ctx.fillText("ATT: " + playerList[0].dmg, this.X() + 20,  this.Y() + 320);
    ctx.fillText("SPD: " + playerList[0].spd, this.X() + 110, this.Y() + 320);
    ctx.fillText("WIS: " + playerList[0].wis, this.X() + 20,  this.Y() + 340);
    ctx.fillText("DEX: " + playerList[0].dex, this.X() + 110, this.Y() + 340);
    ctx.fillText("VIT: " + playerList[0].wis, this.X() + 20,  this.Y() + 360);
  };
  this.drawStatBars = function() {

    //EXP/HP/MP bars
    ctx.font = "18px Palatino";
    this.progressBars.exp.draw();
    this.progressBars.hp.draw();
    this.progressBars.mp.draw();
  };

  this.draw = function() {

    //Background
    this.drawBg();

    //Mini-Map
    mini_map.draw();

    //Show Exp/Hp/Mp bars
    this.drawStatBars();

    //Show player stats
    this.drawStats();

    //Debug Info
    //drawDebugInfo();
  };
}