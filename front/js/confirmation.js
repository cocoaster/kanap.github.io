const orderNumberLocation = document.getElementById("orderId");
const id = localStorage.getItem("orderID") || [];

// Afficher le n° de commande 
console.log(`orderId: ${id}`);
orderNumberLocation.innerHTML = `${id}`;

// Retirer les données duu local storage
function removeLocalStorage(key) {
  localStorage.removeItem(key);
}
removeLocalStorage("orderID");
removeLocalStorage("products");
