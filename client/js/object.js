document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const cardId = urlParams.get('id');

    fetch(`http://localhost:3000/api/opportunities/${cardId}`)
        .then(response => response.json())
        .then(card => {
            if (card) {
                displayCardContent(card);
                setUpNavLinks(card);
                console.log(card);
            } else {
                console.error("Card not found");
            }
        })
        .catch(error => console.error("Error fetching data:", error));
});

function displayCardContent(card) {
    const objectContainer = document.getElementById("objectContainer");
    const user = JSON.parse(localStorage.getItem('user'));

    let buttons = '';
    if (user && user.role === 'farmer') {
        buttons = `
            <div class="button-container text-center mt-4">
                <a class="btn btn-primary mx-2" id="editBtn">Edit</a>
                <a class="btn btn-success mx-2" id="saveBtn">Save</a>
                <a class="btn btn-danger mx-2" id="deleteBtn">Delete</a>
            </div>
        `;
    } else {
        buttons = `
            <div class="button-container text-center mt-4">
                <a class="btn btn-primary mx-2" href="./form.html" role="button">Apply</a>
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

    if (user && user.role === 'farmer') {
        document.getElementById('editBtn').addEventListener('click', () => {
            // Implement the edit functionality
            console.log("Edit button clicked");
        });

        document.getElementById('saveBtn').addEventListener('click', () => {
            // Implement the save functionality
            console.log("Save button clicked");
            // Redirect to list.html
            window.location.href = './list.html';
        });

        document.getElementById('deleteBtn').addEventListener('click', () => {
            // Implement the delete functionality
            deleteOpportunity(card.opportunity);
        });
    }
}

function deleteOpportunity(opportunityId) {
    fetch(`http://localhost:3000/api/opportunities/${opportunityId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log(data.message);
                // Optionally, redirect to another page or update the UI
                window.location.href = './list.html';
            } else {
                console.error(data.error);
            }
        })
        .catch(error => console.error('Error deleting opportunity:', error));
}

function setActiveLink(linkId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById(linkId).classList.add('active');
}

function displayContent(content) {
    document.getElementById('containerObj').innerHTML = content;
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

    document.getElementById('overviewLink').addEventListener('click', (e) => {
        e.preventDefault();
        setActiveLink('overviewLink');
        displayContent(command);
    });

    document.getElementById('informationLink').addEventListener('click', (e) => {
        e.preventDefault();
        setActiveLink('informationLink');
        displayContent(card.informationContent || 'This is the information content.');
    });

    document.getElementById('locationLink').addEventListener('click', (e) => {
        e.preventDefault();
        setActiveLink('locationLink');
        displayContent(card.locationContent || 'This is the location content.');
    });

    setActiveLink('overviewLink');
    displayContent(command);
}
