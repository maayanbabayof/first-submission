document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (user) {
    document.getElementById("logout-button").style.display = "block";
  } else {
    window.location.href = "login.html";
  }

  document
    .getElementById("logout-button")
    .addEventListener("click", function () {
      // Clear session storage and redirect to the login page
      sessionStorage.removeItem("user");
      window.location.href = "login.html";
    });
});
