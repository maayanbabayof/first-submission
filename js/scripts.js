document.addEventListener("DOMContentLoaded", function () {
    fetch("data/opportunities.json")
        .then(response => response.json())
        .then(data => {
            setTitle(data.title);
            createAndAppendCards(data.cards);
        })
        .catch(error => console.error("Error fetching data:", error));
});

function setTitle(title) {
    document.getElementById("pageTitle").innerText = title;
}

function createAndAppendCards(cards) {
    const cardsContainer = document.getElementById("cardsContainer");

    cards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.className = "card mb-3";
        cardElement.style.maxWidth = "540px";
        cardElement.innerHTML = `
            <div class="row g-0">
                <div>
                    <img src="${card.image}" class="img-fluid rounded-start" alt="${card.title}">
                </div>
                <div class="col-md-12">
                    <div class="card-body">
                        <h5 class="card-title">${card.title}</h5>
                        <p class="card-text">${card.region}, ${card.city}</p>
                        <p class="card-text">Rating: ${card.rating}</p>
                        <p class="card-text"><small class="text-body-secondary">Date: ${card.date}</small></p>
                    </div>
                </div>
            </div>
        `;

        cardElement.addEventListener("click", () => {
            window.location.href = `object.html?id=${card.id}`;
        });

        cardsContainer.appendChild(cardElement);
    });
}
