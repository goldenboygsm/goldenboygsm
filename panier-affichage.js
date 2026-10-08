// ==========================================================
// AFFICHAGE ET GESTION DE LA PAGE PANIER
// (les fonctions obtenirPanier/sauvegarderPanier viennent de js/panier.js,
// chargé AVANT ce fichier dans panier.html)
// ==========================================================

const corpsTableau = document.getElementById("panier-corps");
const tableauPanier = document.getElementById("panier-table");
const messageVide = document.getElementById("panier-vide");
const blocTotal = document.getElementById("panier-total-bloc");
const totalTexte = document.getElementById("panier-total");
const sectionCommande = document.getElementById("commande-section");

// -----------------------------------------
// Formatte un nombre en "12 000 FCFA"
// -----------------------------------------
function formaterPrix(nombre) {
  return nombre.toLocaleString("fr-FR") + " FCFA";
}

// -----------------------------------------
// Reconstruit tout l'affichage du panier à partir de localStorage
// C'est LA fonction centrale : on l'appelle à chaque modification
// -----------------------------------------
function afficherPanier() {
  const panier = obtenirPanier();

  // On vide le tableau avant de le reconstruire, pour ne pas dupliquer les lignes
  corpsTableau.innerHTML = "";

  // Cas panier vide : on cache le tableau, le total et le formulaire de commande
  if (panier.length === 0) {
    tableauPanier.style.display = "none";
    blocTotal.style.display = "none";
    sectionCommande.style.display = "none";
    messageVide.style.display = "block";
    return;
  }

  // Sinon on montre tout normalement
  tableauPanier.style.display = "table";
  blocTotal.style.display = "flex";
  sectionCommande.style.display = "block";
  messageVide.style.display = "none";

  let total = 0;

  // Pour chaque produit du panier, on construit une ligne <tr>
  panier.forEach(function (produit, index) {
    const sousTotal = produit.prix * produit.quantite;
    total += sousTotal;

    // On crée la ligne dynamiquement avec createElement (plus sûr que innerHTML avec des données variables)
    const ligne = document.createElement("tr");

    ligne.innerHTML = `
      <td>${produit.nom}</td>
      <td>${formaterPrix(produit.prix)}</td>
      <td>
        <div class="quantite-controle">
          <button class="qty-btn" data-action="moins" data-index="${index}">-</button>
          <span>${produit.quantite}</span>
          <button class="qty-btn" data-action="plus" data-index="${index}">+</button>
        </div>
      </td>
      <td>${formaterPrix(sousTotal)}</td>
      <td><button class="remove-btn" data-index="${index}">✕</button></td>
    `;

    corpsTableau.appendChild(ligne);
  });

  totalTexte.textContent = formaterPrix(total);

  // On rattache les événements sur les boutons +/- et supprimer qu'on vient de créer
  attacherEvenementsLignes();
}

// -----------------------------------------
// Attache les clics sur les boutons +, -, et supprimer de chaque ligne
// Doit être appelée à chaque fois que le tableau est reconstruit,
// car les anciens boutons n'existent plus dans le DOM
// -----------------------------------------
function attacherEvenementsLignes() {

  document.querySelectorAll(".qty-btn").forEach(function (bouton) {
    bouton.addEventListener("click", function () {
      const index = parseInt(bouton.getAttribute("data-index"));
      const action = bouton.getAttribute("data-action");
      const panier = obtenirPanier();

      if (action === "plus") {
        panier[index].quantite += 1;
      } else if (action === "moins") {
        panier[index].quantite -= 1;
        // Si la quantité tombe à 0, on retire complètement le produit
        if (panier[index].quantite <= 0) {
          panier.splice(index, 1);
        }
      }

      sauvegarderPanier(panier);
      mettreAJourCompteurPanier();
      afficherPanier(); // on réaffiche tout avec les nouvelles quantités
    });
  });

  document.querySelectorAll(".remove-btn").forEach(function (bouton) {
    bouton.addEventListener("click", function () {
      const index = parseInt(bouton.getAttribute("data-index"));
      const panier = obtenirPanier();
      panier.splice(index, 1); // enlève 1 élément à la position "index"
      sauvegarderPanier(panier);
      mettreAJourCompteurPanier();
      afficherPanier();
    });
  });

}

// -----------------------------------------
// Validation et "envoi" du formulaire de commande
// -----------------------------------------
const formulaireCommande = document.getElementById("commande-form");

formulaireCommande.addEventListener("submit", function (evenement) {
  evenement.preventDefault();

  document.querySelectorAll("#commande-form .error-message").forEach(function (span) {
    span.textContent = "";
  });

  let valide = true;

  const nom = document.getElementById("cmd-nom");
  if (nom.value.trim() === "") {
    document.getElementById("err-cmd-nom").textContent = "Veuillez indiquer votre nom.";
    valide = false;
  }

  const adresse = document.getElementById("cmd-adresse");
  if (adresse.value.trim() === "") {
    document.getElementById("err-cmd-adresse").textContent = "Veuillez indiquer une adresse de livraison.";
    valide = false;
  }

  const telephone = document.getElementById("cmd-telephone");
  const chiffres = telephone.value.replace(/\D/g, "");
  if (chiffres.length < 8) {
    document.getElementById("err-cmd-telephone").textContent = "Numéro de téléphone invalide.";
    valide = false;
  }

  if (valide) {
    document.getElementById("commande-success").textContent =
      "Commande validée ! Vous recevrez un appel de confirmation sous peu.";
    // On vide le panier après une commande réussie
    sauvegarderPanier([]);
    mettreAJourCompteurPanier();
    formulaireCommande.reset();
    setTimeout(afficherPanier, 1500); // petit délai pour laisser le temps de lire le message
  }
});

// Au chargement de la page panier, on affiche tout de suite le contenu
document.addEventListener("DOMContentLoaded", afficherPanier);
