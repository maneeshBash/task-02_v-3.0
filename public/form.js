document.getElementById('userForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const newUser = {
        name: {
            title: formData.get('title'),
            first: formData.get('firstName'),
            last: formData.get('lastName')
        },
        email: formData.get('email'),
        location: {
            street: {
                number: formData.get('streetNumber'),
                name: formData.get('streetName')
            },
            city: formData.get('city'),
            state: formData.get('state'),
            country: formData.get('country'),
            postcode: formData.get('postcode')
        },
        phone: formData.get('phone'),
        cell: formData.get('cell'),
        dob: {
            date: formData.get('dob')
        },
        nat: formData.get('nat'),
        picture: {
            thumbnail: formData.get('picture')
        }
    };

    try {
        await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        window.location.href = 'index.html'; // Redirect to index.html after submission
    } catch (error) {
        console.error('Error adding user:', error);
    }
});
