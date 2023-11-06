const productsLocation = document.getElementById("cart__items");
console.log(productsLocation);
const totalLocation = document.getElementById("totalPrice");
console.log(totalLocation);
const cartOrderElem = document.querySelector(".cart__order"),
    getLocalStorage = localStorage.getItem("products");
console.log(getLocalStorage);
let cartItems = [];

function emptyCart() {
    {
        productsLocation.innerHTML = "<p id = 'emptyCartMsg'>Votre panier est vide</p>";
        let e = document.getElementById("emptyCartMsg");
        e.style.textAlign = "center", cartOrderElem.style.display = "none"
    }
}
null !== getLocalStorage && (cartItems = JSON.parse(getLocalStorage)), console.log(cartItems), null == getLocalStorage && emptyCart();
const addedProducts = JSON.parse(localStorage.getItem("products") || []);
async function fetchProduct() {
    await fetch("https://kanap-kue4.onrender.com/api/products").then(e => e.json()).then(e => productData = e).catch(e => console.error("An error occurred:", e)), console.log(productData)
}
fetchProduct();
let datas = [];
async function mergeApiAndLocalData() {
    await fetchProduct();
    for (let e = 0; e < addedProducts.length; e++) {
        let t = !1;
        for (let a = 0; a < productData.length; a++)
            if (productData[a]._id === addedProducts[e].id) {
                let r = {
                    ...addedProducts[e],
                    ...productData[a]
                };
                datas.push(r), t = !0
            }
    }
    return datas
}

function calculPrice() {
    let e = 0;
    for (let t = 0; t < datas.length; t++) e += datas[t].price * datas[t].quantity;
    console.log(e), totalLocation.innerHTML = ` ${e}`
}
async function productDisplay() {
    await fetchProduct();
    let e = document.createDocumentFragment();
    for (let t = 0; t < datas.length; t++) {
        let a = datas[t].color,
            r = datas[t].quantity,
            l = datas[t].id;
        datas[t]._id;
        let d = datas[t].name,
            o = datas[t].imageUrl,
            c = datas[t].altTxt,
            s = datas[t].price,
            n = document.createElement("article");
        n.className = "cart__item", n.setAttribute("data-id", l), n.setAttribute("data-color", a);
        let i = document.createElement("div");
        i.className = "cart__item__img";
        let m = document.createElement("img");
        m.src = o.replace("http://", "https://"), m.alt = c, i.appendChild(m), n.appendChild(i);
        let p = document.createElement("div");
        p.className = "cart__item__content";
        let u = document.createElement("div");
        u.className = "cart__item__content__description";
        let h = document.createElement("h2");
        h.textContent = d;
        let g = document.createElement("p");
        g.textContent = a;
        let y = document.createElement("p");
        y.textContent = `${s}€`, u.appendChild(h), u.appendChild(g), u.appendChild(y), p.appendChild(u);
        let f = document.createElement("div");
        f.className = "cart__item__content__settings";
        let C = document.createElement("div");
        C.className = "cart__item__content__settings__quantity";
        let $ = document.createElement("p");
        $.textContent = "Qt\xe9 :  ";
        let v = document.createElement("input");
        v.type = "number", v.className = "itemQuantity", v.name = "itemQuantity", v.min = "1", v.max = "100", v.value = r, C.appendChild($), C.appendChild(v), f.appendChild(C);
        let E = document.createElement("div");
        E.className = "cart__item__content__settings__delete";
        let L = document.createElement("p");
        L.className = "deleteItem", L.textContent = "Supprimer", E.appendChild(L), f.appendChild(E), p.appendChild(f), n.appendChild(p), e.appendChild(n), calculPrice()
    }
    productsLocation.appendChild(e)
}
mergeApiAndLocalData(), productDisplay(), setTimeout(() => {
    let e = document.querySelectorAll(".itemQuantity");
    console.log(e);
    let t = document.querySelectorAll(".deleteItem");
    console.log(t);
    for (let a = 0; a < e.length; a++) {
        let r = e[a].closest(".cart__item"),
            l = r.dataset.id,
            d = r.dataset.color;
        console.log(l, d), e[a].addEventListener("change", function() {
            let e = Number(this.value);
            for (let t = 0; t < addedProducts.length; t++)
                if (addedProducts[t].id === l && addedProducts[t].color === d) {
                    if (addedProducts[t].quantity = e, e < 1 || e > 100) {
                        alert("Veuillez s\xe9lectionner une quantit\xe9 entre 1 et 100."), this.value = datas.find(e => e.id === l && e.color === d).quantity;
                        return
                    }
                    localStorage.setItem("products", JSON.stringify(addedProducts));
                    for (let a = 0; a < datas.length; a++)
                        if (datas[a].id === l && datas[a].color === d) {
                            datas[a].quantity = e;
                            break
                        } calculPrice(), console.log(totalLocation)
                }
        })
    }
    for (let o = 0; o < t.length; o++) t[o].addEventListener("click", function e() {
        let t = this.closest(".cart__item"),
            a = t.dataset.id,
            r = t.dataset.color;
        for (let l = 0; l < datas.length; l++)
            if (datas[l].id === a && datas[l].color === r) {
                datas.splice(l, 1), localStorage.setItem("products", JSON.stringify(addedProducts)), calculPrice(), console.log(datas);
                break
            } localStorage.setItem("products", JSON.stringify(datas)), 0 === datas.length && (localStorage.removeItem("products"), emptyCart()), t.remove(), calculPrice()
    })
}, 2e3);
const form = document.querySelector("form");
form.addEventListener("submit", e => {
    formSubmitted(e)
});
const inputs = document.querySelectorAll('input[type="text"], input[type="email"]'),
    errorDisplay = (e, t, a) => {
        let r = document.getElementById(e + "ErrorMsg");
        a ? r.textContent = "" : r.textContent = t
    },
    firstNameChecker = e => e.length > 48 || !e.match(/^[a-zA-Z'-]*$/) ? (errorDisplay("firstName", "Le pr\xe9nom doit comporter moins de 48 caract\xe8res"), !1) : (errorDisplay("firstName", "", !0), e),
    lastNameChecker = e => e.length > 47 || !e.match(/^[a-zA-Z'-]*$/) ? (errorDisplay("lastName", "Le nom doit comporter moins de 48 caract\xe8res"), !1) : (errorDisplay("lastName", "", !0), e),
    addressChecker = e => e.length > 60 || !e.match(/^[a-zA-Z0-9\s,'-éèàêûôîäëüöç]*$/) ? (errorDisplay("address", "L'adresse doit comporter moins de 60 caract\xe8res et ne peut pas contenir de caract\xe8res sp\xe9ciaux", !1), !1) : (errorDisplay("address", "", !0), !0),
    cityChecker = e => e.length < 2 || e.length > 48 || !e.match(/^[a-zA-Z\s'-]*$/) ? (errorDisplay("city", "La ville doit comporter entre 2 et 48 caract\xe8res", !1), !1) : (errorDisplay("city", "", !0), !0),
    emailChecker = e => e.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ? (errorDisplay("email", "", !0), !0) : (errorDisplay("email", "L'email n'est pas valide", !1), !1);

function formSubmitted(e) {
    e.preventDefault();
    let t = !0,
        a = e.target.elements.firstName.value,
        r = e.target.elements.lastName.value,
        l = e.target.elements.address.value,
        d = e.target.elements.city.value,
        o = e.target.elements.email.value;
    if (t &&= firstNameChecker(a), t &&= lastNameChecker(r), t &&= addressChecker(l), t &&= t &&= cityChecker, cityChecker(d), t &&= emailChecker(o)) {
        let c = {
                firstName: a,
                lastName: r,
                address: l,
                city: d,
                email: o
            },
            s = {
                contact: c,
                products: addedProducts.map(e => e.id)
            };
        console.log("Form is valid", c), sendToServer(s)
    } else console.error("Form is invalid")
}
console.log(addedProducts[0].id);
const products = addedProducts.map(e => e.id);

function sendToServer(e) {
    fetch("https://kanap-kue4.onrender.com/api/products/order", {
        method: "POST",
        body: JSON.stringify(e),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(async e => {
        if (!e.ok) throw Error(`HTTP error! status: ${e.status}`);
        return e.json()
    }).then(e => {
        let t = e.orderId;
        window.location.href = `./confirmation.html?orderId=${t}`
    }).catch(e => {
        console.error("Error from catch", e), alert(`Error: ${e}`)
    })
}
 console.log(products);