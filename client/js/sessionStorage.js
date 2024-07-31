let field = document.getElementById("login-form");

if (sessionStorage.getItem("autosave")) {

  field.value = sessionStorage.getItem("autosave");
}

field.addEventListener("change", () => {

  sessionStorage.setItem("autosave", field.value);
});