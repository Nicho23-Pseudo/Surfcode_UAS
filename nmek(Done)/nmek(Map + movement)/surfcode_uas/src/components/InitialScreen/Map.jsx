import React, { useState, useEffect, useRef } from "react";
import MapImage from "../../assets/Map.png";
import HouseImage from "../../assets/Rumah.png";
import TavernImage from "../../assets/Tavern.png";
import "../../components/InitialScreen/Map.css";
import CharacterMovement from "../../components/Character/CharacterMovement";

const inventoryStyles = `
.hotbar-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  pointer-events: auto;
}
.hotbar {
  display: flex;
  gap: 4px;
  background: rgba(40, 40, 40, 0.95);
  padding: 8px;
  border-radius: 12px;
  border: 2px solid #555;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
}
.hotbar-slot {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #4a4a4a, #3a3a3a);
  border: 2px solid #666;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.1);
}
.hotbar-slot:hover {
  border-color: #888;
  background: linear-gradient(135deg, #5a5a5a, #4a4a4a);
  transform: translateY(-2px);
}
.hotbar-slot.selected {
  border-color: #ffcd3c;
  background: linear-gradient(135deg, #5a4a2a, #4a3a1a);
  box-shadow: inset 0 2px 4px rgba(255, 205, 60, 0.3),
    0 0 20px rgba(255, 205, 60, 0.4);
}
.hotbar-slot-number {
  position: absolute;
  top: -2px;
  left: 2px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: bold;
}
.hotbar-item-icon {
  font-size: 24px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
.hotbar-item-quantity {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 10px;
  padding: 1px 3px;
  border-radius: 3px;
  font-weight: bold;
  min-width: 12px;
  text-align: center;
}
.inventory-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
}
.inventory-modal {
  background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
  border: 3px solid #555;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
  max-width: 480px;
  width: 90%;
  max-height: 80vh;
  animation: slideIn 0.3s ease;
}
.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 2px solid #444;
  background: linear-gradient(135deg, #3a3a3a, #2a2a2a);
  border-radius: 13px 13px 0 0;
}
.inventory-header h2 {
  color: #fff;
  margin: 0;
  font-size: 24px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.inventory-close {
  background: #ff4444;
  border: none;
  color: white;
  font-size: 24px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.inventory-close:hover {
  background: #ff6666;
  transform: scale(1.1);
}
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 6px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
}
.inventory-slot {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #4a4a4a, #3a3a3a);
  border: 2px solid #666;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.1);
}
.inventory-slot:hover {
  border-color: #888;
  background: linear-gradient(135deg, #5a5a5a, #4a4a4a);
  transform: translateY(-2px);
}
.inventory-slot.selected {
  border-color: #4caf50;
  background: linear-gradient(135deg, #2a4a2a, #1a3a1a);
  box-shadow: inset 0 2px 4px rgba(76, 175, 80, 0.3),
    0 0 20px rgba(76, 175, 80, 0.4);
}
.inventory-item-icon {
  font-size: 28px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
.inventory-item-quantity {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: bold;
  min-width: 14px;
  text-align: center;
}
.inventory-footer {
  display: flex;
  gap: 10px;
  padding: 16px 20px;
  border-top: 2px solid #444;
  background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
  border-radius: 0 0 13px 13px;
}
.inventory-button {
  flex: 1;
  padding: 10px 16px;
  background: linear-gradient(135deg, #555, #444);
  border: 2px solid #666;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}
.inventory-button:hover {
  background: linear-gradient(135deg, #666, #555);
  border-color: #777;
  transform: translateY(-1px);
}
.inventory-button:active {
  transform: translateY(0);
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideIn {
  from { opacity: 0; transform: scale(0.8) translateY(-20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
@media (max-width: 768px) {
  .hotbar-slot {
    width: 56px;
    height: 56px;
  }
  .hotbar-item-icon {
    font-size: 20px;
  }
  .inventory-grid {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
  }
  .inventory-slot {
    width: 60px;
    height: 60px;
  }
  .inventory-item-icon {
    font-size: 24px;
  }
}
`;

// Tambahkan di awal komponen Map (sebelum return)


const SAMPLE_ITEMS = {
  sword: { id: 'sword', name: 'Iron Sword', icon: '⚔', type: 'weapon' },
  bow: { id: 'bow', name: 'Wooden Bow', icon: '🏹', type: 'weapon' },
  hammer: { id: 'hammer', name: 'War Hammer', icon: '🔨', type: 'weapon' },
  axe: { id: 'axe', name: 'Battle Axe', icon: '🪓', type: 'weapon' },
  bread: { id: 'bread', name: 'Bread', icon: '🍞', type: 'food' },
  potion_health: { id: 'potion_health', name: 'Health Potion', icon: '🧪', type: 'potion' },
  potion_mana: { id: 'potion_mana', name: 'Mana Potion', icon: '💙', type: 'potion' },
  apple: { id: 'apple', name: 'Red Apple', icon: '🍎', type: 'food' },
  key: { id: 'key', name: 'Golden Key', icon: '🗝', type: 'misc' },
  coin: { id: 'coin', name: 'Gold Coin', icon: '🪙', type: 'currency' }
};

const Hotbar = ({ hotbarItems, onHotbarItemClick, selectedHotbarSlot }) => {
  return (
    <div className="hotbar-container">
      <div className="hotbar">
        {[0, 1, 2, 3].map((slotIndex) => (
          <div
            key={slotIndex}
            className={`hotbar-slot ${selectedHotbarSlot === slotIndex ? 'selected' : ''}`}
            onClick={() => onHotbarItemClick(slotIndex)}
          >
            <div className="hotbar-slot-number">{slotIndex + 1}</div>
            {hotbarItems[slotIndex] && (
              <>
                <div className="hotbar-item-icon">
                  {SAMPLE_ITEMS[hotbarItems[slotIndex].id]?.icon || '❓'}
                </div>
                {hotbarItems[slotIndex].quantity > 1 && (
                  <div className="hotbar-item-quantity">
                    {hotbarItems[slotIndex].quantity}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const InventoryModal = ({
  isOpen,
  onClose,
  inventoryItems,
  onItemClick,
  onMoveToHotbar,
  selectedItem
}) => {
  if (!isOpen) return null;

  return (
    <div className="inventory-overlay" onClick={onClose}>
      <div className="inventory-modal" onClick={(e) => e.stopPropagation()}>
        <div className="inventory-header">
          <h2>Inventory</h2>
          <button className="inventory-close" onClick={onClose}>×</button>
        </div>

        <div className="inventory-grid">
          {Array.from({ length: 15 }, (_, index) => {
            const item = inventoryItems[index];
            return (
              <div
                key={index}
                className={`inventory-slot ${selectedItem === index ? 'selected' : ''}`}
                onClick={() => onItemClick(index)}
                onDoubleClick={() => item && onMoveToHotbar(item, index)}
              >
                {item && (
                  <>
                    <div className="inventory-item-icon">
                      {SAMPLE_ITEMS[item.id]?.icon || '❓'}
                    </div>
                    {item.quantity > 1 && (
                      <div className="inventory-item-quantity">
                        {item.quantity}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="inventory-footer">
          <button className="inventory-button">Drop Item</button>
          <button className="inventory-button">Use Item</button>
        </div>
      </div>
    </div>
  );
};

const InventorySystem = () => {
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [hotbarItems, setHotbarItems] = useState([]);
  const [selectedHotbarSlot, setSelectedHotbarSlot] = useState(0);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);

  useEffect(() => {
    const sampleInventory = [
      { id: 'sword', quantity: 1 },
      { id: 'bow', quantity: 1 },
      { id: 'potion_health', quantity: 5 },
      { id: 'bread', quantity: 3 },
      { id: 'key', quantity: 1 },
      { id: 'coin', quantity: 50 }
    ];
    const sampleHotbar = [
      { id: 'sword', quantity: 1 },
      { id: 'potion_health', quantity: 3 },
      { id: 'bread', quantity: 2 },
      null
    ];
    setInventoryItems(sampleInventory);
    setHotbarItems(sampleHotbar);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        setIsInventoryOpen((open) => !open);
      }
      if (event.key >= '1' && event.key <= '4') {
        const slotIndex = parseInt(event.key) - 1;
        setSelectedHotbarSlot(slotIndex);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleInventoryItemClick = (index) => {
    setSelectedInventoryItem(selectedInventoryItem === index ? null : index);
  };

  const handleHotbarItemClick = (slotIndex) => {
    setSelectedHotbarSlot(slotIndex);
    // You can trigger item usage here if needed
  };

  const moveItemToHotbar = (item, inventoryIndex) => {
    let emptySlot = -1;
    for (let i = 0; i < 4; i++) {
      if (!hotbarItems[i]) {
        emptySlot = i;
        break;
      }
    }
    if (emptySlot !== -1) {
      const newHotbarItems = [...hotbarItems];
      newHotbarItems[emptySlot] = { ...item };
      setHotbarItems(newHotbarItems);

      const newInventoryItems = [...inventoryItems];
      newInventoryItems.splice(inventoryIndex, 1);
      setInventoryItems(newInventoryItems);
    }
  };

  const addItemToInventory = (itemId, quantity = 1) => {
    let emptySlot = -1;
    for (let i = 0; i < 15; i++) {
      if (!inventoryItems[i]) {
        emptySlot = i;
        break;
      }
    }
    if (emptySlot !== -1) {
      const newInventoryItems = [...inventoryItems];
      newInventoryItems[emptySlot] = { id: itemId, quantity };
      setInventoryItems(newInventoryItems);
    }
  };

  return (
    <>
      <Hotbar
        hotbarItems={hotbarItems}
        onHotbarItemClick={handleHotbarItemClick}
        selectedHotbarSlot={selectedHotbarSlot}
      />
      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        inventoryItems={inventoryItems}
        onItemClick={handleInventoryItemClick}
        onMoveToHotbar={moveItemToHotbar}
        selectedItem={selectedInventoryItem}
      />
    </>
  );
};

// --- kode Map component kamu di bawah ini ---
const Map = ({ playerName, playerPosition = { x: 300, y: 225 } }) => {
  const zoom = 2;
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0 });
  const [followPlayer, setFollowPlayer] = useState(true);
  const [currentMap, setCurrentMap] = useState("village");
  const [playerPos, setPlayerPos] = useState(playerPosition);
  const mapContainerRef = useRef(null);

  // Status bar states
  const [stats, setStats] = useState({
    health: 100,
    energy: 100,
    mana: 0,
    happiness: 100,
    sleep: 0,
    coins: 75
  });
  const [currentDay, setCurrentDay] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [gameOver, setGameOver] = useState(false);
  const [movementDisabled, setMovementDisabled] = useState(false);

  // Area pintu masuk/keluar di village
  const redDoorArea = { x: 170, y: 100, width: 40, height: 30 };
  const blueDoorArea = { x: 405, y: 65, width: 80, height: 70 };

  // Area pintu keluar di house & tavern (tepat di bawah pintu masuk)
  const exitAreaHouse = { x: 320, y: 450, width: 40, height: 20 };
  const exitAreaTavern = { x: 217, y: 526, width: 80, height: 20 };

  // Area toilet dan kamar tidur
  const toiletArea = { x: 320, y: 60, width: 110, height: 90 };
  const bedroomArea = { x: 60, y: 40, width: 180, height: 120 };

  const [showToiletButton, setShowToiletButton] = useState(false);
  const [showBedroomButton, setShowBedroomButton] = useState(false);

  const tavernEatArea = { x: 340, y: 420, width: 110, height: 60 }; // area meja kosong untuk makan
  const tavernWorkArea = { x: 220, y: 320, width: 70, height: 60 }; // area depan orang untuk kerja

const [showEatButton, setShowEatButton] = useState(false);
const [showWorkButton, setShowWorkButton] = useState(false);

useEffect(() => {
  if (!document.getElementById("inventory-styles")) {
    const style = document.createElement("style");
    style.id = "inventory-styles";
    style.innerHTML = inventoryStyles;
    document.head.appendChild(style);
  }
}, []);

  // Cek posisi player di area toilet/kamar tidur
  useEffect(() => {
    if (currentMap === "house") {
      setShowToiletButton(
        playerPos.x >= toiletArea.x &&
        playerPos.x <= toiletArea.x + toiletArea.width &&
        playerPos.y >= toiletArea.y &&
        playerPos.y <= toiletArea.y + toiletArea.height
      );
      setShowBedroomButton(
        playerPos.x >= bedroomArea.x &&
        playerPos.x <= bedroomArea.x + bedroomArea.width &&
        playerPos.y >= bedroomArea.y &&
        playerPos.y <= bedroomArea.y + bedroomArea.height
      );
    } else {
      setShowToiletButton(false);
      setShowBedroomButton(false);
    }
  }, [playerPos, currentMap]);

  // Fungsi aksi status bar
  const handleToiletAction = () => {
    setStats((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 10)
    }));
  };

  const handleBedroomAction = () => {
  setCurrentDay((prevDay) => {
    const newDay = prevDay + 1;
    if (newDay >= 7) {
      setGameOver(true);
      setMovementDisabled(true);
    }
    return newDay;
  });

  setStats((prev) => ({
    ...prev,
    health: 100,
    energy: 100,
    mana: 100,
    happiness: 100,
    sleep: 100
  }));
};

  useEffect(() => {
  if (currentMap === "tavern") {
    setShowEatButton(
      playerPos.x >= tavernEatArea.x &&
      playerPos.x <= tavernEatArea.x + tavernEatArea.width &&
      playerPos.y >= tavernEatArea.y &&
      playerPos.y <= tavernEatArea.y + tavernEatArea.height
    );
    setShowWorkButton(
      playerPos.x >= tavernWorkArea.x &&
      playerPos.x <= tavernWorkArea.x + tavernWorkArea.width &&
      playerPos.y >= tavernWorkArea.y &&
      playerPos.y <= tavernWorkArea.y + tavernWorkArea.height
    );
  } else {
    setShowEatButton(false);
    setShowWorkButton(false);
  }
}, [playerPos, currentMap]);

const handleEatAction = () => {
  setStats((prev) => ({
    ...prev,
    happiness: Math.min(100, prev.happiness + 10),
    health: Math.min(100, prev.health + 10),
    energy: Math.min(100, prev.energy + 10),
    mana: Math.min(100, prev.mana + 10)
  }));
};

const handleWorkAction = () => {
  setStats((prev) => ({
    ...prev,
    happiness: Math.max(0, prev.happiness - 10),
    energy: Math.max(0, prev.energy - 10),
    mana: Math.max(0, prev.mana - 10),
    sleep: Math.max(0, prev.sleep - 10)
  }));
};

  // StatusBar Component
  const StatusBar = () => {
    const StatusBarItem = ({ icon, value, maxValue, color, bgColor }) => {
      const percentage = (value / maxValue) * 100;
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
          <div style={{
            width: "12px",
            height: "12px",
            backgroundColor: color,
            borderRadius: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "8px",
            color: "white",
            fontWeight: "bold"
          }}>
            {icon}
          </div>
          <div style={{ flex: 1, position: "relative" }}>
            <div style={{
              height: "12px",
              borderRadius: "6px",
              backgroundColor: bgColor,
              border: "1px solid #4a4a4a",
              overflow: "hidden"
            }}>
              <div
                style={{
                  height: "100%",
                  borderRadius: "6px",
                  backgroundColor: color,
                  width: `${percentage}%`,
                  transition: "width 0.3s ease"
                }}
              />
            </div>
            <span style={{
              position: "absolute",
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "8px",
              fontWeight: "bold",
              color: "white",
              textShadow: "1px 1px 2px rgba(0,0,0,0.8)"
            }}>
              {value}/{maxValue}
            </span>
          </div>
        </div>
      );
    };

    return (
      <div style={{
        background: "linear-gradient(135deg, #ea580c 0%, #dc2626 100%)",
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid #fb923c",
        boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.25)",
        maxWidth: "200px",
        minWidth: "180px"
      }}>
        {/* Character Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "2px solid #fbbf24",
            overflow: "hidden",
            backgroundColor: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{
              width: "30px",
              height: "30px",
              background: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <div style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#92400e",
                borderRadius: "50%",
                position: "relative"
              }}>
                <div style={{
                  position: "absolute",
                  top: "5px",
                  left: "2px",
                  width: "2px",
                  height: "2px",
                  backgroundColor: "black",
                  borderRadius: "50%"
                }}></div>
                <div style={{
                  position: "absolute",
                  top: "5px",
                  right: "2px",
                  width: "2px",
                  height: "2px",
                  backgroundColor: "black",
                  borderRadius: "50%"
                }}></div>
                <div style={{
                  position: "absolute",
                  bottom: "5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "5px",
                  height: "2px",
                  backgroundColor: "#f87171",
                  borderRadius: "50%"
                }}></div>
              </div>
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "white", margin: "0 0 2px 0" }}>
              {playerName || "Eugene"}
            </h2>
          </div>
        </div>

        {/* Status Bars */}
        <div style={{ marginBottom: "8px" }}>
          <StatusBarItem
            icon="♥"
            value={stats.health}
            maxValue={100}
            color="#ef4444"
            bgColor="#7f1d1d"
          />
          <StatusBarItem
            icon="⚡"
            value={stats.energy}
            maxValue={100}
            color="#facc15"
            bgColor="#713f12"
          />
          <StatusBarItem
            icon="🛡"
            value={stats.mana}
            maxValue={100}
            color="#3b82f6"
            bgColor="#1e3a8a"
          />
          <StatusBarItem
            icon="😊"
            value={stats.happiness}
            maxValue={100}
            color="#22c55e"
            bgColor="#14532d"
          />
          <StatusBarItem
            icon="💤"
            value={stats.sleep}
            maxValue={100}
            color="#a855f7"
            bgColor="#581c87"
          />
        </div>

        {/* Coins */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
          <div style={{
            width: "20px",
            height: "20px",
            backgroundColor: "#eab308",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #ca8a04",
            fontSize: "10px",
            fontWeight: "bold",
            color: "#713f12"
          }}>
            $
          </div>
          <span style={{ color: "white", fontWeight: "bold", fontSize: "12px" }}>
            {stats.coins}
          </span>
        </div>

        {/* Time Display */}
        <div style={{
          backgroundColor: "#c2410c",
          borderRadius: "4px",
          padding: "4px",
          border: "1px solid #ea580c",
          textAlign: "center"
        }}>
          <div style={{ color: "white", fontWeight: "bold", fontSize: "10px" }}>
            Day {currentDay} - {currentTime}
          </div>
        </div>
      </div>
    );
  };

  // --- MASUK & KELUAR OTOMATIS ---
  useEffect(() => {
    // Masuk house/tavern dari village
    if (currentMap === "village") {
      if (
        playerPos.x >= redDoorArea.x &&
        playerPos.x <= redDoorArea.x + redDoorArea.width &&
        playerPos.y >= redDoorArea.y &&
        playerPos.y <= redDoorArea.y + redDoorArea.height
      ) {
        setCurrentMap("house");
        setPlayerPos({ x: redDoorArea.x + 10, y: 320 });
      }
      if (
        playerPos.x >= blueDoorArea.x &&
        playerPos.x <= blueDoorArea.x + blueDoorArea.width &&
        playerPos.y >= blueDoorArea.y &&
        playerPos.y <= blueDoorArea.y + blueDoorArea.height
      ) {
        setCurrentMap("tavern");
        setPlayerPos({ x: 225, y: 480 });
      }
    }
    // Keluar dari house ke village
    if (currentMap === "house") {
      if (
        playerPos.x >= exitAreaHouse.x &&
        playerPos.x <= exitAreaHouse.x + exitAreaHouse.width &&
        playerPos.y >= exitAreaHouse.y &&
        playerPos.y <= exitAreaHouse.y + exitAreaHouse.height
      ) {
        setCurrentMap("village");
        setPlayerPos({ x: redDoorArea.x + 10, y: redDoorArea.y + redDoorArea.height + 10 });
      }
    }
    // Keluar dari tavern ke village
    if (currentMap === "tavern") {
      if (
        playerPos.x >= exitAreaTavern.x &&
        playerPos.x <= exitAreaTavern.x + exitAreaTavern.width &&
        playerPos.y >= exitAreaTavern.y &&
        playerPos.y <= exitAreaTavern.y + exitAreaTavern.height
      ) {
        setCurrentMap("village");
        setPlayerPos({ x: blueDoorArea.x + 10, y: blueDoorArea.y + blueDoorArea.height + 10 });
      }
    }
  }, [playerPos, currentMap]);

  useEffect(() => {
    if (followPlayer && mapContainerRef.current && currentMap === "village") {
      const container = mapContainerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const newCameraX = playerPos.x * zoom - containerWidth / 2;
      const newCameraY = playerPos.y * zoom - containerHeight / 2;

      setCameraPosition({ x: newCameraX, y: newCameraY });
    }
  }, [playerPos, followPlayer, currentMap]);

  // Real-time clock and stat reduction
  useEffect(() => {
    let startTime = 0;
    const updateTimeAndStats = () => {
      startTime += 1;
      const hours = String(Math.floor(startTime / 60) % 24).padStart(2, '0');
      const minutes = String(startTime % 60).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      setCurrentTime(`${displayHours}:${minutes} ${ampm}`);

      if (startTime % 5 === 0) {
        setStats(prevStats => ({
          ...prevStats,
          health: Math.max(0, prevStats.health - 5),
          energy: Math.max(0, prevStats.energy - 5),
          happiness: Math.max(0, prevStats.happiness - 5),
          sleep: Math.min(100, prevStats.sleep + 5)
        }));
      }
    };
    updateTimeAndStats();
    const interval = setInterval(updateTimeAndStats, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- HOUSE ---
  if (currentMap === "house") {
    const houseZoom = 1.3;
    const houseWidth = 640;
    const houseHeight = 460;
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#222",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: `${houseWidth}px`,
            height: `${houseHeight}px`,
            transform: `scale(${houseZoom})`,
            transformOrigin: "center center",
            position: "relative"
          }}
        >
          <img
            src={HouseImage}
            alt="House Map"
            style={{
              width: `${houseWidth}px`,
              height: `${houseHeight}px`,
              objectFit: "cover",
              imageRendering: "pixelated",
              display: "block"
            }}
          />
          <CharacterMovement
            playerPosition={playerPos}
            setPlayerPosition={setPlayerPos}
            mapWidth={houseWidth}
            mapHeight={houseHeight}
            disabled={movementDisabled}
          />
      
{showToiletButton && (
  <button
    style={{
      position: "absolute",
      left: toiletArea.x + 40,
      top: toiletArea.y + 10,
      zIndex: 20,
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      padding: "6px 12px",
      fontSize: "14px",
      cursor: "pointer"
    }}
    onClick={handleToiletAction}
  >
    🚽 Pakai Toilet
  </button>
)}

{showBedroomButton && (
  <button
    style={{
      position: "absolute",
      left: bedroomArea.x + 60,
      top: bedroomArea.y + 10,
      zIndex: 20,
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      padding: "6px 12px",
      fontSize: "14px",
      cursor: "pointer"
    }}
    onClick={handleBedroomAction}
  >
    🛏️ Tidur
  </button>
)}
        </div>
        <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
          <StatusBar />
        </div>
        <InventorySystem />

        {gameOver && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #1a1a1a, #111)',
            backgroundSize: 'cover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #2d2d2d, #1f1f1f)',
              border: '4px solid #ff4444',
              borderRadius: '16px',
              padding: '40px 32px',
              textAlign: 'center',
              boxShadow: '0 0 30px rgba(255, 0, 0, 0.5)',
              animation: 'popupFade 0.4s ease',
              maxWidth: '400px',
              width: '90%',
              color: '#fff',
              fontFamily: "'Press Start 2P', monospace"
            }}>
              <h2 style={{
                fontSize: '20px',
                marginBottom: '24px',
                color: '#ffdddd',
                textShadow: '0 0 4px #ff4444',
              }}>
                🪦 GAME OVER
              </h2>
              <p style={{ marginBottom: '32px', fontSize: '12px', color: '#ccc' }}>
                Petualanganmu telah berakhir di hari ke-7.<br />Tapi semangatmu tak padam!
              </p>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  border: '2px solid #7f1d1d',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.2s ease',
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                🔁 Mulai Ulang
              </button>
            </div>
            <style>{`
              @keyframes popupFade {
                from {
                  opacity: 0;
                  transform: scale(0.8);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}</style>
          </div>
        )}
      </div>
    );
  }

  // --- TAVERN ---
  if (currentMap === "tavern") {
    const tavernZoom = 1.3;
    const tavernWidth = 514;
    const tavernHeight = 546;
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#222",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: `${tavernWidth}px`,
            height: `${tavernHeight}px`,
            transform: `scale(${tavernZoom})`,
            transformOrigin: "center center",
            position: "relative"
          }}
        >
          <img
            src={TavernImage}
            alt="Tavern Map"
            style={{
              width: `${tavernWidth}px`,
              height: `${tavernHeight}px`,
              objectFit: "cover",
              imageRendering: "pixelated",
              display: "block"
            }}
          />
          <CharacterMovement
            playerPosition={playerPos}
            setPlayerPosition={setPlayerPos}
            mapWidth={tavernWidth}
            mapHeight={tavernHeight}
            disabled={movementDisabled}
          />
           {/* Tombol makan di area meja */}
        {showEatButton && (
          <button
            style={{
              position: "absolute",
              left: tavernEatArea.x + 30,
              top: tavernEatArea.y + 10,
              zIndex: 20,
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              padding: "6px 12px",
              fontSize: "14px",
              cursor: "pointer"
            }}
            onClick={handleEatAction}
          >
            🍗 Makan
          </button>
        )}

        {/* Tombol kerja di depan orang */}
        {showWorkButton && (
          <button
            style={{
              position: "absolute",
              left: tavernWorkArea.x + 10,
              top: tavernWorkArea.y + 10,
              zIndex: 20,
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              padding: "6px 12px",
              fontSize: "14px",
              cursor: "pointer"
            }}
            onClick={handleWorkAction}
          >
            💼 Kerja
          </button>
        )}
        </div>
        <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
          <StatusBar />
        </div>
        <InventorySystem />

        {gameOver && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #1a1a1a, #111)',
            backgroundSize: 'cover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #2d2d2d, #1f1f1f)',
              border: '4px solid #ff4444',
              borderRadius: '16px',
              padding: '40px 32px',
              textAlign: 'center',
              boxShadow: '0 0 30px rgba(255, 0, 0, 0.5)',
              animation: 'popupFade 0.4s ease',
              maxWidth: '400px',
              width: '90%',
              color: '#fff',
              fontFamily: "'Press Start 2P', monospace"
            }}>
              <h2 style={{
                fontSize: '20px',
                marginBottom: '24px',
                color: '#ffdddd',
                textShadow: '0 0 4px #ff4444',
              }}>
                🪦 GAME OVER
              </h2>
              <p style={{ marginBottom: '32px', fontSize: '12px', color: '#ccc' }}>
                Petualanganmu telah berakhir di hari ke-7.<br />Tapi semangatmu tak padam!
              </p>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  border: '2px solid #7f1d1d',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.2s ease',
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                🔁 Mulai Ulang
              </button>
            </div>
            <style>{`
              @keyframes popupFade {
                from {
                  opacity: 0;
                  transform: scale(0.8);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}</style>
          </div>
        )}
      </div>
    );
  }

  // --- VILLAGE ---
  return (
    <div className="map-bg">
      <div className="map-wrapper">
        <div className="map-header">
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              Welcome to the Village, {playerName}!
            </h2>
            <p style={{ color: "#a7f3d0" }}>Village Map</p>
          </div>
        </div>

        <div ref={mapContainerRef} className="map-container" style={{ width: "600px", height: "450px" }}>
          <div
            style={{
              position: "absolute",
              transform: `translate(${-cameraPosition.x}px, ${-cameraPosition.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
              width: "600px",
              height: "450px",
            }}
          >
            <img
              src={MapImage}
              alt="Village Map"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                imageRendering: "pixelated",
                filter: "contrast(1.1) saturate(1.2)",
                userSelect: "none",
                pointerEvents: "none",
              }}
              draggable={false}
            />

            <CharacterMovement
              playerPosition={playerPos}
              setPlayerPosition={setPlayerPos}
              onPlayerMove={() => setFollowPlayer(true)}
              disabled={movementDisabled}
            />
          </div>

          <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 100 }}>
            <StatusBar />
          </div>

          <div className="minimap" style={{ width: "120px", height: "90px" }}>
            <img
              src={MapImage}
              alt="Minimap"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                imageRendering: "pixelated",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: `${(playerPos.x / 600) * 100}%`,
                top: `${(playerPos.y / 450) * 100}%`,
                width: "6px",
                height: "6px",
                backgroundColor: "#ef4444",
                borderRadius: "0px",
                border: "1px solid white",
                transform: "translate(-50%, -50%)",
                zIndex: 21,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: `${((cameraPosition.x / zoom + 300) / 600) * 100}%`,
                top: `${((cameraPosition.y / zoom + 225) / 450) * 100}%`,
                width: `${150 / zoom}px`,
                height: `${113 / zoom}px`,
                borderRadius: "0px",
                transform: "translate(-50%, -50%)",
                zIndex: 22,
                backgroundColor: "rgba(5, 150, 105, 0.1)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: `${(redDoorArea.x / 600) * 100}%`,
                top: `${(redDoorArea.y / 450) * 100}%`,
                width: `${(redDoorArea.width / 600) * 100}%`,
                height: `${(redDoorArea.height / 450) * 100}%`,
                backgroundColor: "rgba(255,0,0,0.3)",
                border: "1px solid red",
                pointerEvents: "none",
                zIndex: 30,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: `${(blueDoorArea.x / 600) * 100}%`,
                top: `${(blueDoorArea.y / 450) * 100}%`,
                width: `${(blueDoorArea.width / 600) * 100}%`,
                height: `${(blueDoorArea.height / 450) * 100}%`,
                backgroundColor: "rgba(0,0,255,0.3)",
                border: "1px solid blue",
                pointerEvents: "none",
                zIndex: 30,
              }}
            />
          </div>
        </div>
        <InventorySystem />

        {gameOver && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #1a1a1a, #111)',
            backgroundSize: 'cover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #2d2d2d, #1f1f1f)',
              border: '4px solid #ff4444',
              borderRadius: '16px',
              padding: '40px 32px',
              textAlign: 'center',
              boxShadow: '0 0 30px rgba(255, 0, 0, 0.5)',
              animation: 'popupFade 0.4s ease',
              maxWidth: '400px',
              width: '90%',
              color: '#fff',
              fontFamily: "'Press Start 2P', monospace"
            }}>
              <h2 style={{
                fontSize: '20px',
                marginBottom: '24px',
                color: '#ffdddd',
                textShadow: '0 0 4px #ff4444',
              }}>
                🪦 GAME OVER
              </h2>
              <p style={{ marginBottom: '32px', fontSize: '12px', color: '#ccc' }}>
                Petualanganmu telah berakhir di hari ke-7.<br />Tapi semangatmu tak padam!
              </p>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  border: '2px solid #7f1d1d',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.2s ease',
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                🔁 Mulai Ulang
              </button>
            </div>
            <style>{`
              @keyframes popupFade {
                from {
                  opacity: 0;
                  transform: scale(0.8);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;