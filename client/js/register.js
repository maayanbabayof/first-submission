const url = "http://localhost:3000";

document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const city = document.getElementById("city").value;
    const address = document.getElementById("address").value;
    const age = document.getElementById("age").value;

    /////////////////

    const user = {
      email: email,
      name: username,
      password: password,
      role: role,
      phone: phone,
      city: city,
      address: address,
      age: age,
    };

    try {
      const response = await fetch(`${url}/api/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.status === 201) {
        alert("User created successfully!");
        window.location.href = "login.html";
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });
