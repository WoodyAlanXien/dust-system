// ability-sheet.js - Ability Sheet Logic
export class AbilitySheet extends ItemSheet {
    /** @override */
    get template() {
      return "systems/dust-system/templates/ability-sheet.hbs"; // Path to your .hbs file
    }
  
    /** @override */
    getData() {
      const data = super.getData();
  
      // Add additional ability-specific data here
      data.system.archetype = data.system.archetype || "None";
      data.system.discipline = data.system.discipline || "None";
      data.system.aetherCost = data.system.aetherCost || 0;
      data.system.actionPointCost = data.system.actionPointCost || 0;
      data.system.description = data.system.description || "No description provided.";
      data.system.effect = data.system.effect || "No effect specified.";
  
      return data;
    }
  
    /** @override */
    activateListeners(html) {
      super.activateListeners(html);
  
      // Handle configure ability button
      html.find(".configure-ability").click((event) => {
        event.preventDefault();
        this._openConfigurationDialog();
      });
    }
  
    /**
     * Open a configuration dialog for the ability.
     */
    // ...existing code...
_openConfigurationDialog() {
  new Dialog({
    title: "Configure Ability",
    content: `
      <form>
        <div class="form-group">
          <label for="archetype">Archetype:</label>
          <select id="archetype" name="archetype">
            <option value="Warden" ${this.object.system.archetype === "Warden" ? "selected" : ""}>Warden</option>
            <option value="Agent" ${this.object.system.archetype === "Agent" ? "selected" : ""}>Agent</option>
            <option value="Professor" ${this.object.system.archetype === "Professor" ? "selected" : ""}>Professor</option>
            <option value="Magi" ${this.object.system.archetype === "Magi" ? "selected" : ""}>Magi</option>
          </select>
        </div>
        <div class="form-group">
          <label for="discipline">Discipline:</label>
          <input type="text" id="discipline" name="discipline" value="${this.object.system.discipline}" />
        </div>
        <div class="form-group">
          <label for="aether-cost">Aether Cost:</label>
          <input type="number" id="aether-cost" name="aether-cost" value="${this.object.system.aetherCost}" min="0" />
        </div>
        <div class="form-group">
          <label for="action-point-cost">Action Point Cost:</label>
          <input type="number" id="action-point-cost" name="action-point-cost" value="${this.object.system.actionPointCost}" min="0" />
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" name="description">${this.object.system.description}</textarea>
        </div>
        <div class="form-group">
          <label for="effect">Effect:</label>
          <textarea id="effect" name="effect">${this.object.system.effect}</textarea>
        </div>
      </form>
    `,
    buttons: {
      save: {
        label: "Save Changes",
        callback: (html) => this._updateAbilityAttributes(html),
      },
      cancel: {
        label: "Cancel",
      },
    },
    default: "save",
  }).render(true);
}
  
    /**
     * Update the ability attributes based on the configuration dialog input.
     */
    async _updateAbilityAttributes(html) {
      const formData = {
        "system.archetype": html.find("#archetype").val(),
        "system.discipline": html.find("#discipline").val(),
        "system.aetherCost": parseInt(html.find("#aether-cost").val()) || 0,
        "system.actionPointCost": parseInt(html.find("#action-point-cost").val()) || 0,
        "system.description": html.find("#description").val(),
        "system.effect": html.find("#effect").val(),
      };
  
      await this.object.update(formData);
      ui.notifications.info(`${this.object.name} ability updated.`);
    }
  }
  