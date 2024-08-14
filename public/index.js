async function fetchData(page = 1, limit = 10) {
    try {
        const response = await fetch(`/users?page=${page}&limit=${limit}`);
        // console.log(response)
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        const users = data.users;
        const tableBody = document.getElementById("userTable").querySelector("tbody");

        tableBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');

            const profilePicture = document.createElement('td');
            const picture = document.createElement('img');
            picture.src = user.picture.thumbnail;
            picture.alt = 'Profile Picture';
            picture.className = 'profile-picture';
            profilePicture.appendChild(picture);

            const name = document.createElement('td');
            name.textContent = `${user.name.title} ${user.name.first} ${user.name.last}`;

            const email = document.createElement('td');
            email.textContent = user.email;

            const location = document.createElement('td');
            location.textContent = `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country}, ${user.location.postcode}`;

            const phone = document.createElement('td');
            phone.textContent = user.phone;

            const cell = document.createElement('td');
            cell.textContent = user.cell;

            const dateofBirth = document.createElement('td');
            dateofBirth.textContent = new Date(user.dob.date).toLocaleDateString();

            const nationality = document.createElement('td');
            nationality.textContent = user.nat;

            row.appendChild(profilePicture);
            row.appendChild(name);
            row.appendChild(email);
            row.appendChild(location);
            row.appendChild(phone);
            row.appendChild(cell);
            row.appendChild(dateofBirth);
            row.appendChild(nationality);
            
            tableBody.appendChild(row);
        });

        renderPaginationControls(data.total, limit, page);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load data. Please try again later.');
    }
}
//update my page with new values
function renderPaginationControls(total, limit, currentPage) {
    const paginationControls = document.getElementById("paginationControls");
    const pageInfo = document.getElementById('pageInfo');
    const totalPages = Math.ceil(total / limit);   //count total pages

    paginationControls.innerHTML = '';

    if (totalPages > 1) {
        if (currentPage > 1) {
            const prevButton = createPaginationButton('Previous', currentPage - 1);
            paginationControls.appendChild(prevButton);
        }

        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            const firstPageButton = createPaginationButton('1', 1);
            paginationControls.appendChild(firstPageButton);

            if (startPage > 2) {
                const dots = createPaginationButton('...', currentPage - 3, true);
                paginationControls.appendChild(dots);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = createPaginationButton(i, i, i === currentPage);
            paginationControls.appendChild(pageButton);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const dots = createPaginationButton('...', currentPage + 3, true);
                paginationControls.appendChild(dots);
            }

            const lastPageButton = createPaginationButton(totalPages, totalPages);
            paginationControls.appendChild(lastPageButton);
        }

        if (currentPage < totalPages) {
            const nextButton = createPaginationButton('Next', currentPage + 1);
            paginationControls.appendChild(nextButton);
        }
    }

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

function createPaginationButton(text, page, isDisabled = false) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = `pagination-button ${isDisabled ? 'disabled' : ''}`;
    button.disabled = isDisabled;
    if (!isDisabled) {
        button.addEventListener('click', () => fetchData(page, document.getElementById('rowCount').value));
    }
    return button;
}

document.getElementById('fetchButton').addEventListener('click', () => {
    const rowCount = document.getElementById('rowCount').value;
    if (rowCount && rowCount > 0) {
        fetchData(1, rowCount);
    } else {
        alert("Please enter a valid number of rows.");
    }
});

document.getElementById('addUserButton').addEventListener('click', () => {
    window.location.href = 'form.html';
});

window.onload = () => fetchData();
