
const url = "https://web2-project-pvk5.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (user) {
    if (user.role === "farmer") {
      console.log("farmer");
      document.getElementById("volunteer-content").style.display = "none";
      document.getElementById("farmer-content").style.display = "block";
    } else {
      console.log("volunteer");
      document.getElementById("farmer-content").style.display = "none";
      document.getElementById("volunteer-content").style.display = "block";

      const opportunitiesList =
        document.getElementsByClassName("opportunities-list");

      fetch(`${url}/api/applications/user/${user.userID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: user.role,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.length === 0) {
          } else {
            const approvedCards = data.filter(
              (card) => card.status === "approved"
            );
            approvedCards.forEach((card) => {
              const opportunityDiv = document.createElement("div");
              opportunityDiv.className = "opportunity-div";

              const img = document.createElement("img");
              img.alt = "image";
              img.src = card.img;

              const infoDiv = document.createElement("div");

              const title = document.createElement("p");
              title.className = "title";
              title.textContent = card.title;

              const description = document.createElement("p");
              description.className = "description";
              description.innerHTML = `
                  Region: ${card.region} <br>
                  City: ${card.city} <br>
                  Rating: ${card.rating} <br>
                  Date: ${card.date}
              `;

              const deleteButton = document.createElement("button");
              deleteButton.textContent = "Delete";
              deleteButton.classList.add("delete-button");
              deleteButton.addEventListener("click", () => {
                opportunitiesList[0].removeChild(opportunityDiv);
              });

              infoDiv.appendChild(title);
              infoDiv.appendChild(description);
              infoDiv.appendChild(deleteButton);
              opportunityDiv.appendChild(img);
              opportunityDiv.appendChild(infoDiv);

              opportunitiesList[0].appendChild(opportunityDiv);
            });
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  } else {
    document.getElementById("farmer-content").style.display = "none";
    document.getElementById("volunteer-content").style.display = "block";
  }

  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });

  document
    .getElementById("opportunities-link")
    .addEventListener("click", (event) => {
      if (opportunitiesList[0].children.length === 0) {
        event.preventDefault();
        window.location.href = "my-opportunities.html";
      }
    });
});

function redirectToMyOpportunities() {
  window.location.href = "my-opportunities.html";
}
