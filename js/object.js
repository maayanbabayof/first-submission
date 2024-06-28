document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const cardId = urlParams.get('id');

    fetch("data/opportunities.json")
        .then(response => response.json())
        .then(data => {
            const card = data.cards.find(card => card.id == cardId);
            if (card) {
                displayCard(card);
            } else {
                console.error("Card not found");
            }
        })
        .catch(error => console.error("Error fetching data:", error));
});

function displayCard(card) {
    const objectContainer = document.getElementById("objectContainer");
    const cardElement = document.createElement("div");
    cardElement.className = "card";
    cardElement.innerHTML = `
        <img src="${card.image}" class="card-img-top" alt="${card.title}">
        <div class="card-body">
            <h5 class="card-title">${card.title}</h5>
            <p class="card-text">${card.region}, ${card.city}</p>
            <p class="card-text">Rating: ${card.rating}</p>
            <p class="card-text">Date: ${card.date}</p>
        </div>
    `;
    objectContainer.appendChild(cardElement);
}