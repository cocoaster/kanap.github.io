let productData = [];

// Récupération des produits stockésdans l'API
const fetchProduct = async () => {
  await fetch("https://kanap-kue4.onrender.com/api/products") // Assurez-vous que l'URL est correcte et utilise HTTPS
    .then((res) => res.json())
    .then((data) => (productData = data))
    .catch((error) => console.error("An error occurred:", error)); // Ajouter un gestionnaire d'erreur pour voir les erreurs
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
    img.src = product.imageUrl.replace("http://", "https://");
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

