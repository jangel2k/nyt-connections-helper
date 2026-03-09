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
      definition.textContent = "Definition not found.";
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

        if (Array.isArray(def.synonyms) && def.synonyms.length > 0) {
          html += `
            <div class="syn-block">
              <strong>Synonyms:</strong> ${def.synonyms.slice(0, 8).join(", ")}
            </div>
          `;
        }
      });

      html += `</ul></div>`;
    });

    definition.innerHTML = html;

  } catch (err) {
    console.error(err);
    definition.textContent = "Definition not available.";
  }
}



    // Build clean HTML with proper indentation
    definition.innerHTML = data[0].meanings
      .map(meaning => `
        <div class="meaning-block">
          <div class="part-of-speech">${meaning.partOfSpeech}</div>
          <ul class="definition-list">
            ${meaning.definitions
              .map(def => `<li>${def.definition}</li>`)
              .join("")}
          </ul>
        </div>
      `)
      .join("");

  } catch (error) {
    console.error("Lookup error:", error);
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












