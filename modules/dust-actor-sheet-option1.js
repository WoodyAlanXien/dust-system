import { ActorSheet } from "foundry.js"; // Adjust the import path as needed

export class DustActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["dust-system", "sheet", "actor"],
      template: "systems/dust-system/templates/actor/character-sheet-option1.hbs",
      width: 800,
      height: 600,
      resizable: true,
    });
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Configure Character Button
    html.find(".configure-character").click(() => this.actor.configureCharacter());

    // Change Character Image
    html.find(".image-clickable").click(async () => {
      const newImage = await new FilePicker({
        type: "image",
        current: this.actor.img,
        callback: (path) => this.actor.update({ img: path }),
      }).render(true);
    });

    // Adjust Conserving Aether
    html.find(".aether-conserving-input").change(this._onAetherConservingChange.bind(this));

    // Adjust Aether Supply
    html.find(".aether-supply-input").change(this._onAetherSupplyChange.bind(this));

    // Listener for assigning light or shadow specialties
    html.find(".assign-specialty").click(this._onAssignSpecialtyClick.bind(this));

    // Listener for purchasing upgrades
    html.find(".clickable-icon").click(() => this.actor.purchaseUpgradeItem("dust-system.upgrades"));

    // Open Unassigned Inventory Modal
    html.find(".inventory-icon").click(() => this.showUnassignedInventory());

    // Remove Item from Loadout
    html.find(".remove-item").click(this._onRemoveItemClick.bind(this));

    // Light/Shadow Toggle
    html.find(".light-shadow-toggle").click(this._onLightShadowToggleClick.bind(this));

    // Roll for Resilience
    html.find(".clickable-resilience").click(this._onResilienceRollClick.bind(this));

    // Handle skill icon clicks
    html.find(".clickable-skill").click(this._onSkillIconClick.bind(this));
  }

  async _onAetherConservingChange(event) {
    const value = parseInt(event.target.value) || 0;
    if (value > this.actor.system.aether.capacity) {
      ui.notifications.warn("Conserving Aether cannot exceed Capacity.");
      return;
    }
    await this.actor.update({ "system.aether.conserving": value });
    ui.notifications.info(`Conserving Aether updated to ${value}.`);
  }

  async _onAetherSupplyChange(event) {
    const value = parseInt(event.target.value) || 0;
    await this.actor.update({ "system.aether.supply": value });
    ui.notifications.info(`Aether Supply updated to ${value}.`);
  }

  _onAssignSpecialtyClick(event) {
    const type = event.currentTarget.dataset.type;
    this.actor.assignActiveSpclty(type);
  }

  async _onRemoveItemClick(event) {
    const itemId = event.currentTarget.dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) {
      await item.update({ "system.isAssigned": false });
      ui.notifications.info(`${item.name} removed from Loadout.`);
    }
  }

  async _onLightShadowToggleClick(event) {
    const icon = html.find(".toggle-icon");
    const currentMode = icon.data("mode");

    if (currentMode === "light") {
      icon.removeClass("fa-sun").addClass("fa-moon").data("mode", "shadow");
      html.addClass("shadow-mode").removeClass("light-mode");
      ui.notifications.info("Switched to Shadow mode.");
    } else {
      icon.removeClass("fa-moon").addClass("fa-sun").data("mode", "light");
      html.addClass("light-mode").removeClass("shadow-mode");
      ui.notifications.info("Switched to Light mode.");
    }

    const actor = this.actor;
    if (currentMode === "light") {
      actor.update({ "system.shadowActiveSpclty.highlighted": false });
      actor.update({ "system.lightActiveSpclty.highlighted": true });
    } else {
      actor.update({ "system.lightActiveSpclty.highlighted": false });
      actor.update({ "system.shadowActiveSpclty.highlighted": true });
    }
  }

  _onResilienceRollClick(event) {
    const resilience = parseInt(event.currentTarget.dataset.resilience) || 0;
    const tempRes = parseInt(event.currentTarget.dataset.tempres) || 0;
    const totalDice = resilience + tempRes;
    const roll = new Roll(`${totalDice}d8`).roll({ async: false });

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: "Resilience Roll",
    });
  }

  async _onSkillIconClick(event) {
    const skillElement = $(event.currentTarget).closest(".skill-icon-container");
    const skillName = skillElement.data("skill");
    const skillValue = parseInt(skillElement.data("value"), 10);

    if (skillName && skillValue >= 0) {
      await this.triggerSkillRoll(skillName, skillValue);
    } else {
      ui.notifications.error("Invalid skill data. Please check the skill configuration.");
    }
  }

  async triggerSkillRoll(skillName, skillValue) {
    try {
      const rollModule = await import('./path/to/triggerSkillRoll.js');
      rollModule.default(skillName, skillValue, this.actor);
    } catch (error) {
      console.error("Error triggering skill roll:", error);
      ui.notifications.error("Failed to roll the skill. Check the console for details.");
    }
  }

  /**
   * Show a dialog box with the list of unassigned items.
   */
  async showUnassignedInventory() {
    const unassignedItems = this.actor.getUnassignedItems();

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

    new Dialog({
      title: "Unassigned Inventory",
      content: content,
      buttons: {
        close: { label: "Close" }
      },
      default: "close",
      render: (html) => {
        html.find(".assign-item").click(async (event) => {
          const itemId = event.currentTarget.dataset.itemId;
          const item = this.actor.items.get(itemId);
          if (item) {
            await item.update({ "system.isAssigned": true });
            ui.notifications.info(`${item.name} has been added to your Loadout.`);
            this.render();
          }
        });
      },
    }).render(true);
  }

  async updateActorAbilities() {
    const archetypeItem = this.items.find(item => item.type === "archetype");
    if (archetypeItem) {
      const abilities = archetypeItem.system.abilities || [];
      await this.update({ "system.abilities": abilities });
    } else {
      await this.update({ "system.abilities": [] });
    }
  }

  async configureCharacter() {
    const system = this.system;

    async function getFeatureItemsFromCompendium() {
      const compendium = game.packs.get("world.features");
      if (!compendium) {
        ui.notifications.error("Features compendium not found!");
        return [];
      }
      const compendiumItems = await compendium.getDocuments();
      return compendiumItems.filter(item => item.type === "feature")
        .map(item => ({
          id: item.id,
          name: item.name,
          description: item.system.description
        }));
    }

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
                const total = relentless + elusive + charming + discreet;
                if (total > 9) {
                  ui.notifications.error("You cannot allocate more than 9 nerve points.");
                  return reject();
                }
                system.relentless.nerveMax = relentless;
                system.elusive.nerveMax = elusive;
                system.charming.nerveMax = charming;
                system.discreet.nerveMax = discreet;
                resolve();
              }
            },
            cancel: { label: "Cancel", callback: () => reject() }
          },
          default: "save"
        }).render(true);
      });
    };

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
            cancel: { label: "Cancel", callback: () => reject() }
          },
          default: "save"
        }).render(true);
      });
    };

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
            cancel: { label: "Cancel", callback: () => reject() }
          },
          default: "save"
        }).render(true);
      });
    };

    const selectArchetype = async () => {
      const archetypeChoices = ["Warden", "Agent", "Professor", "Magi"];
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
                const archetype = html.find("#archetype").val();
                system.archetype = { name: archetype, startingItems: [] };
                ui.notifications.info(`Archetype set to: ${archetype}`);
                resolve();
              }
            },
            cancel: { label: "Cancel", callback: () => reject() }
          },
          default: "save"
        }).render(true);
      });
    };

    const distributeSkillPoints = () => {
      return new Promise((resolve, reject) => {
        const maxPoints = 3;
        const maxPerSkill = 3;
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
                Object.keys(system.skills).forEach(skill => {
                  const value = parseInt(html.find(`#${skill}`).val()) || 0;
                  if (value > maxPerSkill) {
                    ui.notifications.error(`${skill.charAt(0).toUpperCase() + skill.slice(1)} cannot exceed ${maxPerSkill} points.`);
                    return;
                  }
                  updatedSkills[skill] = value;
                  totalPoints += value;
                });
                if (totalPoints > maxPoints) {
                  ui.notifications.error(`You can only allocate a maximum of ${maxPoints} points.`);
                  return reject();
                }
                system.skills = updatedSkills;
                ui.notifications.info("Skill points successfully distributed.");
                resolve();
              }
            },
            cancel: { label: "Cancel", callback: () => reject() }
          },
          default: "save"
        }).render(true);
      });
    };

    const selectInitialFeature = async () => {
      const features = await getFeatureItemsFromCompendium();
      if (!features.length) {
        ui.notifications.warn("No features available for selection.");
        return null;
      }
      const options = features.map(
        (feature, index) => `<option value="${feature.id}">${feature.name} - ${feature.description}</option>`
      ).join("");
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
            cancel: { label: "Cancel", callback: () => reject("Feature selection canceled.") }
          },
          default: "save"
        }).render(true);
      });
    };

    try {
      await allocateNervePoints();
      await selectQuirk();
      await selectDrive();
      await selectArchetype();
      await distributeSkillPoints();
      const selectedFeature = await selectInitialFeature();
      if (selectedFeature) {
        const currentFeatures = this.actor.system.features || [];
        const newFeatures = [...currentFeatures, selectedFeature];
        await this.actor.update({ "system.features": newFeatures });
        ui.notifications.info(`Feature "${selectedFeature.name}" added to character.`);
      }
      ui.notifications.info("Character configuration complete!");
    } catch (error) {
      ui.notifications.warn("Character configuration canceled.");
    }
  }
}
