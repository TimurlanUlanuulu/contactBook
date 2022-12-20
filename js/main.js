let nameInp = document.getElementsByClassName("name-inp")[0];
let surnameInp = document.getElementsByClassName("surname-inp")[0];
let phoneInp = document.getElementsByClassName("phone-inp")[0];
let photoInp = document.getElementsByClassName("photo-inp")[0];
let addBtn = document.getElementsByClassName("add-btn")[0];
let contacts = document.getElementsByClassName("contacts")[0];
let editForm = document.getElementsByClassName("edit-form")[0];
let clsBtn = document.getElementsByClassName("close")[0];
let saveBtn = document.getElementsByClassName("save-btn")[0];
let nameInpEdit = document.getElementsByClassName("edit-name-inp")[0];
let surnameInpEdit = document.getElementsByClassName("edit-surname-inp")[0];
let phoneInpEdit = document.getElementsByClassName("edit-phone-inp")[0];
let photoInpEdit = document.getElementsByClassName("edit-photo-inp")[0];
let contactImage = document.getElementsByClassName("form-image")[0];

render();

addBtn.addEventListener("click", async function () {
  if (
    !nameInp.value.trim() ||
    !surnameInp.value.trim() ||
    !photoInp.value.trim() ||
    !phoneInp.value.trim()
  ) {
    alert("Заполните все поля!");
    return;
  }

  let newContact = {
    name: nameInp.value,
    surname: surnameInp.value,
    phone: phoneInp.value,
    photo: photoInp.value,
  };

  await setContactToStorage(newContact);
  render();
  nameInp.value = "";
  surnameInp.value = "";
  phoneInp.value = "";
  photoInp.value = "";
});

async function setContactToStorage(newContact) {
  let options = {
    method: "POST",
    body: JSON.stringify(newContact),
    headers: {
      "Content-Type": "application/json",
    },
  };
  await fetch("http://localhost:8000/contacts", options);
}

async function getContactsFromStorage() {
  const data = await fetch("http://localhost:8000/contacts");
  const reslut = await data.json();
  return reslut;
}

async function render() {
  const data = await getContactsFromStorage();

  contacts.innerHTML = "";

  data.forEach((item) => {
    let divContactForm = document.createElement("div");
    let divImg = document.createElement("div");
    let contImg = document.createElement("img");
    let h3 = document.createElement("h3");
    let dataDiv = document.createElement("div");
    let contDivName = document.createElement("div");
    let contDivSurname = document.createElement("div");
    let contDivPhone = document.createElement("div");
    let editBtn = document.createElement("button");
    let delBtn = document.createElement("button");

    divContactForm.classList.add("contact__form");
    divContactForm.classList.add("form");
    divImg.classList.add("image");
    contImg.classList.add("contact-photo");
    dataDiv.classList.add("contact__data");
    dataDiv.classList.add("data");
    contDivName.classList.add("contact-name");
    contDivSurname.classList.add("contact-surname");
    contDivPhone.classList.add("contact-phone-num");

    contDivName.classList.add("contact");
    contDivSurname.classList.add("contact");
    contDivPhone.classList.add("contact");

    editBtn.classList.add("btn");
    delBtn.classList.add("btn");

    editBtn.innerText = "Редактировать";
    delBtn.innerText = "Удалить";
    h3.innerText = "Данные контакта";
    contDivName.innerHTML = `<p class="pBord">Имя:</p>
    <p class="contact-name">${item.name}</p>`;
    dataDiv.append(contDivName);

    contDivSurname.innerHTML = `<p class="pBord">Фамилия:</p>
    <p class="contact-surname">${item.surname}</p>`;
    dataDiv.append(contDivSurname);

    contDivPhone.innerHTML = `<p class="pBord">Номер телефона:</p>
    <p class="contact-phone-num">${item.phone}</p>`;
    dataDiv.append(contDivPhone);

    dataDiv.append(editBtn);
    dataDiv.append(delBtn);

    contImg.setAttribute("src", `${item.photo}`);
    divImg.append(contImg);

    divContactForm.append(divImg);
    divContactForm.append(h3);
    divContactForm.append(dataDiv);

    contacts.append(divContactForm);

    delBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      deleteContact(item.id);
    });

    editBtn.addEventListener("click", function (e) {
      // e.stopPropagation();
      editContact(item.id);
    });
    // contPhone.innerText = item.phone;
  });
}

async function editContact(id) {
  editForm.style.display = "block";
  const resopns = await fetch(`http://localhost:8000/contacts/${id}`);
  const result = await resopns.json();

  nameInpEdit.value = result.name;
  surnameInpEdit.value = result.surname;
  phoneInpEdit.value = result.phone;
  photoInpEdit.value = result.photo;
  contactImage.setAttribute("src", `${result.photo}`);
  saveBtn.id = id;
}
saveBtn.addEventListener("click", async function (e) {
  // e.stopPropagation();
  let res = {};
  if (nameInpEdit.value) {
    res.name = nameInpEdit.value;
  }

  if (surnameInpEdit.value) {
    res.surname = surnameInpEdit.value;
  }

  if (phoneInpEdit.value) {
    res.phone = phoneInpEdit.value;
  }

  if (photoInpEdit.value) {
    res.photo = photoInpEdit.value;
  }
  editForm.style.display = "none";

  const options = {
    method: "PATCH",
    body: JSON.stringify(res),
    headers: {
      "Content-Type": "application/json",
    },
  };
  await fetch(`http://localhost:8000/contacts/${e.target.id}`, options);

  render();
});

clsBtn.addEventListener("click", () => {
  editForm.style.display = "none";
});

async function deleteContact(id) {
  await fetch(`http://localhost:8000/contacts/${id}`, { method: "DELETE" });
  render();
}
