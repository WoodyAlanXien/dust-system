/**
 * Define the DustActor class.
 * This extends FoundryVTT's base Actor class with additional functionality specific to the DUST system.
 */
export class DustActor extends Actor {
    /**
     * Prepare data for rendering the actor's sheet and system interactions.
     */
    prepareData() {
      super.prepareData();
  
      // Define actor and system for convenience
      const actor = this;
      const system = this.system;
  
      // Prepare common data for all actor types
      this._prepareBaseActorData(actor, system);
  
      // Prepare actor-specific data
      if (actor.type === "character") this._prepareCharacterData(system);
    }
  
    /**
     * Prepare common actor data for all types.
     * @param {Object} actor The actor instance.
     * @param {Object} system The system data for the actor.
     */
    _prepareBaseActorData(actor, system) {

        // Reset abilities
  system.abilities = [];

  // Get the archetype item from the actor's inventory
  const archetypeItem = actor.items.find(item => item.type === "archetype");

  if (archetypeItem) {
    // Assign abilities from the archetype item to the actor's system
    system.abilities = archetypeItem.system.abilities || [];
  }

    // Set default starting values
        system.combatApTotal = 1;
        system.genApTotal = 2;
        system.tempRes = 0;
        system.tempNerve = 0;
        system.stress = 0;
        system.corruption = 0;
        system.taruma = 0;
        system.combatApAvail = system.combatApTotal;
        system.genApAvail = system.genApTotal;
        system.unspentXp = 0;
        system.cumulativeXp = 0;
        system.aetherCap = 3;
        system.aetherConserve = 3;
        system.aetherSupply = 0;
        system.armorRating = 0;

         // Ensure available AP does not exceed total AP
  system.combatApAvail = Math.min(system.combatApAvail, system.combatApTotal);
  system.genApAvail = Math.min(system.genApAvail, system.genApTotal);

        
            // Initialize skills
            system.skills = {
              clash: 0,
              push: 0,
              menace: 0,
              maneuver: 0,
              control: 0,
              stealth: 0,
              sense: 0,
              influence: 0,
              deceive: 0,
              notice: 0,
              focus: 0,
              invoke: 0,
            };
          
            // Other initialization logic...
         
          
    // Initialize bonds with default values
        system.bonds = {
        bond1: null,
        bond1Lvl: 0,
        bond1Health: 0,
        bond2: null,
        bond2Lvl: 0,
        bond2Health: 0,
        bond3: null,
        bond3Lvl: 0,
        bond3Health: 0
        };
      // Calculate resilience
        system.resilience =
        Math.floor(system.relentless.nerveMax / 3) +
        Math.floor(system.elusive.nerveMax / 3) +
        Math.floor(system.charming.nerveMax / 3) +
        Math.floor(system.discreet.nerveMax / 3);
   
    // Determine level based on cumulative XP thresholds
        const xpThresholds = [1, 3, 8, 15, 24, 35, 48, 63, 80, 99, 120];
        const cumulativeXp = system.cumulativeXp;

  // Check for level 0 to level 11
        let level = xpThresholds.findIndex(xp => cumulativeXp < xp);
        if (level === -1) level = xpThresholds.length; // Catch cases beyond level 11

  // Handle levels beyond XP 120 dynamically
        if (cumulativeXp >= 120) {
        level = 11 + Math.floor((cumulativeXp - 120) / 25);
        }

        system.level = level;
        }
        
        async gainExperience(xpAmount) {
            this.system.cumulativeXp += xpAmount;
          
            // Recalculate level
            const xpThresholds = [1, 3, 8, 15, 24, 35, 48, 63, 80, 99, 120];
            let level = xpThresholds.findIndex(xp => this.system.cumulativeXp < xp);
            if (this.system.cumulativeXp >= 120) {
              level = 12 + Math.floor((this.system.cumulativeXp - 120) / 25);
            }
          
            this.system.level = level;
          
            // Notify or update the UI
            ui.notifications.info(`You gained ${xpAmount} XP! Your level is now ${level}.`);
          }
          
    /**
     * Prompt the user to roll a 1d8 to set stressTolerance during actor configuration.
     */
    async rollStressTolerance() {
      const system = this.system;
  
      // Show a dialog box to prompt the user to roll
      new Dialog({
        title: "Roll Stress Tolerance",
        content: `<p>Roll a 1d8 and add the current resilience (${system.resilience}) to determine your Stress Tolerance.</p>`,
        buttons: {
          roll: {
            label: "Roll 1d8",
            callback: async () => {
              const roll = new Roll("1d8");
              await roll.roll({ async: true }); // Execute the roll asynchronously
  
              // Add resilience to the roll result
              const result = roll.total + system.resilience;
  
              // Set the result in the system data
              system.stressTolerance = result;
  
              // Display the roll and result in chat
              roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this }),
                flavor: `Rolling Stress Tolerance: 1d8 + Resilience (${system.resilience}) = ${result}`
              });
            }
          },
          cancel: {
            label: "Cancel"
          }
        },
        default: "roll"
      }).render(true);
    }

    async assignBond(bondNumber) {
        const system = this.system;
      
        // Get all actors from the world
        const worldActors = game.actors.contents.filter(a => a.type === "character"); // Filter by type if needed
        const actorOptions = worldActors.map(a => `<option value="${a.id}">${a.name}</option>`).join("");
      
        // Show a dialog to select an actor for the bond
        new Dialog({
          title: `Assign Actor to Bond ${bondNumber}`,
          content: `
            <p>Select an actor from the world to assign to Bond ${bondNumber}:</p>
            <form>
              <div class="form-group">
                <label for="bond-actor">Actor:</label>
                <select id="bond-actor" name="bond-actor">${actorOptions}</select>
              </div>
            </form>
          `,
          buttons: {
            save: {
              label: "Save",
              callback: (html) => {
                const actorId = html.find("#bond-actor").val();
                const selectedActor = game.actors.get(actorId);
      
                // Assign the bond based on the selected actor
                system[`bond${bondNumber}`] = selectedActor ? selectedActor.toObject() : null;
                system[`bond${bondNumber}Lvl`] = 0; // Reset bond level
                system[`bond${bondNumber}Health`] = 0; // Reset bond health
      
                // Notify the user
                if (selectedActor) {
                  ui.notifications.info(`Bond ${bondNumber} set to: ${selectedActor.name}`);
                } else {
                  ui.notifications.error(`Failed to assign Bond ${bondNumber}.`);
                }
              }
            },
            cancel: {
              label: "Cancel"
            }
          },
          default: "save"
        }).render(true);
      }
      
/**
 * Updates stress, corruption, and trauma based on game mechanics.
 * Caps stress and corruption at 20, and trauma at 4 (4 trauma = death).
 * @param {number} stressGain - The amount of stress being added.
 */
async handleStress(stressGain) {
    const system = this.system;
  
    // Increase stress
    system.stress = (system.stress || 0) + stressGain;
  
    // Cap stress at 20
    if (system.stress > 20) {
      system.stress = 20;
      ui.notifications.info(`${this.name}'s stress is capped at 20.`);
    }
  
    // Check if stress exceeds tolerance and handle corruption
    if (system.stress > system.stressTolerance) {
      system.corruption = (system.corruption || 0) + 1;
  
      // Cap corruption at 20
      if (system.corruption > 20) {
        system.corruption = 20;
        ui.notifications.info(`${this.name}'s corruption is capped at 20.`);
      } else {
        ui.notifications.info(`${this.name}'s stress exceeded their tolerance! Corruption increased to ${system.corruption}.`);
      }
  
      // Check for trauma if new corruption + stress > 20
      if (system.corruption + system.stress > 20) {
        system.trauma = (system.trauma || 0) + 1;
  
        // Cap trauma at 4
        if (system.trauma > 4) {
          system.trauma = 4; // Ensure trauma doesn't exceed cap
        }
  
        // Notify player if trauma reaches lethal level
        if (system.trauma === 4) {
          ui.notifications.error(`${this.name} has suffered 4 trauma and is killed!`);
        } else {
          ui.notifications.warn(`${this.name} gains 1 trauma (${system.trauma}/4).`);
        }
      }
    }
  
    // Update the actor's system data
    await this.update({
      "system.stress": system.stress,
      "system.corruption": system.corruption,
      "system.trauma": system.trauma
    });
  }
    /**
 * Assign an active specialty for light or shadow from available specialties.
 * @param {string} type - The type of specialty to assign ("light" or "shadow").
 */
async assignActiveSpclty(type) {
    const system = this.system;
  
    // Ensure the type is valid
    if (!["light", "shadow"].includes(type)) {
      ui.notifications.error(`Invalid specialty type: ${type}`);
      return;
    }
  
    // Check if the actor is in combat
    if (game.combat?.combatants.some(c => c.actorId === this.id)) {
      ui.notifications.error(`You cannot change ${type} active specialty during combat.`);
      return;
    }
  
    // Get the available specialties (items the character owns)
    const availSpclty = this.items.filter(item => item.type === "specialty");
  
    // Create dropdown options
    const options = availSpclty
      .map(item => `<option value="${item.id}">${item.name}</option>`)
      .join("");
  
    // Prompt the user to select a specialty
    new Dialog({
      title: `Assign Active ${type.charAt(0).toUpperCase() + type.slice(1)} Specialty`,
      content: `
        <p>Select a specialty to assign as the active ${type} specialty:</p>
        <form>
          <div class="form-group">
            <label for="${type}-specialty">Available Specialties:</label>
            <select id="${type}-specialty" name="${type}-specialty">
              ${options}
            </select>
          </div>
        </form>
      `,
      buttons: {
        save: {
          label: "Save",
          callback: (html) => {
            const selectedId = html.find(`#${type}-specialty`).val();
            const selectedItem = availSpclty.find(item => item.id === selectedId);
  
            if (selectedItem) {
              // Update the active specialty for the given type
              system[`${type}ActiveSpclty`] = selectedItem.toObject();
  
              // Notify the user
              ui.notifications.info(`Active ${type} specialty set to: ${selectedItem.name}`);
            } else {
              ui.notifications.error(`Failed to assign active ${type} specialty.`);
            }
          }
        },
        cancel: {
          label: "Cancel"
        }
      },
      default: "save"
    }).render(true);
  }

  /**
 * Purchases an upgrade item from a world compendium using unspent XP.
 * @param {string} compendiumName - The name of the compendium containing the items.
 */
async purchaseUpgradeItem(compendiumName) {
    const system = this.system;
  
    // Ensure the actor has unspent XP
    if (system.unspentXp <= 0) {
      ui.notifications.error("You do not have enough unspent XP to purchase upgrades.");
      return;
    }
  
    // Fetch items from the specified compendium
    const compendium = game.packs.get(compendiumName);
    if (!compendium) {
      ui.notifications.error(`Compendium '${compendiumName}' not found.`);
      return;
    }
  
    const items = await compendium.getDocuments();
  
    // Create options for available items, showing their name and cost
    const itemOptions = items.map(item => {
      const cost = item.system.cost || 0; // Assume the cost is stored in item.system.cost
      return `<option value="${item.id}" data-cost="${cost}">${item.name} (Cost: ${cost} XP)</option>`;
    }).join("");
  
    // Show a dialog to let the user select an item to purchase
    new Dialog({
      title: "Purchase Upgrade Item",
      content: `
        <p>Select an upgrade item to purchase with your unspent XP:</p>
        <form>
          <div class="form-group">
            <label for="upgrade-item">Available Items:</label>
            <select id="upgrade-item" name="upgrade-item">${itemOptions}</select>
          </div>
        </form>
      `,
      buttons: {
        purchase: {
          label: "Purchase",
          callback: async (html) => {
            const selectedId = html.find("#upgrade-item").val();
            const selectedItem = items.find(item => item.id === selectedId);
            const itemCost = parseInt(html.find("#upgrade-item option:selected").data("cost"));
  
            // Check if the user has enough XP
            if (system.unspentXp < itemCost) {
              ui.notifications.error(`You do not have enough XP to purchase ${selectedItem.name}.`);
              return;
            }
  
            // Deduct XP and add the item to the actor's inventory
            system.unspentXp -= itemCost;
            await this.update({ "system.unspentXp": system.unspentXp });
  
            // Add the item to the actor's inventory
            await this.createEmbeddedDocuments("Item", [selectedItem.toObject()]);
  
            // Notify the user
            ui.notifications.info(`You purchased ${selectedItem.name} for ${itemCost} XP!`);
          }
        },
        cancel: {
          label: "Cancel"
        }
      },
      default: "purchase"
    }).render(true);
  }
  getLoadoutItems() {
    return this.items.filter(item => item.system.isAssigned);
  }
  
  getUnassignedItems() {
    return this.items.filter(item => !item.system.isAssigned);
  }
  
  
  
  }

  Hooks.on("endCombatRound", async (combat) => {
    for (const combatant of combat.combatants) {
      const actor = combatant.actor;
  
      // Reset AP values to maximum totals
      await actor.update({
        "system.genApAvail": actor.system.genApTotal,
        "system.combatApAvail": actor.system.combatApTotal
      });
    }
  
    ui.notifications.info("Action Points have been reset for all players.");
  });
  
  async function spendGenAPForMovement(actor) {
    const genAp = actor.system.genApAvail;
  
    if (genAp <= 0) {
      ui.notifications.warn("You do not have enough general AP to move.");
      return false;
    }
  
    // Deduct 1 general AP for movement
    await actor.update({ "system.genApAvail": genAp - 1 });
    ui.notifications.info(`${actor.name} moved 30 feet, 1 General AP spent.`);
    return true;
  }
  
  async function spendCombatAPForAttack(actor) {
    const combatAp = actor.system.combatApAvail;
  
    if (combatAp <= 0) {
      ui.notifications.warn("You do not have enough combat AP to attack.");
      return false;
    }
  
    // Deduct 1 combat AP for the attack
    await actor.update({ "system.combatApAvail": combatAp - 1 });
    ui.notifications.info(`${actor.name} performed an attack, 1 Combat AP spent.`);
    return true;
  }
  
  async function useAbilityOrFeature(actor, ability) {
    const genAp = actor.system.genApAvail;
    const combatAp = actor.system.combatApAvail;
    const cost = ability.system.cost || { genAp: 0, combatAp: 0 };
  
    // Ensure enough AP is available
    if (cost.genAp > genAp || cost.combatAp > combatAp) {
      ui.notifications.warn("Not enough action points to use this ability.");
      return false;
    }
  
    // Deduct AP costs
    await actor.update({
      "system.genApAvail": genAp - cost.genAp,
      "system.combatApAvail": combatAp - cost.combatAp
    });
  
    ui.notifications.info(`${actor.name} used ${ability.name}, spending ${cost.genAp} General AP and ${cost.combatAp} Combat AP.`);
    return true;
  }
  