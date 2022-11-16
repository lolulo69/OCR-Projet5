let url = new URL(window.location.href);
let id = url.searchParams.get("id");


fetch("http://localhost:3000/api/products/"+ id)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
//Ajout dynamique des différents paramètres dans les balises HTML
    .then(function(product) {

        document.title = product.name;

        let imageContainer = document.getElementsByClassName("item__img");
        let image = document.createElement("img");
        imageContainer[0].appendChild(image);
        image.setAttribute("src", product.imageUrl);
        image.setAttribute("alt", product.altTxt);


        let title = document.getElementById("title");
        title.innerText = product.name;


        let price = document.getElementById("price");
        price.innerText = product.price;


        let description = document.getElementById("description");
        description.innerText = product.description;


        //Boucle for of qui crée les différents choix de couleur en fonction du résultat du GET
        for(let i of product.colors) {

            let colorsContainer = document.getElementById("colors");
            let color = document.createElement("option");
            colorsContainer.appendChild(color);
            color.setAttribute("value", i);
            color.innerText = i;

        }

    })
    
//Affichage d'un message d'erreur en cas de problème à l'exécution
    .catch((err) => {
        console.log("Une erreur est survenue"); 
      });


//Déclaration des variables utilisées pour l'ajout au panier
let quantityElement = document.getElementById("quantity")
let colorElement = document.getElementById("colors")
let basketButton = document.getElementById("addToCart");
let quantity;
let selectedColor;
let alreadyAdded;


//On ajoute les 3 event listener qui vont tracker respectivement : la quantité, la couleur, et le bouton d'ajout au panier
quantityElement.addEventListener("change", storeQuantity);
colorElement.addEventListener("change", storeColor);
basketButton.addEventListener("click", addToBasket);


//Fonction qui met à jour la variable qui stock la quantité sélectionnée par l'utilisateur
function storeQuantity(value) {
    quantity = value.target.value;
}

//Fonction qui met à jour la variable qui stock la couleur sélectionnée par l'utilisateur
function storeColor(value) {
    selectedColor = value.target.value;
}

//Fonction qui gère l'ajout au panier en reprenant les différents paramètres, et met à jour l'array, avant de tout envoyer dans le DOM
function addToBasket(event) {
    event.stopPropagation();

    let basket = JSON.parse(localStorage.getItem("basket") || "[]");

    let order = {
        id: id, 
        quantity: quantity,
        color: selectedColor
    };
    for(let element of basket) {
        if(element.id == id && element.color == selectedColor) {
            alreadyAdded = true;
            let total = quantity*1+element.quantity*1;
            element.quantity = total;
            localStorage.setItem("basket", JSON.stringify(basket));
        }else{
            alreadyAdded = false;
        }
    }

    if(alreadyAdded === true) {
        return
    }else{
        basket.push(order);
        localStorage.setItem("basket", JSON.stringify(basket));
    }
}
