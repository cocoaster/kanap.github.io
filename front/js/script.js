let productData = [];

// Récupération des produits stockésdans l'API
const fetchProduct = async () => {
  await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => (productData = data));
};

// Affichage des produits sur la page
const productDisplay = async () => {
  await fetchProduct();
  console.log(productData[0]);

  document.querySelector("section").innerHTML = productData
    .map(
      (product) =>
        `<a href="front/html/product.html?id=${product._id}">
            <article>
            <img src=${product.imageUrl} alt=${product.altTxt} >
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>   
        </article>
        </a>
      `
    )
    .join("");
};
productDisplay();

