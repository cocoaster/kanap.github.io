const orderNumberLocation = document.getElementById("orderId");
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get("orderId");

// Afficher le n° de commande
console.log(`orderId: ${orderId}`);
orderNumberLocation.innerHTML = `${orderId}`;

// Retirer les données duu local storage
function removeLocalStorage(key) {
  localStorage.removeItem(key);
}
removeLocalStorage("products");
