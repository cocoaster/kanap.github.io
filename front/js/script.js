let productData = [];

const fetchProduct = async () => {
  await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => (productData = data));
};

const productDisplay = async () => {
  await fetchProduct();
  console.log(productData[0]);

  document.querySelector("section").innerHTML = productData
    .map(
      (product) =>
        `<a href="./product.html?id=${product._id}">
            <article>
            <img src=${product.imageUrl} >
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>   
        </article>
        </a>
      `
    )
    .join("");
};
productDisplay();
// producstArray.addEventListener("click", (e) => {
//   fetchProducts().then(() => productsDisplay());
// });
