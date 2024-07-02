document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const cardId = urlParams.get('id');

    fetch("data/opportunities.json")
        .then(response => response.json())
        .then(data => {
            const card = data.cards.find(card => card.id == cardId);
            if (card) {
                displayCardContent(card);
                setUpNavLinks(card);
            } else {
                console.error("Card not found");
            }
        })
        .catch(error => console.error("Error fetching data:", error));
});

function displayCardContent(card) {
    const objectContainer = document.getElementById("objectContainer");
    objectContainer.innerHTML = `
        <div class="card-content mx-auto"> <!-- Center and add margin to the top -->
            <img src="${card.image}" class="card-img-top" alt="${card.title}">
            <div class="card-body">
                <h5 class="card-title">${card.title}</h5>
                <p class="card-text">${card.region}, ${card.city}</p>
                <p class="card-text">Rating: ${card.rating}</p>
                <p class="card-text">Date: ${card.date}</p>
            </div>
        </div>
    `;
}

function setActiveLink(activeLinkId) {
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
        link.style.fontWeight = 'normal';
        link.style.color = '';
    });
    const activeLink = document.getElementById(activeLinkId);
    activeLink.classList.add('active');
    activeLink.style.fontWeight = 'bold';
    activeLink.style.color = 'green';
}

function displayContent(content) {
    document.getElementById('content').innerHTML = content;
}

function setUpNavLinks(card) {
    function displayContent(contentId) {
        let content = card[contentId] || `This is the ${contentId} content.`;
        
        if (contentId === 'overviewContent') {
            document.getElementById('content').innerHTML = `
                <img src="images/verify.png" alt="verify"/><span> Verified By Volunteer Membership</span><br>
                <img src="images/response.png" alt="response"/><span> Very High Response Rate</span><br><br>
                <h5>About our project</h5>
                <p>This season, we start clearing out old pots and  recycling the growing medium, lay out new planting bags and install drip irrigation.<br>
                The instruction of the home front commmand change from time to time...<span class="read"> Read more</span></p><br>
                <h5>Ratings And Reviews</h5>
                <img src="images/stars.png" alt="stars"/><span>&nbsp;212 reviews</span>
                <div class="reviews">All The Reviews</div><br>
                <h6>Joseph Stanly</h6>
                <div>Jan 2024</div>
                <img src="images/blackStars.png" alt="blackStars"/>
                <p>My friends and I came to volunteer in order to experience Israeli agriculture and on the way to enjoy a stay in a variety of different places in the country, David the farmer was great and hosted us in a wonderful way, we learned a lot from him, thank you !</p>
                <a class="btn btn-primary" href="/form.html" role="button">Apply</a>
                `;
        } else {
            document.getElementById('content').innerHTML = `
                <h2>${contentId.charAt(0).toUpperCase() + contentId.slice(1)}</h2>
                <p>${content}</p>
            `;
        }
    }

    document.getElementById('overviewLink').addEventListener('click', (e) => {
        e.preventDefault();
        setActiveLink('overviewLink');
        displayContent(document.getElementById('overviewLink').getAttribute('data-content'));
    });

    document.getElementById('informationLink').addEventListener('click', (e) => {
        e.preventDefault();
        setActiveLink('informationLink');
        displayContent(document.getElementById('informationLink').getAttribute('data-content'));
    });

    document.getElementById('locationLink').addEventListener('click', (e) => {
        e.preventDefault();
        setActiveLink('locationLink');
        displayContent(document.getElementById('locationLink').getAttribute('data-content'));
    });

    setActiveLink('overviewLink');
    displayContent(document.getElementById('overviewLink').getAttribute('data-content'));
}

const card = {
    overviewContent: "This is the overview content.",
    informationContent: "This is the information content.",
    locationContent: "This is the location content."
};

setUpNavLinks(card);
function setActiveLink(linkId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById(linkId).classList.add('active');
}
