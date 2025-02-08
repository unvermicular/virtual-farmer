# Virtual Farmer

**Virtual Farmer** is a browser-based incremental farming game built with vanilla JavaScript, HTML, and CSS. Manage your own virtual farm by planting crops, upgrading your tools, and purchasing fertilizers and equipment from dedicated in-game shops. With a fully responsive interface, automatic saving using `localStorage`, and a multi-page structure, Virtual Farmer provides an engaging and continuously evolving farming experience.

## Features

- **Incremental Farming:**  
  Click the **Farm** button to plant crops and earn XP along with virtual currency. Your yield and XP depend on your selected hoe, active fertilizer, and various upgrades.

- **Dynamic Inventory:**  
  Harvested crops are stored in your inventory, and the total plant count is updated in real time. Sell your crops at optimal prices to increase your balance.

- **Upgrades with Descriptive Effects:**  
  Improve various aspects of your farm with upgrades such as:
  - *Sharper Tools* – Increases base yield by +1 per level.
  - *Expert Farmer* – Improves plant quality, boosting sell price.
  - *Businessman* – Enhances the plant sell price.
  - *Experienced* – Boosts XP gain.
  - *Duplicator* – Provides a chance to double yield.
  - *Irrigation System* – Multiplies overall yield.
  - *Automated Sprinkler* – Adds extra yield per farm.
  - *Fertilizer Efficiency* – Boosts fertilizer bonus by 10% per level.
  - *Market Specialist* – Further increases sell price.
  - *Advanced Analytics* – Optimizes farming decisions.
  - *Seed Multiplier* – Increases seed production.

- **Responsive Shops with Pagination:**  
  Navigate through the Hoe Shop and Fertilizer Shop via multi-page interfaces. In the Hoe Shop, purchase new hoes and equip them; once equipped, the corresponding button displays “Equipped” and becomes disabled.

- **Fertilizer Consumption Mechanics:**  
  The amount of fertilizer consumed during farming depends on the crop rarity:
  - **Normal:** Consumes 1 unit.
  - **Rare/Uncommon:** Consumes 2 units.
  - **Epic:** Consumes 3 units.
  - **Legendary:** Consumes 4 units.
  - **Mythical:** Consumes 5 units.

- **Auto-Save & Multi-Page Navigation:**  
  Game progress is automatically saved every 5 seconds and before the page unloads. Use the header navigation links to switch seamlessly between Farming, Upgrades, and Shop pages.

## Project Structure
virtual-farmer/
├── index.html              # Main page: Farming and Inventory view
├── upgrades.html           # Upgrades page (with pagination)
├── shop.html               # Main Shop menu page (links to Hoe and Fertilizer shops)
├── shop-hoe.html           # Hoe Shop page (with pagination and equip functionality)
├── shop-fertilizer.html    # Fertilizer Shop page (with pagination)
├── style.css               # Global styles and responsive design
├── game.js                 # Game logic, state management, and event listeners
├── README.md               # Project documentation and usage instructions
└── LICENSE                 # License file
