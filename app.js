/**
 * Stores the list of kittens
 * @type {Kitten[]}
 */
let kittens = [];
/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * you can use robohash for images
 * https://robohash.org/<INSERTCATNAMEHERE>?set=set4
 * then add that data to the kittens list.
 * Then reset the form
 */
function addKitten(event) {
  event.preventDefault();
  let form = event.target;
  let nameUsed = checkForSameName(form);
  if (!nameUsed) {
    let kitten = generateKittenProperties(form);
    if (kitten) {
      kittens.push(kitten);
    }
    saveKittens();
  }
  form.reset();
}

function removeAllKittens() {
  kittens = [];
  saveKittens();
  sumOfKittens();
}

function removeKitten(id) {
  let removedKittenIndex = kittens.findIndex((k) => k.id == id);
  kittens.splice(removedKittenIndex, 1);
  saveKittens();
}

function sumOfKittens() {
  loadKittens();
  let sumOfKittens = kittens.length;
  document.getElementById("sum-kittens").innerText = sumOfKittens.toString();
}

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
  window.localStorage.setItem("kittens", JSON.stringify(kittens));
  drawKittens();
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let kittenData = JSON.parse(window.localStorage.getItem("kittens"));
  if (kittenData) {
    kittens = kittenData;
  }
}

/**
 * Draw all of the kittens to the kittens element
 */

function drawKittens() {
  let template = "";
  let kittensElem = document.getElementById("kittens");
  kittens.forEach((kitten) => {
    template += `
          <div class="container card bg-dark text-light kitten ${kitten.mood.toLowerCase()}">
              <img
                class="img-size-1"
                src="https://robohash.org/moodykittens${kitten.img}/?set=set4"
                alt="Kitten"
              />
            <div>
              <span>Name:</span>
              <span>${kitten.name}</span>
            </div>
            ${kittenIsGone(kitten)}

          </div>
    `;
  });
  kittensElem.innerHTML = template;
}

function kittenIsGone(kitten) {
  let template = ``;
  if (kitten.mood == "Gone") {
    template = `<div><span>Ran Away</span></div>
                <div><button class="btn-cancel" onclick="removeKitten('${kitten.id}')">Remove</button></div>`;
  } else {
    template = `
        <div>
          <span>Mood:</span>
          <span>${kitten.mood}</span>
        </div>
        <div>
          <span>Affection:</span>
          <span>${kitten.affection}</span>
        </div>
        <div>
          <button class="btn-cancel" onclick="pet('${kitten.id}')">PET</button>
          <button onclick="catnip('${kitten.id}')">CATNIP</button>
        </div>`;
  }
  return template;
}

/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  return kittens.find((k) => k.id == id);
}

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .7
 * increase the kittens affection
 * otherwise decrease the affection
 * save the kittens
 * @param {string} id
 */
function pet(id) {
  let petKitten = findKittenById(id);
  let petReaction = Math.random();
  if (petReaction > 0.7) {
    petKitten.affection++;
  } else {
    petKitten.affection--;
  }
  setKittenMood(petKitten);
  saveKittens();
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */
function catnip(id) {
  let catnipKitten = findKittenById(id);
  catnipKitten.mood = "Tolerant";
  catnipKitten.affection = 5;

  saveKittens();
}

/**
 * Sets the kittens mood based on its affection
 * Happy > 6, Tolerant <= 5, Angry <= 3, Gone <= 0
 * @param {Kitten} kitten
 */
function setKittenMood(kitten) {
  if (kitten.affection > 6) {
    kitten.mood = "Happy";
  } else if (kitten.affection <= 5 && kitten.affection > 3) {
    kitten.mood = "Tolerant";
  } else if (kitten.affection <= 3 && kitten.affection > 0) {
    kitten.mood = "Angry";
  } else if (kitten.affection == 0) {
    kitten.mood = "Gone";
  }
}

function getStarted() {
  document.getElementById("welcome").remove();
  loadKittens();
  drawKittens();
}

/**
 * Defines the Properties of a Kitten
 * @typedef {{id: string, name: string, mood: string, affection: number}} Kitten
 */

function generateKittenProperties(form) {
  let kitten;
  kitten = {
    id: generateId(),
    name: form.name.value,
    mood: "Tolerant",
    affection: 5,
    img: generateImageNum(),
  };
  return kitten;
}

function checkForSameName(form) {
  let detectedSameName = false;
  kittens.forEach((kitten) => {
    if (kitten.name == form.name.value) {
      alert("Cannot have a cat with the same name");
      detectedSameName = true;
    }
  });
  return detectedSameName;
}

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
  );
}

function generateImageNum() {
  let randomNumber = Math.ceil(Math.random() * 5);
  console.log("There was a four");
  // For some reason moodykitten4 returns a robot
  if (randomNumber == 4) {
    randomNumber++;
  }
  return randomNumber;
}

sumOfKittens();
