// ==== GLOBAL ====
let invertColors = false;
let volumeOn = false;
let dialogueElement;
let currentQuestion = 0;
let typing = false;
let phase = "start"; // start → questions → instructions → free 

// links to sketch.js globals: crackEnabled, waveLayers, waveHeight
let choiceContainer;
// ==== HELPER: random pick ====
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ==== QUESTIONS ====
let questions = [
  {
    text: "Did you have people who truly know you?",
    type: "yn",
    onAnswer: (ans) => {
      weatherMode = (ans === "y") ? "snow" : "rain";
      updateWeatherSound();
      if (ans === "y") {
        return pickRandom([
          "Your life is touched by connection, and this presence holds value. It is good to acknowledge those who see you as you are.",
          "You are surrounded by souls who truly know you. Allow yourself to appreciate the depth of these connections.",
          "Your life is brightened by those who understand you. It is good to recognize and value their presence."
        ]);
      } else {
        return pickRandom([
          "Your life carries a quiet weight, yet it is not without purpose. It is acceptable to continue seeking those who will understand you.",
          "The absence of true understanding marks your current life, but this is not the end of your journey. It is alright to continue seeking connection with care.",
          "You walk a path of reflection that few may share. Allow yourself the time to find those who will see you clearly."
        ]);
      }
    }
  },
    {
    text: "Have you forgiven yourself for your own mistakes?",
    type: "yn",
    onAnswer: (ans) => {
      playSound(circleSfx);
      gsap.to(state, { cirlceOPacity: 255, duration: 2, ease: "power2.out" });
      crackEnabled = (ans === "n");
      
      if (ans === "y") {
        return pickRandom([
          "Your life carries the ease of self-acceptance. It is good to honor the peace you have granted yourself.",
          "The act of forgiveness rests within you. Allow yourself to continue forward with this clarity.",
          "You have reconciled with your past error. It is acceptable to move with grace from this understanding."
        ]);
      } else {
        return pickRandom([
          "Your life carries the weight of past errors. It is acceptable to approach yourself with patience and understanding.",
          "The memory of your mistake remains within you. Allow yourself time to find reconciliation and peace.",
          "You are marked by experiences yet to be fully forgiven. It is alright to move gently toward self-acceptance."
        ]);
      }
    }
  },
  {
    text: "How many people do you love?",
    type: "number",
    onAnswer: (num) => {
      waveLayers = num; 
      playSound(waveSfx);
      gsap.to(state, { waveOffsetY: 0, duration: 2, ease: "power2.out" });
      if (num === 0) {
        return pickRandom([
          "Your life reflects moments yet to be shared in full devotion. It is acceptable to open your heart when the time feels right.",
          "The capacity for unconditional love remains within you, even if unexpressed. Allow yourself patience as connections grow.",
          "You walk a path where love has yet to be given completely. It is alright to prepare your heart for those you may cherish in the future."
        ]);
      } else if (num < 4) {
        return pickRandom([
          "Your life holds bonds of deep care, small but meaningful. It is good to nurture these connections gently.",
          "The love you give touches those you hold close. Allow yourself to honor and protect these relationships.",
          "You are capable of profound affection, even if for a few. Take comfort in the depth of these connections."
        ]);
      } else {
        return pickRandom([
          "Your life is rich with care and devotion toward others. It is good to recognize the strength of these bonds.",
          "The love you give spreads across many lives, creating warmth and connection. Allow yourself to honor the depth of this affection.",
          "You are surrounded by those who feel your unconditional care. Take comfort in the abundance of these relationships."
        ]);
      }
    }
  },
  {
    text: "Have you completed your dreams?",
    type: "yn",
    onAnswer: (ans) => {
      if (ans === "y") {
        gsap.to(state, { waveHeight: 100, duration: 3, ease: "power2.out" });
        waveHeight = 100;
      } else {
        gsap.to(state, { waveHeight: 300, duration: 3, ease: "power2.out" });
        waveHeight = 300;
      }
      
      if (ans === "y") {
        return pickRandom([
          "Your life bears the mark of achievement and fulfillment. It is good to acknowledge the work that brought you here.",
          "The dreams you pursued have reached their conclusion. Allow yourself to take pride in this accomplishment.",
          "You have realized what you once sought. It is acceptable to honor the journey that led to this moment."
        ]);
      } else {
        return pickRandom([
          "Your life holds aspirations yet to be fulfilled. It is acceptable to continue moving toward them at your own pace.",
          "The path of your dreams remains open and unfinished. Allow yourself patience as you pursue what matters.",
          "You carry goals that have not yet reached their conclusion. It is alright to take steady steps toward them."
        ]);
      }
    }
  },

  {
    text: "Did you feel like you have wasted your time?",
    type: "yn",
    onAnswer: (ans) => {
      //crackEnabled = (ans === "n");
      if (ans === "n") {
        return pickRandom([
          "Your life is measured by experience, not only by accomplishment. It is acceptable to acknowledge the passage of time without regret.",
          "The hours you have spent carry their own lessons. Allow yourself to move forward with awareness and care.",
          "You perceive time as lost, yet it has shaped your journey. It is alright to accept what has passed and continue onward."
        ]);
      } else {
        return pickRandom([
          "Your life is marked by purpose and attentive action. It is good to acknowledge the value of your time.",
          "The moments you have lived carry meaning and impact. Allow yourself to recognize the worth of your experiences.",
          "You perceive your time as well-spent and meaningful. It is acceptable to honor the way you have lived."
        ]);
      }
    }
  },
{
  text: "Would you live differently if you had the chance?",
  type: "yn",
  onAnswer: (ans) => {
    if (ans === "y") {
      playSound(invertSfx);
      // Trigger the invert animation if not already inverted
      if (!invertColors) {
        invertColors = true;
        let invertObj = { progress: 0 };
        gsap.to(invertObj, {
          progress: 1,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            const v = invertObj.progress;
            const filterStr = `invert(${v}) hue-rotate(${v * 180}deg)`;
            getCanvasElt().style.filter = filterStr;
            document.querySelectorAll('#text-layer, #choice-container, #instruction-box, #instruction-icon, #volume-icon').forEach(el => {
              el.style.filter = filterStr;
            });
          }
        });
      }

      // Return original "yes" dialogue\
      return pickRandom([
        "Your life carries the weight of reflection and possibility. It is acceptable to acknowledge the desire for change.",
        "The path you walked invites reconsideration in hindsight. Allow yourself to honor the lessons of your choices.",
        "You perceive opportunities for a different life. It is alright to recognize what might have been without dwelling upon it."
      ]);
    
    } else {
      // Answer is "no", no inversion
      invertColors = false;
      applyInvert(false);

      // Return original "no" dialogue
      return pickRandom([
        "Your life is accepted as it has unfolded. It is good to recognize the path you have chosen.",
        "The choices you have made are honored in their entirety. Allow yourself to move forward with confidence in your journey.",
        "You perceive your life as complete in its course. It is acceptable to embrace the way things have been."
      ]);
    }
  }
}


];

// ==== HELPERS ====
function gsapTypewriter(text, callback) {
  typing = true;
  dialogueElement.innerHTML = "";
  let chars = text.split("");
  let obj = { i: 0 };

  gsap.to(obj, {
    i: chars.length,
    duration: chars.length * 0.02,
    ease: "none",
    onStart: () => playSound(dialogueSfx), // play once at the start
    onUpdate: () => {
      dialogueElement.innerHTML = chars.slice(0, Math.floor(obj.i)).join("");
    },
    onComplete: () => {
      typing = false;
      if (callback) callback();
    }
  });
}

function askQuestion() {
  if (currentQuestion < questions.length) {
    let q = questions[currentQuestion];
    gsapTypewriter(q.text, () => {
      showChoices(q);
    });
  } else {
    gsapTypewriter(
      "Your presence has been acknowledged. May the light guide your path in the afterlife.",
      () => {
        const endProceed = () => {
          // fade out last dialogue
          gsap.to(dialogueElement, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              dialogueElement.innerHTML = "";
              dialogueElement.style.opacity = 1;
              proceedToInstructions(); // go straight to instructions
            }
          });
        };

        // instead of waiting twice, do it once
        document.addEventListener("click", endProceed, { once: true });
        document.addEventListener("keydown", (e) => {
          if (e.key === "Enter") endProceed();
        }, { once: true });
      }
    );
    choiceContainer.innerHTML = "";
  }

}

function showChoices(q) {
  choiceContainer.innerHTML = ""; // clear old buttons

  if (q.type === "yn") {
    ["y", "n"].forEach(ans => {
      let btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = (ans === "y") ? "Yes" : "No";

      // Play hover sound
      btn.addEventListener("mouseenter", () => playSound(hoverSfx));

      // Play click sound
      btn.onclick = () => {
        playSound(clickSfx);
        handleAnswer(ans);
        choiceContainer.innerHTML = "";
      };

      choiceContainer.appendChild(btn);
    });
  } else if (q.type === "number") {
    let input = document.createElement("input");
    input.type = "number";
    input.className = "choice-input";
    input.id = "number"; // give it the custom font
    input.placeholder = "Enter a number...";
    
    let btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = "Confirm";

    // Hover
    btn.addEventListener("mouseenter", () => playSound(hoverSfx));
    
    // Click
    btn.onclick = () => {
      playSound(clickSfx);
      if (input.value !== "") {
        handleAnswer(parseInt(input.value));
        choiceContainer.innerHTML = "";
      }
    };

    choiceContainer.appendChild(input);
    choiceContainer.appendChild(btn);
    input.focus();
  }
}

function handleAnswer(ans) {
  let q = questions[currentQuestion];
  let response = q.onAnswer(ans);

  gsap.to(dialogueElement, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      dialogueElement.innerHTML = "";
      dialogueElement.style.opacity = 1;
      gsapTypewriter(response, () => {
        const proceed = () => {
          document.removeEventListener("keydown", keyNext);
          document.removeEventListener("click", clickNext);
          currentQuestion++;
          askQuestion();
        };

        function keyNext(e) {
          if (e.key === "Enter") {
            e.preventDefault();
            proceed();
          }
        }

        function clickNext(e) {
          e.preventDefault();
          proceed();
        }

        document.addEventListener("keydown", keyNext);
        document.addEventListener("click", clickNext);
      });
    }
  });
}

// ==== START & INSTRUCTION LOGIC ====
const startScreen = document.getElementById("start-screen");
const instructionIcon = document.getElementById("instruction-icon");
const instructionBox = document.getElementById("instruction-box");
const instructionOk = document.querySelector(".instruction-ok");

// overlay element
let overlay = document.createElement("div");
overlay.id = "overlay";
document.body.appendChild(overlay);
overlay.style.display = "none";

// Start click
startScreen.addEventListener("click", () => {
  if (phase === "start") {
    phase = "questions";
    gsap.to(startScreen, { opacity: 0, duration: 1, onComplete: () => {
      startScreen.style.display = "none";
      askQuestion();
    }});
  }
});

function proceedToInstructions() {
  if (phase === "questions") {
    phase = "instructions";
    instructionIcon.style.display = "block";
    showInstructionBox();
    phase = "free"; // unlock controls after this
  }
}


function showInstructionsOnce() {
  instructionIcon.style.display = "block";
  showInstructionBox();
  phase = "free"; // unlock controls after this
}

// Instruction icon toggle
instructionIcon.addEventListener("click", () => {
  if (phase === "free") showInstructionBox();
});

function showInstructionBox() {
  overlay.style.display = "block";
  instructionBox.style.display = "block";
  gsap.fromTo(instructionBox, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 });
}

// OK button closes
instructionOk.addEventListener("mouseenter", () => playSound(hoverSfx));
instructionOk.addEventListener("click", () => {
  playSound(clickSfx);
  gsap.to(instructionBox, { scale: 0.8, opacity: 0, duration: 0.3, onComplete: () => {
    instructionBox.style.display = "none";
    overlay.style.display = "none";
  }});
});



// === VOLUME TOGGLE ===

const volumeIcon = document.getElementById("volume-icon").querySelector("i");

// helper: mute/unmute all audio/video and Tone if present
function setSiteVolume(on) {
  volumeOn = on;
  
  [bgMusic, rainSound, dialogueSfx, hoverSfx, clickSfx, circleSfx, invertSfx, waveSfx].forEach(audio => {
    audio.muted = !on;
  });

  // If turning volume on, make sure bgMusic is actually playing
  if (on && bgMusic.paused) {
    bgMusic.play().catch(()=> {
      console.log("Background music play blocked. Will try again on next user interaction.");
    });
  }

  const icon = document.querySelector('#volume-icon i');
  if (icon) icon.className = on ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
}



function toggleVolume() {
  volumeOn = !volumeOn;
  setSiteVolume(volumeOn);
  updateWeatherSound();
  const icon = document.querySelector('#volume-icon i');
  if (icon) {
    icon.className = volumeOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
  }
  console.log('Volume now:', volumeOn ? 'ON' : 'OFF');
}

// Always listen, no matter the phase
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "m") {
    toggleVolume();
  }
});


// Click event
volumeIcon.addEventListener("click", toggleVolume);

// Key press (M for mute/unmute)
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "m") {
    toggleVolume();
  }
});

// Helper: find canvas
function getCanvasElt() {
  if (typeof canvas !== 'undefined' && canvas && canvas.elt) return canvas.elt;
  return document.querySelector('canvas');
}

function applyInvert(on) {
  // invert ONLY canvas
  if (typeof canvas !== 'undefined' && canvas) {
    canvas.elt.style.filter = on ? "invert(1) hue-rotate(180deg)" : "";
  }

  // invert UI separately
  document.querySelectorAll('#text-layer, #choice-container, #instruction-box, #instruction-icon, #volume-icon').forEach(el => {
    el.style.filter = on ? "invert(1) hue-rotate(180deg)" : "";
  });
}


// Cycle weather mode
function cycleWeather() {
  if (weatherMode === 'none') weatherMode = 'rain';
  else if (weatherMode === 'rain') weatherMode = 'snow';
  else weatherMode = 'none';
  console.log('Weather:', weatherMode);
  updateWeatherSound();
}

// === KEYBOARD HANDLER ===
document.addEventListener('keydown', (e) => {
  if (typing) return;

  // Always allow volume toggle with M
  if (e.key.toLowerCase() === 'm') {
    toggleVolume();
    return;
  }

  // Only unlock the rest after "free" phase
  if (phase !== 'free') return;

  if (e.key.toLowerCase() === 'r') {
    cycleWeather();
    return;
  }

  if (e.key.toLowerCase() === 'c') {
    crackEnabled = !crackEnabled;
    console.log("Cracks:", crackEnabled ? "ON" : "OFF");
    return;
  }

  if (e.key.toLowerCase() === 'i') {
    invertColors = !invertColors;
    applyInvert(invertColors);
    return;
  }

  if (e.key === 'ArrowUp') {
    state.waveHeight = (state.waveHeight || 0) + 20;
    console.log("waveHeight:", state.waveHeight);
    return;
  }
  if (e.key === 'ArrowDown') {
    state.waveHeight = Math.max(0, (state.waveHeight || 0) - 20);
    console.log("waveHeight:", state.waveHeight);
    return;
  }

  if (/^[1-9]$/.test(e.key)) {
    waveLayers = parseInt(e.key, 10);
    console.log("waveLayers:", waveLayers);
    return;
  }

  if (e.key.toLowerCase() === 's') {
    if (typeof saveCanvas === 'function' && typeof canvas !== 'undefined') {
      if (invertColors) {
        filter(INVERT); // temporarily invert for screenshot
      }

      saveCanvas(canvas, 'screenshot', 'png');

      if (invertColors) {
        filter(INVERT); // undo inversion after screenshot
      }
    } else {
      const c = getCanvasElt();
      if (!c) return;
      const a = document.createElement('a');
      a.href = c.toDataURL('image/png');
      a.download = 'screenshot.png';
      a.click();
    }
  }

});

// ==== AUDIO SETUP WITH PRELOAD ====

// Helper to preload audio and ensure canplaythrough
function preloadAudio(url, loop = false, volume = 0.5) {
  const audio = new Audio();
  audio.src = url;
  audio.loop = loop;
  audio.volume = volume;
  audio.preload = "auto";
  audio.muted = true; // <-- ensure muted to allow autoplay

  audio.isReady = false;
  audio.addEventListener('canplaythrough', () => {
    audio.isReady = true;
    console.log("Audio loaded:", url);
  });

  return audio;
}


// Background music
const bgMusic = preloadAudio(
  "https://kvsx0810.github.io/Interactive1-A3/Assets/DSGNDron_Angelic,%20Synthetic,%20Loop,%20Key%20Amin_Ocular%20Sounds_Granular%20Drones_The%20Complete%20Drones%20Collection.wav",
  true, 0.4
);

// Rain sound
const rainSound = preloadAudio(
  "https://kvsx0810.github.io/Interactive1-A3/Assets/RAIN_S~4.WAV",
  true, 0.8
);

// Dialogue typing sound
const dialogueSfx = preloadAudio(
  "https://kvsx0810.github.io/Interactive1-A3/Assets/COMCam_Very%20Short%20Click_Ocular%20Sounds_Camera%20Shutters_The%20Cinematic%20Elements%20Collection.wav",
  false, 0.1
);

// Hover & click sounds
const hoverSfx = preloadAudio(
  "https://kvsx0810.github.io/Interactive1-A3/Assets/159698__qubodup__scroll-step-hover-sound-for-user-interface.flac",
  false, 0.4
);
const clickSfx = preloadAudio(
  "https://kvsx0810.github.io/Interactive1-A3/Assets/159698__qubodup__scroll-step-hover-sound-for-user-interface.flac",
  false, 0.5
);

//Casting sounds
const circleSfx = preloadAudio(
  "https://kvsx0810.github.io/Interactive1-A3/Assets/casting-magic-3-382381.mp3",
  false, 0.3
);
const invertSfx = preloadAudio(
  "https://kvsx0810.github.io/Interactive1-A3/Assets/magic-spell-333896.mp3",
  false, 0.3
);
const waveSfx = preloadAudio(
  "https://kvsx0810.github.io/Interactive1-A3/Assets/stone-push-37412.mp3",
  false, 0.3
);

// Play helper respecting volume and ready state
function playSound(sound) {
  if (!volumeOn) return;
  if (!sound.isReady) {
    // try again once ready
    sound.addEventListener('canplaythrough', () => {
      if (!volumeOn) return;
      sound.currentTime = 0;
      sound.play().catch(()=>{}); // prevent uncaught promise error
    }, { once: true });
  } else {
    sound.currentTime = 0;
    sound.play().catch(()=>{});
  }
}

// ==== WEATHER AUDIO FIX ====
let rainPlaying = false;

function updateWeatherSound() {
  if (weatherMode === "rain") {
    if (!rainPlaying) {
      rainSound.loop = true;
      rainSound.currentTime = 0;
      if (volumeOn) rainSound.play().catch(()=>{});
      rainPlaying = true;
    }
  } else {
    rainSound.pause();
    rainPlaying = false;
  }
}

// ==== INIT ====
window.addEventListener("DOMContentLoaded", () => {
    // Ensure music is ready
    bgMusic.play().catch(() => {
    console.log("Autoplay blocked, waiting for user interaction");
    });

  // Create dialogue and choice containers
  choiceContainer = document.createElement("div");
  choiceContainer.id = "choice-container";
  document.body.appendChild(choiceContainer);

  dialogueElement = document.createElement("div");
  dialogueElement.id = "text-layer";
  document.body.appendChild(dialogueElement);

  // Initially hide instruction icon & box
  instructionIcon.style.display = "none";
  instructionBox.style.display = "none";

  // Only listen for Enter when number input is active
  document.addEventListener("keydown", (e) => {
    if (typing) return;

    const numInput = document.querySelector(".choice-input");
    if (numInput && document.activeElement === numInput) {
      if (e.key === "Enter" && numInput.value !== "") {
        e.preventDefault();
        handleAnswer(parseInt(numInput.value));
        choiceContainer.innerHTML = "";
      }
    }
  });
});