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
  await fetch(`https://kanap-kue4.onrender.com/api/products/${id}`)
    .then((res) => res.json())
    .then((data) => (productData = data))
    .catch((error) => console.error("An error occurred:", error));


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
  img.src = image.replace("http://", "https://");

  img.alt = alt;
  imgLocation.appendChild(img);

  let h1 = document.createElement("h1");
  h1.textContent = name;
  h1Location.appendChild(h1);

  priceLocation.textContent = price;
  descriptionLocation.textContent = description;
  

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

  const ProductsValues = () => {
    const colors = document.getElementById('colors'); // Assurez-vous que l'ID est correct
    const quantity = document.getElementById('quantity'); // Assurez-vous que l'ID est correct
  
    const data = {
      color: colors.value,
      quantity: parseInt(quantity.value), // Convertir la quantité en nombre ici pour éviter de le faire à plusieurs endroits
      id: id,
    };

  //Ajout des produits dans le local storage
  let addedProducts = JSON.parse(localStorage.getItem("products")) || [];

  const existingProductIndex = addedProducts.findIndex(
    (p) => p.id === data.id && p.color === data.color
  );

  if (data.quantity < 1 || data.quantity > 100) {
    alert("Veuillez sélectionner une quantité entre 1 et 100");
    return;
  } else if (existingProductIndex === -1) {
    addedProducts.push(data);
  } else {
    // Pas besoin de map ici, car nous mettons à jour un seul produit
    addedProducts[existingProductIndex].quantity += data.quantity;
  }
  localStorage.setItem("products", JSON.stringify(addedProducts));
  location.href = "./cart.html";
  
};



