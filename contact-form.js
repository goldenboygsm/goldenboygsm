// ==========================================================
// VALIDATION DU FORMULAIRE DE CONTACT
// (même logique que le formulaire de réparation : on la retape
// car chaque page reste indépendante et simple à comprendre)
// ==========================================================

const formulaireContact = document.getElementById("contact-form");

formulaireContact.addEventListener("submit", function (evenement) {
  evenement.preventDefault();

  document.querySelectorAll("#contact-form .error-message").forEach(function (span) {
    span.textContent = "";
  });

  let valide = true;

  const nom = document.getElementById("c-nom");
  if (nom.value.trim() === "") {
    document.getElementById("err-c-nom").textContent = "Veuillez indiquer votre nom.";
    valide = false;
  }

  // Validation simple d'email : présence d'un @ suivi d'un point dans le domaine
  const email = document.getElementById("c-email");
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email.value.trim())) {
    document.getElementById("err-c-email").textContent = "Veuillez indiquer un email valide.";
    valide = false;
  }

  const message = document.getElementById("c-message");
  if (message.value.trim().length < 10) {
    document.getElementById("err-c-message").textContent = "Votre message doit contenir au moins 10 caractères.";
    valide = false;
  }

  if (valide) {
    document.getElementById("contact-success").textContent =
      "Message envoyé ! Nous vous répondrons dans les plus brefs délais.";
    formulaireContact.reset();
  }
});
