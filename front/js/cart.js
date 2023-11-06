// Variables globales pour stocker les données du panier et les informations sur les produits
let cartItems = JSON.parse(localStorage.getItem("products") || '[]');
let productData = [];

// Élément du DOM où les produits du panier seront ajoutés
const productsLocation = document.getElementById("cart__items");
const totalLocation = document.getElementById("totalPrice");

// Fonction pour afficher un message lorsque le panier est vide
function displayEmptyCart() {
    productsLocation.innerHTML = "<p id='emptyCartMsg'>Votre panier est vide</p>";
    document.getElementById("emptyCartMsg").style.textAlign = "center";
    document.querySelector(".cart__order").style.display = "none";
}

// Récupérer les données des produits de l'API et les fusionner avec les données du localStorage
async function fetchAndMergeProductData() {
    try {
        const response = await fetch("https://kanap-kue4.onrender.com/api/products");
        productData = await response.json();
        cartItems = cartItems.map(cartItem => ({
            ...cartItem,
            ...productData.find(p => p._id === cartItem.id)
        }));
    } catch (error) {
        console.error("An error occurred:", error);
        // Afficher un message d'erreur ou gérer l'erreur d'une autre manière
    }
}

// Fonction pour calculer et afficher le prix total
function calculateAndDisplayTotalPrice() {
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    totalLocation.textContent = `${totalPrice}`;
}

// Fonction pour créer et retourner un élément de produit du panier
function createCartItemElement(item) {
    // Création de l'élément article du panier
    const article = document.createElement("article");
    article.className = "cart__item";
    article.dataset.id = item.id;
    article.dataset.color = item.color;

    // Création de l'élément de l'image du produit
    const divImg = document.createElement("div");
    divImg.className = "cart__item__img";
    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.alt = item.altTxt;
    divImg.appendChild(img);

    // Création de la description du produit
    const divContent = document.createElement("div");
    divContent.className = "cart__item__content";
    const divDescription = document.createElement("div");
    divDescription.className = "cart__item__content__description";
    
    const h2 = document.createElement("h2");
    h2.textContent = item.name;
    const pColor = document.createElement("p");
    pColor.textContent = item.color;
    const pPrice = document.createElement("p");
    pPrice.textContent = `${item.price} €`;

    // Assemblage des éléments de la description
    divDescription.appendChild(h2);
    divDescription.appendChild(pColor);
    divDescription.appendChild(pPrice);

    // Création de la section de gestion de la quantité de produit
    const divSettings = document.createElement("div");
    divSettings.className = "cart__item__content__settings";
    const divQuantity = document.createElement("div");
    divQuantity.className = "cart__item__content__settings__quantity";
    const pQuantity = document.createElement("p");
    pQuantity.textContent = "Qté : ";
    const inputQuantity = document.createElement("input");
    inputQuantity.type = "number";
    inputQuantity.className = "itemQuantity";
    inputQuantity.name = "itemQuantity";
    inputQuantity.min = "1";
    inputQuantity.max = "100";
    inputQuantity.value = item.quantity;

    // Assemblage des éléments de la quantité
    divQuantity.appendChild(pQuantity);
    divQuantity.appendChild(inputQuantity);

    // Création du bouton de suppression
    const divDelete = document.createElement("div");
    divDelete.className = "cart__item__content__settings__delete";
    const pDelete = document.createElement("p");
    pDelete.className = "deleteItem";
    pDelete.textContent = "Supprimer";

    // Assemblage des éléments des réglages
    divDelete.appendChild(pDelete);
    divSettings.appendChild(divQuantity);
    divSettings.appendChild(divDelete);

    // Assemblage final des éléments du produit
    divContent.appendChild(divDescription);
    divContent.appendChild(divSettings);
    article.appendChild(divImg);
    article.appendChild(divContent);

    return article;
}


// Fonction pour afficher les produits dans le panier
function displayCartItems() {
    if (cartItems.length === 0) {
        displayEmptyCart();
        return;
    }

    const fragment = document.createDocumentFragment();
    cartItems.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        fragment.appendChild(cartItemElement);
    });
    productsLocation.appendChild(fragment);
    calculateAndDisplayTotalPrice();
}

// Fonction initiale pour démarrer le processus
async function initializeCart() {
    await fetchAndMergeProductData();
    displayCartItems();
    setupEventListeners();
}

// Fonction pour configurer les écouteurs d'événements (pour la quantité, la suppression, etc.)
function setupEventListeners() {
    // Écouteur pour les changements de quantité
    productsLocation.addEventListener('change', function(event) {
        if (event.target.classList.contains('itemQuantity')) {
            const newQuantity = event.target.value;
            const itemId = event.target.closest('.cart__item').dataset.id;
            const itemColor = event.target.closest('.cart__item').dataset.color;
            updateQuantity(itemId, itemColor, newQuantity);
        }
    });

    // Écouteur pour les boutons de suppression
    productsLocation.addEventListener('click', function(event) {
        if (event.target.classList.contains('deleteItem')) {
            const itemId = event.target.closest('.cart__item').dataset.id;
            const itemColor = event.target.closest('.cart__item').dataset.color;
            removeItemFromCart(itemId, itemColor);
        }
    });
}

// Fonction pour mettre à jour la quantité d'un article dans le panier
function updateQuantity(itemId, itemColor, newQuantity) {
    const itemIndex = cartItems.findIndex(item => item.id === itemId && item.color === itemColor);
    if (itemIndex !== -1) {
        cartItems[itemIndex].quantity = parseInt(newQuantity, 10);
        localStorage.setItem('products', JSON.stringify(cartItems));
        calculateAndDisplayTotalPrice();
    }
}

// Fonction pour retirer un article du panier
function removeItemFromCart(itemId, itemColor) {
    cartItems = cartItems.filter(item => !(item.id === itemId && item.color === itemColor));
    if (cartItems.length > 0) {
        localStorage.setItem('products', JSON.stringify(cartItems));
    } else {
        localStorage.removeItem('products');
        displayEmptyCart();
    }
    calculateAndDisplayTotalPrice();
    document.querySelector(`[data-id="${itemId}"][data-color="${itemColor}"]`).remove();
}


// Démarrer l'initialisation du panier
initializeCart();


const form = document.querySelector("form");

// Affiche un message d'erreur sous l'input concerné
function displayError(inputId, message, isValid) {
    const errorMsg = document.getElementById(inputId + "ErrorMsg");
    errorMsg.textContent = isValid ? "" : message;
}

// Vérifie la validité du prénom
function validateFirstName(firstName) {
    if (firstName.length > 48 || !firstName.match(/^[a-zA-Z'-]*$/)) {
        displayError("firstName", "Le prénom doit comporter moins de 48 caractères et ne peut contenir que des lettres, des apostrophes ou des tirets.", false);
        return false;
    } else {
        displayError("firstName", "", true);
        return true;
    }
}

// Vérifie la validité du nom
function validateLastName(lastName) {
    if (lastName.length > 47 || !lastName.match(/^[a-zA-Z'-]*$/)) {
        displayError("lastName", "Le nom doit comporter moins de 48 caractères et ne peut contenir que des lettres, des apostrophes ou des tirets.", false);
        return false;
    } else {
        displayError("lastName", "", true);
        return true;
    }
}

// Vérifie la validité de l'adresse
function validateAddress(address) {
    if (address.length > 60 || !address.match(/^[a-zA-Z0-9\s,'-éèàêûôîäëüöç]*$/)) {
        displayError("address", "L'adresse doit comporter moins de 60 caractères et ne peut pas contenir de caractères spéciaux.", false);
        return false;
    } else {
        displayError("address", "", true);
        return true;
    }
}

// Vérifie la validité de la ville
function validateCity(city) {
    if (city.length < 2 || city.length > 48 || !city.match(/^[a-zA-Z\s'-]*$/)) {
        displayError("city", "La ville doit comporter entre 2 et 48 caractères et ne peut contenir que des lettres, des apostrophes ou des tirets.", false);
        return false;
    } else {
        displayError("city", "", true);
        return true;
    }
}

// Vérifie la validité de l'email
function validateEmail(email) {
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        displayError("email", "L'email n'est pas valide.", false);
        return false;
    } else {
        displayError("email", "", true);
        return true;
    }
}

// Gère la soumission du formulaire
function handleFormSubmission(event) {
    event.preventDefault();

    const firstName = form.elements.firstName.value;
    const lastName = form.elements.lastName.value;
    const address = form.elements.address.value;
    const city = form.elements.city.value;
    const email = form.elements.email.value;

    const isFormValid = 
        validateFirstName(firstName) &&
        validateLastName(lastName) &&
        validateAddress(address) &&
        validateCity(city) &&
        validateEmail(email);

    if (isFormValid) {
        const contact = { firstName, lastName, address, city, email };
        const products = cartItems.map(item => item.id);
        const order = { contact, products };

        console.log("Form is valid", contact);
        sendToServer(order);
    } else {
        console.error("Form is invalid");
    }
}

// Ajoute l'écouteur d'événement de soumission au formulaire
form.addEventListener("submit", handleFormSubmission);

// Envoie les données de la commande au serveur
function sendToServer(order) {
    fetch("https://kanap-kue4.onrender.com/api/products/order", {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const orderId = data.orderId;
        window.location.href = `./confirmation.html?orderId=${orderId}`;
    })
    .catch(error => {
        console.error("Error from catch", error);
        alert(`Error: ${error.message}`);
    });
}
