// globals
const clueHoldTime = 1000;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;
var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var progress = 0;
var guessCounter = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;



// button effects
function lightButton(btn){
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn){
  document.getElementById("button" + btn).classList.remove("lit");
}

// logic
function guess(btn){
  console.log("user guessed: " + btn);
  
  if(!gamePlaying){
    return;
  }
  
  var guess = btn; // user guess
  var correctBtn = pattern[guessCounter]; // correct pattern
  
  if(guess == correctBtn) { // correct guess
    if(guessCounter == progress) { // turn is over
      if(progress == pattern.length - 1) { // last turn
        winGame();
      }
      else {
        // play next sequance
        progress++;
        playClueSequence();
      }
    }
    else {
      // more turns to go
      guessCounter++;
    }
  }
  else { // wrong guess
    loseGame();
  }
  
}


// clues
function playSingleClue(btn){
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}
function playClueSequence(){
  guessCounter = 0;
  context.resume();
  let delay = nextClueWaitTime;
  
  for (let i = 0; i <= progress; i++) {
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    
    setTimeout(playSingleClue, delay, pattern[i]);
    
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

// game lost
function loseGame() {
  stopGame();
  alert("Game Over ... You lose!");
}

// game win
function winGame() {
  stopGame();
  alert("Game Over ... YOU WON!!!");
}


function startGame() {
  // init
  console.log("Game started ...")
  progress = 0;
  gamePlaying = true;
  
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  
  playClueSequence();
}

function stopGame() {
  // exit
  console.log("Exiting ...")
  gamePlaying = false;
  
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}


// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

