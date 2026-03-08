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