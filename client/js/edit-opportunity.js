const url = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const cardId = urlParams.get('id');
    console.log('cardId:', cardId); // Should print the opportunity ID or `null`

    if (cardId) {
        fetch(`${url}/api/opportunities/${cardId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text(); // Get the raw response text first
            })
            .then(text => {
                try {
                    const card = JSON.parse(text);
                    console.log('Fetched Card:', card);
                    populateForm(card);
                } catch (e) {
                    console.error('Failed to parse JSON:', e);
                    console.error('Response Text:', text);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    } else {
        console.error('No card ID found in URL');
    }

    function populateForm(card) {
        document.getElementById('title').value = card.title;
        document.getElementById('city').value = card.city;
        document.getElementById('date').value = card.date;
        document.getElementById('description').value = card.description;

        // Set the selected value for the region dropdown
        const regionSelect = document.getElementById('region');
        regionSelect.value = card.region;

        // Make sure the option with the value exists
        if (!Array.from(regionSelect.options).some(option => option.value === card.region)) {
            console.error('Invalid region value:', card.region);
        }
    }

    document.getElementById('edit-opportunity-form').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission
    
        const user = JSON.parse(localStorage.getItem('user'));
        let userID = user?.userID || '';
        let userRole = user?.role || '';
    
        // Assuming cardId is defined and available
        const opportunityID = cardId;
    
        // Get form data
        const formData = {
            userID: userID,
            role: userRole,
            title: document.getElementById('title').value,
            region: document.getElementById('region').value,
            city: document.getElementById('city').value,
            date: document.getElementById('date').value,
            description: document.getElementById('description').value,
            rate: 0, // Default to 0
            reviews: 0 // Default to 0
        };
    
        // Show confirmation alert
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to save changes?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Send data to the server
                    const response = await fetch(`${url}/api/opportunities/${opportunityID}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });
    
                    if (response.ok) {
                        Swal.fire(
                            'Saved!',
                            'Your changes have been saved.',
                            'success'
                        ).then(() => {
                            window.location.href = `object.html?id=${opportunityID}`;
                        });
                    } else {
                        const errorText = await response.text(); // Get raw text first
                        try {
                            const errorData = JSON.parse(errorText);
                            Swal.fire('Error', errorData.error, 'error');
                        } catch (e) {
                            console.error('Error parsing server response:', e);
                            Swal.fire('Error', 'Failed to parse error response.', 'error');
                        }
                    }
                } catch (error) {
                    console.error('Error saving changes:', error);
                    Swal.fire('Error', 'Failed to save changes.', 'error');
                }
            }
        });
    });
});
