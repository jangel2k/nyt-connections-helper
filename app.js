function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
async function loadPuzzle() {

const res = await fetch("puzzle.json");
const data = await res.json();

let words = [];

data.categories.forEach(cat=>{
  cat.cards.forEach(word => words.push(word));
});

shuffle(words);
buildGrid(words);

}

