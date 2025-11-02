// --- Story Setup ---
const cutscenes = [
  {
    title: "Cutscene 1 — Leaving Home",
    background: "assets/backgrounds/home.jpg",
    sound: "assets/sounds/city.mp3",
    dialogues: [
      { name: "Narrator", text: "The sun sets over the narrow streets of North Haven." },
      { name: "Narrator", text: "Vic ties his sneakers, eyes restless, hiding a storm beneath." },
      { name: "Mom", text: "Vic, dinner will be ready soon! Where are you going?" },
      { name: "Vic", text: "Just heading out to play basketball with the guys, mom. Won't be long." },
      { name: "Narrator", text: "He grabs his jacket, forcing a smile. It's a lie — one that weighs heavier than his footsteps." },
      {
        name: "System",
        text: "Make a choice:",
        choice: [
          { text: "Tell the truth", nextText: "Vic hesitates but says: 'I'm going to settle something, mom.' She looks confused as he leaves." },
          { text: "Keep lying", nextText: "Vic forces a grin and walks out, hiding the gun under his jacket." }
        ]
      }
    ]
  },
  {
    title: "Cutscene 2 — The Gun Deal",
    background: "assets/backgrounds/alley.jpg",
    sound: "assets/sounds/alley.mp3",
    dialogues: [
      { name: "Narrator", text: "A dim alley behind an old warehouse. Leon waits, cigarette glowing like a tiny ember." },
      { name: "Leon", text: "You sure about this, kid? This ain't a toy." },
      { name: "Vic", text: "I've never been more sure in my life." },
      { name: "Leon", text: "You turn 18 yesterday, now you're asking for a pistol. What the hell happened?" },
      { name: "Vic", text: "Let's just say I found out something that changes everything." },
      { name: "Leon", text: "Fine. But remember — once you pull that trigger, there's no turning back."},
      {
        name: "System",
        text: "Make a choice:",
        choice: [
          { text: "Take the gun silently", nextText: "Vic nods, his hands shaking slightly as he grips the weapon." },
          { text: "Refuse for a moment", nextText: "Vic pauses, but the storm in his eyes doesn't fade. 'Give it to me, Leon.'" }
        ]
      }
    ]
  },
  {
    title: "Cutscene 3 — The Cottage at Atticus Lake",
    background: "assets/backgrounds/lake.jpg",
    sound: "assets/sounds/lake.mp3",
    dialogues: [
      { name: "Narrator", text: "The moonlight spills over the quiet waters of Atticus Lake." },
      { name: "Vic", text: "There he is. The man who ruined everything." },
      { name: "Narrator", text: "Vic sneaks in. The floorboards creak, his heart louder than his steps." },
      { name: "Vic", text: "Don't move. You know why I'm here." },
      { name: "Old Man", text: "If you're going to shoot me… open the drawer. There's an album inside." },
      { name: "Narrator", text: "Vic opens it — and freezes. The photos show the man, a woman, and a child — him." },
      { name: "Old Man", text: "I'm your real father, son." },
      { name: "Narrator", text: "Vic trembles, the truth shaking his hand on the trigger."},
      {
        name: "System",
        text: "Make a choice:",
        choice: [
          { text: "Shoot", nextText: "Vic pulls the trigger. Silence follows. Only the lake watches." },
          { text: "Spare", nextText: "Vic lowers the gun, tears falling freely. 'You don't deserve to die… not yet.'" }
        ]
      }
    ]
  }
];

// --- DOM References ---
const titleEl = document.getElementById("title");
const nameEl = document.getElementById("name");
const textEl = document.getElementById("text");
const nextBtn = document.getElementById("nextBtn");
const skipBtn = document.getElementById("skipBtn");
const startMission = document.getElementById("startMission");
const indicator = document.getElementById("cutsceneIndicator");
const choicesContainer = document.getElementById("choices");
const backgroundEl = document.getElementById("background");

// --- Audio ---
let bgAudio = new Audio();
bgAudio.loop = true;

let currentCutscene = 0;
let dialogueIndex = 0;

// --- Core Functions ---
function playSoundtrack(src) {
  if (!src) return; // Skip if no sound file
  
  // Stop current audio completely
  bgAudio.pause();
  bgAudio.currentTime = 0;
  
  // Create fresh audio object for each sound
  bgAudio = new Audio(src);
  bgAudio.loop = true;
  bgAudio.volume = 0.4;
  
  // Add event listeners for debugging
  bgAudio.addEventListener('loadeddata', () => {
    console.log("Audio loaded successfully:", src);
  });
  
  bgAudio.addEventListener('error', (e) => {
    console.error("Audio loading error:", src, e);
  });
  
  // Play with error handling
  const playPromise = bgAudio.play();
  if (playPromise !== undefined) {
    playPromise.catch(err => {
      console.warn("Audio playback failed:", src, err);
      // User interaction might be needed - show a message
      console.log("Try clicking anywhere on the page to enable audio");
    });
  }
}

function changeBackground(imgSrc) {
  backgroundEl.style.opacity = 0;
  setTimeout(() => {
    backgroundEl.style.backgroundImage = `url(${imgSrc})`;
    backgroundEl.style.opacity = 1;
  }, 500);
}

function showDialogue(i) {
  const d = cutscenes[currentCutscene].dialogues[i];
  
  // Reset and prepare
  choicesContainer.innerHTML = "";
  textEl.style.opacity = 0;
  
  // Set content
  nameEl.textContent = d.name + ":";
  textEl.textContent = d.text;
  
  // Fade in text after a brief delay
  setTimeout(() => {
    textEl.style.opacity = 1;
  }, 200);

  // Handle choices
  if (d.choice) {
    // Hide next button until a choice is made
    nextBtn.style.display = "none";
    nextBtn.disabled = true;
  
    // Create choice buttons
    d.choice.forEach((option) => {
      const btn = document.createElement("button");
      btn.classList.add("choiceBtn");
      btn.textContent = option.text;
  
      btn.onclick = () => {
        // Fade out current text
        textEl.style.opacity = 0;
        // Remove all choices smoothly
        choicesContainer.style.opacity = 0;
  
        setTimeout(() => {
          choicesContainer.innerHTML = "";
          choicesContainer.style.opacity = 1;
          textEl.textContent = option.nextText;
          textEl.style.opacity = 1;
  
          // ✅ Now wait for user to click NEXT manually
          nextBtn.style.display = "inline-block";
          nextBtn.disabled = false;
        }, 400);
      };
  
      choicesContainer.appendChild(btn);
    });
  } else {
    nextBtn.disabled = false;
    nextBtn.style.display = "inline-block";
  }
}

function updateCutsceneHeader() {
  const total = cutscenes.length;
  indicator.textContent = `Cutscene ${currentCutscene + 1} of ${total}`;
  titleEl.textContent = cutscenes[currentCutscene].title;
}

function nextDialogue() {
  dialogueIndex++;
  const dialogues = cutscenes[currentCutscene].dialogues;
  if (dialogueIndex < dialogues.length) {
    showDialogue(dialogueIndex);
  } else {
    nextCutscene();
  }
}

function skipCutscene() {
  nextCutscene();
}

function nextCutscene() {
  currentCutscene++;
  if (currentCutscene < cutscenes.length) {
    dialogueIndex = 0;
    const currentScene = cutscenes[currentCutscene];
    updateCutsceneHeader();
    changeBackground(currentScene.background);
    playSoundtrack(currentScene.sound);
    showDialogue(dialogueIndex);
  } else {
    endAllCutscenes();
  }
}

function endAllCutscenes() {
  nameEl.textContent = "";
  textEl.textContent = "End of cutscenes. Vic's story begins...";
  textEl.style.opacity = 1;
  nextBtn.style.display = "none";
  skipBtn.style.display = "none";
  startMission.style.display = "block";
  bgAudio.pause();
  backgroundEl.style.opacity = 0.3;
}

startMission.addEventListener("click", () => {
  textEl.textContent = "MISSION START: Vic steps into the night, his destiny uncertain...";
  startMission.style.display = "none";
  backgroundEl.style.background = "#000";
});

// --- Initialize ---
function startGame() {
  const currentScene = cutscenes[currentCutscene];
  updateCutsceneHeader();
  changeBackground(currentScene.background);
  playSoundtrack(currentScene.sound);
  showDialogue(dialogueIndex);
}

nextBtn.addEventListener("click", nextDialogue);
skipBtn.addEventListener("click", skipCutscene);

startGame();