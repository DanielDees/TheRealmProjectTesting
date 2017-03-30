"use strict";

//Audio Files

//Game Background Music loops with this.
var gameBackgroundMusic = new Audio("sounds/Valiant-Struggle.mp3");
      gameBackgroundMusic.addEventListener('ended', function() {
        this.currentTime = 0;
        this.volume = 0.5;
        this.play();
      }, false);
gameBackgroundMusic.volume = 0.5;
gameBackgroundMusic.play();

//MUTE/UNMUTE
function muteGame () {

  gameBackgroundMusic.pause();
  gameBackgroundMusic.volume = 0;
}
function unMuteGame () {

  gameBackgroundMusic.volume = 0.5;
  gameBackgroundMusic.play();
}
//END MUTE/UNMUTE

//GAME SOUNDS ====================
var potionDrinkSound = new Audio("sounds/potionDrink.wav");
//END GAME SOUNDS ================