import createGameItem from "./createGameItem.js";

export default async function getProxy() {
  try {
    const data = await fetchGameData();
    renderGameItems(data);
  } catch (error) {
    console.error("Error fetching and populating game data:", error);
  }
}

async function fetchGameData() {
  const response = await fetch(
    "https://gfg-proxy-kohl.vercel.app/api/liveGiveaways"
  );
  return response.json();
}

function renderGameItems(data) {
  const gameList = document.querySelector(".game-list");
  if (!gameList) {
    console.error("Game list element not found");
    return;
  }

  data.forEach((game) => {
    const gameItem = createGameItem(game);
    if (gameItem) {
      gameList.appendChild(gameItem);
    } else {
      console.error("Failed to create game item for:", game);
    }
  });
}
