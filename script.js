// importing code from firebase servers to utilise the server
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push, // pushes data to the database
  onValue,
  remove, // enables data to be fetched from the databse
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// adding my firebase database reference URL created
const appSettings = {
  databaseURL:
    "https://shopping-list-a8e5c-default-rtdb.europe-west1.firebasedatabase.app/",
};

// initialise app by connecting to the database reference URL
const app = initializeApp(appSettings); // get database information from the app
const database = getDatabase(app); // reference to a location inside the database with reference name, where it will be pushed
const itemsInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addBtnEl = document.getElementById("add-button");
let shoppingListEl = document.getElementById("shopping-list");

// push item to database on click
addBtnEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  push(itemsInDB, inputValue);
  console.log(`${inputValue} added to the shopping list`);

  clearInputField();
});

// fetch items from the database & return in the console
onValue(itemsInDB, function (databaseSnapshot) {
  // specify database reference so it can retrieve
  if (databaseSnapshot.exists()) {
    let itemsArray = Object.entries(databaseSnapshot.val()); // retrieving the values and changing the object to an array

    clearShoppingListEl(); // prevent database appending multiple times
    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];

      appendItemToShoppingListEL(currentItem);
    }
  } else {
    shoppingListEl.innerText = "No items added yet";
  }
});

// add items to element via the DOM - create a new element via the dom
function appendItemToShoppingListEL(item) {
  // shoppingListEl.innerHTML += `<li class="items"> ${itemValue} </li>`;
  let itemID = item[0];
  let itemValue = item[1];

  let newListEl = document.createElement("li");

  newListEl.textContent = itemValue;
  shoppingListEl.append(newListEl);

  newListEl.addEventListener("click", function () {
    let locationOfItemInDB = ref(database, `shoppingList/${itemID}`);

    remove(locationOfItemInDB);
  });
}

// empty input field
function clearInputField() {
  inputFieldEl.value = "";
}

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}
