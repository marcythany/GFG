export default function createGameItem(game) {
  const timeLeftData = calculateTimeLeft(game.end_date);
  const timeLeft = timeLeftData ? timeLeftData.timeLeft : "";
  const colorClass = timeLeftData ? timeLeftData.colorClass : "";

  const gameItem = document.createElement("section");
  gameItem.classList.add("game-item");
  gameItem.innerHTML = `
    <div class="game-thumbnail">
      <a href="${game.open_giveaway_url}" target="_blank">
        <img src="${game.thumbnail}" alt="${game.title}">
      </a>
      <aside class="badges">
        ${
          timeLeft // Check if timeLeft is truthy (not null, NaN, or 0)
            ? `<time class="btn badge--timeleft ${colorClass}">
                  ${timeLeft}
                </time>`
            : "" // Render nothing if timeLeft is falsy
        }
        <span class="brands"></span>
      </aside>
    </div>
    <article class="game-details">
      <h2 class="game-title">${game.title}</h2>
      <div class="price">
        <div class="btn btn--free">Free</div>
        <span class="price-muted">${game.worth}</span>
        <div class="btn btn--type">${game.type}</div>
      </div>
      <p class="description">${game.description}</p>
      <div class="btn btn--claim">
        <a href="${game.open_giveaway_url}" class="claim-button">Claim Loot</a>
      </div>
      <footer class="game-claimed">
        <p class="users-claimed">
          <i class="fas fa-users"></i> ${game.users} Claimed this loot!
        </p>
      </footer>
    </article>
  `;

  // Call function to create platform icons
  const platformIconsContainer = gameItem.querySelector(".brands");
  if (platformIconsContainer) {
    createPlatformIcons(game.platforms.split(","), platformIconsContainer);
  } else {
    console.error("Platform icons container not found");
    return null;
  }

  return gameItem;
}

function calculateTimeLeft(endDate) {
  const endDateTime = new Date(endDate).getTime();
  const now = new Date().getTime();
  const timeLeft = endDateTime - now;

  if (isNaN(timeLeft) || timeLeft <= 0) {
    return null;
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  if (days >= 7) {
    return { timeLeft: `${days} days left`, colorClass: "" }; // Default color
  } else if (days >= 5) {
    return { timeLeft: `${days} days left`, colorClass: "warning-color" };
  } else if (days >= 1 || (days === 0 && hours >= 24)) {
    return {
      timeLeft: `${days} day${days > 1 ? "s" : ""} left`,
      colorClass: "danger-color",
    };
  } else if (hours >= 24) {
    return { timeLeft: `${hours}h`, colorClass: "danger-color" };
  } else {
    return { timeLeft: "", colorClass: "" };
  }
}

function createPlatformIcons(platforms, platformIconsContainer) {
  const iconMap = {
    PC: "fa-brands fa-windows",
    Steam: "fa-brands fa-steam",
    GOG: "fa-brands fa-gog",
    "Playstation 5": "fa-brands fa-playstation",
    "Xbox Series X|S": "fa-brands fa-xbox",
    "Playstation 4": "fa-brands fa-playstation",
    "Xbox One": "fa-brands fa-xbox",
    Android: "fa-brands fa-android",
    iOS: "fa-brands fa-apple",
    "Itch.io": "fa-brands fa-itch-io",
    "Xbox 360": "fa-brands fa-xbox",
  };

  const displayedIcons = new Set(); // Set to avoid duplicate icons

  // Create platform elements
  platforms.forEach((platform) => {
    const iconClassName = iconMap[platform.trim()];
    if (iconClassName && !displayedIcons.has(iconClassName)) {
      let platformElement;

      if (iconClassName.includes("fa-brands")) {
        platformElement = document.createElement("i");
        platformElement.classList.add("fab", ...iconClassName.split(" "));
      }

      platformIconsContainer.appendChild(platformElement);
      displayedIcons.add(iconClassName);
    }
  });
}
