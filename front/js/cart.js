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
  await fetch(`http://localhost:3000/api/products`)
    .then((res) => res.json())
    .then((data) => (productData = data));
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
    img.src = image;
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

let isFormValid = false;

// Fonction d'affichage des messages d'erreur
const errorDisplay = (tag, message, valid) => {
  setTimeout(() => {
    const errorP = document.getElementById(tag + "ErrorMsg");
    if (!valid) {
      errorP.textContent = message;
    } else {
      errorP.textContent = message;
    }
  }, 500);
};

// Mise en place des conditions de validation des champs du formulaire
const firstNameChecker = (value) => {
  if (value.length > 48) {
    errorDisplay(
      "firstName",
      "Ce champs doit comporter moins de 48 caractères"
    );
    firstName = null;
    isFormValid = false;
  } else if (!value.match(/^[a-zA-Z'-]*$/)) {
    errorDisplay(
      "firstName",
      "Ce champs ne doit pas contenir de nombre ni de caractères spéciaux autres que - et '"
    );
    firstName = null;
    isFormValid = false;
  } else {
    errorDisplay("firstName", "", true);
    firstName = value;
    isFormValid = true;
  }
};

const lastNameChecker = (value) => {
  if (value.length > 47) {
    errorDisplay("lastName", "Ce champs doit comporter moins de 48 caractères");
    lastName = null;
    isFormValid = false;
  } else if (!value.match(/^[a-zA-Z'-]*$/)) {
    errorDisplay(
      "lastName",
      "Ce champs ne doit pas contenir de nombre ni de caractères spéciaux autres que les - et les '"
    );
    lastName = null;
    isFormValid = false;
  } else {
    errorDisplay("lastName", "", true);
    lastName = value;
    isFormValid = true;
  }
};

const addressChecker = (value) => {
  if (value.length > 60) {
    errorDisplay(
      "address",
      "Ce champs doit comporter entre moins de 60 caracteres"
    );
    lastName = null;
    isFormValid = false;
  } else if (!value.match(/^[a-zà-öø-ÿ¨'\d,-\/]+$/i)) {
    errorDisplay(
      "address",
      "Ce champs ne doit pas contenir de caractères spéciaux autres que - / , et '"
    );
    lastName = null;
    isFormValid = false;
  } else {
    errorDisplay("address", "", true);
    lastName = value;
    isFormValid = true;
  }
};

const cityChecker = (value) => {
  if (value.length > 48) {
    errorDisplay("city", "Ce champs doit comporter entre 2 et 48 caractères");
    lastName = null;
    isFormValid = false;
  } else if (!value.match(/^[a-zà-öø-ÿ¨'-\/]+$/i)) {
    errorDisplay(
      "city",
      "Ce champs ne doit pas contenir de nombre ou de caractères spéciaux autres que - / et '"
    );
    lastName = null;
    isFormValid = false;
  } else {
    errorDisplay("city", "", true);
    lastName = value;
    isFormValid = true;
  }
};

const emailChecker = (value) => {
  if (!value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
    errorDisplay("email", "Cet email n'est pas valide");
    lastName = null;
    isFormValid = false;
  } else {
    errorDisplay("email", "", true);
    lastName = value;
    isFormValid = true;
  }
};

// Fonction de soumission du formulaire
function formSubmitted(e) {
  e.preventDefault();
  const formInputs = e.target;
  const inputFirstName = firstNameChecker(formInputs.elements.firstName.value);
  const inputLastName = lastNameChecker(formInputs.elements.lastName.value);
  const inputAddress = addressChecker(formInputs.elements.address.value);
  const inputCity = cityChecker(formInputs.elements.city.value);
  const inputEmail = emailChecker(formInputs.elements.email.value);

  if (isFormValid) {
    console.log("form valide");
    const contact = {
      firstName: firstName,
      lastName: lastName,
      address: lastName,
      city: lastName,
      email: lastName,
    };

    console.log(contact);
    const toSend = {
      contact,
      products,
    };
    console.log(toSend);
    inputs.forEach((input) => {
      input.value = "";
    });

    sendToServer(toSend);
  }
}

// Création de l'array d'_id extrait du local storage pour l'envoi au serveur
console.log(addedProducts[0].id);

const products = [];
for (let l = 0; l < addedProducts.length; l++) {
  products.push(addedProducts[l].id);
}

console.log(products);

// Fonction d'envoie des données du formulaire et des produits commandés au serveur
function sendToServer(toSend) {
  const productIdGo = fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(toSend),
    headers: {"Content-Type": "application/json"},
  });
  console.log(productIdGo);
  productIdGo.then(async (response) => {
    try {
      console.log(response);
      const content = await response.json();
      console.log(content);
      if (response.ok) {
        const orderID = content.orderId;
        location.href = `./confirmation.html?orderId=${orderID}`;
      } else {
        alert(`Problème de serveur erreur : ${response.status}`);
      }
    } catch (e) {
      console.log("error from catch");
      console.log(e);
      alert(`Error() ${e}`);
    }
  });
}
