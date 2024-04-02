// Function to fetch giveaways data
async function fetchGiveawaysData(query = "") {
  try {
    const response = await fetch(
      `https://gfg-proxy.vercel.app/api/giveaways${query}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch giveaways data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching giveaways data:", error);
    return null;
  }
}

// Function to delay execution
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to collapse the description when the mouse leaves the giveaway item
function collapseDescription(event) {
  const description = event.currentTarget.querySelector(
    ".giveaway__description"
  ); // Adjusted class name
  if (description) {
    description.style.maxHeight = "3.6em"; // Collapse the description
  }
}

// Function to expand the description of the hovered giveaway item
function expandDescription(event) {
  const description = event.currentTarget.querySelector(
    ".giveaway__description"
  ); // Adjusted class name
  if (description) {
    description.style.maxHeight = description.scrollHeight + "px"; // Expand the description
    description.style.transition = "max-height 0.3s ease-in-out"; // Smooth transition
  }
}

// Function to collapse the title when the mouse leaves the giveaway item
function collapseTitle(event) {
  const title = event.currentTarget.querySelector(".card-title");
  if (title) {
    title.classList.remove("expanded"); // Remove expanded class
  }
}

// Function to expand the title of the hovered giveaway item
function expandTitle(event) {
  const title = event.currentTarget.querySelector(".card-title");
  if (title) {
    title.classList.add("expanded"); // Add expanded class
  }
}

// Function to adjust z-index of other cards on mouse enter to bring hovered card to the top
function adjustZIndex(event) {
  const allCards = document.querySelectorAll(".container .giveaway__card");
  const hoveredCard = event.currentTarget;

  // Bring hovered card to the top
  hoveredCard.style.zIndex = 1;

  // Remove transition from other cards
  allCards.forEach((card) => {
    if (card !== hoveredCard) {
      card.style.transition = "none";
    }
  });
}

// Function to reset transition and z-index of all cards
function resetCardTransitions() {
  const allCards = document.querySelectorAll(".container .giveaway__card");
  allCards.forEach((card) => {
    card.style.transition = "none";
    card.style.zIndex = 0;
  });
}

// Add event listeners to handle mouse enter and leave events for each giveaway item
function addEventListenersToItems() {
  document.querySelectorAll(".container .giveaway__card").forEach((item) => {
    // Adjusted class name
    item.addEventListener("mouseenter", (event) => {
      expandDescription(event);
      expandTitle(event);
      adjustZIndex(event); // Adjust z-index and position of cards
    });
    item.addEventListener("mouseleave", (event) => {
      collapseDescription(event);
      collapseTitle(event);
      resetCardTransitions(); // Reset transitions and z-index of cards
    });
  });
}

// Function to create a single giveaway item
function createGiveawayItem(giveaway, container) {
  // Create game-item wrapper
  const gameItem = document.createElement("div");
  gameItem.classList.add("game-item");

  // Create article with card class
  const cardArticle = document.createElement("article");
  cardArticle.classList.add("card", "giveaway__card");

  // Create thumbnail container
  const thumbnailContainer = document.createElement("div");
  thumbnailContainer.classList.add("giveaway__thumbnail-container");

  // Create span for position of badges and platform icons
  const badgePositionSpan = document.createElement("span");
  badgePositionSpan.classList.add("giveaway__badge--position");

  // Create time left badge
  let timeLeftBadge = null;
  if (giveaway.end_date) {
    timeLeftBadge = createTimeLeftBadge(giveaway.end_date);
    badgePositionSpan.appendChild(timeLeftBadge);
  }

  // Create platform icons container
  const platformIconsContainer = document.createElement("span");
  platformIconsContainer.classList.add("giveaway__platform-icons");

  // Add platform icons to the container
  if (giveaway.platforms && typeof giveaway.platforms === "string") {
    const platforms = giveaway.platforms
      .split(",")
      .map((platform) => platform.trim());
    createPlatformIcons(platforms, platformIconsContainer);
  } else {
    console.error(
      "Giveaway object or its platforms property is undefined or not a string."
    );
  }
  badgePositionSpan.appendChild(platformIconsContainer);

  // Append badge position span to thumbnail container
  thumbnailContainer.appendChild(badgePositionSpan);

  // Create thumbnail link
  const thumbnailLink = document.createElement("a");
  thumbnailLink.href = giveaway.open_giveaway_url;

  // Create thumbnail image
  const thumbnailImage = createThumbnailImage(
    giveaway.thumbnail,
    giveaway.title
  );
  thumbnailLink.appendChild(thumbnailImage);
  thumbnailContainer.appendChild(thumbnailLink);
  cardArticle.appendChild(thumbnailContainer);

  // Create section with title, badges, description, and button
  const section = createSection(giveaway);
  cardArticle.appendChild(section);

  // Append card article to game item
  gameItem.appendChild(cardArticle);

  // Append game item to container
  container.appendChild(gameItem);

  return gameItem;
}

// Function to create time left badge
function createTimeLeftBadge(endDate) {
  // Check if endDate is null, undefined, or invalid
  if (endDate == null || isNaN(new Date(endDate))) {
    const noEndDateBadge = document.createElement("span");
    noEndDateBadge.classList.add("giveaway__badge--no-end-date");
    noEndDateBadge.textContent = "No end date";
    return noEndDateBadge;
  }

  const endDateObj = new Date(endDate);
  const now = new Date();
  const timeRemaining = endDateObj - now;
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  let badgeText = "";
  let badgeClass = "";

  if (daysRemaining >= 0) {
    if (daysRemaining >= 31) {
      const monthsRemaining = Math.floor(daysRemaining / 31);
      badgeText = `${monthsRemaining} month${
        monthsRemaining > 1 ? "s" : ""
      } left`;
    } else if (daysRemaining > 0) {
      badgeText = `${daysRemaining} day${daysRemaining > 1 ? "s" : ""} left`;
    } else if (hoursRemaining > 0) {
      badgeText = `${hoursRemaining} hour${
        hoursRemaining !== 1 ? "s" : ""
      } left`;
    }

    badgeClass = daysRemaining < 3 ? "badge--danger" : "badge--primary";
  } else {
    // If daysRemaining is negative, set a default value for badgeClass
    badgeClass = "badge--danger";
  }

  const timeLeftBadge = document.createElement("span");
  timeLeftBadge.classList.add(
    "badge",
    "giveaway__badge",
    "badge--pill",
    "giveaway__badge--time-left",
    badgeClass
  );
  timeLeftBadge.textContent = badgeText;

  return timeLeftBadge;
}

// Function to create thumbnail image
function createThumbnailImage(thumbnail, title) {
  const thumbnailImage = document.createElement("img");
  thumbnailImage.classList.add("giveaway__thumbnail", "card-img-top");
  thumbnailImage.src = thumbnail || "fallback-image.jpg";
  thumbnailImage.alt = title;
  thumbnailImage.width = "100%";
  thumbnailImage.height = "150";
  return thumbnailImage;
}

// Function to create section with title, badges, description, and button
function createSection(giveaway) {
  const section = document.createElement("section");
  section.classList.add("giveaway__section");

  // Create title
  const title = document.createElement("h2");
  title.classList.add("giveaway__title", "card-title");
  const titleLink = document.createElement("a");
  titleLink.classList.add("giveaway__title-link");
  titleLink.href = giveaway.open_giveaway_url;
  titleLink.textContent = giveaway.title;
  title.appendChild(titleLink);
  section.appendChild(title);

  // Create badges
  const badges = document.createElement("div");
  badges.classList.add("badges");
  badges.appendChild(
    createBadge("FREE", "badge--free", "giveaway__original-price", "text-muted")
  );
  badges.appendChild(createOriginalPriceBadge(giveaway.worth));
  badges.appendChild(createTypeBadge(giveaway.type));
  section.appendChild(badges);

  // Create description
  const descriptionTextarea = document.createElement("div");
  descriptionTextarea.classList.add("giveaway__description");
  const descriptionParagraph = document.createElement("p");
  descriptionParagraph.classList.add("card-text");
  descriptionParagraph.textContent = giveaway.description;
  descriptionTextarea.appendChild(descriptionParagraph);
  section.appendChild(descriptionTextarea);

  // Create button container
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("giveaway__button-container");
  const claimGameButton = createClaimGameButton(giveaway.open_giveaway_url);
  buttonContainer.appendChild(claimGameButton);
  section.appendChild(buttonContainer);

  // Create users claimed section
  const usersClaimed = document.createElement("div");
  usersClaimed.classList.add("giveaway__users-claimed", "text-muted");
  usersClaimed.innerHTML = `<i class="fas fa-users"></i> <strong>${
    giveaway.users
      ? `${giveaway.users} Claimed this loot!`
      : "Be the first to claim!"
  }</strong>`;
  section.appendChild(usersClaimed);

  return section;
}

// Function to create badge element
function createBadge(text, ...classes) {
  const badge = document.createElement("span");
  badge.classList.add("badge", ...classes);
  badge.textContent = text;
  return badge;
}

// Function to create original price badge
function createOriginalPriceBadge(worth) {
  const originalPrice = document.createElement("span");
  originalPrice.classList.add("giveaway__original-price", "text-muted");
  if (worth && typeof worth === "string" && worth.trim() !== "") {
    const originalPriceValue = parseFloat(worth.replace("$", "").trim());
    if (!isNaN(originalPriceValue)) {
      originalPrice.innerHTML = `<s>$${originalPriceValue.toFixed(2)}</s>`;
    }
  }
  return originalPrice;
}

// Function to create type badge
function createTypeBadge(type) {
  const typeBadge = document.createElement("span");
  typeBadge.classList.add("badge", "giveaway__badge", "giveaway__badge--type");
  type = type ? type.toLowerCase() : "";
  switch (type) {
    case "game":
      typeBadge.textContent = "Game";
      break;
    case "early access":
      typeBadge.textContent = "Early Access";
      break;
    case "dlc":
      typeBadge.textContent = "DLC";
      break;
    case "other":
      typeBadge.textContent = "Other";
      break;
    default:
      typeBadge.textContent = type
        ? type.charAt(0).toUpperCase() + type.slice(1)
        : ""; // Capitalize first letter of unknown type
  }
  return typeBadge;
}

// Function to create claim game button
function createClaimGameButton(url) {
  const claimGameButton = document.createElement("a");
  claimGameButton.href = url;
  claimGameButton.classList.add(
    "btn",
    "btn-outline-blue",
    "giveaway__button",
    "giveaway__button--claim-loot"
  );
  claimGameButton.textContent = "Claim Loot";
  return claimGameButton;
}

// Function to create platform icons
function createPlatformIcons(platforms, platformIconsContainer) {
  const iconMap = {
    PC: "fa-brands fa-windows",
    Steam: "fa-brands fa-steam",
    GOG: "fa-brands fa-gog",
    "Epic Games Store": "fa-brands fa-epic-games",
    "Playstation 5": "fa-brands fa-playstation",
    "Xbox Series X|S": "fa-brands fa-xbox",
    "Playstation 4": "fa-brands fa-playstation",
    "Xbox One": "fa-brands fa-xbox",
    "Nintendo Switch": "custom-nintendo-switch-icon",
    Android: "fa-brands fa-android",
    iOS: "fa-brands fa-apple",
    "Itch.io": "fa-brands fa-itch-io",
    "Xbox 360": "fa-brands fa-xbox",
  };

  const displayedIcons = new Set(); // Set to avoid duplicate icons

  platforms.forEach((platform) => {
    const iconClassName = iconMap[platform];
    if (iconClassName && !displayedIcons.has(iconClassName)) {
      const platformIcon = document.createElement("i");
      platformIcon.classList.add("fab");
      if (platform === "Nintendo Switch") {
        platformIcon.classList.add("custom-nintendo-switch-icon");
        platformIcon.style.backgroundImage =
          'url("assets/images/icons/switch.png")';
      } else {
        platformIcon.classList.add(...iconClassName.split(" "));
      }
      platformIconsContainer.appendChild(platformIcon);
      displayedIcons.add(iconClassName);
    }
  });
}

// Function to display giveaways data for a specific page
function displayGiveawaysData(giveaways, page) {
  const container = document.querySelector(".container");
  const gamesPerPage = 12;
  if (!container) {
    console.error("Container element not found");
    return;
  }

  // Add event listener to the container to reset transitions and z-index when mouse leaves
  document
    .querySelector(".container")
    .addEventListener("mouseleave", (event) => {
      collapseDescription(event);
      collapseTitle(event);
      resetCardTransitions(); // Reset transitions and z-index of cards
    });

  // Clear previous data
  container.innerHTML = "";

  // Display new data for the current page
  const startIndex = (page - 1) * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;
  const gamesOnPage = giveaways.slice(startIndex, endIndex);
  gamesOnPage.forEach((giveaway) => {
    if (giveaway.status === "Active") {
      createGiveawayItem(giveaway, container); // Pass container to createGiveawayItem
    }
  });

  addEventListenersToItems(); // Add event listeners after displaying data

  resetDescriptions(); // Reset descriptions when the page changes
}

// Function to reset descriptions to collapsed state
function resetDescriptions() {
  document.querySelectorAll(".container .giveaway__card").forEach((item) => {
    collapseDescription({ currentTarget: item }); // Collapse descriptions
    collapseTitle({ currentTarget: item }); // Remove expanded class from titles
  });
}

// Function to update pagination
function updatePagination(totalGiveaways, currentPage) {
  const pagination = document.querySelector(".pagination");
  const gamesPerPage = 12;
  if (!pagination) {
    console.error("Pagination element not found");
    return;
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalGiveaways / gamesPerPage);

  // Clear previous pagination
  pagination.innerHTML = "";

  // Create pagination buttons
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.add("pagination__button"); // Adjusted class name
    if (i === currentPage) {
      button.classList.add("pagination__button--active"); // Adjusted class name
    }
    button.addEventListener("click", () => {
      displayGiveawaysData(allGiveaways, i);
      const activeBtn = document.querySelector(".pagination__button--active"); // Adjusted class name
      if (activeBtn) {
        activeBtn.classList.remove("pagination__button--active"); // Adjusted class name
      }
      button.classList.add("pagination__button--active"); // Adjusted class name
    });
    pagination.appendChild(button);
  }
}

// Global variable to store all giveaways
let allGiveaways = [];

// Function to initialize giveaways
async function initializeGiveaways() {
  try {
    const data = await fetchGiveawaysData();
    if (data) {
      allGiveaways = data;
      displayGiveawaysData(allGiveaways, 1); // Display first page
      updatePagination(allGiveaways.length, 1); // Update pagination
      resetDescriptions(); // Reset descriptions when the page loads
    }
  } catch (error) {
    console.error("Error initializing giveaways:", error);
  }
}

initializeGiveaways();

// Update year in copyright every year
const currentYear = new Date().getFullYear();
const copyrightElement = document.querySelector("footer p");
const yearRegex = /\d+(?= \u00A9)/;
copyrightElement.textContent = copyrightElement.textContent.replace(
  yearRegex,
  currentYear
);
setInterval(() => {
  const currentDate = new Date();
  const nextYear =
    currentDate.getFullYear() + (currentDate.getMonth() < 6 ? -1 : 0);
  copyrightElement.textContent = copyrightElement.textContent.replace(
    yearRegex,
    nextYear.toString()
  );
}, 86400000); // update every day (24 hours)
