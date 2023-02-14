const orderNumberLocation = document.getElementById("orderId");
const id = localStorage.getItem("orderID") || [];

console.log(`orderId: ${id}`);
orderNumberLocation.innerHTML = `${id}`;

function removeLocalStorage(key) {
  localStorage.removeItem(key);
}
removeLocalStorage("orderID");
removeLocalStorage("products");
