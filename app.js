/* ------------------------------
   SHUFFLE WORDS
------------------------------ */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function shrinkText(element) {

  let size = 16;

  while (element.scrollWidth > element.clientWidth && size > 9) {
    size--;
    element.style.fontSize = size + "px";
  }

}

/* ------------------------------
   LOAD PUZZLE.JSON AND BUILD GRID
------------------------------ */
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
    console.error("Error loading puzzle:", error);
    alert("Failed to load puzzle");
  }
}

/* ------------------------------
   BUILD GRID OF WORD BUTTONS
------------------------------ */
function buildGrid(words) {

  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  words.forEach(word => {

    const div = document.createElement("div");
    div.className = "word";
    div.textContent = word;

    div.onclick = () => lookupWord(word);

    grid.appendChild(div);

    shrinkText(div);   // auto adjust font

  });

}



/* ------------------------------
   LOOKUP WORD IN DICTIONARY API
------------------------------ */
async function lookupWord(word) {
  const panel = document.getElementById("panel");
  const title = document.getElementById("wordTitle");
  const definition = document.getElementById("definition");

  panel.style.display = "flex";
  definition.scrollTop = 0;

  title.textContent = word;
  definition.textContent = "Loading...";

  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
    );

    if (!res.ok) throw new Error("Not found");

    const data = await res.json();
    const entry = data[0];

    if (!entry?.meanings?.length) {
      definition.innerHTML = "Definition not found.<br><em>Hint: This may be a proper name (person or place).</em>";
      return;
    }

    let html = "";

    entry.meanings.forEach(meaning => {
      html += `
        <div class="meaning-block">
          <div class="part-of-speech">${meaning.partOfSpeech || ""}</div>
          <ul class="definition-list">
      `;

      meaning.definitions.forEach(def => {
        html += `<li>${def.definition}</li>`;

        // 1. Synonyms inside definition
        if (Array.isArray(def.synonyms) && def.synonyms.length > 0) {
          html += `
            <div class="syn-block">
              <strong>Synonyms:</strong> ${def.synonyms.slice(0, 8).join(", ")}
            </div>
          `;
        }
      });

      // 2. Synonyms at meaning level
      if (Array.isArray(meaning.synonyms) && meaning.synonyms.length > 0) {
        html += `
          <div class="syn-block">
            <strong>Synonyms:</strong> ${meaning.synonyms.slice(0, 8).join(", ")}
          </div>
        `;
      }

      html += `
          </ul>
        </div>
      `;
    });

    definition.innerHTML = html;

  } catch (error) {
    console.error("Lookup error:", error);
    definition.textContent = "Definition not available.";
  }
}


/* ------------------------------
   CLOSE PANEL
------------------------------ */
function closePanel() {
  document.getElementById("panel").style.display = "none";
}

/* ------------------------------
   LOAD GRID ON PAGE LOAD
------------------------------ */
window.onload = loadPuzzle;




















