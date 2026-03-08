function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function loadPuzzle() {
  try {
    const res = await fetch("puzzle.json");
    const data = await res.json();

    let words = [];

   data.categories.forEach(cat => {
   cat.cards.forEach(card => words.push(card.content));
    });

    shuffle(words);
    buildGrid(words);
  } catch (error) {
    console.error('Error loading puzzle:', error);
    alert('Failed to load puzzle');
  }
}

function buildGrid(words) {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  words.forEach(word => {
    const button = document.createElement("button");
    button.textContent = word;
    button.className = "word-button";
    button.onclick = () => selectWord(button, word);
    grid.appendChild(button);
  });
}

function selectWord(button, word) {
  button.classList.toggle("selected");
}

function closePanel() {
  document.getElementById("panel").style.display = "none";
}
window.onload = loadPuzzle;

