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
    const description = event.currentTarget.querySelector('.giveaway__description'); // Adjusted class name
    if (description) {
        description.style.maxHeight = '3.6em'; // Collapse the description
    }
}

// Function to expand the description of the hovered giveaway item
function expandDescription(event) {
    const description = event.currentTarget.querySelector('.giveaway__description'); // Adjusted class name
    if (description) {
        description.style.maxHeight = description.scrollHeight + 'px'; // Expand the description
    }
}

// Add event listeners to handle mouse enter and leave events for each giveaway item
function addEventListenersToItems() {
    document.querySelectorAll('.container .giveaway__card').forEach(item => { // Adjusted class name
        item.addEventListener('mouseenter', expandDescription);
        item.addEventListener('mouseleave', collapseDescription);
    });
}

// Function to create a single giveaway item
function createGiveawayItem(giveaway) {
    // Create article element for the giveaway item
    const article = document.createElement('article');
    article.classList.add('giveaway'); // Add BEM block class

    // Create card element
    const card = document.createElement('div');
    card.classList.add('card', 'giveaway__card'); // Add BEM block and element classes

    // Create thumbnail container
    const thumbnailContainer = document.createElement('div');
    thumbnailContainer.classList.add('giveaway__thumbnail-container'); // Add BEM block and element classes

// Create badge for remaining time if data is provided
let timeLeftBadge = null;
if (giveaway.end_date) {
    const endDate = new Date(giveaway.end_date);
    const now = new Date();
    const timeRemaining = endDate - now;
    const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (daysRemaining > 0 || hoursRemaining > 0) {
        timeLeftBadge = document.createElement('span');
        timeLeftBadge.classList.add('badge', 'giveaway__badge', 'badge--pill', 'badge--primary', 'giveaway__badge--time-left'); // Add BEM block, element, and modifier classes
        if (daysRemaining > 0) {
            timeLeftBadge.textContent = `${daysRemaining} day${daysRemaining > 1 ? 's' : ''} left`;
        } else if (hoursRemaining > 0) {
            timeLeftBadge.textContent = `${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''} left`;
        }
    }
}

    // Create thumbnail link
    const thumbnailLink = document.createElement('a');
    thumbnailLink.href = giveaway.open_giveaway_url;

    // Create thumbnail image
    const thumbnailImage = document.createElement('img');
    thumbnailImage.classList.add('giveaway__thumbnail', 'card-img-top'); // Add BEM block and element classes
    thumbnailImage.src = giveaway.thumbnail || 'fallback-image.jpg';
    thumbnailImage.alt = giveaway.title;
    thumbnailImage.width = '100%';
    thumbnailImage.height = '150';

    // Append thumbnail image to thumbnail link
    thumbnailLink.appendChild(thumbnailImage);
    thumbnailContainer.appendChild(thumbnailLink);

    // Append time left badge if exists
    if (timeLeftBadge) {
        thumbnailContainer.appendChild(timeLeftBadge);
    }

    // Create container for platform icons (assuming dynamically generated)
    const platformIconsContainer = document.createElement('span');
    platformIconsContainer.classList.add('giveaway__platform-icons'); // Add BEM block and element classes

    // Create header section
    const header = document.createElement('header');
    header.classList.add('giveaway__header'); // Add BEM block class

    // Create title
    const title = document.createElement('h2');
    title.classList.add('giveaway__title', 'card-title'); // Add BEM block and element classes
    const titleLink = document.createElement('a');
    titleLink.classList.add('giveaway__title-link'); // Add BEM block and element classes
    titleLink.href = giveaway.open_giveaway_url;
    titleLink.textContent = giveaway.title;
    title.appendChild(titleLink);

    // Create badge for free
    const badgeFree = document.createElement('span');
    badgeFree.classList.add('badge', 'giveaway__badge', 'giveaway__badge--free'); // Add BEM block, element, and modifier classes
    badgeFree.textContent = 'FREE';

// Create original price element
const originalPrice = document.createElement('span');
originalPrice.classList.add('giveaway__original-price', 'text-muted'); // Add BEM block and element classes

// Check if original price is available and valid
if (giveaway.worth && typeof giveaway.worth === 'string' && giveaway.worth.trim() !== '') {
    // Extract numerical value from original price string
    const originalPriceValue = parseFloat(giveaway.worth.replace('$', '').trim());

    // Check if the parsed value is a valid number
    if (!isNaN(originalPriceValue)) {
        // Set the inner HTML content
        originalPrice.innerHTML = `<s>$${originalPriceValue.toFixed(2)}</s>`;
    }
}

    // Create badge for type
    const typeBadge = document.createElement('span');
    typeBadge.classList.add('badge', 'giveaway__badge', 'giveaway__badge--type'); // Add BEM block, element, and modifier classes
    switch (giveaway.type.toLowerCase()) {
        case 'game':
            typeBadge.textContent = 'Game';
            break;
        case 'dlc':
            typeBadge.textContent = 'DLC';
            break;
        case 'beta access':
            typeBadge.textContent = 'Beta';
            break;
        case 'other':
            typeBadge.textContent = 'Other';
            break;
        default:
            typeBadge.textContent = 'Unknown';
    }
    

    // Create description
    const description = document.createElement('p');
    description.classList.add('giveaway__description', 'card-text'); // Add BEM block and element classes
    description.textContent = giveaway.description;

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('giveaway__button-container'); // Add BEM block and element classes

    // Create button group
    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('btn-group', 'giveaway__button-group'); // Add BEM block and element classes

    // Append buttons to button group
    buttonContainer.appendChild(buttonGroup);

    // Create claim game button
    const claimGameButton = document.createElement('a');
    claimGameButton.href = giveaway.open_giveaway_url;
    claimGameButton.classList.add('btn', 'btn-outline-blue', 'giveaway__button', 'giveaway__button--claim-loot'); // Add BEM block, element, and modifier classes
    claimGameButton.textContent = 'Claim Loot';
    buttonContainer.appendChild(claimGameButton);

    // Create users claimed section
    const usersClaimed = document.createElement('div');
    usersClaimed.classList.add('giveaway__users-claimed', 'text-muted'); // Add BEM block and element classes
    const claimedText = giveaway.users ? `${giveaway.users} Claimed this loot!` : 'Be the first to claim!';
    usersClaimed.innerHTML = `<i class="fa-users"></i> <strong>${claimedText}</strong>`;

    // Append elements to header
    header.appendChild(title);
    header.appendChild(badgeFree);
    header.appendChild(originalPrice);
    header.appendChild(typeBadge);
    header.appendChild(description);
    header.appendChild(buttonContainer);
    header.appendChild(usersClaimed);

    // Append elements to card
    card.appendChild(thumbnailContainer);
    card.appendChild(platformIconsContainer);
    card.appendChild(header);

    // Append card to article
    article.appendChild(card);

    return article;
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
        button.classList.add('pagination__button'); // Adjusted class name
        if (i === currentPage) {
            button.classList.add('pagination__button--active'); // Adjusted class name
        }
        button.addEventListener('click', () => {
            displayGiveawaysData(allGiveaways, i);
            const activeBtn = document.querySelector('.pagination__button--active'); // Adjusted class name
            if (activeBtn) {
                activeBtn.classList.remove('pagination__button--active'); // Adjusted class name
            }
            button.classList.add('pagination__button--active'); // Adjusted class name
        });
        pagination.appendChild(button);
    }
}


// Global variable to store all giveaways
let allGiveaways = [];

// Call the fetchGiveawaysData function and display the data when it's fetched
async function initializeGiveaways() {
    try {
        const data = await fetchGiveawaysData();
        if (data) {
            allGiveaways = data;
            displayGiveawaysData(allGiveaways, 1); // Display first page by default
            updatePagination(allGiveaways.length, 1); // Update pagination
        }
    } catch (error) {
        console.error('Error fetching and displaying giveaways data:', error);
    }
}

initializeGiveaways();

// Update year in copyright every year
const currentYear = new Date().getFullYear();
const copyrightElement = document.querySelector('footer p');
const yearRegex = /\d+(?= \u00A9)/;
copyrightElement.textContent = copyrightElement.textContent.replace(yearRegex, currentYear);
setInterval(() => {
    const currentDate = new Date();
    const nextYear = currentDate.getFullYear() + (currentDate.getMonth() < 6 ? -1 : 0);
    copyrightElement.textContent = copyrightElement.textContent.replace(yearRegex, nextYear.toString());
}, 86400000); // update every day (24 hours)