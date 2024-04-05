import createGameItem from "./createGameItem.js";

document.addEventListener("DOMContentLoaded", function () {
  let allGiveaways = [];

  function createDropdownMenu() {
    const dropdownButton = document.getElementById("dropdown-button");
    dropdownButton.innerText = "Sort by";
    const dropdownMenu = document.getElementById("dropdown-menu");
    if (!dropdownButton || !dropdownMenu) {
      console.error("Dropdown button or menu element not found");
      return;
    }

    // Function to toggle the dropdown menu
    function toggleDropdown() {
      dropdownMenu.classList.toggle("show");
    }

    dropdownButton.addEventListener("click", toggleDropdown);

    dropdownButton.addEventListener("mouseenter", function () {
      dropdownMenu.classList.add("show");
    });

    dropdownMenu.addEventListener("mouseleave", function () {
      dropdownMenu.classList.remove("show");
    });

    const sortingOptions = {
      Platforms: [
        "PC",
        "Steam",
        "Epic Games",
        "GOG",
        "Nintendo Switch",
        "Playstation 5",
        "Xbox Series X|S",
        "Playstation 4",
        "Xbox One",
        "Android",
        "iOS",
        "Itch.io",
        "Xbox 360",
      ],
      SortBy: ["Date", "Value", "Popularity"],
    };

    const dropdownGroup = document.createElement("ul");
    dropdownGroup.classList.add("dropdown-group");
    dropdownMenu.appendChild(dropdownGroup);

    for (const optionGroup in sortingOptions) {
      const optionGroupTitle = document.createElement("li");
      optionGroupTitle.textContent = optionGroup;
      dropdownGroup.appendChild(optionGroupTitle);

      const dropdownItems = document.createElement("ul");
      dropdownItems.classList.add("dropdown-items");
      dropdownGroup.appendChild(dropdownItems);

      sortingOptions[optionGroup].forEach((option) => {
        const dropdownItem = document.createElement("li");
        dropdownItem.textContent = option;
        dropdownItem.classList.add("dropdown-item");
        dropdownItem.addEventListener("click", () => {
          handleSorting(optionGroup, option);
          dropdownMenu.classList.remove("show"); // Hide dropdown after selection
        });
        dropdownItems.appendChild(dropdownItem);
      });
    }
  }

  function handleSorting(optionGroup, option) {
    switch (optionGroup) {
      case "Platforms":
        sortGamesByPlatform(option);
        break;
      case "SortBy":
        const sortedGiveaways = sortGamesByCriteria(option, allGiveaways);
        displayGiveawaysData(sortedGiveaways);
        break;
      default:
        console.error("Invalid sorting option");
    }
  }

  function sortGamesByPlatform(platform) {
    try {
      const filteredGames = allGiveaways.filter((giveaway) =>
        giveaway.platforms.toLowerCase().includes(platform.toLowerCase())
      );
      displayGiveawaysData(filteredGames);
    } catch (error) {
      console.error("Error sorting games by platform:", error);
    }
  }

  function sortGamesByCriteria(criteria, giveaways) {
    switch (criteria) {
      case "Date":
        return giveaways.sort(
          (a, b) => new Date(b.published_date) - new Date(a.published_date)
        );
      case "Value":
        return giveaways.sort((a, b) => {
          const worthA = parseFloat(a.worth.replace("$", ""));
          const worthB = parseFloat(b.worth.replace("$", ""));
          return worthB - worthA;
        });
      case "Popularity":
        return giveaways.sort((a, b) => b.users - a.users);
      default:
        console.error("Invalid sorting criteria");
        return giveaways;
    }
  }

  function updatePagination(totalGiveaways, currentPage) {
    const pagination = document.querySelector(".pagination");
    const gamesPerPage = 12;
    if (!pagination) {
      console.error("Pagination element not found");
      return;
    }

    const totalPages = Math.ceil(totalGiveaways / gamesPerPage);

    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.textContent = i;
      button.classList.add("pagination__button");
      if (i === currentPage) {
        button.classList.add("pagination__button--active");
      }
      button.addEventListener("click", () => {
        currentPage = i;
        displayGiveawaysData(allGiveaways, currentPage);
        const activeBtn = document.querySelector(".pagination__button--active");
        if (activeBtn) {
          activeBtn.classList.remove("pagination__button--active");
        }
        button.classList.add("pagination__button--active");
      });
      pagination.appendChild(button);
    }
  }

  async function initializeGiveaways() {
    const gameList = document.querySelector(".game-list");
    if (!gameList) {
      return;
    }

    const loadingElement = document.createElement("p");
    loadingElement.textContent = "Loading giveaways...";
    gameList.appendChild(loadingElement);

    try {
      allGiveaways = await fetchGiveawaysData();

      if (allGiveaways && allGiveaways.length > 0) {
        createDropdownMenu();
        const sortedGiveaways = sortGamesByCriteria("Date", allGiveaways);
        displayGiveawaysData(sortedGiveaways);
        updatePagination(sortedGiveaways.length, 1);
      } else {
        const emptyStateElement = document.createElement("p");
        emptyStateElement.textContent = "No giveaways found.";
        gameList.appendChild(emptyStateElement);
      }
    } catch (error) {
      console.error("Error initializing giveaways:", error);
      const errorElement = document.createElement("p");
      errorElement.textContent =
        "Error loading giveaways. Please try again later.";
      gameList.appendChild(errorElement);
    } finally {
      if (gameList.contains(loadingElement)) {
        gameList.removeChild(loadingElement);
      }
    }
  }

  async function fetchGiveawaysData() {
    try {
      const response = await fetch(
        "https://gfg-proxy-kohl.vercel.app/api/liveGiveaways"
      );
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Error fetching giveaways data: " + error.message);
    }
  }

  function displayGiveawaysData(giveaways, page = 1) {
    const gameList = document.querySelector(".game-list");
    if (!gameList) {
      console.error("Game list element not found");
      return;
    }

    // Clear existing game items
    gameList.innerHTML = "";

    const gamesPerPage = 12;
    const startIndex = (page - 1) * gamesPerPage;
    const endIndex = page * gamesPerPage;
    const gamesToShow = giveaways.slice(startIndex, endIndex);

    gamesToShow.forEach((giveaway) => {
      const gameItem = createGameItem(giveaway);
      if (gameItem) {
        gameList.appendChild(gameItem);
      } else {
        console.error("Failed to create game item");
      }
    });
  }

  function createFooter() {
    const currentYear = new Date().getFullYear();
    const footer = document.createElement("footer");
    footer.classList.add("copy");
    const paragraph = document.createElement("p");
    paragraph.textContent = `© ${currentYear} - Made with love by Marcy. All rights reserved.`;
    footer.appendChild(paragraph);
    document.body.appendChild(footer);
  }

  createFooter();
  initializeGiveaways();
});
