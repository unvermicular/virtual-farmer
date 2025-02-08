// game.js

// -------------------------------
// Global Game State
// -------------------------------
let game = {
    balance: 0,
    xp: 0,
    plants: 0,
    currentHoeIndex: 0,
    selectedHoeIndex: 0,
    fertilizers: {
      mud: 0,
      soil: 0,
      compost: 0,
      manure: 0,
      organic: 0,
      bio: 0,
      vermicompost: 0,
      liquid: 0,
      chemical: 0,
      superphosphate: 0
    },
    upgrades: {
      sharperTools: 0,
      expertFarmer: 0,
      businessman: 0,
      experienced: 0,
      duplicator: 0,
      irrigationSystem: 0,
      automatedSprinkler: 0,
      fertilizerEfficiency: 0,
      marketSpecialist: 0,
      advancedAnalytics: 0,
      seedMultiplier: 0
    },
    inventory: {},
    selectedFertilizer: ""
  };
  
  // -------------------------------
  // Definitions
  // -------------------------------
  const hoes = [
    { name: "Wooden Hoe", multiplier: 1.0, cost: 0 },
    { name: "Stone Hoe", multiplier: 1.1, cost: 500 },
    { name: "Lapis Hoe", multiplier: 1.2, cost: 1000 },
    { name: "Gold Hoe", multiplier: 1.3, cost: 1500 },
    { name: "Iron Hoe", multiplier: 1.4, cost: 2000 },
    { name: "Diamond Hoe", multiplier: 1.5, cost: 2500 },
    { name: "Netherite Hoe", multiplier: 1.7, cost: 3000 },
    { name: "Special Hoe", multiplier: 2.0, cost: 5000 },
    { name: "Emerald Hoe", multiplier: 2.2, cost: 7000 },
    { name: "Obsidian Hoe", multiplier: 2.5, cost: 10000 },
    { name: "Mythic Hoe", multiplier: 3.0, cost: 15000 },
    { name: "Platinum Hoe", multiplier: 3.2, cost: 20000 },
    { name: "Titanium Hoe", multiplier: 3.5, cost: 25000 }
  ];
  
  const upgradeDefs = {
    sharperTools: { max: 20, cost: 250 },
    expertFarmer: { max: 10, cost: 250 },
    businessman: { max: 20, cost: 500 },
    experienced: { max: 5, cost: 2500 },
    duplicator: { max: 3, cost: 2500 },
    irrigationSystem: { max: 5, cost: 1000 },
    automatedSprinkler: { max: 10, cost: 2000 },
    fertilizerEfficiency: { max: 5, cost: 1500 },
    marketSpecialist: { max: 10, cost: 750 },
    advancedAnalytics: { max: 5, cost: 3000 },
    seedMultiplier: { max: 5, cost: 2000 }
  };
  
  // Untuk pagination di halaman Upgrade
  const upgradeOrder = [
    "sharperTools", "expertFarmer", "businessman", "experienced", "duplicator",
    "irrigationSystem", "automatedSprinkler", "fertilizerEfficiency", "marketSpecialist",
    "advancedAnalytics", "seedMultiplier"
  ];
  
  const fertilizerDefs = {
    mud: { bonus: 1, cost: 50 },
    soil: { bonus: 2, cost: 100 },
    compost: { bonus: 3, cost: 200 },
    manure: { bonus: 5, cost: 300 },
    organic: { bonus: 8, cost: 500 },
    bio: { bonus: 10, cost: 800 },
    vermicompost: { bonus: 12, cost: 1000 },
    liquid: { bonus: 15, cost: 1200 },
    chemical: { bonus: 20, cost: 1500 },
    superphosphate: { bonus: 25, cost: 1800 }
  };
  
  const plantTypes = [
    { id: "tomato", name: "Tomato", sellPrice: 8, minHoe: 0, rarity: "normal" },
    { id: "potato", name: "Potato", sellPrice: 7, minHoe: 0, rarity: "normal" },
    { id: "lettuce", name: "Lettuce", sellPrice: 6, minHoe: 0, rarity: "normal" },
    { id: "cucumber", name: "Cucumber", sellPrice: 9, minHoe: 0, rarity: "normal" },
    { id: "carrot", name: "Carrot", sellPrice: 10, minHoe: 0, rarity: "normal" },
    { id: "bellPepper", name: "Bell Pepper", sellPrice: 11, minHoe: 1, rarity: "rare" },
    { id: "eggplant", name: "Eggplant", sellPrice: 12, minHoe: 2, rarity: "rare" },
    { id: "spinach", name: "Spinach", sellPrice: 7, minHoe: 0, rarity: "normal" },
    { id: "broccoli", name: "Broccoli", sellPrice: 13, minHoe: 2, rarity: "rare" },
    { id: "strawberry", name: "Strawberry", sellPrice: 15, minHoe: 3, rarity: "epic" },
    { id: "blueberry", name: "Blueberry", sellPrice: 18, minHoe: 4, rarity: "epic" },
    { id: "avocado", name: "Avocado", sellPrice: 20, minHoe: 4, rarity: "epic" },
    { id: "saffron", name: "Saffron", sellPrice: 50, minHoe: 6, rarity: "legendary" },
    { id: "truffle", name: "Truffle", sellPrice: 80, minHoe: 6, rarity: "legendary" },
    { id: "goldenWheat", name: "Golden Wheat", sellPrice: 12, minHoe: 1, rarity: "normal" },
    { id: "rubyBerry", name: "Ruby Berry", sellPrice: 17, minHoe: 2, rarity: "rare" },
    { id: "emeraldLeaf", name: "Emerald Leaf", sellPrice: 15, minHoe: 2, rarity: "rare" },
    { id: "crimsonCarrot", name: "Crimson Carrot", sellPrice: 10, minHoe: 0, rarity: "normal" },
    { id: "silverCorn", name: "Silver Corn", sellPrice: 19, minHoe: 3, rarity: "epic" },
    { id: "mysticHerb", name: "Mystic Herb", sellPrice: 25, minHoe: 4, rarity: "mythical" }
  ];
  
  // -------------------------------
  // Upgrade Effects Mapping
  // -------------------------------
  const upgradeEffects = {
    sharperTools: "Increases base yield by +1 per level",
    expertFarmer: "Improves plant quality, boosting sell price",
    businessman: "Enhances plant sell price",
    experienced: "Boosts XP gain",
    duplicator: "Chance to double yield",
    irrigationSystem: "Multiplies overall yield",
    automatedSprinkler: "Adds extra yield per farm",
    fertilizerEfficiency: "Boosts fertilizer bonus by 10% per level",
    marketSpecialist: "Further increases sell price",
    advancedAnalytics: "Optimizes farming decisions",
    seedMultiplier: "Increases seed production"
  };
  
  // -------------------------------
  // Helper Functions
  // -------------------------------
  function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function getUpgradeEffectiveness() {
    for (let key in upgradeDefs) {
      if (game.upgrades[key] < upgradeDefs[key].max) {
        return 0.5;
      }
    }
    return 1;
  }
  function getFertilizerConsumption(rarity) {
    if (rarity === "normal") return 1;
    else if (rarity === "rare" || rarity === "uncommon") return 2;
    else if (rarity === "epic") return 3;
    else if (rarity === "legendary") return 4;
    else if (rarity === "mythical") return 5;
    return 1;
  }
  
  // -------------------------------
  // UI Update Functions
  // -------------------------------
  function updateFertilizerDropdown() {
    const fertilizerSelect = document.getElementById('fertilizer-select');
    if (!fertilizerSelect) return;
    fertilizerSelect.innerHTML = "";
    const noneOption = document.createElement('option');
    noneOption.value = "";
    noneOption.textContent = "None";
    fertilizerSelect.appendChild(noneOption);
    let fertKeys = Object.keys(fertilizerDefs).sort((a, b) => fertilizerDefs[a].cost - fertilizerDefs[b].cost);
    fertKeys.forEach(fert => {
      const option = document.createElement('option');
      option.value = fert;
      let fertName = fert.charAt(0).toUpperCase() + fert.slice(1);
      let qty = game.fertilizers[fert];
      if (isNaN(qty)) { qty = 0; game.fertilizers[fert] = 0; }
      option.textContent = `${fertName} (+${fertilizerDefs[fert].bonus} yield)`;
      if (qty <= 0) {
        option.disabled = true;
        option.textContent += " [Locked]";
      }
      fertilizerSelect.appendChild(option);
    });
    if (game.selectedFertilizer && game.fertilizers[game.selectedFertilizer] > 0) {
      fertilizerSelect.value = game.selectedFertilizer;
    } else {
      fertilizerSelect.value = "";
      game.selectedFertilizer = "";
    }
  }
  function updateHoeDropdown() {
    const hoeSelect = document.getElementById('hoe-select');
    if (!hoeSelect) return;
    hoeSelect.innerHTML = "";
    for (let i = 0; i <= game.currentHoeIndex; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = hoes[i].name;
      hoeSelect.appendChild(option);
    }
    hoeSelect.value = game.selectedHoeIndex;
  }
  function updateInventoryUI() {
    const inventoryList = document.getElementById('inventory-list');
    if (!inventoryList) return;
    inventoryList.innerHTML = "";
    plantTypes.forEach(plant => {
      let qty = game.inventory[plant.id] || 0;
      let multiplier = 1 + getUpgradeEffectiveness() * (
        (0.1 * game.upgrades.expertFarmer) +
        (0.05 * game.upgrades.businessman) +
        (0.05 * game.upgrades.marketSpecialist)
      );
      let effectivePrice = (plant.sellPrice * multiplier).toFixed(2);
      if (qty > 0) {
        const div = document.createElement('div');
        div.className = 'inventory-item';
        div.innerHTML = `<span>${plant.name}</span>
                         <span>Quantity: ${qty}</span>
                         <span>Sell Price: $${effectivePrice} each</span>`;
        inventoryList.appendChild(div);
      }
    });
    if (inventoryList.innerHTML.trim() === "") {
      inventoryList.innerHTML = "<p style='text-align:center;'>Your inventory is empty.</p>";
    }
  }
  function updateMainUI() {
    if (document.getElementById('balance')) {
      document.getElementById('balance').innerText = game.balance.toFixed(2);
    }
    if (document.getElementById('xp')) {
      document.getElementById('xp').innerText = game.xp;
    }
    if (document.getElementById('currentHoe')) {
      document.getElementById('currentHoe').innerText = hoes[game.currentHoeIndex].name;
    }
    let totalPlants = 0;
    for (let id in game.inventory) { totalPlants += game.inventory[id]; }
    game.plants = totalPlants;
    if (document.getElementById('plants')) {
      document.getElementById('plants').innerText = totalPlants;
    }
    updateFertilizerDropdown();
    updateHoeDropdown();
    // Update stok fertilizer di area lain (jika ada)
    for (let fert in game.fertilizers) {
      let span = document.getElementById('fertilizer-' + fert);
      if (span) { span.innerText = game.fertilizers[fert] || 0; }
    }
    updateInventoryUI();
  }
  
  // -------------------------------
  // Save & Load Functions
  // -------------------------------
  function saveGame() {
    localStorage.setItem('virtualFarmerSave', JSON.stringify(game));
  }
  function loadGame() {
    const savedGame = localStorage.getItem('virtualFarmerSave');
    if (savedGame) { game = JSON.parse(savedGame); }
  }
  
  // -------------------------------
  // Game Action Functions
  // -------------------------------
  function farm() {
    let selectedHoe = parseInt(game.selectedHoeIndex);
    let xpMin = Math.min(10 + (selectedHoe * 5), 45);
    let xpMax = xpMin + 5;
    let xpGain = getRandomIntInclusive(xpMin, xpMax) + (getUpgradeEffectiveness() * game.upgrades.experienced);
    let yieldMin = 10 + (selectedHoe * 5);
    let yieldMax = Math.min(20 + (selectedHoe * 5), 59);
    let plantYield = getRandomIntInclusive(yieldMin, yieldMax);
    let selectedFert = game.selectedFertilizer;
    let fertilizerUsed = false;
    if (selectedFert && game.fertilizers[selectedFert] > 0) {
      let fertBonus = fertilizerDefs[selectedFert].bonus;
      fertBonus = Math.floor(fertBonus * (1 + 0.1 * getUpgradeEffectiveness() * game.upgrades.fertilizerEfficiency));
      plantYield += fertBonus;
      fertilizerUsed = true;
    }
    plantYield += getUpgradeEffectiveness() * (game.upgrades.sharperTools + game.upgrades.automatedSprinkler);
    plantYield = Math.floor(plantYield * (1 + (0.2 * getUpgradeEffectiveness() * game.upgrades.irrigationSystem)));
    if (Math.random() < (0.05 * getUpgradeEffectiveness() * game.upgrades.duplicator)) {
      plantYield *= 2;
    }
    const availablePlants = plantTypes.filter(plant => plant.minHoe <= selectedHoe);
    let selectedPlant = availablePlants[getRandomIntInclusive(0, availablePlants.length - 1)];
    if (fertilizerUsed && selectedFert) {
      let consumption = getFertilizerConsumption(selectedPlant.rarity);
      game.fertilizers[selectedFert] -= consumption;
      if (game.fertilizers[selectedFert] < 0) game.fertilizers[selectedFert] = 0;
    }
    if (!game.inventory[selectedPlant.id]) { game.inventory[selectedPlant.id] = 0; }
    game.inventory[selectedPlant.id] += plantYield;
    game.xp += xpGain;
    updateMainUI();
    saveGame();
  }
  function sellPlants() {
    let totalSale = 0;
    for (let plantId in game.inventory) {
      let qty = game.inventory[plantId];
      let plant = plantTypes.find(p => p.id === plantId);
      if (plant) {
        let multiplier = 1 + getUpgradeEffectiveness() * (
          (0.1 * game.upgrades.expertFarmer) +
          (0.05 * game.upgrades.businessman) +
          (0.05 * game.upgrades.marketSpecialist)
        );
        let effectivePrice = plant.sellPrice * multiplier;
        totalSale += qty * effectivePrice;
      }
    }
    if (totalSale === 0) return;
    game.balance += totalSale;
    game.inventory = {};
    updateMainUI();
    saveGame();
  }
  function buyUpgrade(upgradeKey) {
    const def = upgradeDefs[upgradeKey];
    if (game.upgrades[upgradeKey] < def.max && game.balance >= def.cost) {
      game.balance -= def.cost;
      game.upgrades[upgradeKey]++;
      updateMainUI();
      saveGame();
    } else {
      alert("Upgrade cannot be purchased!");
    }
  }
  function buyAllUpgrade(upgradeKey) {
    const def = upgradeDefs[upgradeKey];
    while (game.upgrades[upgradeKey] < def.max && game.balance >= def.cost) {
      game.balance -= def.cost;
      game.upgrades[upgradeKey]++;
    }
    updateMainUI();
    saveGame();
  }
  function buyHoe(hoeIndex) {
    const hoe = hoes[hoeIndex];
    if (game.balance >= hoe.cost) {
      game.balance -= hoe.cost;
      if (hoeIndex > game.currentHoeIndex) {
        game.currentHoeIndex = hoeIndex;
      }
      // Setelah pembelian, secara default kita set sebagai equipped
      game.selectedHoeIndex = hoeIndex;
      updateMainUI();
      saveGame();
    } else {
      alert("Insufficient balance to buy this hoe!");
    }
  }
  function equipHoe(hoeIndex) {
    if (hoeIndex <= game.currentHoeIndex) {
      game.selectedHoeIndex = hoeIndex;
      updateMainUI();
      saveGame();
    }
  }
  function buyFertilizer(fertKey) {
    const fertDef = fertilizerDefs[fertKey];
    if (typeof game.fertilizers[fertKey] === "undefined") {
      game.fertilizers[fertKey] = 0;
    }
    if (game.balance >= fertDef.cost) {
      game.balance -= fertDef.cost;
      game.fertilizers[fertKey]++;
      updateMainUI();
      saveGame();
    } else {
      alert("Insufficient balance to buy this fertilizer!");
    }
  }
  function buyAllFertilizer(fertKey) {
    const fertDef = fertilizerDefs[fertKey];
    if (typeof game.fertilizers[fertKey] === "undefined") {
      game.fertilizers[fertKey] = 0;
    }
    while (game.balance >= fertDef.cost) {
      game.balance -= fertDef.cost;
      game.fertilizers[fertKey]++;
    }
    updateMainUI();
    saveGame();
  }
  
  // -------------------------------
  // Pagination & Rendering for Upgrade & Shop Pages
  // -------------------------------
  
  // Upgrade Page Rendering (Pagination: 5 upgrades per page)
  let currentUpgradePage = 1;
  const upgradesPerPage = 5;
  function renderUpgradesPage() {
    const container = document.getElementById('upgrade-list-container');
    if (!container) return;
    container.innerHTML = "";
    const startIndex = (currentUpgradePage - 1) * upgradesPerPage;
    const endIndex = startIndex + upgradesPerPage;
    const upgradesToShow = upgradeOrder.slice(startIndex, endIndex);
    upgradesToShow.forEach(key => {
      const def = upgradeDefs[key];
      const currentLevel = game.upgrades[key] || 0;
      const div = document.createElement('div');
      div.className = 'item-container';
      div.setAttribute('data-upgrade', key);
      div.innerHTML = `
        <span>${formatUpgradeName(key)} (${upgradeEffects[key]})</span>
        <span id="${key}-level">${currentLevel}/${def.max}</span>
        <button class="buy-upgrade" data-upgrade="${key}">Buy ($${def.cost})</button>
        <button class="buy-all-upgrade" data-upgrade="${key}">Buy All</button>
      `;
      container.appendChild(div);
    });
    document.getElementById('upgrade-page-number').innerText = `Page ${currentUpgradePage}`;
  }
  function formatUpgradeName(key) {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
  }
  
  // Shop Page Rendering (Pagination: 5 items per page)
  // Untuk sub-tab "hoe" dan "fertilizer"
  let currentShopTab = "hoe";
  let currentShopPage = 1;
  const shopItemsPerPage = 5;
  function renderShopPage() {
    const container = document.getElementById('shop-list-container');
    if (!container) return;
    container.innerHTML = "";
    let items = [];
    if (currentShopTab === "hoe") {
      items = hoes;
    } else {
      items = Object.keys(fertilizerDefs)
                .sort((a, b) => fertilizerDefs[a].cost - fertilizerDefs[b].cost)
                .map(key => ({ key, ...fertilizerDefs[key] }));
    }
    const startIndex = (currentShopPage - 1) * shopItemsPerPage;
    const endIndex = startIndex + shopItemsPerPage;
    const itemsToShow = items.slice(startIndex, endIndex);
    itemsToShow.forEach(item => {
      const div = document.createElement('div');
      div.className = 'item-container';
      if (currentShopTab === "hoe") {
        const index = hoes.indexOf(item);
        let buttonHtml = "";
        if (index <= game.currentHoeIndex) {
          if (index === game.selectedHoeIndex) {
            buttonHtml = `<button class="equip-hoe" data-hoe-index="${index}" disabled>Equipped</button>`;
          } else {
            buttonHtml = `<button class="equip-hoe" data-hoe-index="${index}">Equip</button>`;
          }
        } else {
          buttonHtml = `<button class="buy-hoe" data-hoe-index="${index}">Buy ($${item.cost})</button>`;
        }
        div.innerHTML = `
          <span>${item.name}</span>
          <span>Multiplier: ${item.multiplier.toFixed(1)}</span>
          <span>Cost: $${item.cost}</span>
          ${buttonHtml}
        `;
      } else {
        const key = item.key;
        div.innerHTML = `
          <span>${capitalize(key)} (+${item.bonus} yield) - Cost: $${item.cost}</span>
          <button class="buy-fertilizer" data-fertilizer="${key}">Buy</button>
          <button class="buy-all-fertilizer" data-fertilizer="${key}">Buy All</button>
          <span>Owned: <span id="fertilizer-${key}">${game.fertilizers[key] || 0}</span></span>
        `;
      }
      container.appendChild(div);
    });
    document.getElementById('shop-page-number').innerText = `Page ${currentShopPage}`;
  }
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  // -------------------------------
  // Inisiasi Event Listeners Setelah DOM Siap
  // -------------------------------
  function initEventListeners() {
    // Dropdown untuk fertilizer
    const fertSelect = document.getElementById('fertilizer-select');
    if (fertSelect) {
      fertSelect.addEventListener('change', function() {
        game.selectedFertilizer = this.value;
        saveGame();
      });
    }
    // Dropdown untuk hoe
    const hoeSelect = document.getElementById('hoe-select');
    if (hoeSelect) {
      hoeSelect.addEventListener('change', function() {
        game.selectedHoeIndex = parseInt(this.value);
        saveGame();
      });
    }
  }
  
  // -------------------------------
  // Event Listeners (untuk tombol-tombol dinamis)
  // -------------------------------
  document.addEventListener('click', function(e) {
    // Upgrade actions
    if (e.target.classList.contains('buy-upgrade')) {
      const key = e.target.getAttribute('data-upgrade');
      buyUpgrade(key);
      renderUpgradesPage();
    }
    if (e.target.classList.contains('buy-all-upgrade')) {
      const key = e.target.getAttribute('data-upgrade');
      buyAllUpgrade(key);
      renderUpgradesPage();
    }
    // Shop Hoe actions
    if (e.target.classList.contains('buy-hoe')) {
      const index = parseInt(e.target.getAttribute('data-hoe-index'));
      buyHoe(index);
      renderShopPage();
      updateHoeDropdown();
    }
    if (e.target.classList.contains('equip-hoe')) {
        const index = parseInt(e.target.getAttribute('data-hoe-index'));
        equipHoe(index);
        updateMainUI();
        renderShopPage(); // Tambahkan pemanggilan renderShopPage() agar tombol di shop diperbarui
    }
    // Shop Fertilizer actions
    if (e.target.classList.contains('buy-fertilizer')) {
      const fertKey = e.target.getAttribute('data-fertilizer');
      buyFertilizer(fertKey);
      renderShopPage();
      updateFertilizerDropdown();
    }
    if (e.target.classList.contains('buy-all-fertilizer')) {
      const fertKey = e.target.getAttribute('data-fertilizer');
      buyAllFertilizer(fertKey);
      renderShopPage();
      updateFertilizerDropdown();
    }
  });
  
  // Tab & Pagination Event Listeners (untuk halaman Upgrade & Shop)
  if (document.getElementById('upgrade-tab-button')) {
    document.getElementById('upgrade-tab-button').addEventListener('click', function() {
      document.getElementById('upgrade-page').style.display = "block";
      document.getElementById('shop-page').style.display = "none";
      renderUpgradesPage();
    });
  }
  if (document.getElementById('shop-tab-button')) {
    document.getElementById('shop-tab-button').addEventListener('click', function() {
      document.getElementById('shop-page').style.display = "block";
      document.getElementById('upgrade-page').style.display = "none";
      currentShopTab = "hoe";
      currentShopPage = 1;
      renderShopPage();
    });
  }
  if (document.getElementById('shop-hoe-tab')) {
    document.getElementById('shop-hoe-tab').addEventListener('click', function() {
      currentShopTab = "hoe";
      currentShopPage = 1;
      renderShopPage();
    });
  }
  if (document.getElementById('shop-fertilizer-tab')) {
    document.getElementById('shop-fertilizer-tab').addEventListener('click', function() {
      currentShopTab = "fertilizer";
      currentShopPage = 1;
      renderShopPage();
    });
  }
  if (document.getElementById('upgrade-prev-button')) {
    document.getElementById('upgrade-prev-button').addEventListener('click', function() {
      if (currentUpgradePage > 1) {
        currentUpgradePage--;
        renderUpgradesPage();
      }
    });
  }
  if (document.getElementById('upgrade-next-button')) {
    document.getElementById('upgrade-next-button').addEventListener('click', function() {
      const maxPage = Math.ceil(upgradeOrder.length / upgradesPerPage);
      if (currentUpgradePage < maxPage) {
        currentUpgradePage++;
        renderUpgradesPage();
      }
    });
  }
  if (document.getElementById('shop-prev-button')) {
    document.getElementById('shop-prev-button').addEventListener('click', function() {
      if (currentShopPage > 1) {
        currentShopPage--;
        renderShopPage();
      }
    });
  }
  if (document.getElementById('shop-next-button')) {
    document.getElementById('shop-next-button').addEventListener('click', function() {
      let items = [];
      if (currentShopTab === "hoe") {
        items = hoes;
      } else {
        items = Object.keys(fertilizerDefs).sort((a, b) => fertilizerDefs[a].cost - fertilizerDefs[b].cost);
      }
      const maxPage = Math.ceil(items.length / shopItemsPerPage);
      if (currentShopPage < maxPage) {
        currentShopPage++;
        renderShopPage();
      }
    });
  }
  
  // -------------------------------
  // Initialize Game
  // -------------------------------
  function initializeGame() {
    loadGame();
    if (game.selectedHoeIndex === undefined) {
      game.selectedHoeIndex = game.currentHoeIndex;
    }
    updateMainUI();
    initEventListeners(); // Pasang event listener untuk dropdown
    setInterval(saveGame, 5000);
    window.onbeforeunload = function() { saveGame(); };
  }
  
  // -------------------------------
  // Expose functions for main page actions (Farming & Selling)
  // -------------------------------
  function startFarm() {
    farm();
  }
  function startSell() {
    sellPlants();
  }
  
  // Initialize saat DOM siap
  document.addEventListener("DOMContentLoaded", initializeGame);
  