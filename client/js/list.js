const url = "http://localhost:3000";
document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(sessionStorage.getItem("user"));
  console.log("User object from localStorage:", user);

  if (user && user.role === "farmer") {
    console.log(`User ID: ${user.userID}`);

    if (user.userID === undefined) {
      displayNoOpportunitiesMessage();
    } else {
      fetch(`${url}/api/opportunities/user/${user.userID}`)
        .then((response) => response.json())
        .then((data) => {
          setTitle("My Opportunities");
          console.log(data.length); // Log the fetched data
          if (data.length === undefined) {
            displayNoOpportunitiesMessage();
          } else {
            createAndAppendCards(data);
          }
          showAddOpportunityButton();
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  } else {
    // If the user is not a farmer or not logged in, redirect to a different page or show a message
    setTitle("Opportunities");
    fetch(`${url}/api/opportunities/all`)
      .then((response) => response.json())
      .then((data) => createAndAppendCards(data))
      .catch((error) => console.error("Error fetching data:", error));
  }
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

function displayNoOpportunitiesMessage() {
  const cardsContainer = document.querySelector("#cardsContainer");
  cardsContainer.innerHTML = `
        <div class="text-center">
            <p>No opportunities exist.</p>
            <a href="add-opportunity.html" class="btn btn-primary">Create a new opportunity</a>
        </div>
    `;
}

function showAddOpportunityButton() {
  const addOpportunityBtnContainer = document.getElementById(
    "addOpportunityBtnContainer"
  );
  addOpportunityBtnContainer.innerHTML = `<a href="add-opportunity.html" class="btn btn-primary">Add Opportunity</a>`;
}
