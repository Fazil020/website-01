const PASSWORD = "1622";

const lockScreen = document.getElementById("lockScreen");
const mainSite = document.getElementById("mainSite");
const unlockForm = document.getElementById("unlockForm");
const secretCode = document.getElementById("secretCode");
const errorMessage = document.getElementById("errorMessage");

unlockForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = secretCode.value.trim();

  if (value === PASSWORD) {
    errorMessage.textContent = "";
    lockScreen.classList.add("unlocked");

    // Give the envelope animation a moment before revealing the site.
    setTimeout(() => {
      lockScreen.style.transition = "opacity .7s ease, transform .7s ease";
      lockScreen.style.opacity = "0";
      lockScreen.style.transform = "scale(1.03)";
    }, 850);

    setTimeout(() => {
      lockScreen.classList.add("hidden");
      mainSite.classList.remove("hidden");
      window.scrollTo({top: 0, behavior: "instant"});
      startSparkles();
    }, 1500);
  } else {
    errorMessage.textContent = "Oops... that's not the magic number 🥺❤️ Try again.";
    secretCode.value = "";
    secretCode.focus();
    lockScreen.animate(
      [{transform:"translateX(0)"},{transform:"translateX(-7px)"},{transform:"translateX(7px)"},{transform:"translateX(0)"}],
      {duration:280}
    );
  }
});

document.querySelectorAll(".scroll-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById(btn.dataset.target)?.scrollIntoView({behavior:"smooth"});
  });
});

/* PHOTO LIGHTBOX */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");

document.querySelectorAll(".photo-card").forEach(card => {
  card.addEventListener("click", () => {
    lightboxImg.src = card.dataset.full;
    lightboxImg.alt = card.querySelector("img")?.alt || "Photo";
    lightboxCaption.textContent = card.dataset.caption || "";
    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

function closeLightbox() {
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* MUSIC */
const song = document.getElementById("song");
const playBtn = document.getElementById("playBtn");
const muteBtn = document.getElementById("muteBtn");
const musicStatus = document.getElementById("musicStatus");
const musicCard = document.querySelector(".music-card");

playBtn.addEventListener("click", async () => {
  try {
    if (song.paused) {
      await song.play();
      playBtn.textContent = "❚❚";
      musicStatus.textContent = "Playing your song... ♪ ♥";
      musicCard.classList.add("playing");
    } else {
      song.pause();
      playBtn.textContent = "▶";
      musicStatus.textContent = "Paused... tap play whenever you want. ✨";
      musicCard.classList.remove("playing");
    }
  } catch (error) {
    musicStatus.textContent = "Add music/song.mp3, then tap play again. 🎵";
  }
});

muteBtn.addEventListener("click", () => {
  song.muted = !song.muted;
  muteBtn.textContent = song.muted ? "🔇" : "🔊";
});

song.addEventListener("ended", () => {
  playBtn.textContent = "▶";
  musicStatus.textContent = "That was your little soundtrack. ♥";
  musicCard.classList.remove("playing");
});

/* LETTER */
const letterButton = document.getElementById("letterButton");
const letter = document.getElementById("letter");

letterButton.addEventListener("click", () => {
  const isOpen = letterButton.classList.toggle("open");
  letterButton.setAttribute("aria-expanded", String(isOpen));
  letter.setAttribute("aria-hidden", String(!isOpen));

  if (isOpen) {
    setTimeout(() => {
      letter.classList.add("show");
      typeLetter();
    }, 500);
  } else {
    letter.classList.remove("show");
  }
});

/* Gentle paragraph-by-paragraph reveal instead of an overly fast typewriter. */
function typeLetter() {
  if (letter.dataset.revealed === "true") return;
  letter.dataset.revealed = "true";

  const paragraphs = [...letter.querySelectorAll("p")];
  paragraphs.forEach((p, index) => {
    const text = p.textContent;
    p.textContent = "";
    let i = 0;
    setTimeout(() => {
      const timer = setInterval(() => {
        p.textContent += text[i++];
        if (i >= text.length) clearInterval(timer);
      }, 13);
    }, index * 650);
  });
}

/* Decorative sparkle burst after unlock. */
function startSparkles() {
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const s = document.createElement("span");
      s.textContent = i % 3 === 0 ? "♥" : "✦";
      s.style.position = "fixed";
      s.style.left = `${10 + Math.random() * 80}%`;
      s.style.top = `${18 + Math.random() * 60}%`;
      s.style.zIndex = "90";
      s.style.pointerEvents = "none";
      s.style.color = i % 2 ? "#7d1d39" : "#c78c74";
      s.style.fontSize = `${10 + Math.random() * 14}px`;
      s.animate(
        [{transform:"translateY(20px) scale(.4)",opacity:0},
         {transform:"translateY(0) scale(1)",opacity:1},
         {transform:`translate(${(Math.random()-.5)*90}px,-${30+Math.random()*80}px) scale(.5)`,opacity:0}],
        {duration:900+Math.random()*500,easing:"ease-out"}
      ).onfinish = () => s.remove();
      document.body.appendChild(s);
    }, i * 55);
  }
}

/* Friendly fallback for missing sample photos. */
document.querySelectorAll(".photo-card img").forEach(img => {
  img.addEventListener("error", () => {
    img.style.display = "none";
    const fallback = document.createElement("div");
    fallback.className = "missing-photo";
    fallback.textContent = "Replace this with her photo ♥";
    fallback.style.cssText = "aspect-ratio:4/5;display:grid;place-items:center;text-align:center;padding:20px;background:#e7d5bb;color:#795f58;font-family:'Cormorant Garamond',serif;font-size:1.2rem;";
    img.parentElement.insertBefore(fallback, img);
  });
});

/* Keep the site friendly on phones with an optional toast when media is missing. */
window.addEventListener("load", () => {
  const test = new Image();
  test.onerror = () => {};
  test.src = "music/song.mp3";
});
