document.getElementById('add-opportunity-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    const formData = {
        title: document.getElementById('title').value,
        region: document.getElementById('region').value,
        city: document.getElementById('city').value,
        rate: document.getElementById('rate').value,
        img: document.getElementById('img').value,
        date: document.getElementById('date').value,
        reviews: document.getElementById('reviews').value,
    };

    try {
        // Send data to the server
        const response = await fetch('/api/opportunities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            // Handle successful creation (e.g., redirect to the opportunities list)
            alert('Opportunity created successfully!');
            window.location.href = 'my-opportunities.html';
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Error creating opportunity:', error);
        alert('Failed to create opportunity. Please try again.');
    }
});
