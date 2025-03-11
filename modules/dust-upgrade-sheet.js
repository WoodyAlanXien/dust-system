// upgrade-sheet.js - Upgrade Sheet Logic
export class UpgradeSheet extends ItemSheet {
    /** @override */
    get template() {
      return "systems/dust-system/templates/upgrade-sheet.hbs"; // Path to your .hbs file
    }
  
    /** @override */
    getData() {
      const data = super.getData();
  
      // Add additional upgrade-specific data here
      data.system.costXp = data.system.costXp || 0;
      data.system.description = data.system.description || "No description provided.";
      data.system.effect = data.system.effect || "No effect specified.";
  
      return data;
    }
  
    /** @override */
    activateListeners(html) {
      super.activateListeners(html);
  
      // Handle configure upgrade button
      html.find(".configure-upgrade").click((event) => {
        event.preventDefault();
        this._openConfigurationDialog();
      });
    }
  
    /**
     * Open a configuration dialog for the upgrade.
     */
    _openConfigurationDialog() {
      new Dialog({
        title: "Configure Upgrade",
        content: `
          <form>
            <div class="form-group">
              <label for="description">Description:</label>
              <textarea id="description" name="description">${this.object.system.description}</textarea>
            </div>
            <div class="form-group">
              <label for="cost-xp">Cost (XP):</label>
              <input type="number" id="cost-xp" name="cost-xp" value="${this.object.system.costXp}" min="0" />
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
            callback: (html) => this._updateUpgradeAttributes(html),
          },
          cancel: {
            label: "Cancel",
          },
        },
        default: "save",
      }).render(true);
    }
  
    /**
     * Update the upgrade attributes based on the configuration dialog input.
     */
    async _updateUpgradeAttributes(html) {
      const formData = {
        "system.description": html.find("#description").val(),
        "system.costXp": parseInt(html.find("#cost-xp").val()) || 0,
        "system.effect": html.find("#effect").val(),
      };
  
      await this.object.update(formData);
      ui.notifications.info(`${this.object.name} upgrade updated.`);
    }
  }
  