document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      document.getElementById('user-greeting').textContent = `Hello ${user.name}!`;
      document.getElementById('user-profile-image').src = `${user.profilePicture}`;
    }
});