//Récupération de l'id contenu dans l'url de la page
let url = new URL(window.location.href);
let id = url.searchParams.get("id");

//Ajout du numéro de commande dans l'élément html prévu à cet effet
document.getElementById("orderId").innerText = id;