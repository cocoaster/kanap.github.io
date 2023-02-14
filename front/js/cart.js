// -------------------------Panier --------------------

// Emplacement des éléments à intégrer
const productsLocation = document.getElementById("cart__items");
console.log(productsLocation);
const totalLocation = document.getElementById("totalPrice");

//Récupération des produits présents dans le localStorage
const addedProducts = JSON.parse(localStorage.getItem("products") || []);
console.log(addedProducts[0].id);

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
  console.log(datas);
}
mergeApiAndLocalData();

// console.log(JSON.parse(datas[0].color));

// Fonction d'affichage des produits
async function productDisplay() {
  await fetchProduct();
  let basketContent = [];

  for (let i = 0; i < datas.length; i++) {
    let color = datas[i].color;
    let quantity = datas[i].quantity;
    let id = datas[i].id;
    let apiId = datas[i]._id;
    let name = datas[i].name;
    let image = datas[i].imageUrl;
    let price = datas[i].price;

    basketContent += `
        <article class="cart__item" data-id="${id}" data-color="${color}">
        <div class="cart__item__img">
          <img src=${image} alt="Photographie d'un canapé">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${name}</h2>
            <p>${color}</p>
            <p>${price}€</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté :  </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${quantity}>
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`;
    productsLocation.innerHTML = basketContent;

    // Calcul du prix total et ajout du total dans la page
    let total = 0;
    for (let i = 0; i < datas.length; i++) {
      total += datas[i].price * datas[i].quantity;
    }
    totalLocation.innerHTML = ` ${total}`;
  }
}
productDisplay();

// Modification des quantités et suppression des produits
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
          localStorage.setItem("products", JSON.stringify(addedProducts));
        }
      }
    });
  }
  for (let i = 0; i < deleteButtonLocation.length; i++) {
    deleteButtonLocation[i].addEventListener("click", function () {
      const article = this.closest(".cart__item");
      const dataId = article.dataset.id;
      const dataColor = article.dataset.color;

      // Boucle sur les produits ajoutés pour trouver celui à supprimer
      for (let j = 0; j < datas.length; j++) {
        if (datas[j].id === dataId && datas[j].color === dataColor) {
          // Supprime l'article correspondant du tableau
          datas.splice(j, 1);
          break;
        }
      }
      // Mettre à jour les données du localStorage
      localStorage.setItem("products", JSON.stringify(datas));

      // Supprimer visuellement l'article du panier
      article.remove();
    });
  }
}, 2000);

// ---------------------Formulaire---------------------
const form = document.querySelector("form");
const inputs = document.querySelectorAll(
  'input[type="text"], input[type="email"]'
);
console.log(inputs);

let firstName, lastName, address, city, email;

// Fonction d'affichage des messages d'erreur
const errorDisplay = (tag, message, valid) => {
  setTimeout(() => {
    const errorP = document.getElementById(tag + "ErrorMsg");
    if (!valid) {
      errorP.textContent = message;
    } else {
      errorP.textContent = message;
    }
  }, 1000);
};

// Mise en place des conditions de validation des champs du formulaire
const firstNameChecker = (value) => {
  if (value.length < 1) {
    errorDisplay("firstName", "Ce champs doit être complété");
    firstName = null;
  } else if (!value.match(/^[a-zA-ZÀ-ÿ'-]+$/)) {
    errorDisplay("firstName", "Ce champs ne doit pas contenir de nombre");
    firstName = null;
  } else if (!value.match(/^[a-zA-ZÀ-ÖØ-öø-ÿ'-~]+$/)) {
    errorDisplay(
      "firstName",
      "Ce champs ne doit pas contenir de nombre ni de caractères spéciaux autres que les - et les '"
    );
    firstName = null;
  } else {
    errorDisplay("firstName", "", true);
    firstName = value;
  }
};
const lastNameChecker = (value) => {
  if (value.length > 47) {
    errorDisplay("lastName", "Ce champs doit comporter moins de 48 caractères");
    lastName = null;
  } else if (!value.match(/^[a-zA-ZÀ-ÖØ-öø-ÿ'-~]+$/)) {
    errorDisplay(
      "lastName",
      "Ce champs ne doit pas contenir de nombre ni de caractères spéciaux autres que les - et les '"
    );
    lastName = null;
  } else {
    errorDisplay("lastName", "", true);
    lastName = value;
  }
};
const addressChecker = (value) => {
  if (value.length < 3) {
    errorDisplay("address", "Ce champs doit comporter au moins 3 caracteres");
    address = null;
  } else if (!value.match(/^[\w\s-/']+$/)) {
    errorDisplay(
      "address",
      "Ce champs ne doit pas contenir de caractères spéciaux autres que - / et '"
    );
    address = null;
  } else {
    errorDisplay("address", "", true);
    address = value;
  }
};
const cityChecker = (value) => {
  if (value.length < 2 && value.length > 60) {
    errorDisplay("city", "Ce champs doit comporter moins de 48 caractères");
    city = null;
  } else if (!value.match(/^[a-zA-ZÀ-ÿ'-]+$/)) {
    errorDisplay(
      "city",
      "Ce champs ne doit pas contenir de nombre ou de caractères spéciaux autres que - / et '"
    );
    city = null;
  } else {
    errorDisplay("city", "", true);
    city = value;
  }
};

const emailChecker = (value) => {
  if (
    !value.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    errorDisplay("email", "Cet email n'est pas valide");
    email = null;
  } else {
    errorDisplay("email", "", true);
    email = value;
  }
};

// Ecoute des valeurs entrées dans le formulaire
inputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    switch (e.target.id) {
      case "firstName":
        firstNameChecker(e.target.value);
      case "lastName":
        lastNameChecker(e.target.value);
      case "address":
        addressChecker(e.target.value);
      case "city":
        cityChecker(e.target.value);
      case "email":
        emailChecker(e.target.value);
        break;
      default:
        nul;
    }
  });
});

// Création de l'array d'_id extrait du local storage pour l'envoi au serveur
console.log(addedProducts[0].id);

const products = [];
for (let l = 0; l < addedProducts.length; l++) {
  products.push(addedProducts[l].id);
}
// console.log(productsId);
// const products = productsId.map((value) => {
//   return {_id: value};
// });

console.log(products);

// Soumission du formulaire
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (firstName && lastName && address && city && email) {
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
    // firstName = null;
    // lastName = null;
    // address = null;
    // city = null;
    // email = null;
    sendToServer(toSend);
  } else {
    alert("Veuillez compléter tous les champs du formulaire");
  }
});

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
        localStorage.setItem("orderID", content.orderId);
        location.href = "./confirmation.html";
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
