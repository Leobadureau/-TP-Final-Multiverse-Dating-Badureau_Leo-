const baseURL = "https://rickandmortyapi.com/api/character";
let characters = [];
let currentIndex = 0;
let myMatches = [];

// Récupération des personnages
async function fetchCharacters(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${baseURL}/?${params.toString()}`);
    const data = await res.json();
    characters = data.results || [];
    currentIndex = 0;
    showNext();
    updateCounters();
  } catch (error) {
    console.error("Erreur API :", error);
    document.getElementById("deck").innerHTML = "<p>Erreur de chargement </p>";
  }
}
// Mode nuit/jour
const toggleBtn = document.getElementById("toggle-darkmode");
toggleBtn.addEventListener("click", () => {
  document.documentElement.classList.toggle("light");

  if (document.documentElement.classList.contains("light")) {
    toggleBtn.textContent = "Nuit";
  } else {
    toggleBtn.textContent = "Jour";
  }
});

// Affichage de la prochaine carte
function showNext() {
  const deck = document.getElementById("deck");
  if (currentIndex >= characters.length) {
    deck.innerHTML = "<p>Plus de personnages dans cette dimension </p>";
    return;
  }
  const character = characters[currentIndex];
  deck.innerHTML = `
    <div class="character-card" data-id="${character.id}">
      <img src="${character.image}" alt="${character.name}">
      <h2>${character.name}</h2>
      <p>${character.status} — ${character.species}</p>
      <div class="btns">
        <button class="swipe-btn dislike">❌</button>
        <button class="swipe-btn like">❤️</button>
      </div>
    </div>
  `;

  // Boutons swipe
  document.querySelector(".dislike").onclick = () => swipe("left", character);
  document.querySelector(".like").onclick = () => swipe("right", character);
}

// Swipe gauche/droite
function swipe(direction, character) {
  const card = document.querySelector(".character-card");
  card.style.transition = "transform 0.5s ease";
  card.style.transform = direction === "right" ? 
    "translateX(500px) rotate(30deg)" : 
    "translateX(-500px) rotate(-30deg)";

  setTimeout(() => {
    if (direction === "right") {
      myMatches.push(character);
      updateMatchList();
    }
    currentIndex = currentIndex + 1;
    showNext();
    updateCounters();
  }, 500);
}

// Mise à jour liste de matchs
function updateMatchList() {
  const matchesDiv = document.getElementById("matches");
  if (myMatches.length === 0) {
    matchesDiv.innerHTML = "<p>Aucun crush pour le moment</p>";
    return;
  }
  matchesDiv.innerHTML = myMatches.map(m => `
    <div class="match-card">
      <img src="${m.image}" alt="${m.name}" width="50">
      ${m.name}
    </div>
  `).join("");
}

// Mise à jour compteur Like / Pass
function updateCounters() {
  document.getElementById("like-counter").textContent = myMatches.length;
  document.getElementById("pass-counter").textContent = currentIndex - myMatches.length;
}

// Formulaire filtre
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();

  myMatches = [];
  currentIndex = 0;
  updateMatchList();
  updateCounters();

  const name = document.getElementById("nameInput").value.trim();
  const status = document.getElementById("statusSelect").value;
  const species = document.getElementById("speciesSelect").value;

  const filters = {};
  if (name) filters.name = name;
  if (status) filters.status = status;
  if (species) filters.species = species;

  fetchCharacters(filters);
});

// Initialisation
updateMatchList();
updateCounters();
fetchCharacters();
