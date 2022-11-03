let url = new URL(window.location.href);
let id = url.searchParams.get("id");


fetch("http://localhost:3000/api/products/"+ id)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(product) {

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
