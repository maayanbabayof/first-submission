document.addEventListener("DOMContentLoaded", () => {
  const opportunitiesList = document.getElementsByClassName("opportunities-list");

  fetch("data/opportunities.json")
    .then((response) => response.json())
    .then((data) => {
      data.cards.forEach((card) => {
        const opportunityDiv = document.createElement("div");
        opportunityDiv.className = "opportunity-div";

        const img = document.createElement("img");
        img.alt = "image";
        img.src = card.image;

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
    })
    .catch((error) => console.error("Error fetching data:", error));

  // Highlight active navigation link
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
});
