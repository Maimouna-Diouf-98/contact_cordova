let contacts = [];

function afficherContacts() {
  const liste = $("#contactList").empty();
  if (contacts.length === 0) {
    return liste.append("<p>Aucun contact enregistré</p>");
  }

  contacts.forEach((c, index) => {
    let photoHTML = c.photo
      ? `<img src="${c.photo}" alt="Photo" class="contact-img">`
      : `<div class="contact-img-default">👤</div>`;

    const item = `
      <div class="contact-card">
        ${photoHTML}
        <div class="contact-info">
          <div class="contact-name">${c.nom}</div>
          <div class="contact-phone">${c.telephone}</div>
          <div class="contact-actions">
            <a href="#viewPage" onclick="voirContact(${index})" class="ui-btn ui-mini ui-btn-a">Voir</a>
            <a href="#addPage" onclick="chargerFormulaire(${index})" class="ui-btn ui-mini ui-btn-b">Modifier</a>
            <a href="#" onclick="supprimerContact(${index})" class="ui-btn ui-mini ui-btn-c">Supprimer</a>
          </div>
        </div>
      </div>`;
    liste.append(item);
  });
}
function chargerContactsTelephone() {
  const options = new ContactFindOptions();
  options.filter = "";
  options.multiple = true;
  options.desiredFields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.phoneNumbers];
  const fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.phoneNumbers];

  navigator.contacts.find(fields, function(results) {
    contacts = results
      .filter(c => c.displayName && c.phoneNumbers && c.phoneNumbers.length > 0)
      .map(c => ({
        nom: c.displayName,
        telephone: c.phoneNumbers[0].value,
        photo: null,
        email: null
      }));

    afficherContacts();
  }, function(err) {
    alert("Erreur lors de la récupération des contacts: " + err);
  }, options);
}

function voirContact(index) {
  const c = contacts[index];
  const image = c.photo
    ? `<img src="${c.photo}" class="detail-photo">`
    : `<div class="detail-photo-default"></div>`;

  const html = `
    <div class="detail-card">
      ${image}
      <h2>${c.nom}</h2>
      <p>${c.telephone}</p>
      ${c.email ? `<p>${c.email}</p>` : ''}
    </div>
  `;
  $("#contactDetails").html(html);
}



$(document).on("submit", "#contactForm", function (e) {
  e.preventDefault();
  const nom = $("#nom").val();
  const tel = $("#telephone").val();
  const email = $("#email").val();
  const photo = $("#photo").val();
  const id = $("#contactId").val();

  const nouveau = { nom, telephone: tel, email, photo };

  if (id === "") {
    contacts.push(nouveau);
  } else {
    contacts[id] = nouveau;
  }

  $.mobile.changePage("#mainPage");
  afficherContacts();
  this.reset();
  $("#formTitle").text("Ajouter Contact");
});

function chargerFormulaire(index) {
  const c = contacts[index];
  $("#contactId").val(index);
  $("#nom").val(c.nom);
  $("#telephone").val(c.telephone);
  $("#email").val(c.email || '');
  $("#photo").val(c.photo || '');
  $("#formTitle").text("Modifier Contact");
}

function supprimerContact(index) {
  if (confirm("Supprimer ce contact ?")) {
    contacts.splice(index, 1);
    afficherContacts();
  }
}

$("#searchContact").on("input", function () {
  const term = $(this).val().toLowerCase();
  const resultats = contacts.filter(c => c.nom.toLowerCase().includes(term));
  const liste = $("#contactList").empty();

  resultats.forEach((c, index) => {
    const photo = c.photo
      ? `<img src="${c.photo}" class="contact-img