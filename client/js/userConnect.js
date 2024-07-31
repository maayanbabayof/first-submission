document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    document.getElementById(
      "user-greeting"
    ).textContent = `Hello ${user.name}!`;
    document.getElementById(
      "user-profile-image"
    ).src = `${user.profilePicture}`;
  }


  const navLink = document
    .querySelector('a[href="./applications.html"]')
    .querySelector("p");

  if (user && user.role === "volunteer") {
    navLink.style.display = "none";
  }
});
