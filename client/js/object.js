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
    objectContainer.innerHTML = `
        <div class="card-content mx-auto">
            <img src="${card.img}" class="card-img-top" alt="${card.title}">
            <div class="card-body">
                <h5 class="card-title">${card.title}</h5>
                <p class="card-text">${card.region}, ${card.city}</p>
                <p class="card-text">Rating: ${card.rate}</p>
                <p class="card-text">Date: ${card.date}</p>
            </div>
        </div>
    `;
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
    <p>This season, we start clearing out old pots and  recycling the growing medium, lay out new planting bags and install drip irrigation.<br>
    The instruction of the home front command change from time to time...<span class="read"> Read more</span></p><br>
    <h5>Ratings And Reviews</h5>
    <img src="images/stars.png" alt="stars"/><span>&nbsp;${card.reviews} reviews</span>
    <div class="reviews">All The Reviews</div><br>
    <h6>Joseph Stanly</h6>
    <div>Jan 2024</div>
    <img src="images/blackStars.png" alt="blackStars"/>
    <p>${card.feedback}</p>
    <a class="btn btn-primary" href="./form.html" role="button">Apply</a>
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
