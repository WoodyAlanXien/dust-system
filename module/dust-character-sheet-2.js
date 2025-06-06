export class DustActorSheet2 extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["dust-system", "sheet", "actor"],
      template: "systems/dust-system/templates/actor/character-sheet-2.hbs",
      width: 800,
      height: 600,
      resizable: true
    });
  }

  
/**
   * Set the active specialty.
   * @param {string} type - Either "light" or "shadow".
   */
async assignActiveSpclty(type) {
  if (type === "light") {
    await this.actor.update({
      "system.lightActiveSpclty.highlighted": true,
      "system.shadowActiveSpclty.highlighted": false
    });
    ui.notifications.info("Light Specialty assigned.");
  } else if (type === "shadow") {
    await this.actor.update({
      "system.lightActiveSpclty.highlighted": false,
      "system.shadowActiveSpclty.highlighted": true
    });
    ui.notifications.info("Shadow Specialty assigned.");
  } else {
    ui.notifications.warn("Invalid specialty type.");
  }
}
/**
* Triggers the skill roll by importing and executing `triggerSkillRoll.js`.
* @param {string} skillName - The name of the skill being rolled.
* @param {number} skillValue - The skill's value.
*/
async triggerSkillRoll(skillName, skillValue) {
try {
  const rollModule = await import('./path/to/triggerSkillRoll.js'); // Update the path as needed
  rollModule.default(skillName, skillValue, this.actor); // Pass the actor for context if needed
} catch (error) {
  console.error("Error triggering skill roll:", error);
  ui.notifications.error("Failed to roll the skill. Check the console for details.");
}
}
  
//** Shows Inventory   */
async showInventory() {
  const items = this.actor.items.map(item => `
    <li>
      ${item.name}
      <i class="fas fa-trash inventory-trash" data-item-id="${item.id}" title="Remove ${item.name} from Inventory"></i>
    </li>
  `).join("");

  // Generate content for dialog
  const content = `
    <p>View full Inventory:</p>
    <ul>
      ${items}
    </ul>
  `;

  // Create the dialog with a render callback for event binding
  new Dialog({
    title: "Inventory",
    content: content,
    buttons: {
      close: {
        label: "Close"
      }
    },
    default: "close",
    render: (html) => {
      // Bind the click event for the trash icons
      html.find(".inventory-trash").click(async (event) => {
        const itemId = event.currentTarget.dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) {
          await item.delete();
          ui.notifications.info(`${item.name} removed from Inventory.`);
          this.render(); // Refresh the sheet if needed
        } else {
          ui.notifications.warn("Item not found.");
        }
      });
    }
  }).render(true);
}

  /**
 * Show a dialog box with the list of unassigned items.
 */
async showUnassignedInventory() {
  const unassignedItems = this.actor.items.filter(item => !item.system.isAssigned); // Fetch unassigned items

  // Generate content for the dialog
  const content = `
    <p>Select an item to assign to your Loadout:</p>
    <ul>
      ${unassignedItems.map(item => `
        <li>
          <strong>${item.name}</strong>
          <button class="assign-item" data-item-id="${item.id}" aria-label="Assign ${item.name} to Loadout">Assign</button>
        </li>
      `).join("")}
    </ul>
  `;

  // Create the dialog
  new Dialog({
    title: "Unassigned Inventory",
    content: content,
    buttons: {
      close: {
        label: "Close"
      }
    },
    default: "close",
    render: (html) => {
      // Add event listeners for assigning items
      html.find(".assign-item").click(async (event) => {
        const itemId = event.currentTarget.dataset.itemId;
        const item = this.actor.items.get(itemId);

        if (item) {
          // Assign the item to the loadout
          await item.update({ "system.isAssigned": true }); // Mark item as assigned
          ui.notifications.info(`${item.name} has been added to your Loadout.`);

          // Refresh the sheet to show changes
          this.render();
        }
      });
    }
  }).render(true);
}

async updateActorAbilities() {
  const archetypeItem = this.items.find(item => item.type === "archetype");

  if (archetypeItem) {
    const abilities = archetypeItem.system.abilities || [];
    await this.update({ "system.abilities": abilities });
  } else {
    await this.update({ "system.abilities": [] }); // No abilities if no archetype
  }
}



    
    async configureCharacter() {
      const system = this.system;
      
      
    
      // Step 1: Allocate Nerve Points
      const allocateNervePoints = () => {
        return new Promise((resolve, reject) => {
          new Dialog({
            title: "Allocate Nerve Points",
            content: `
              <p>You have 9 nerve points to allocate among the following attributes:</p>
              <form>
                <div class="form-group">
                  <label for="relentless">Relentless:</label>
                  <input type="number" id="relentless" name="relentless" min="0" max="9" value="${system.relentless.nerveMax}" />
                </div>
                <div class="form-group">
                  <label for="elusive">Elusive:</label>
                  <input type="number" id="elusive" name="elusive" min="0" max="9" value="${system.elusive.nerveMax}" />
                </div>
                <div class="form-group">
                  <label for="charming">Charming:</label>
                  <input type="number" id="charming" name="charming" min="0" max="9" value="${system.charming.nerveMax}" />
                </div>
                <div class="form-group">
                  <label for="discreet">Discreet:</label>
                  <input type="number" id="discreet" name="discreet" min="0" max="9" value="${system.discreet.nerveMax}" />
                </div>
              </form>
            `,
            buttons: {
              save: {
                label: "Save",
                callback: (html) => {
                  const relentless = parseInt(html.find("#relentless").val()) || 0;
                  const elusive = parseInt(html.find("#elusive").val()) || 0;
                  const charming = parseInt(html.find("#charming").val()) || 0;
                  const discreet = parseInt(html.find("#discreet").val()) || 0;
    
                  // Validate total
                  const total = relentless + elusive + charming + discreet;
                  if (total > 9) {
                    ui.notifications.error("You cannot allocate more than 9 nerve points.");
                    return reject();
                  }
    
                  // Save to system
                  system.relentless.nerveMax = relentless;
                  system.elusive.nerveMax = elusive;
                  system.charming.nerveMax = charming;
                  system.discreet.nerveMax = discreet;
    
                  resolve();
                }
              },
              cancel: {
                label: "Cancel",
                callback: () => reject()
              }
            },
            default: "save"
          }).render(true);
        });
      };

// Step 5: Distribute Skill Points
const distributeSkillPoints = () => {
  return new Promise((resolve, reject) => {
    const maxPoints = 3;
    const maxPerSkill = 3;

    // Render the dialog
    new Dialog({
      title: "Distribute Skill Points",
      content: `
        <p>You have ${maxPoints} points to allocate among the following skills:</p>
        <form>
          ${Object.keys(system.skills).map(skill => `
            <div class="form-group">
              <label for="${skill}">${skill.charAt(0).toUpperCase() + skill.slice(1)}:</label>
              <input type="number" id="${skill}" name="${skill}" value="${system.skills[skill]}" min="0" max="${maxPerSkill}" />
            </div>
          `).join("")}
        </form>
      `,
      buttons: {
        save: {
          label: "Save",
          callback: (html) => {
            let totalPoints = 0;
            const updatedSkills = {};

            // Gather input values and calculate total points
            Object.keys(system.skills).forEach(skill => {
              const value = parseInt(html.find(`#${skill}`).val()) || 0;
              if (value > maxPerSkill) {
                ui.notifications.error(`${skill.charAt(0).toUpperCase() + skill.slice(1)} cannot exceed ${maxPerSkill} points.`);
                return;
              }
              updatedSkills[skill] = value;
              totalPoints += value;
            });

            // Validate total points
            if (totalPoints > maxPoints) {
              ui.notifications.error(`You can only allocate a maximum of ${maxPoints} points.`);
              return reject();
            }

            // Update skills in the system
            system.skills = updatedSkills;
            ui.notifications.info("Skill points successfully distributed.");
            resolve();
          }
        },
        cancel: {
          label: "Cancel",
          callback: () => reject()
        }
      },
      default: "save"
    }).render(true);
  });
};

   
      // Trigger the chain of dialogs
      try {
        await allocateNervePoints();

        await distributeSkillPoints();
        ui.notifications.info("Character configuration complete!");
      } catch (error) {
        ui.notifications.warn("Character configuration canceled.");
      }
    }
    /** @override */
activateListeners(html) {
  super.activateListeners(html);

  // Add these within activateListeners(html) after calling super.activateListeners(html);

html.find('.aether-conserving-decrement').click(async (event) => {
  // Get current conserving value
  let current = this.actor.system.attributes.aether.conserved;
  if (current > 0) {
    await this.actor.update({ "system.attributes.aether.conserved": current - 1 });
  } else {
    ui.notifications.warn("Conserving Aether is already at 0.");
  }
});

html.find('.aether-conserving-increment').click(async (event) => {
  // Get current conserving value and capacity
  let current = this.actor.system.attributes.aether.conserved;
  let capacity = this.actor.system.attributes.aether.capacity;
  if (current < capacity) {
    await this.actor.update({ "system.attributes.aether.conserved": current + 1 });
  } else {
    ui.notifications.warn("Conserving Aether cannot exceed Capacity.");
  }
});

html.find('.aether-supply-decrement').click(async (event) => {
  // Get current supply value
  let current = this.actor.system.attributes.aether.supply;
  if (current > 0) {
    await this.actor.update({ "system.attributes.aether.supply": current - 1 });
  } else {
    ui.notifications.warn("Aether Supply is already at 0.");
  }
});

html.find('.aether-supply-increment').click(async (event) => {
  // Increase supply value by 1 (no explicit maximum given)
  let current = this.actor.system.attributes.aether.supply;
  await this.actor.update({ "system.attributes.aether.supply": current + 1 });
});

   // Listener for unassigning a specialty item (both light and shadow)
   html.find(".unassign-specialty").click(async (event) => {
    const itemId = event.currentTarget.dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) {
      await item.update({ "system.isAssigned": false });
      ui.notifications.info(`${item.name} has been unassigned.`);
      this.render();
    }
  });

  // Listener for assigning specialties remains the same:
  html.find(".assign-specialty").click((event) => {
    const type = event.currentTarget.dataset.type;
    this.actor.assignActiveSpclty(type); // Calls your Actor method for assignment
  });

  // Configure Character Button
  html.find(".configure-character").click(() => {
    this.configureCharacter();
  });

 
    // Trauma controls
    html.find('.trauma-decrement').click(async (event) => {
      // Decrease trauma value by one, ensuring a minimum of 0
      let current = this.actor.system.attributes.trauma;
      await this.actor.update({"system.attributes.trauma": Math.max(current - 1, 0)});
    });
    html.find('.trauma-increment').click(async (event) => {
      // Increase trauma value by one, ensuring a maximum of 4
      let current = this.actor.system.attributes.trauma;
      await this.actor.update({"system.attributes.trauma": Math.min(current + 1, 4)});
    });
    
    // Stress controls
    html.find('.stress-decrement').click(async (event) => {
      let current = this.actor.system.attributes.stress;
      await this.actor.update({"system.attributes.stress": Math.max(current - 1, 0)});
    });
    html.find('.stress-increment').click(async (event) => {
      // Get current stress and compute new stress value
      const currentStress = this.actor.system.attributes.stress;
      const newStress = Math.min(currentStress + 1, 20);
      await this.actor.update({"system.attributes.stress": newStress});
      
      // If new stress exceeds or equals stressTolerance, reduce corruption by 1 (min 0)
      const stressTolerance = this.actor.system.attributes.stressTolerance;
      if(newStress >= stressTolerance) {
        const currentCorruption = this.actor.system.attributes.corruption;
        const newCorruption = Math.max(currentCorruption - 1, 20);
        await this.actor.update({"system.attributes.corruption": newCorruption});
      }
    });
    
    // Corruption controls
    html.find('.corruption-decrement').click(async (event) => {
      let current = this.actor.system.attributes.corruption;
      await this.actor.update({"system.attributes.corruption": Math.min(current + 1, 20)});
    });
    html.find('.corruption-increment').click(async (event) => {
      let current = this.actor.system.attributes.corruption;
      await this.actor.update({"system.attributes.corruption": Math.max(current - 1, 0)});
    });

  // Change Character Image
  html.find(".image-clickable").click(async () => {
    const newImage = await new FilePicker({
      type: "image",
      current: this.actor.img,
      callback: (path) => {
        this.actor.update({ img: path }); // Update the character image
      }
    }).render(true);
  });

  // Adjust Conserving Aether
  html.find(".aether-conserving-input").change(async (event) => {
    const value = parseInt(event.target.value) || 0;

    // Ensure conserving does not exceed capacity
    if (value > this.actor.system.attributes.aether.capacity) {
      ui.notifications.warn("Conserving Aether cannot exceed Capacity.");
      return;
    }

    // Update actor's conserving value
    await this.actor.update({ "system.attributes.aether.consered": value });
    ui.notifications.info(`Conserving Aether updated to ${value}.`);
  });

  // Adjust Aether Supply
  html.find(".aether-supply-input").change(async (event) => {
    const value = parseInt(event.target.value) || 0;

    // Update actor's supply value
    await this.actor.update({ "system.attributes.aether.supply": value });
    ui.notifications.info(`Aether Supply updated to ${value}.`);
  });

  // Listener for assigning light or shadow specialties
  html.find(".assign-specialty").click((event) => {
    const type = event.currentTarget.dataset.type;
    this.actor.assignActiveSpclty(type); // Call the assignment method
  });

  (html);

  // Listener for purchasing upgrades (Font Awesome icon)
  html.find(".clickable-icon").click(() => {
    this.actor.purchaseUpgradeItem("dust-system.upgrades"); // Replace with the correct compendium name
  });

  (html);
// Listener for displaying full inventory with a clickable box icon
html.find(".fas.fa-box").click(() => {
 this.showInventory(); // Call the showInventory method
});
  // Open Unassigned Inventory Modal
  html.find(".inventory-icon").click(() => {
    this.showUnassignedInventory();
  });

  // Remove Item from Loadout
  html.find(".remove-item").click(async (event) => {
    const itemId = event.currentTarget.dataset.itemId;
    const item = this.actor.items.get(itemId);

    if (item) {
      await item.update({ "system.isAssigned": false }); // Mark as unassigned
      ui.notifications.info(`${item.name} removed from Loadout.`);
    }
  });

  // Set the initial mode based on actor.system.mode
  if (this.actor.system.mode === 'light') {
    html.addClass("light-mode").removeClass("shadow-mode");
    html.find(".toggle-icon").removeClass("fa-moon").addClass("fa-sun").data("mode", "light");
  } else {
    html.addClass("shadow-mode").removeClass("light-mode");
    html.find(".toggle-icon").removeClass("fa-sun").addClass("fa-moon").data("mode", "shadow");
  }

  // Light/Shadow Toggle
  html.find(".light-shadow-toggle").click(async (event) => {
    const icon = html.find(".toggle-icon");
    const currentMode = icon.data("mode");
  
    if (currentMode === "light") {
      // Switch to Shadow Mode
      icon.removeClass("fa-sun").addClass("fa-moon").data("mode", "shadow");
      html.addClass("shadow-mode").removeClass("light-mode");
      ui.notifications.info("Switched to Shadow mode.");
      // Update the actor's mode and specialty highlight flags for Shadow mode
      await this.actor.update({
        "system.mode": "shadow",
        "system.lightActiveSpclty.highlighted": false,
        "system.shadowActiveSpclty.highlighted": true
      });
    } else {
      // Switch to Light Mode
      icon.removeClass("fa-moon").addClass("fa-sun").data("mode", "light");
      html.addClass("light-mode").removeClass("shadow-mode");
      ui.notifications.info("Switched to Light mode.");
      // Update the actor's mode and specialty highlight flags for Light mode
      await this.actor.update({
        "system.mode": "light",
        "system.lightActiveSpclty.highlighted": true,
        "system.shadowActiveSpclty.highlighted": false
      });
    }
  });

  // Roll for Resilience
  html.find(".clickable-resilience").click(async (event) => {
    const resilience = parseInt(event.currentTarget.dataset.resilience) || 0;
    const tempRes = parseInt(event.currentTarget.dataset.tempres) || 0;
    const totalDice = resilience + tempRes;
    
    // If there are no dice to roll, show a notification and exit.
    if (totalDice < 1) {
      ui.notifications.warn("No dice to roll!");
      return;
    }
    
    try {
      // Create and evaluate the roll instance while only keeping the highest result
      const roll = await new Roll(`${totalDice}d8kh1`).evaluate({ async: true });
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: "Resilience Roll (highest die kept)"
      });
    } catch (error) {
      console.error(error);
      ui.notifications.error("Failed to roll dice. Check the console for details.");
    }
  });
// Handle skill icon clicks
html.find(".clickable-skill").click(async (event) => {
  const skillElement = $(event.currentTarget).closest(".skill-icon-container");
  const skillName = skillElement.data("skill");
  const skillValue = parseInt(skillElement.data("value"), 10);

  // Call the triggerSkillRoll.js function
  if (skillName && skillValue >= 0) {
    await this.triggerSkillRoll(skillName, skillValue);
  } else {
    ui.notifications.error("Invalid skill data. Please check the skill configuration.");
  }
});
}
  }