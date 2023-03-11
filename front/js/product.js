let productData = [];

// let pageUrl = location.href;
// console.log(pageUrl);

// Ciblage des éléments de la page
const titleHeaderLocation = document.querySelector("head > title");
const imgLocation = document.querySelector(".item__img");
console.log(imgLocation);
const h1Location = document.getElementById("title");
const priceLocation = document.getElementById("price");
const descriptionLocation = document.getElementById("description");
const colorsLocation = document.getElementById("colors");

// Récupération de l'id du produit sélectionné
const urlIdSelected = window.location.search;
console.log(urlIdSelected);

// const urlIdSelectedSliced = urlIdSelected.slice(1);
// console.log(urlIdSelectedSliced);

const url = new URLSearchParams(urlIdSelected);
console.log(url);
const id = url.get("id");
console.log(id);

// Appeler le produit sélectionné dans l'API
const fetchProduct = async () => {
  await fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => res.json())
    .then((data) => (productData = data));

  console.log(productData);
};
fetchProduct();

// Afficher le produit est ses caractéritiques

async function productDisplay() {
  await fetchProduct();
  console.log(productData.name);

  let name = productData.name;
  let image = productData.imageUrl;
  let alt = productData.altTxt;
  let price = productData.price;
  let description = productData.description;

  titleHeaderLocation.textContent = `${name}`;

  let img = document.createElement("img");
  img.src = image;
  img.alt = alt;
  imgLocation.appendChild(img);

  let h1 = document.createElement("h1");
  h1.textContent = name;
  h1Location.appendChild(h1);

  let priceSpan = document.createElement("span");
  priceSpan.id = "price";
  priceSpan.textContent = price;
  priceLocation.appendChild(priceSpan);

  let descriptionP = document.createElement("p");
  descriptionP.id = "description";
  descriptionP.textContent = description;
  descriptionLocation.appendChild(descriptionP);

  colorsLocation.innerHTML = ""; // Vider la liste de couleurs avant de la remplir

  let colorOption = [];

  for (let i = 0; i < productData.colors.length; i++) {
    if (productData.colors[`${i}`]) {
      let color = productData.colors[`${i}`];
      console.log(color);

      let option = document.createElement("option");
      option.value = color;
      option.textContent = color;
      colorOption.push(option);
    }
  }

  // Ajouter chaque option de colorOption à colorsLocation
  colorOption.forEach((option) => colorsLocation.appendChild(option));
}

productDisplay();


//envoyer la sélection dans le local strorage et renvoyer vers le panier après validation
document
  .getElementById("addToCart")
  .addEventListener("click", () => ProductsValues());

const ProductsValues = (values) => {
  const data = {
    color: colors.value,
    quantity: quantity.value,
    id: `${id}`,
  };

  //Ajout des produits dans le local storage
  const addedProducts = JSON.parse(localStorage.getItem("products")) || [];

  const existingProductIndex = addedProducts.findIndex(
    (p) => p.id === data.id && p.color === data.color
  );
  if (quantity.value < 1 || quantity.value > 100) {
    alert("Veuillez sélectionner une quantité entre 1 et 100");
    return;
  } else if (
    existingProductIndex === -1 &&
    data.quantity > 0 &&
    data.quantity <= 100
  ) {
    addedProducts.push({
      ...data,
      quantity: Number(data.quantity),
    });
  } else {
    addedProducts.map((item) => {
      return {
        ...item,
        quantity: parseInt(item.quantity),
      };
    });
    addedProducts[existingProductIndex].quantity += Number(data.quantity);
  }

  location.href = "./cart.html";

  localStorage.setItem("products", JSON.stringify(addedProducts));
};



