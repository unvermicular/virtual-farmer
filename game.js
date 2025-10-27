// game.js

const STORAGE_KEY = 'virtualFarmerSave';
const AUTO_SAVE_INTERVAL = 5000;
let autoSaveTimer = null;
let hasBoundGlobalClickHandlers = false;
let hasBoundUnloadHandler = false;
let hasBoundNavHandlers = false;
let navToggleButton = null;
let siteNavElement = null;

function closeNavigationMenu() {
  if (!siteNavElement || !navToggleButton) return;
  siteNavElement.classList.remove('site-nav--open');
  navToggleButton.setAttribute('aria-expanded', 'false');
}

function isNavigationOpen() {
  return Boolean(siteNavElement && siteNavElement.classList.contains('site-nav--open'));
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});
const integerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

function clamp(value, min, max) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return min;
  return Math.min(Math.max(numericValue, min), max);
}

function sanitizeInteger(value, fallback = 0) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return fallback;
  return Math.floor(numericValue);
}

function createDefaultGameState() {
  return {
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
      superphosphate: 0,
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
      seedMultiplier: 0,
    },
    inventory: {},
    selectedFertilizer: '',
  };
}

let game = createDefaultGameState();

const hoes = [
  { name: 'Wooden Hoe', multiplier: 1.0, cost: 0 },
  { name: 'Stone Hoe', multiplier: 1.1, cost: 500 },
  { name: 'Lapis Hoe', multiplier: 1.2, cost: 1000 },
  { name: 'Gold Hoe', multiplier: 1.3, cost: 1500 },
  { name: 'Iron Hoe', multiplier: 1.4, cost: 2000 },
  { name: 'Diamond Hoe', multiplier: 1.5, cost: 2500 },
  { name: 'Netherite Hoe', multiplier: 1.7, cost: 3000 },
  { name: 'Special Hoe', multiplier: 2.0, cost: 5000 },
  { name: 'Emerald Hoe', multiplier: 2.2, cost: 7000 },
  { name: 'Obsidian Hoe', multiplier: 2.5, cost: 10000 },
  { name: 'Mythic Hoe', multiplier: 3.0, cost: 15000 },
  { name: 'Platinum Hoe', multiplier: 3.2, cost: 20000 },
  { name: 'Titanium Hoe', multiplier: 3.5, cost: 25000 },
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
  seedMultiplier: { max: 5, cost: 2000 },
};

const upgradeOrder = [
  'sharperTools',
  'expertFarmer',
  'businessman',
  'experienced',
  'duplicator',
  'irrigationSystem',
  'automatedSprinkler',
  'fertilizerEfficiency',
  'marketSpecialist',
  'advancedAnalytics',
  'seedMultiplier',
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
  superphosphate: { bonus: 25, cost: 1800 },
};

const plantTypes = [
  { id: 'tomato', name: 'Tomato', sellPrice: 8, minHoe: 0, rarity: 'normal' },
  { id: 'potato', name: 'Potato', sellPrice: 7, minHoe: 0, rarity: 'normal' },
  { id: 'lettuce', name: 'Lettuce', sellPrice: 6, minHoe: 0, rarity: 'normal' },
  { id: 'cucumber', name: 'Cucumber', sellPrice: 9, minHoe: 0, rarity: 'normal' },
  { id: 'carrot', name: 'Carrot', sellPrice: 10, minHoe: 0, rarity: 'normal' },
  { id: 'bellPepper', name: 'Bell Pepper', sellPrice: 11, minHoe: 1, rarity: 'rare' },
  { id: 'eggplant', name: 'Eggplant', sellPrice: 12, minHoe: 2, rarity: 'rare' },
  { id: 'spinach', name: 'Spinach', sellPrice: 7, minHoe: 0, rarity: 'normal' },
  { id: 'broccoli', name: 'Broccoli', sellPrice: 13, minHoe: 2, rarity: 'rare' },
  { id: 'strawberry', name: 'Strawberry', sellPrice: 15, minHoe: 3, rarity: 'epic' },
  { id: 'blueberry', name: 'Blueberry', sellPrice: 18, minHoe: 4, rarity: 'epic' },
  { id: 'avocado', name: 'Avocado', sellPrice: 20, minHoe: 4, rarity: 'epic' },
  { id: 'saffron', name: 'Saffron', sellPrice: 50, minHoe: 6, rarity: 'legendary' },
  { id: 'truffle', name: 'Truffle', sellPrice: 80, minHoe: 6, rarity: 'legendary' },
  { id: 'goldenWheat', name: 'Golden Wheat', sellPrice: 12, minHoe: 1, rarity: 'normal' },
  { id: 'rubyBerry', name: 'Ruby Berry', sellPrice: 17, minHoe: 2, rarity: 'rare' },
  { id: 'emeraldLeaf', name: 'Emerald Leaf', sellPrice: 15, minHoe: 2, rarity: 'rare' },
  { id: 'crimsonCarrot', name: 'Crimson Carrot', sellPrice: 10, minHoe: 0, rarity: 'normal' },
  { id: 'silverCorn', name: 'Silver Corn', sellPrice: 19, minHoe: 3, rarity: 'epic' },
  { id: 'mysticHerb', name: 'Mystic Herb', sellPrice: 25, minHoe: 4, rarity: 'mythical' },
];

function getSellPriceMultiplier() {
  let multiplier = 1;
  multiplier += (game.upgrades.expertFarmer || 0) * 0.08;
  multiplier += (game.upgrades.businessman || 0) * 0.04;
  multiplier += (game.upgrades.marketSpecialist || 0) * 0.05;
  multiplier += (game.upgrades.advancedAnalytics || 0) * 0.02;
  return Math.max(1, multiplier);
}

function getFertilizerBonus(fertKey) {
  const definition = fertilizerDefs[fertKey];
  if (!definition) return 0;
  const efficiencyBonus = 1 + (game.upgrades.fertilizerEfficiency || 0) * 0.12;
  return Math.floor(definition.bonus * efficiencyBonus);
}

function getToolYieldBonus() {
  return (game.upgrades.sharperTools || 0) * 2;
}

function getSprinklerYieldBonus() {
  return (game.upgrades.automatedSprinkler || 0) * 3;
}

function getIrrigationMultiplier() {
  return 1 + (game.upgrades.irrigationSystem || 0) * 0.15;
}

function getSeedYieldMultiplier() {
  return 1 + (game.upgrades.seedMultiplier || 0) * 0.08;
}

function getAnalyticsYieldMultiplier() {
  return 1 + (game.upgrades.advancedAnalytics || 0) * 0.03;
}

function getDuplicatorChance() {
  const chance = (game.upgrades.duplicator || 0) * 0.06;
  return clamp(chance, 0, 0.5);
}

function getXpBonus() {
  const experiencedBonus = (game.upgrades.experienced || 0) * 3;
  const analyticsBonus = (game.upgrades.advancedAnalytics || 0) * 1.5;
  return experiencedBonus + analyticsBonus;
}

const upgradeEffects = {
  sharperTools: 'Increases base yield by +1 per level',
  expertFarmer: 'Improves plant quality, boosting sell price',
  businessman: 'Enhances plant sell price',
  experienced: 'Boosts XP gain',
  duplicator: 'Chance to double yield',
  irrigationSystem: 'Multiplies overall yield',
  automatedSprinkler: 'Adds extra yield per farm',
  fertilizerEfficiency: 'Boosts fertilizer bonus by 10% per level',
  marketSpecialist: 'Further increases sell price',
  advancedAnalytics: 'Optimizes farming decisions',
  seedMultiplier: 'Increases seed production',
};

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getFertilizerConsumption(rarity) {
  if (rarity === 'normal') return 1;
  if (rarity === 'rare' || rarity === 'uncommon') return 2;
  if (rarity === 'epic') return 3;
  if (rarity === 'legendary') return 4;
  if (rarity === 'mythical') return 5;
  return 1;
}

function mergeGameState(savedGame) {
  const defaults = createDefaultGameState();
  if (!savedGame || typeof savedGame !== 'object') {
    return { ...defaults };
  }
  return {
    ...defaults,
    ...savedGame,
    fertilizers: {
      ...defaults.fertilizers,
      ...(savedGame.fertilizers || {}),
    },
    upgrades: {
      ...defaults.upgrades,
      ...(savedGame.upgrades || {}),
    },
    inventory: { ...(savedGame.inventory || {}) },
    selectedFertilizer: savedGame.selectedFertilizer || '',
  };
}

function saveGame() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
  } catch (error) {
    console.warn('Unable to save game progress.', error);
  }
}

function loadGame() {
  let savedGame = null;
  try {
    savedGame = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to access saved data. Resetting game state.', error);
  }
  if (!savedGame) {
    game = createDefaultGameState();
    return;
  }
  try {
    const parsed = JSON.parse(savedGame);
    game = mergeGameState(parsed);
  } catch (error) {
    console.warn('Failed to parse saved data. Resetting game state.', error);
    game = createDefaultGameState();
    saveGame();
  }
}

function ensureValidSelections() {
  const balanceValue = Number(game.balance);
  game.balance = Number.isFinite(balanceValue) ? Math.max(0, balanceValue) : 0;
  game.xp = Math.max(0, sanitizeInteger(game.xp, 0));
  game.plants = Math.max(0, sanitizeInteger(game.plants, 0));

  game.currentHoeIndex = clamp(sanitizeInteger(game.currentHoeIndex, 0), 0, hoes.length - 1);
  game.selectedHoeIndex = clamp(
    sanitizeInteger(game.selectedHoeIndex, game.currentHoeIndex),
    0,
    game.currentHoeIndex,
  );

  if (!game.fertilizers || typeof game.fertilizers !== 'object') {
    game.fertilizers = { ...createDefaultGameState().fertilizers };
  }

  Object.keys(game.fertilizers).forEach((key) => {
    const amount = Math.max(0, sanitizeInteger(game.fertilizers[key], 0));
    game.fertilizers[key] = amount;
  });

  if (!game.upgrades || typeof game.upgrades !== 'object') {
    game.upgrades = { ...createDefaultGameState().upgrades };
  }

  Object.keys(upgradeDefs).forEach((key) => {
    const level = clamp(sanitizeInteger(game.upgrades[key], 0), 0, upgradeDefs[key].max);
    game.upgrades[key] = level;
  });

  if (!game.inventory || typeof game.inventory !== 'object') {
    game.inventory = {};
  }

  Object.keys(game.inventory).forEach((plantId) => {
    const qty = sanitizeInteger(game.inventory[plantId], 0);
    if (qty <= 0) {
      delete game.inventory[plantId];
    } else {
      game.inventory[plantId] = qty;
    }
  });

  const selectedFert = game.selectedFertilizer;
  if (!selectedFert || !fertilizerDefs[selectedFert] || game.fertilizers[selectedFert] <= 0) {
    game.selectedFertilizer = '';
  }
}

function updateFertilizerDropdown() {
  const fertilizerSelect = document.getElementById('fertilizer-select');
  if (!fertilizerSelect) return;
  fertilizerSelect.innerHTML = '';

  const noneOption = document.createElement('option');
  noneOption.value = '';
  noneOption.textContent = 'None';
  fertilizerSelect.appendChild(noneOption);

  const fertKeys = Object.keys(fertilizerDefs).sort(
    (a, b) => fertilizerDefs[a].cost - fertilizerDefs[b].cost,
  );

  fertKeys.forEach((fert) => {
    const option = document.createElement('option');
    option.value = fert;
    const fertName = fert.charAt(0).toUpperCase() + fert.slice(1);
    const qty = Number.isFinite(game.fertilizers[fert]) ? game.fertilizers[fert] : 0;
    if (!Number.isFinite(game.fertilizers[fert])) {
      game.fertilizers[fert] = 0;
    }
    const label = `${fertName} (+${fertilizerDefs[fert].bonus} yield)`;
    const formattedQty = integerFormatter.format(qty);
    if (qty <= 0) {
      option.disabled = true;
      option.textContent = `${label} — Owned: ${formattedQty} (Locked)`;
    } else {
      option.textContent = `${label} — Owned: ${formattedQty}`;
    }
    fertilizerSelect.appendChild(option);
  });

  if (game.selectedFertilizer && game.fertilizers[game.selectedFertilizer] > 0) {
    fertilizerSelect.value = game.selectedFertilizer;
  } else {
    fertilizerSelect.value = '';
    game.selectedFertilizer = '';
  }
}

function updateHoeDropdown() {
  const hoeSelect = document.getElementById('hoe-select');
  if (!hoeSelect) return;
  hoeSelect.innerHTML = '';

  for (let i = 0; i <= game.currentHoeIndex; i += 1) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = hoes[i].name;
    hoeSelect.appendChild(option);
  }
  hoeSelect.value = game.selectedHoeIndex;
}

function createInventoryCard(plant, qty, effectivePrice) {
  const card = document.createElement('article');
  card.className = 'inventory-card';
  card.innerHTML = `
    <h3 class="inventory-name">${plant.name}</h3>
    <p class="inventory-detail">Quantity: <strong>${integerFormatter.format(qty)}</strong></p>
    <p class="inventory-detail">Sell Price: <strong>${currencyFormatter.format(effectivePrice)}</strong> each</p>
  `;
  return card;
}

function updateInventoryUI() {
  const inventoryList = document.getElementById('inventory-list');
  if (!inventoryList) return;
  inventoryList.innerHTML = '';

  let hasItems = false;
  plantTypes.forEach((plant) => {
    const qty = game.inventory[plant.id] || 0;
    if (qty > 0) {
      const multiplier = getSellPriceMultiplier();
      const effectivePrice = Math.round(plant.sellPrice * multiplier * 100) / 100;
      inventoryList.appendChild(createInventoryCard(plant, qty, effectivePrice));
      hasItems = true;
    }
  });

  if (!hasItems) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'empty-state';
    emptyMessage.textContent = 'Your inventory is empty. Start farming to fill it with crops.';
    inventoryList.appendChild(emptyMessage);
  }
}

function updateMainUI() {
  const normalizedBalance = Number.isFinite(game.balance) ? game.balance : 0;
  game.balance = Math.max(0, Math.round(normalizedBalance * 100) / 100);
  game.xp = Math.max(0, sanitizeInteger(game.xp, 0));
  const balanceEl = document.getElementById('balance');
  if (balanceEl) {
    balanceEl.textContent = currencyFormatter.format(Math.max(0, game.balance));
  }
  const xpEl = document.getElementById('xp');
  if (xpEl) {
    xpEl.textContent = integerFormatter.format(Math.floor(game.xp));
  }
  const hoeEl = document.getElementById('currentHoe');
  if (hoeEl) {
    hoeEl.textContent = hoes[game.currentHoeIndex].name;
  }
  let totalPlants = 0;
  for (const id in game.inventory) {
    if (Object.prototype.hasOwnProperty.call(game.inventory, id)) {
      totalPlants += game.inventory[id];
    }
  }
  game.plants = totalPlants;
  const plantsEl = document.getElementById('plants');
  if (plantsEl) {
    plantsEl.textContent = integerFormatter.format(totalPlants);
  }
  updateFertilizerDropdown();
  updateHoeDropdown();
  for (const fert in game.fertilizers) {
    if (Object.prototype.hasOwnProperty.call(game.fertilizers, fert)) {
      const span = document.getElementById(`fertilizer-${fert}`);
      if (span) {
        span.innerText = integerFormatter.format(game.fertilizers[fert] || 0);
      }
    }
  }
  updateInventoryUI();
}

function farm() {
  const selectedHoe = clamp(sanitizeInteger(game.selectedHoeIndex, 0), 0, hoes.length - 1);
  const hoeData = hoes[selectedHoe] || hoes[0];

  const xpMin = Math.min(12 + selectedHoe * 4, 48);
  const xpMax = xpMin + 6;
  const xpGain = Math.max(1, Math.round(getRandomIntInclusive(xpMin, xpMax) + getXpBonus()));

  const yieldMin = 12 + selectedHoe * 6;
  const yieldMax = Math.min(28 + selectedHoe * 6, 80);
  let plantYield = getRandomIntInclusive(yieldMin, yieldMax);

  plantYield = Math.round(plantYield * (hoeData.multiplier || 1));
  plantYield += getToolYieldBonus();
  plantYield += getSprinklerYieldBonus();

  const selectedFert = game.selectedFertilizer;
  let fertilizerUsed = false;
  if (selectedFert && game.fertilizers[selectedFert] > 0) {
    plantYield += getFertilizerBonus(selectedFert);
    fertilizerUsed = true;
  }

  plantYield = Math.floor(
    plantYield *
      getIrrigationMultiplier() *
      getSeedYieldMultiplier() *
      getAnalyticsYieldMultiplier(),
  );

  plantYield = Math.max(1, plantYield);

  if (Math.random() < getDuplicatorChance()) {
    plantYield *= 2;
  }

  const availablePlants = plantTypes.filter((plant) => plant.minHoe <= selectedHoe);
  if (availablePlants.length === 0) {
    console.warn('No plants available for the current hoe level.');
    return;
  }
  const selectedPlant = availablePlants[getRandomIntInclusive(0, availablePlants.length - 1)];

  if (fertilizerUsed && selectedFert) {
    const consumption = getFertilizerConsumption(selectedPlant.rarity);
    game.fertilizers[selectedFert] -= consumption;
    if (game.fertilizers[selectedFert] <= 0) {
      game.fertilizers[selectedFert] = 0;
      game.selectedFertilizer = '';
    }
  }

  if (!game.inventory[selectedPlant.id]) {
    game.inventory[selectedPlant.id] = 0;
  }
  game.inventory[selectedPlant.id] += plantYield;
  game.xp += xpGain;

  updateMainUI();
  saveGame();
}

function sellPlants() {
  let totalSale = 0;
  for (const plantId in game.inventory) {
    if (!Object.prototype.hasOwnProperty.call(game.inventory, plantId)) continue;
    const qty = game.inventory[plantId];
    const plant = plantTypes.find((p) => p.id === plantId);
    if (plant) {
      const multiplier = getSellPriceMultiplier();
      const effectivePrice = Math.round(plant.sellPrice * multiplier * 100) / 100;
      totalSale += qty * effectivePrice;
    }
  }
  if (totalSale <= 0) return;
  totalSale = Math.round(totalSale * 100) / 100;
  game.balance += totalSale;
  game.inventory = {};
  ensureValidSelections();
  updateMainUI();
  saveGame();
}

function buyUpgrade(upgradeKey) {
  const def = upgradeDefs[upgradeKey];
  if (!def) return;
  if (game.upgrades[upgradeKey] < def.max && game.balance >= def.cost) {
    game.balance -= def.cost;
    game.upgrades[upgradeKey] += 1;
    updateMainUI();
    saveGame();
  }
}

function buyAllUpgrade(upgradeKey) {
  const def = upgradeDefs[upgradeKey];
  if (!def || def.cost <= 0) return;
  while (game.upgrades[upgradeKey] < def.max && game.balance >= def.cost) {
    game.balance -= def.cost;
    game.upgrades[upgradeKey] += 1;
  }
  ensureValidSelections();
  updateMainUI();
  saveGame();
}

function buyHoe(hoeIndex) {
  const index = clamp(sanitizeInteger(hoeIndex, 0), 0, hoes.length - 1);
  const hoe = hoes[index];
  if (!hoe) return;
  if (game.balance >= hoe.cost) {
    game.balance -= hoe.cost;
    if (index > game.currentHoeIndex) {
      game.currentHoeIndex = index;
    }
    game.selectedHoeIndex = index;
    ensureValidSelections();
    updateMainUI();
    saveGame();
  }
}

function equipHoe(hoeIndex) {
  const index = clamp(sanitizeInteger(hoeIndex, 0), 0, hoes.length - 1);
  if (index <= game.currentHoeIndex) {
    game.selectedHoeIndex = index;
    ensureValidSelections();
    updateMainUI();
    saveGame();
  }
}

function buyFertilizer(fertKey) {
  const fertDef = fertilizerDefs[fertKey];
  if (!fertDef || fertDef.cost <= 0) return;
  if (typeof game.fertilizers[fertKey] === 'undefined') {
    game.fertilizers[fertKey] = 0;
  }
  if (game.balance >= fertDef.cost) {
    game.balance -= fertDef.cost;
    game.fertilizers[fertKey] += 1;
    ensureValidSelections();
    updateMainUI();
    saveGame();
  }
}

function buyAllFertilizer(fertKey) {
  const fertDef = fertilizerDefs[fertKey];
  if (!fertDef || fertDef.cost <= 0) return;
  if (typeof game.fertilizers[fertKey] === 'undefined') {
    game.fertilizers[fertKey] = 0;
  }
  while (game.balance >= fertDef.cost) {
    game.balance -= fertDef.cost;
    game.fertilizers[fertKey] += 1;
  }
  ensureValidSelections();
  updateMainUI();
  saveGame();
}

let currentUpgradePage = 1;
const upgradesPerPage = 5;

function formatUpgradeName(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
}

function renderUpgradesPage() {
  const container = document.getElementById('upgrade-list-container');
  if (!container) return;
  container.innerHTML = '';

  const maxPage = Math.max(1, Math.ceil(upgradeOrder.length / upgradesPerPage));
  currentUpgradePage = clamp(currentUpgradePage, 1, maxPage);

  const startIndex = (currentUpgradePage - 1) * upgradesPerPage;
  const endIndex = startIndex + upgradesPerPage;
  const upgradesToShow = upgradeOrder.slice(startIndex, endIndex);

  upgradesToShow.forEach((key) => {
    const def = upgradeDefs[key];
    const currentLevel = game.upgrades[key] || 0;
    const div = document.createElement('div');
    div.className = 'item-container';
    div.setAttribute('data-upgrade', key);
    div.innerHTML = `
      <div class="item-summary">
        <h3 class="item-title">${formatUpgradeName(key)}</h3>
        <p class="item-subtitle">${upgradeEffects[key]}</p>
      </div>
      <span class="item-meta" id="${key}-level">Level ${currentLevel} / ${def.max}</span>
      <div class="item-actions">
        <button class="buy-upgrade item-button" data-upgrade="${key}">Buy (${currencyFormatter.format(def.cost)})</button>
        <button class="buy-all-upgrade item-button button-secondary" data-upgrade="${key}">Buy All</button>
      </div>
    `;
    container.appendChild(div);
  });

  const pageIndicator = document.getElementById('upgrade-page-number');
  if (pageIndicator) {
    pageIndicator.innerText = `Page ${currentUpgradePage}`;
  }
}

let currentShopTab = 'hoe';
let currentShopPage = 1;
const shopItemsPerPage = 5;

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderShopPage() {
  const container = document.getElementById('shop-list-container');
  if (!container) return;
  container.innerHTML = '';

  let items = [];
  if (currentShopTab === 'hoe') {
    items = hoes;
  } else {
    items = Object.keys(fertilizerDefs)
      .sort((a, b) => fertilizerDefs[a].cost - fertilizerDefs[b].cost)
      .map((key) => ({ key, ...fertilizerDefs[key] }));
  }

  const maxPage = Math.max(1, Math.ceil(items.length / shopItemsPerPage));
  currentShopPage = clamp(currentShopPage, 1, maxPage);

  const startIndex = (currentShopPage - 1) * shopItemsPerPage;
  const endIndex = startIndex + shopItemsPerPage;
  const itemsToShow = items.slice(startIndex, endIndex);

  itemsToShow.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'item-container';
    if (currentShopTab === 'hoe') {
      const index = hoes.indexOf(item);
      let actionMarkup = '';
      if (index <= game.currentHoeIndex) {
        if (index === game.selectedHoeIndex) {
          actionMarkup = `<button class="equip-hoe item-button" data-hoe-index="${index}" disabled>Equipped</button>`;
        } else {
          actionMarkup = `<button class="equip-hoe item-button button-secondary" data-hoe-index="${index}">Equip</button>`;
        }
      } else {
        actionMarkup = `<button class="buy-hoe item-button" data-hoe-index="${index}">Buy (${currencyFormatter.format(item.cost)})</button>`;
      }
      div.innerHTML = `
        <div class="item-summary">
          <h3 class="item-title">${item.name}</h3>
          <p class="item-subtitle">Multiplier ${item.multiplier.toFixed(1)}×</p>
        </div>
        <span class="item-meta">Cost ${currencyFormatter.format(item.cost)}</span>
        <div class="item-actions">${actionMarkup}</div>
      `;
    } else {
      const key = item.key;
      div.innerHTML = `
        <div class="item-summary">
          <h3 class="item-title">${capitalize(key)}</h3>
          <p class="item-subtitle">+${item.bonus} yield • Cost ${currencyFormatter.format(item.cost)}</p>
        </div>
        <span class="item-meta">Owned: <span id="fertilizer-${key}">${integerFormatter.format(game.fertilizers[key] || 0)}</span></span>
        <div class="item-actions">
          <button class="buy-fertilizer item-button" data-fertilizer="${key}">Buy</button>
          <button class="buy-all-fertilizer item-button button-secondary" data-fertilizer="${key}">Buy All</button>
        </div>
      `;
    }
    container.appendChild(div);
  });

  const pageIndicator = document.getElementById('shop-page-number');
  if (pageIndicator) {
    pageIndicator.innerText = `Page ${currentShopPage}`;
  }
}

function bindNavigationToggle() {
  if (hasBoundNavHandlers) return;

  navToggleButton = document.querySelector('.nav-toggle');
  siteNavElement = document.querySelector('.site-nav');

  if (!navToggleButton || !siteNavElement) {
    navToggleButton = null;
    siteNavElement = null;
    return;
  }

  siteNavElement.classList.add('site-nav--collapsible');

  navToggleButton.addEventListener('click', () => {
    const expanded = navToggleButton.getAttribute('aria-expanded') === 'true';
    const shouldOpen = !expanded;
    navToggleButton.setAttribute('aria-expanded', String(shouldOpen));
    siteNavElement.classList.toggle('site-nav--open', shouldOpen);
  });

  siteNavElement.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeNavigationMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeNavigationMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isNavigationOpen()) {
      closeNavigationMenu();
      if (navToggleButton) {
        navToggleButton.focus();
      }
    }
  });

  closeNavigationMenu();
  hasBoundNavHandlers = true;
}

function bindSelectionInputs() {
  const fertSelect = document.getElementById('fertilizer-select');
  if (fertSelect) {
    fertSelect.addEventListener('change', function handleFertilizerChange() {
      game.selectedFertilizer = this.value;
      ensureValidSelections();
      updateMainUI();
      saveGame();
    });
  }

  const hoeSelect = document.getElementById('hoe-select');
  if (hoeSelect) {
    hoeSelect.addEventListener('change', function handleHoeChange() {
      const parsed = parseInt(this.value, 10);
      game.selectedHoeIndex = clamp(Number.isNaN(parsed) ? 0 : parsed, 0, game.currentHoeIndex);
      updateMainUI();
      saveGame();
    });
  }
}

function bindActionButtons() {
  const farmButton = document.getElementById('farm-button');
  if (farmButton) {
    farmButton.addEventListener('click', farm);
  }
  const sellButton = document.getElementById('sell-button');
  if (sellButton) {
    sellButton.addEventListener('click', sellPlants);
  }
}

function bindPaginationControls() {
  const upgradePrev = document.getElementById('upgrade-prev-button');
  if (upgradePrev) {
    upgradePrev.addEventListener('click', () => {
      if (currentUpgradePage > 1) {
        currentUpgradePage -= 1;
        renderUpgradesPage();
      }
    });
  }

  const upgradeNext = document.getElementById('upgrade-next-button');
  if (upgradeNext) {
    upgradeNext.addEventListener('click', () => {
      const maxPage = Math.ceil(upgradeOrder.length / upgradesPerPage);
      if (currentUpgradePage < maxPage) {
        currentUpgradePage += 1;
        renderUpgradesPage();
      }
    });
  }

  const shopPrev = document.getElementById('shop-prev-button');
  if (shopPrev) {
    shopPrev.addEventListener('click', () => {
      if (currentShopPage > 1) {
        currentShopPage -= 1;
        renderShopPage();
      }
    });
  }

  const shopNext = document.getElementById('shop-next-button');
  if (shopNext) {
    shopNext.addEventListener('click', () => {
      let items = [];
      if (currentShopTab === 'hoe') {
        items = hoes;
      } else {
        items = Object.keys(fertilizerDefs);
      }
      const maxPage = Math.ceil(items.length / shopItemsPerPage);
      if (currentShopPage < maxPage) {
        currentShopPage += 1;
        renderShopPage();
      }
    });
  }
}

function handleDocumentClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.classList.contains('buy-upgrade')) {
    const key = target.getAttribute('data-upgrade');
    buyUpgrade(key);
    renderUpgradesPage();
  }

  if (target.classList.contains('buy-all-upgrade')) {
    const key = target.getAttribute('data-upgrade');
    buyAllUpgrade(key);
    renderUpgradesPage();
  }

  if (target.classList.contains('buy-hoe')) {
    const index = parseInt(target.getAttribute('data-hoe-index'), 10);
    buyHoe(index);
    renderShopPage();
    updateHoeDropdown();
  }

  if (target.classList.contains('equip-hoe')) {
    const index = parseInt(target.getAttribute('data-hoe-index'), 10);
    equipHoe(index);
    updateMainUI();
    renderShopPage();
  }

  if (target.classList.contains('buy-fertilizer')) {
    const fertKey = target.getAttribute('data-fertilizer');
    buyFertilizer(fertKey);
    renderShopPage();
    updateFertilizerDropdown();
  }

  if (target.classList.contains('buy-all-fertilizer')) {
    const fertKey = target.getAttribute('data-fertilizer');
    buyAllFertilizer(fertKey);
    renderShopPage();
    updateFertilizerDropdown();
  }

  if (navToggleButton && siteNavElement && isNavigationOpen()) {
    const clickedToggle = target === navToggleButton || navToggleButton.contains(target);
    const clickedInsideNav = siteNavElement.contains(target);
    if (!clickedToggle && !clickedInsideNav) {
      closeNavigationMenu();
    }
  }
}

function scheduleAutoSave() {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer);
  }
  autoSaveTimer = setInterval(saveGame, AUTO_SAVE_INTERVAL);
  if (!hasBoundUnloadHandler) {
    window.addEventListener('beforeunload', saveGame);
    hasBoundUnloadHandler = true;
  }
}

function initializeGame() {
  loadGame();
  ensureValidSelections();
  updateMainUI();
  bindNavigationToggle();
  bindSelectionInputs();
  bindActionButtons();
  bindPaginationControls();
  scheduleAutoSave();

  if (!hasBoundGlobalClickHandlers) {
    document.addEventListener('click', handleDocumentClick);
    hasBoundGlobalClickHandlers = true;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initializeGame();

  const bodyClassList = document.body.classList;
  if (bodyClassList.contains('page-upgrades')) {
    currentUpgradePage = 1;
    renderUpgradesPage();
  }
  if (bodyClassList.contains('page-shop-hoe')) {
    currentShopTab = 'hoe';
    currentShopPage = 1;
    renderShopPage();
  }
  if (bodyClassList.contains('page-shop-fertilizer')) {
    currentShopTab = 'fertilizer';
    currentShopPage = 1;
    renderShopPage();
  }
});
