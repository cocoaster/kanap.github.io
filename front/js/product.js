let productData = [];
let pageUrl = location.href;
console.log(pageUrl);
const titleHeaderLocation = document.querySelector("head > title");
const imgLocation = document.querySelector(".item__img");
console.log(imgLocation);
const h1Location = document.getElementById("title");
const priceLocation = document.getElementById("price");
const descriptionLocation = document.getElementById("description");
const colorsLocation = document.getElementById("colors");

const urlIdSelected = window.location.search;
console.log(urlIdSelected);

const urlIdSelectedSliced = urlIdSelected.slice(1);

const url = new URLSearchParams(urlIdSelected);

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
  let price = productData.price;
  let description = productData.description;

  titleHeaderLocation.textContent = `${name}`;

  imgLocation.innerHTML = `
  <img src="${image}" />
  `;
  h1Location.innerHTML = `
  <h1>${name}</h1>
  `;
  priceLocation.innerHTML = `
<span id="price">${price}</span>
  `;
  descriptionLocation.innerHTML = `
  <p id="description">${description}</p>
  `;

  let colorOption = [];

  for (let i = 0; i < productData.colors.length; i++) {
    if (productData.colors[`${i}`]) {
      let color = productData.colors[`${i}`];
      console.log(color);

      colorOption.push(`<option value=${color}>${color}</option>`);
      console.log(colorOption);
    }
  }
  colorOption.forEach((colorIndex) => console.log);

  colorsLocation.innerHTML = `${colorOption.join("")}`;
}

productDisplay();

//envoyer la sélection dans le local strorage et renvoyer vers le panier après validation

// let quantity = quantity.value;

document
  .getElementById("addToCart")
  .addEventListener("click", () => ProductsValues());

const ProductsValues = (values) => {
  const data = {
    color: colors.value,
    quantity: quantity.value,
    id: `${id}`,
  };

  //ajout des produits dans le local storage
  const addedProducts = JSON.parse(localStorage.getItem("products")) || [];

  const existingProductIndex = addedProducts.findIndex(
    (p) => p.id === data.id && p.color === data.color
  );
  if (existingProductIndex === -1) {
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
  localStorage.setItem("products", JSON.stringify(addedProducts));
  location.href = "./cart.html";
};
