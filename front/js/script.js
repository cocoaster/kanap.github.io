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

  const section = document.querySelector("section");

  productData.forEach((product) => {
    const a = document.createElement("a");
    a.href = `front/html/product.html?id=${product._id}`;

    const article = document.createElement("article");

    const img = document.createElement("img");
    img.src = product.imageUrl;
    img.alt = product.altTxt;
    article.appendChild(img);

    const h3 = document.createElement("h3");
    h3.classList.add("productName");
    h3.textContent = product.name;
    article.appendChild(h3);

    const p = document.createElement("p");
    p.classList.add("productDescription");
    p.textContent = product.description;
    article.appendChild(p);

    a.appendChild(article);
    section.appendChild(a);
  });
};

productDisplay();

