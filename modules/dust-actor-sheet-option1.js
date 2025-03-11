import { ActorSheet } from "foundry.js"; // Adjust the import path as needed

export class DustActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["dust-system", "sheet", "actor"],
      template: "systems/dust-system/templates/actor/character-sheet-option1.hbs",
      width: 800,
      height: 600,
      resizable: true
    });
  }

  /** @override */
activateListeners(html) {
  super.activateListeners(html);

  // Configure Character Button
  html.find(".configure-character").click(() => {
    this.actor.configureCharacter();
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
    if (value > this.actor.system.aether.capacity) {
      ui.notifications.warn("Conserving Aether cannot exceed Capacity.");
      return;
    }

    // Update actor's conserving value
    await this.actor.update({ "system.aether.conserving": value });
    ui.notifications.info(`Conserving Aether updated to ${value}.`);
  });

  // Adjust Aether Supply
  html.find(".aether-supply-input").change(async (event) => {
    const value = parseInt(event.target.value) || 0;

    // Update actor's supply value
    await this.actor.update({ "system.aether.supply": value });
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

  // Light/Shadow Toggle
  html.find(".light-shadow-toggle").click(async (event) => {
    const icon = html.find(".toggle-icon");
    const currentMode = icon.data("mode");

    if (currentMode === "light") {
      // Switch to Shadow Mode
      icon.removeClass("fa-sun").addClass("fa-moon").data("mode", "shadow");
      html.addClass("shadow-mode").removeClass("light-mode"); // Adjust background styling
      ui.notifications.info("Switched to Shadow mode.");
    } else {
      // Switch to Light Mode
      icon.removeClass("fa-moon").addClass("fa-sun").data("mode", "light");
      html.addClass("light-mode").removeClass("shadow-mode"); // Adjust background styling
      ui.notifications.info("Switched to Light mode.");
    }

    // Optionally Highlight Active Specialty
    const actor = this.actor;
    if (currentMode === "light") {
      actor.update({ "system.shadowActiveSpclty.highlighted": false });
      actor.update({ "system.lightActiveSpclty.highlighted": true });
    } else {
      actor.update({ "system.lightActiveSpclty.highlighted": false });
      actor.update({ "system.shadowActiveSpclty.highlighted": true });
    }
  });

  // Roll for Resilience
  html.find(".clickable-resilience").click((event) => {
    const resilience = parseInt(event.currentTarget.dataset.resilience) || 0;
    const tempRes = parseInt(event.currentTarget.dataset.tempres) || 0;

    // Total dice to roll
    const totalDice = resilience + tempRes;

    // Perform the roll
    const roll = new Roll(`${totalDice}d8`).roll({ async: false });

    // Display roll result in chat
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: "Resilience Roll",
    });
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
  


  /**
 * Show a dialog box with the list of unassigned items.
 */
async showUnassignedInventory() {
  const unassignedItems = this.actor.getUnassignedItems(); // Fetch unassigned items

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
      async function getFeatureItemsFromCompendium() {
        // Get the compendium
        const compendium = game.packs.get("world.features"); // Replace "world.features" with the correct compendium name
        if (!compendium) {
          ui.notifications.error("Features compendium not found!");
          return [];
        }
      
        // Load all entries from the compendium
        const compendiumItems = await compendium.getDocuments();
      
        // Filter to include only feature items
        const features = compendiumItems
          .filter(item => item.type === "feature")
          .map(item => ({
            id: item.id,
            name: item.name,
            description: item.system.description
          }));
      
        return features;
      }
      
    
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
    
      // Step 2: Select Quirk
      const selectQuirk = async () => {
        const quirks = await game.packs.get("dust-system.quirks").getDocuments();
        const options = quirks.map(q => `<option value="${q.id}">${q.name}</option>`).join("");
    
        return new Promise((resolve, reject) => {
          new Dialog({
            title: "Select Quirk",
            content: `
              <p>Select a <strong>Quirk</strong>:</p>
              <form>
                <div class="form-group">
                  <label for="quirk">Quirk:</label>
                  <select id="quirk" name="quirk">${options}</select>
                </div>
              </form>
            `,
            buttons: {
              save: {
                label: "Save",
                callback: (html) => {
                  const quirkId = html.find("#quirk").val();
                  system.quirk = quirks.find(q => q.id === quirkId)?.toObject() || null;
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
    
      // Step 3: Select Drive
      const selectDrive = async () => {
        const drives = await game.packs.get("dust-system.drives").getDocuments();
        const options = drives.map(d => `<option value="${d.id}">${d.name}</option>`).join("");
    
        return new Promise((resolve, reject) => {
          new Dialog({
            title: "Select Drive",
            content: `
              <p>Select a <strong>Drive</strong>:</p>
              <form>
                <div class="form-group">
                  <label for="drive">Drive:</label>
                  <select id="drive" name="drive">${options}</select>
                </div>
              </form>
            `,
            buttons: {
              save: {
                label: "Save",
                callback: (html) => {
                  const driveId = html.find("#drive").val();
                  system.drive = drives.find(d => d.id === driveId)?.toObject() || null;
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
    
      // Step 4: Select Archetype
      const selectArchetype = async () => {
  // Predefined archetype choices
  const archetypeChoices = ["Warden", "Agent", "Professor", "Magi"];

  // Create dropdown options from the predefined choices
  const options = archetypeChoices.map(a => `<option value="${a}">${a}</option>`).join("");

  return new Promise((resolve, reject) => {
    new Dialog({
      title: "Select Archetype",
      content: `
        <p>Select an <strong>Archetype</strong> for this character:</p>
        <form>
          <div class="form-group">
            <label for="archetype">Archetype:</label>
            <select id="archetype" name="archetype">${options}</select>
          </div>
        </form>
      `,
      buttons: {
        save: {
          label: "Save",
          callback: (html) => {
            // Get the selected archetype
            const archetype = html.find("#archetype").val();

            // Save the archetype to the actor's system data
            system.archetype = { name: archetype, startingItems: [] }; // Set `startingItems` to be populated later based on archetype logic

            // Notify the user
            ui.notifications.info(`Archetype set to: ${archetype}`);
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

//Step 6: Pick initial Feature
const features = await getFeatureItemsFromCompendium();

// Handle case where no features are found
if (!features.length) {
  ui.notifications.warn("No features available for selection.");
  return null;
}

// Generate options for the dialog
const options = features
  .map(
    (feature, index) =>
      `<option value="${feature.id}">${feature.name} - ${feature.description}</option>`
  )
  .join("");

return new Promise((resolve, reject) => {
  new Dialog({
    title: "Select Initial Feature",
    content: `
      <p>Select a starting feature for your character:</p>
      <form>
        <div class="form-group">
          <label for="feature-select">Available Features:</label>
          <select id="feature-select">${options}</select>
        </div>
      </form>
    `,
    buttons: {
      save: {
        label: "Save",
        callback: (html) => {
          const selectedId = html.find("#feature-select").val();
          const selectedFeature = features.find(feature => feature.id === selectedId);
          resolve(selectedFeature);
        }
      },
      cancel: {
        label: "Cancel",
        callback: () => reject("Feature selection canceled.")
      }
    },
    default: "save"
  }).render(true);
});

try {
  const selectedFeature = await selectInitialFeature();
  if (selectedFeature) {
    const currentFeatures = actor.system.features || [];
    const newFeatures = [...currentFeatures, selectedFeature];
    await actor.update({ "system.features": newFeatures });
    ui.notifications.info(`Feature "${selectedFeature.name}" added to character.`);
  }
} catch (error) {
  console.warn(error);
}



    
      // Trigger the chain of dialogs
      try {
        await allocateNervePoints();
        await selectQuirk();
        await selectDrive();
        await selectArchetype();
        await distributeSkillPoints();
        await selectInitialFeature();
        ui.notifications.info("Character configuration complete!");
      } catch (error) {
        ui.notifications.warn("Character configuration canceled.");
      }
    }
  }    