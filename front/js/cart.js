let basket = JSON.parse(localStorage.getItem("basket") || "[]");
let section = document.getElementById("cart__items");

window.onload = loadBasket();

/* Fonction qui charge le panier contenu dans le DOM à l'aide d'une boucle for et d'un fetch qui récupère les paramètres manquants
La fonction crée aussi les différents event listeners associés aux boutons du panier */
function loadBasket() {
    for(let element of basket) {

        fetch("http://localhost:3000/api/products/"+ element.id)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })

        .then(function(product) {

            let article = document.createElement('article');
            section.appendChild(article);
            article.classList.add("cart__item");
            article.setAttribute("data-id", element.id);
            article.setAttribute("data-color", element.color);


            let divImg = document.createElement('div');
            article.appendChild(divImg)
                .classList.add("cart__item__img");


            let image = document.createElement('img');
            divImg.appendChild(image);
            image.setAttribute("src", product.imageUrl);
            image.setAttribute("alt", product.altTxt);

            let divContent = document.createElement('div');
            let divContentDescription = document.createElement('div');
            let divContentSettings = document.createElement('div');
            let divContentSettingsQuantity = document.createElement('div');
            let divContentSettingsDelete = document.createElement('div');
            article.appendChild(divContent).classList.add("cart__item__content");
            divContent.appendChild(divContentDescription).classList.add("cart__item__content__description");
            divContent.appendChild(divContentSettings).classList.add("cart__item__content__settings");
            divContentSettings.appendChild(divContentSettingsQuantity).classList.add("cart__item__content__settings__quantity");
            divContentSettings.appendChild(divContentSettingsDelete).classList.add("cart__item__content__settings__delete");

            let name = document.createElement("h2");
            divContentDescription.appendChild(name);
            name.innerText = product.name;


            let color = document.createElement("p");
            divContentDescription.appendChild(color);
            color.innerText = element.color;


            let price = document.createElement("p");
            divContentDescription.appendChild(price);
            price.innerText = product.price + ",00 €";


            let quantityP = document.createElement("p");
            divContentSettingsQuantity.appendChild(quantityP);
            quantityP.innerText = "Qté : ";


            let quantity = document.createElement("input");
            divContentSettingsQuantity.appendChild(quantity);
            quantity.classList.add("itemQuantity");
            quantity.setAttribute("type", "number");
            quantity.setAttribute("name", "itemQuantity");
            quantity.setAttribute("min", "1");
            quantity.setAttribute("max", "100");
            quantity.setAttribute("value", element.quantity);
            quantity.addEventListener("change", modifyQuantity);


            let deleteButton = document.createElement("p");
            divContentSettingsDelete.appendChild(deleteButton).classList.add("deleteItem");
            deleteButton.innerText = "Supprimer"
            deleteButton.addEventListener("click", deleteItem);
            

        })
    }
    return sumQuantity(), sumPrice();
}

//Fonction qui fait le total de quantité des différents produits présents dans le panier
function sumQuantity() {
    let totalQuantity = document.getElementById("totalQuantity");
    let quantityCount = 0;
    basket.forEach(element => {quantityCount += element.quantity*1});
    totalQuantity.innerText = quantityCount;
}

//Fonction qui fait le total du prix des différents produits présents dans le panier
function sumPrice() {
    let totalPrice = document.getElementById("totalPrice");
    let priceCount = 0;
    totalPrice.innerText = 0;
    for(let element of basket) {
        fetch("http://localhost:3000/api/products/"+ element.id)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(product) {
            priceCount += element.quantity * product.price;
            totalPrice.innerText = priceCount;
        })
    }
}

//Fonction qui permet de modifier la quantité d'un article du panier, dans la page, ainsi que dans le DOM
function modifyQuantity() {
    article = this.closest("article.cart__item");
    id = article.getAttribute("data-id");
    color = article.getAttribute("data-color");
    for(let element of basket) {
        if(id == element.id && color == element.color) {
            element.quantity = 1*this.value;
            localStorage.setItem("basket", JSON.stringify(basket));
            sumQuantity();
            sumPrice();
        }
    }
}

//Fonction qui permet de supprimer un élément du panier
function deleteItem() {
    article = this.closest("article.cart__item");
    id = article.getAttribute("data-id");
    color = article.getAttribute("data-color");
    for(let element of basket) {
        if(id == element.id && color == element.color) {
            basket = basket.filter(item => item != element);
            localStorage.setItem("basket", JSON.stringify(basket));
            article.remove();
            sumQuantity();
            sumPrice();
        }
    }

}


//Déclaration des variables de regex qui servent à tester les entrées faites dans le formulaire
const regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð .'-]+$/u;
const regexName = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð .'-]{2,}[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð .'-]*$/;
const regexAddress = /[0-9bis,]+[\s]+[a-zA-Z0-9\s,.'-]/;
const regexEmail = /[a-zA-Z1-9.-_]+[@]+[a-zA-Z1-9.-_]+[.]+[a-zA-Z]/;


//On cible les éléments du formulaire et on ajoute les eventlistener
const formFirstName = document.getElementById("firstName");
const formLastName = document.getElementById("lastName");
const formAddress = document.getElementById("address");
const formCity = document.getElementById("city");
const formEmail = document.getElementById("email");

const formOrderButton = document.getElementById("order");


formFirstName.addEventListener("change", checkFirstName);
formLastName.addEventListener("change", checkLastName);
formAddress.addEventListener("change", checkAddress);
formCity.addEventListener("change", checkCity);
formEmail.addEventListener("change", checkEmail);

formOrderButton.addEventListener("click", order);


//Ces fonctions servent à tester les entrées faites dans le formulaire par le client
function checkFirstName() {
    if (regexName.test(formFirstName.value)) {
        document.getElementById("firstNameErrorMsg").innerText = "";
        return true;
    }else{
        document.getElementById("firstNameErrorMsg").innerText = "Veuillez entrer un prénom valide";
        return false;
    }
}

function checkLastName() {
    if (regexName.test(formLastName.value)) {
        document.getElementById("lastNameErrorMsg").innerText = "";
        return true;
    }else{
        document.getElementById("lastNameErrorMsg").innerText = "Veuillez entrer un nom valide";
        return false;
    }
}

function checkAddress() {
    if (regexAddress.test(formAddress.value)) {
        document.getElementById("addressErrorMsg").innerText = "";
        return true;
    }else{
        document.getElementById("addressErrorMsg").innerText = "Veuillez entrer une adresse existante";
        return false;
    }
}

function checkCity() {
    if (regex.test(formCity.value)) {
        document.getElementById("cityErrorMsg").innerText = "";
        return true;
    }else{
        document.getElementById("cityErrorMsg").innerText = "La ville spécifiée n'est pas reconnue";
        return false;
    }
}

function checkEmail() {
    if (regexEmail.test(formEmail.value)) {
        document.getElementById("emailErrorMsg").innerText = "";
        return true;
    }else{
        document.getElementById("emailErrorMsg").innerText = "Veuillez entrer une adresse email valide";
        return false;
    }
}


//Cette fonction vérifie et envoie les données du client et du panier au serveur, puis redirige le client en confirmant la commande
function order(e) {
    e.preventDefault();

    if (checkFirstName() && checkLastName() && checkAddress() && checkCity() && checkEmail() === true) {
        if (basket.length > 0) {
            let contact = {
                firstName : formFirstName.value,
                lastName : formLastName.value,
                address : formAddress.value,
                city : formCity.value,
                email : formEmail.value
            }
            let products = [];
            for (let product of basket) {
                productId = product.id;
                products.push(productId);
            }
            let toPost = {contact, products};
            fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(toPost)
            })
            .then((res) => res.json())
            .then((data) => {         
                localStorage.clear();
                window.location.href = "./confirmation.html?id=" + data.orderId;
            })
            .catch((err) => {
                console.log(err);
                alert("Une erreur est survenue");
            });
        }else{
            alert("Votre panier est vide.");
        }
    }else{
        alert("Merci de remplir le formulaire correctement.");
    }
}