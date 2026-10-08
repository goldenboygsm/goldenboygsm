// ==========================================================
// VALIDATION DU FORMULAIRE DE PRISE DE RENDEZ-VOUS
// ==========================================================

// 1. On récupère le formulaire et le paragraphe de succès
const formulaire = document.getElementById("rdv-form");
const messageSucces = document.getElementById("rdv-success");

// 2. On écoute l'événement "submit" (clic sur le bouton, ou touche Entrée)
formulaire.addEventListener("submit", function (evenement) {

  // On empêche le comportement par défaut (rechargement de la page)
  // pour pouvoir d'abord vérifier les champs nous-mêmes
  evenement.preventDefault();

  // On réinitialise les anciens messages d'erreur avant de revalider
  document.querySelectorAll(".error-message").forEach(function (span) {
    span.textContent = "";
  });

  let formulaireValide = true; // on part du principe que tout est bon, et on invalide si besoin

  // 3. Validation du champ "nom" : ne doit pas être vide
  const nom = document.getElementById("nom");
  if (nom.value.trim() === "") {
    document.getElementById("err-nom").textContent = "Veuillez indiquer votre nom.";
    formulaireValide = false;
  }

  // 4. Validation du champ "téléphone" : doit contenir au moins 8 chiffres
  const telephone = document.getElementById("telephone");
  const chiffresUniquement = telephone.value.replace(/\D/g, ""); // \D = tout ce qui n'est PAS un chiffre
  if (chiffresUniquement.length < 8) {
    document.getElementById("err-telephone").textContent = "Numéro de téléphone invalide (8 chiffres minimum).";
    formulaireValide = false;
  }

  // 5. Validation du champ "modèle" : ne doit pas être vide
  const modele = document.getElementById("modele");
  if (modele.value.trim() === "") {
    document.getElementById("err-modele").textContent = "Veuillez indiquer le modèle de votre appareil.";
    formulaireValide = false;
  }

  // 6. Validation de la date : doit être renseignée et pas dans le passé
  const date = document.getElementById("date");
  const aujourdHui = new Date().toISOString().split("T")[0]; // date du jour au format AAAA-MM-JJ
  if (date.value === "") {
    document.getElementById("err-date").textContent = "Veuillez choisir une date.";
    formulaireValide = false;
  } else if (date.value < aujourdHui) {
    document.getElementById("err-date").textContent = "La date ne peut pas être dans le passé.";
    formulaireValide = false;
  }

  // 7. Si tout est valide : on affiche un message de succès et on vide le formulaire
  if (formulaireValide) {
    messageSucces.textContent = "Votre demande a bien été envoyée ! Nous vous contacterons rapidement pour confirmer le rendez-vous.";
    formulaire.reset();
  } else {
    messageSucces.textContent = "";
  }

});
