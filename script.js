const spinner = document.getElementById('spinner');
const table = document.getElementById('data-table');
const tableBody = document.getElementById('table-body');
const pagination = document.getElementById('pagination');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageNumber = document.getElementById('page-number');

let data = [];
let sortedData = [];
let currentpage = 1;
const rowsPerPage = 10;
let sortDirection = {};

// ================= FETCH =================
async function fetchData() {
    spinner.style.display = 'flex';

    try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch('https://randomuser.me/api/?results=50');
        const json = await response.json();

        data = json.results;
        sortedData = [...data];

        displayTable(sortedData);
        updateButtons();

    } catch (error) {
        console.error('Error fetching Data:', error);
    } finally {
        spinner.style.display = 'none';
        table.style.display = 'table';
        pagination.style.display = 'block';
    }
}

// ================= DISPLAY =================
function displayTable(dataToDisplay) {
    tableBody.innerHTML = '';

    const start = (currentpage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = dataToDisplay.slice(start, end);

    paginatedItems.forEach(user => {
        const row = `
        <tr>
            <td>${user.name.first} ${user.name.last}</td>
            <td>${user.email}</td>
            <td>${user.login.username}</td>
            <td>${user.location.country}</td>
        </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

// ================= SORT =================
function sortTable(columnIndex) {
    clearSortIcons();

    if (!sortDirection[columnIndex]) {
        sortDirection[columnIndex] = 'asc';
    }

    sortedData = [...sortedData].sort((a, b) => {
        let valA, valB;

        switch (columnIndex) {
            case 0:
                valA = `${a.name.first} ${a.name.last}`;
                valB = `${b.name.first} ${b.name.last}`;
                break;
            case 1:
                valA = a.email;
                valB = b.email;
                break;
            case 2:
                valA = a.login.username;
                valB = b.login.username;
                break;
            case 3:
                valA = a.location.country;
                valB = b.location.country;
                break;
        }

        if (sortDirection[columnIndex] === 'desc') {
            return valB.localeCompare(valA);
        } else {
            return valA.localeCompare(valB);
        }
    });

    sortDirection[columnIndex] =
        sortDirection[columnIndex] === 'asc' ? 'desc' : 'asc';

    updateSortIcon(columnIndex, sortDirection[columnIndex]);

    currentpage = 1;
    displayTable(sortedData);
    updateButtons();
}

// ================= ICONS =================
function clearSortIcons() {
    for (let i = 0; i < 4; i++) {
        const icon = document.getElementById(`icon-${i}`);
        if (icon) icon.className = 'fas fa-sort';
    }
}

function updateSortIcon(columnIndex, direction) {
    const icon = document.getElementById(`icon-${columnIndex}`);
    if (!icon) return;

    icon.className =
        direction === 'asc'
            ? 'fas fa-sort-up'
            : 'fas fa-sort-down';
}

// ================= PAGINATION =================
function nextPage() {
    if (currentpage * rowsPerPage < sortedData.length) {
        currentpage++;
        displayTable(sortedData);
        updateButtons();
    }
}

function prevPage() {
    if (currentpage > 1) {
        currentpage--;
        displayTable(sortedData);
        updateButtons();
    }
}

// ================= BUTTONS =================
function updateButtons() {
    pageNumber.innerText = currentpage;
    prevBtn.disabled = currentpage === 1;
    nextBtn.disabled = currentpage * rowsPerPage >= sortedData.length;
}

// ================= DARK MODE =================
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const isDarkMode = localStorage.getItem('dark-mode') === 'true';

if (isDarkMode) {
    body.classList.add('dark-mode');
    themeToggle.innerText = 'Light Mode';
}

themeToggle.addEventListener('click', () => {
    body.style.transition = '0.3s';

    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        themeToggle.innerText = 'Dark Mode';
        localStorage.setItem('dark-mode', 'false');
    } else {
        body.classList.add('dark-mode');
        themeToggle.innerText = 'Light Mode';
        localStorage.setItem('dark-mode', 'true');
    }
});

// ================= START =================
fetchData();