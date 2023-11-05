// -------------------------Panier --------------------

// Emplacement des éléments à intégrer ou à modifier
const productsLocation = document.getElementById("cart__items");
console.log(productsLocation);
const totalLocation = document.getElementById("totalPrice");
console.log(totalLocation);
const cartOrderElem = document.querySelector('.cart__order');


// Récupérer le contenu du localStorage
const getLocalStorage = localStorage.getItem("products");
console.log(getLocalStorage);

let cartItems = [];

if (getLocalStorage !== null) {
  cartItems = JSON.parse(getLocalStorage);
}

console.log(cartItems);

function emptyCart() {
  {
    productsLocation.innerHTML =
      "<p id = 'emptyCartMsg'>Votre panier est vide</p>";
    const emptyCartMsgContent = document.getElementById("emptyCartMsg");

    emptyCartMsgContent.style.textAlign = "center";
    cartOrderElem.style.display = "none";
  }
}

// Affichage du panier s'il est vide
if (getLocalStorage == null) {
  emptyCart();
}

//Récupération des produits présents dans le localStorage

const addedProducts = JSON.parse(localStorage.getItem("products") || []);

// fonction de requête des données de l'API
async function fetchProduct() {
  await fetch(`https://kanap-kue4.onrender.com/api/products`)
    .then((res) => res.json())
    .then((data) => (productData = data))
    .catch((error) => console.error("An error occurred:", error));

  console.log(productData);
}
fetchProduct();

// Fusion des données de l'API et du local storage
let datas = [];
async function mergeApiAndLocalData() {
  await fetchProduct();
  for (let i = 0; i < addedProducts.length; i++) {
    let found = false;
    for (let j = 0; j < productData.length; j++) {
      if (productData[j]._id === addedProducts[i].id) {
        let merged = {...addedProducts[i], ...productData[j]};
        datas.push(merged);
        found = true;
      }
    }
  }

  return datas;
}
mergeApiAndLocalData();


// Fonction de calcul du panier 
function calculPrice () {
  let total = 0;

  for (let i = 0; i < datas.length; i++) {
    total += datas[i].price * datas[i].quantity;
  }
  console.log(total);
  totalLocation.innerHTML = ` ${total}`;
}

// Fonction d'affichage des produits
async function productDisplay() {
  await fetchProduct();
  let basketContent = document.createDocumentFragment();

  for (let i = 0; i < datas.length; i++) {
    let color = datas[i].color;
    let quantity = datas[i].quantity;
    let id = datas[i].id;
    let apiId = datas[i]._id;
    let name = datas[i].name;
    let image = datas[i].imageUrl;
    let alt = datas[i].altTxt;
    let price = datas[i].price;

    let article = document.createElement("article");
    article.className = "cart__item";
    article.setAttribute("data-id", id);
    article.setAttribute("data-color", color);

    let imgDiv = document.createElement("div");
    imgDiv.className = "cart__item__img";
    let img = document.createElement("img");
    img.src = image.replace("http://", "https://");
    img.alt = alt;
    imgDiv.appendChild(img);
    article.appendChild(imgDiv);

    let contentDiv = document.createElement("div");
    contentDiv.className = "cart__item__content";
    let descDiv = document.createElement("div");
    descDiv.className = "cart__item__content__description";
    let nameH2 = document.createElement("h2");
    nameH2.textContent = name;
    let colorP = document.createElement("p");
    colorP.textContent = color;
    let priceP = document.createElement("p");
    priceP.textContent = `${price}€`;
    descDiv.appendChild(nameH2);
    descDiv.appendChild(colorP);
    descDiv.appendChild(priceP);
    contentDiv.appendChild(descDiv);

    let settingsDiv = document.createElement("div");
    settingsDiv.className = "cart__item__content__settings";
    let quantityDiv = document.createElement("div");
    quantityDiv.className = "cart__item__content__settings__quantity";
    let quantityP = document.createElement("p");
    quantityP.textContent = "Qté :  ";
    let quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.className = "itemQuantity";
    quantityInput.name = "itemQuantity";
    quantityInput.min = "1";
    quantityInput.max = "100";
    quantityInput.value = quantity;
    quantityDiv.appendChild(quantityP);
    quantityDiv.appendChild(quantityInput);
    settingsDiv.appendChild(quantityDiv);

    let deleteDiv = document.createElement("div");
    deleteDiv.className = "cart__item__content__settings__delete";
    let deleteP = document.createElement("p");
    deleteP.className = "deleteItem";
    deleteP.textContent = "Supprimer";
    deleteDiv.appendChild(deleteP);
    settingsDiv.appendChild(deleteDiv);

    contentDiv.appendChild(settingsDiv);
    article.appendChild(contentDiv);

    basketContent.appendChild(article);
    calculPrice();
  }
  productsLocation.appendChild(basketContent);
}

productDisplay();

// Modification des quantités
setTimeout(() => {
  const inputLocation = document.querySelectorAll(".itemQuantity");
  console.log(inputLocation);
  const deleteButtonLocation = document.querySelectorAll(".deleteItem");
  console.log(deleteButtonLocation);

  for (let i = 0; i < inputLocation.length; i++) {
    const article = inputLocation[i].closest(".cart__item");
    const dataId = article.dataset.id;
    const dataColor = article.dataset.color;
    console.log(dataId, dataColor);

    // Modification des quantités
    inputLocation[i].addEventListener("change", function () {
      let newQuantity = Number(this.value);
      for (let j = 0; j < addedProducts.length; j++) {
        if (
          addedProducts[j].id === dataId &&
          addedProducts[j].color === dataColor
        ) {
          addedProducts[j].quantity = newQuantity;

          if (newQuantity < 1 || newQuantity > 100) {
            alert("Veuillez sélectionner une quantité entre 1 et 100.");
            // remettre l'ancienne valeur si la quantité n'est pas comprise entre 1 et 100
            this.value = datas.find(
              (item) => item.id === dataId && item.color === dataColor
            ).quantity;
            return; // Quitter eventListener
          }
          localStorage.setItem("products", JSON.stringify(addedProducts));

          // Mise à jour de datas
          for (let k = 0; k < datas.length; k++) {
            if (datas[k].id === dataId && datas[k].color === dataColor) {
              datas[k].quantity = newQuantity;
              break;
            }
          }
          calculPrice();

          console.log(totalLocation);
        }
      }
    });
  }

  // Suppression d'un article
  for (let i = 0; i < deleteButtonLocation.length; i++) {
    deleteButtonLocation[i].addEventListener("click", function deleteProduct() {
      const article = this.closest(".cart__item");
      const dataId = article.dataset.id;
      const dataColor = article.dataset.color;

      // Boucle sur les produits ajoutés pour trouver celui à supprimer
      for (let j = 0; j < datas.length; j++) {
        if (datas[j].id === dataId && datas[j].color === dataColor) {
          // Supprime l'article correspondant du tableau
          datas.splice(j, 1);
          localStorage.setItem("products", JSON.stringify(addedProducts));

          calculPrice();
          console.log(datas);

          break;
        }
      }

      // Mettre à jour les données du localStorage
      localStorage.setItem("products", JSON.stringify(datas));
      if (datas.length === 0) {
        localStorage.removeItem("products");
        emptyCart();
      }

      // Supprimer visuellement l'article du panier
      article.remove();
      calculPrice();
    });
  }
}, 2000);



// ---------------------Formulaire---------------------

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  formSubmitted(e);
});
const inputs = document.querySelectorAll(
  'input[type="text"], input[type="email"]'
);

// let isFormValid = false;

// Fonction d'affichage des messages d'erreur
const errorDisplay = (tag, message, valid) => {
  // setTimeout(() => {
  //   const errorP = document.getElementById(tag + "ErrorMsg");
  //   if (!valid) {
  //     errorP.textContent = message;
  //   } else {
  //     errorP.textContent = message;
  //   }
  // }, 500);
  const errorP = document.getElementById(tag + "ErrorMsg");
  if (!valid) {
    errorP.textContent = message;
  } else {
    errorP.textContent = ""; // Assurez-vous que le message est effacé quand il n'y a pas d'erreur
  }
};

// Mise en place des conditions de validation des champs du formulaire
const firstNameChecker = (value) => {
  if (value.length > 48 || !value.match(/^[a-zA-Z'-]*$/)) {
    errorDisplay("firstName", "Le prénom doit comporter moins de 48 caractères");
    return false;
  }
  errorDisplay("firstName", "", true);
  return value;
};

const lastNameChecker = (value) => {
  if (value.length > 47 || !value.match(/^[a-zA-Z'-]*$/)) {
    errorDisplay("lastName", "Le nom doit comporter moins de 48 caractères");
    return false;
  }
  errorDisplay("lastName", "", true);
  return value;
};

const addressChecker = (value) => {
  if (value.length > 60 || !value.match(/^[a-zA-Z0-9\s,'-éèàêûôîäëüöç]*$/)) {
    
   
errorDisplay("address", "L'adresse doit comporter moins de 60 caractères et ne peut pas contenir de caractères spéciaux", false);
    return false;
  }
  errorDisplay("address", "", true);
  return true;
};

const cityChecker = (value) => {
  if (value.length < 2 || value.length > 48 || !value.match(/^[a-zA-Z\s'-]*$/)) {
    errorDisplay("city", "La ville doit comporter entre 2 et 48 caractères", false);
    return false;
  }
  errorDisplay("city", "", true);
  return true;
};

const emailChecker = (value) => {
  if (!value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
    errorDisplay("email", "L'email n'est pas valide", false);
    return false;
  }
  errorDisplay("email", "", true);
  return true;
};

// Fonction de soumission du formulaire
function formSubmitted(e) {
  e.preventDefault();
 let isFormValid = true;

  // On récupère les valeurs des champs pour éviter de les sélectionner plusieurs fois
  const firstNameValue = e.target.elements.firstName.value;
  const lastNameValue = e.target.elements.lastName.value;
  const addressValue = e.target.elements.address.value;
  const cityValue = e.target.elements.city.value;
  const emailValue = e.target.elements.email.value;

  // Vérifie chaque champ et met à jour `isFormValid`
  isFormValid &&= firstNameChecker(firstNameValue);
  isFormValid &&= lastNameChecker(lastNameValue);
  isFormValid &&= addressChecker(addressValue);
  isFormValid &&= 
  isFormValid &&= cityChecker
  cityChecker(cityValue);
  isFormValid &&= emailChecker(emailValue);

  if (isFormValid) {
    const contact = {
      firstName: firstNameValue,
      lastName: lastNameValue,
      address: addressValue,
      city: cityValue,
      email: emailValue,
    };
    
   
const toSend = { contact, products: addedProducts.map(product => product.id) };

    console.log("Form is valid", contact);
    sendToServer(toSend);
  } else {
    console.error("Form is invalid");
    // Afficher un message d'erreur à l'utilisateur ici, si nécessaire
  }
}

// Création de l'array d'_id extrait du local storage pour l'envoi au serveur
console.log(addedProducts[0].id);
const products = addedProducts.map(product => product.id);
console.log(products);

console.log(products);

// Fonction d'envoie des données du formulaire et des produits commandés au serveur
function sendToServer(toSend) {
  fetch("https://kanap-kue4.onrender.com/api/products/order", {
    method: "POST",
    body: JSON.stringify(toSend),
    headers: { "Content-Type": "application/json" },
  })
  .then(async (response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const orderID = data.orderId;
    
   
window.location.href = `./confirmation.html?orderId=${orderID}`;
  })
  .catch((e) => {
    console.error("Error from catch", e);
    alert(`Error: ${e}`);
  });
}
