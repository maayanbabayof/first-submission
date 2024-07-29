document.addEventListener("DOMContentLoaded", function () {
   
  fetch("http://localhost:3000/api/opportunities/all")
    .then((response) => response.json())
    .then((data) => {
      setTitle("Opportunities");
      createAndAppendCards(data);
    })
    .catch((error) => console.error("Error fetching data:", error));
});

function setTitle(title) {
  document.getElementById("pageTitle").innerText = title;
}

function createAndAppendCards(cards) {
  const cardsContainer = document.querySelector("#cardsContainer .cardsGrid");

  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.className = "card mb-3 card-width";

    cardElement.innerHTML = `
            <div class="col g-0">
                <div class="col">
                    <img src="${card.img}" class="img-fluid rounded-start" alt="${card.title}">
                </div>
                <div class="col">
                    <div class="card-body">
                        <h5 class="card-title">${card.title}</h5>
                        <p class="card-text">${card.region}, ${card.city}</p>
                        <p class="card-text">Rating: ${card.rate}★</p>
                        <p class="card-text"><small class="text-body-secondary">Date: ${card.date}</small></p>
                    </div>
                </div>
            </div>
        `;

    cardElement.addEventListener("click", () => {
      window.location.href = `object.html?id=${card.opportunity}`;
    });

    cardsContainer.appendChild(cardElement);
  });
}
