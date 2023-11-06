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
form.addEventListener("submit", e => {
    formSubmitted(e)
});
const inputs = document.querySelectorAll('input[type="text"], input[type="email"]'),
    errorDisplay = (e, t, a) => {
        let r = document.getElementById(e + "ErrorMsg");
        a ? r.textContent = "" : r.textContent = t
    },
    firstNameChecker = e => e.length > 48 || !e.match(/^[a-zA-Z'-]*$/) ? (errorDisplay("firstName", "Le pr\xe9nom doit comporter moins de 48 caract\xe8res"), !1) : (errorDisplay("firstName", "", !0), e),
    lastNameChecker = e => e.length > 47 || !e.match(/^[a-zA-Z'-]*$/) ? (errorDisplay("lastName", "Le nom doit comporter moins de 48 caract\xe8res"), !1) : (errorDisplay("lastName", "", !0), e),
    addressChecker = e => e.length > 60 || !e.match(/^[a-zA-Z0-9\s,'-éèàêûôîäëüöç]*$/) ? (errorDisplay("address", "L'adresse doit comporter moins de 60 caract\xe8res et ne peut pas contenir de caract\xe8res sp\xe9ciaux", !1), !1) : (errorDisplay("address", "", !0), !0),
    cityChecker = e => e.length < 2 || e.length > 48 || !e.match(/^[a-zA-Z\s'-]*$/) ? (errorDisplay("city", "La ville doit comporter entre 2 et 48 caract\xe8res", !1), !1) : (errorDisplay("city", "", !0), !0),
    emailChecker = e => e.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ? (errorDisplay("email", "", !0), !0) : (errorDisplay("email", "L'email n'est pas valide", !1), !1);

function formSubmitted(e) {
    e.preventDefault();
    let t = !0,
        a = e.target.elements.firstName.value,
        r = e.target.elements.lastName.value,
        l = e.target.elements.address.value,
        d = e.target.elements.city.value,
        o = e.target.elements.email.value;
    if (t &&= firstNameChecker(a), t &&= lastNameChecker(r), t &&= addressChecker(l), t &&= t &&= cityChecker, cityChecker(d), t &&= emailChecker(o)) {
        let c = {
                firstName: a,
                lastName: r,
                address: l,
                city: d,
                email: o
            },
            s = {
                contact: c,
                products: addedProducts.map(e => e.id)
            };
        console.log("Form is valid", c), sendToServer(s)
    } else console.error("Form is invalid")
}
console.log(addedProducts[0].id);
const products = addedProducts.map(e => e.id);

function sendToServer(e) {
    fetch("https://kanap-kue4.onrender.com/api/products/order", {
        method: "POST",
        body: JSON.stringify(e),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(async e => {
        if (!e.ok) throw Error(`HTTP error! status: ${e.status}`);
        return e.json()
    }).then(e => {
        let t = e.orderId;
        window.location.href = `./confirmation.html?orderId=${t}`
    }).catch(e => {
        console.error("Error from catch", e), alert(`Error: ${e}`)
    })
}
 console.log(products);