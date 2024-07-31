const url = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const cardId = urlParams.get("id");

  fetch(`${url}/api/opportunities/${cardId}`)
    .then((response) => response.json())
    .then((card) => {
      if (card) {
        displayCardContent(card);
        setUpNavLinks(card);
        console.log(card);
      } else {
        console.error("Card not found");
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
});

function displayCardContent(card) {
  const objectContainer = document.getElementById("objectContainer");
  const user = JSON.parse(localStorage.getItem("user"));

  let buttons = "";
  if (user && user.role === "farmer") {
    buttons = `
            <div class="button-container text-center mt-4">
                <a class="btn btn-primary mx-2" id="editBtn">Edit</a>
                <a class="btn btn-danger mx-2" id="deleteBtn">Delete</a>
            </div>
        `;
  } else {
    buttons = `
            <div class="button-container text-center mt-4">
                <button class="btn btn-primary mx-2" id="applyButton" role="button">Apply</button>
            </div>
        `;
  }

  objectContainer.innerHTML = `
        <div class="card-content mx-auto">
            <img src="${card.img}" class="card-img-top" alt="${card.title}">
            <div class="card-body">
                <h5 class="card-title">${card.title}</h5>
                <p class="card-text">${card.region}, ${card.city}</p>
                <p class="card-text">Rating: ${card.rate}★</p>
                <p class="card-text">Date: ${card.date}</p>
            </div>
        </div>
        ${buttons}
    `;

  if (user && user.role === "farmer") {
    document.getElementById("editBtn").addEventListener("click", () => {
      const urlParams = new URLSearchParams(window.location.search);
      const cardId = urlParams.get("id");
      console.log("cardId:", cardId);
      window.location.href = `edit-opportunity.html?id=${cardId}`;
    });

    document.getElementById("deleteBtn").addEventListener("click", () => {
      confirmAndDeleteOpportunity(card.id);
    });
  } else {
    const applyButton = document.getElementById("applyButton");
    applyButton.addEventListener("click", (e) => {
      fetch(`${url}/api/applications/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          volunteerId: user.userID,
          farmerId: card.userID,
          opportunityID: card.opportunity,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            alert("נרשמת בהצלחה.");
          } else {
            alert("לא הצלחנו לרשום אותך, נסה שוב");
          }
        })
        .catch((error) => console.error("Error:", error));
    });
  }
}

function confirmAndDeleteOpportunity(opportunityId) {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this opportunity?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, keep it",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteOpportunity(opportunityId);
    }
  });
}

function deleteOpportunity(opportunityId) {
  fetch(`${url}/api/opportunities/${opportunityId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        console.log(data.message);
        Swal.fire(
          "Deleted!",
          "The opportunity has been deleted.",
          "success"
        ).then(() => {
          window.location.href = "./list.html";
        });
      } else {
        console.error(data.error);
        Swal.fire("Error", data.error, "error");
      }
    })
    .catch((error) => {
      console.error("Error deleting opportunity:", error);
      Swal.fire(
        "Error",
        "Failed to delete opportunity. Please try again.",
        "error"
      );
    });
}

function setActiveLink(linkId) {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });
  document.getElementById(linkId).classList.add("active");
}

function displayContent(content) {
  document.getElementById("containerObj").innerHTML = content;
}

function setUpNavLinks(card) {
  const command = `
    <img src="images/verify.png" alt="verify"/><span> Verified By Volunteer Membership</span><br>
    <img src="images/response.png" alt="response"/><span> Very High Response Rate</span><br><br>
    <h5>About our project</h5>
    <p>${card.description}...<span class="read"> Read more</span></p><br>
    <h5>Ratings And Reviews</h5>
    <img src="images/stars.png" alt="stars"/><span>&nbsp;${card.reviews} reviews</span>
    <div class="reviews">All The Reviews</div><br>
    <h6>Joseph Stanly</h6>
    <div>Jan 2024</div>
    <img src="images/blackStars.png" alt="blackStars"/>
    <p>${card.feedback}</p>
    `;

  document.getElementById("overviewLink").addEventListener("click", (e) => {
    e.preventDefault();
    setActiveLink("overviewLink");
    displayContent(command);
  });

  document.getElementById("informationLink").addEventListener("click", (e) => {
    e.preventDefault();
    setActiveLink("informationLink");
    displayContent(
      card.informationContent || "This is the information content."
    );
  });

  document.getElementById("locationLink").addEventListener("click", (e) => {
    e.preventDefault();
    setActiveLink("locationLink");
    displayContent(card.locationContent || "This is the location content.");
  });

  setActiveLink("overviewLink");
  displayContent(command);
}
