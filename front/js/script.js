//Récupération du tableau des produits via requête GET
fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(products) {
        let section = document.getElementById("items");

//Boucle for qui assigne chaque produit à ses différents élément html
        for(let product of products) {

            let productLink = document.createElement("a");
            section.appendChild(productLink);
            productLink.setAttribute("href", "./product.html?id="+product._id);

            let productArticle = document.createElement("article");
            productLink.appendChild(productArticle);

            let productImage = document.createElement("img");
            productArticle.appendChild(productImage);
            productImage.setAttribute("src", product.imageUrl);
            productImage.setAttribute("alt", product.altTxt);

            let productTitle = document.createElement("h3");
            productArticle.appendChild(productTitle);
            productTitle.innerText = product.name;
            productTitle.classList.add("productName");

            let productDescription = document.createElement("p");
            productArticle.appendChild(productDescription);
            productDescription.innerText = product.description;
            productDescription.classList.add("productDescription");

        }
    })
//Affichage d'un message d'erreur en cas de problème à l'exécution
    .catch((err) => {
        console.log("Une erreur est survenue"); 
      });