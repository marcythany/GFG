// Function to fetch giveaways data
async function fetchGiveawaysData() {
    try {
        const response = await fetch('https://gfg-proxy.vercel.app/api/giveaways');
        if (!response.ok) {
            throw new Error('Failed to fetch giveaways data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching giveaways data:', error);
        return null;
    }
}

// Function to collapse the description when the mouse leaves the giveaway item
function collapseDescription(event) {
    const description = event.currentTarget.querySelector('.description');
    if (description) {
        description.style.maxHeight = '3.6em'; // Collapse the description
    }
}

// Function to expand the description of the hovered giveaway item
function expandDescription(event) {
    const description = event.currentTarget.querySelector('.description');
    if (description) {
        description.style.maxHeight = description.scrollHeight + 'px'; // Expand the description
    }
}

// Add event listeners to handle mouse enter and leave events for each giveaway item
function addEventListenersToItems() {
    document.querySelectorAll('.container .game-item').forEach(item => {
        item.addEventListener('mouseenter', expandDescription);
        item.addEventListener('mouseleave', collapseDescription);
    });
}

// Function to create a single giveaway item
function createGiveawayItem(giveaway) {
    const listItem = document.createElement('div');
    listItem.classList.add('game-item');
    listItem.innerHTML = `
        <img src="${giveaway.thumbnail}" alt="${giveaway.title}">
        <h3>${giveaway.title}</h3>
        <p><strong>Worth:</strong> ${giveaway.worth}</p>
        <p><strong>Type:</strong> ${giveaway.type}</p>
        <p><strong>Platforms:</strong> ${giveaway.platforms}</p>
        <div class="description">
        <p class="description-label">Description:</p>
        <p class="description-text">${giveaway.description}</p>
        </div>
        <a href="${giveaway.open_giveaway_url}" target="_blank" class="giveaway-link">Go to giveaway</a>
    `;
    return listItem;
}

// Function to display giveaways data for a specific page
function displayGiveawaysData(giveaways, page) {
    const container = document.querySelector('.container');
    const gamesPerPage = 9;
    if (!container) {
        console.error('Container element not found');
        return;
    }
    
    // Clear previous data
    container.innerHTML = '';
    
    // Display new data for the current page
    const startIndex = (page - 1) * gamesPerPage;
    const endIndex = startIndex + gamesPerPage;
    const gamesOnPage = giveaways.slice(startIndex, endIndex);
    gamesOnPage.forEach(giveaway => {
        if (giveaway.status === 'Active') {
            const item = createGiveawayItem(giveaway);
            container.appendChild(item);
        }
    });

    addEventListenersToItems(); // Add event listeners after displaying data
}

// Function to update pagination
function updatePagination(totalGiveaways, currentPage) {
    const pagination = document.querySelector('.pagination');
    const gamesPerPage = 9;
    if (!pagination) {
        console.error('Pagination element not found');
        return;
    }

    // Calculate total pages
    const totalPages = Math.ceil(totalGiveaways / gamesPerPage);

    // Clear previous pagination
    pagination.innerHTML = '';

    // Create pagination buttons
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('page-btn');
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            displayGiveawaysData(allGiveaways, i);
            const activeBtn = document.querySelector('.page-btn.active');
            if (activeBtn) {
                activeBtn.classList.remove('active');
            }
            button.classList.add('active');
        });
        pagination.appendChild(button);
    }
}

// Global variable to store all giveaways
let allGiveaways = [];

// Call the fetchGiveawaysData function and display the data when it's fetched
fetchGiveawaysData()
    .then(data => {
        if (data) {
            allGiveaways = data;
            displayGiveawaysData(allGiveaways, 1); // Display first page by default
            updatePagination(allGiveaways.length, 1); // Update pagination
        }
    })
    .catch(error => {
        console.error('Error fetching and displaying giveaways data:', error);
    });
