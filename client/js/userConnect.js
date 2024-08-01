document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (user) {
    document.getElementById(
      "user-greeting"
    ).innerHTML = `Hello <span>${user.name}</span>!`;
    document.getElementById(
      "user-profile-image"
    ).src = `${user.profilePicture}`;
  }

  const navLink = document
    .querySelector('a[href="./applications.html"]')
    .querySelector("p");

  if (user && user.role === "volunteer") {
    navLink.textContent = "My Volunteer";
    navLink.setAttribute("href", "#");
  }
  const footer = document.querySelector('footer');
  const firstAnchor = footer.querySelectorAll('a')[0];
  const firstParagraph = firstAnchor.querySelector('p');
  if (user && user.role === "volunteer") {
    firstParagraph.textContent = "My Volunteer";
    firstAnchor.setAttribute("href", "#");
  }
});
