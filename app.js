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

    button.addEventListener("click", () => lookupWord(word));

    grid.appendChild(button);
  });
}
async function lookupWord(word) {

  const panel = document.getElementById("panel");
  const title = document.getElementById("wordTitle");
  const definition = document.getElementById("definition");
  const synonyms = document.getElementById("synonyms");

  panel.style.display = "block";
  title.textContent = word;

  definition.textContent = "Loading...";
  synonyms.textContent = "";

  try {
    const res = await fetch(
      "https://api.dictionaryapi.dev/api/v2/entries/en/" + word.toLowerCase()
    );

    const data = await res.json();

 <!--   if (data[0]?.meanings?.[0]?.definitions?.[0]?.definition) {
      definition.textContent = data[0].meanings[0].definitions[0].definition;
    } else {
      definition.textContent = "Definition not found.";
    } -->

    if (data[0]?.meanings) {
  const allDefs = data[0].meanings
    .flatMap(meaning =>
      meaning.definitions.map(def => `• ${def.definition}`)
    )
    .join("\n");

  definition.textContent = allDefs;
} else {
  definition.textContent = "Definition not found.";
}

  } catch (err) {
    definition.textContent = "Definition not available.";
  }

}
function selectWord(button, word) {
  button.classList.toggle("selected");
}

function closePanel() {
  document.getElementById("panel").style.display = "none";
}
window.onload = loadPuzzle;






