const apiUrl = 'http://localhost:3000/api/authors'; // Updated API URL

document.getElementById('authorForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('authorId').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const birthdate = document.getElementById('birthdate').value;
    const nationality = document.getElementById('nationality').value;

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${apiUrl}/${id}` : apiUrl;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ first_name: firstName, last_name: lastName, birthdate, nationality }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        await response.json();
        loadAuthors();
        resetForm();
    } catch (error) {
        console.error('Error:', error);
    }
});

const loadAuthors = async () => {
    const response = await fetch(apiUrl);
    const authors = await response.json();
    const authorsTableBody = document.querySelector('#authorsTable tbody');
    authorsTableBody.innerHTML = '';

    authors.forEach(author => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${author.author_id}</td>
            <td>${author.first_name}</td>
            <td>${author.last_name}</td>
            <td>${author.birthdate}</td>
            <td>${author.nationality}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editAuthor(${author.author_id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteAuthor(${author.author_id})">Delete</button>
            </td>
        `;
        authorsTableBody.appendChild(row);
    });
};

const editAuthor = async (id) => {
    const response = await fetch(`${apiUrl}/${id}`);
    const author = await response.json();

    document.getElementById('authorId').value = author.author_id;
    document.getElementById('firstName').value = author.first_name;
    document.getElementById('lastName').value = author.last_name;
    document.getElementById('birthdate').value = author.birthdate;
    document.getElementById('nationality').value = author.nationality;
};

const deleteAuthor = async (id) => {
    if (confirm('Are you sure you want to delete this author?')) {
        try {
            await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
            });
            loadAuthors();
        } catch (error) {
            console.error('Error:', error);
        }
    }
};

const resetForm = () => {
    document.getElementById('authorId').value = '';
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('birthdate').value = '';
    document.getElementById('nationality').value = '';
};

loadAuthors(); // Load authors when the page loads
