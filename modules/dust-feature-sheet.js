// feature-sheet.js - Feature Sheet Logic
export class FeatureSheet extends ItemSheet {
    /** @override */
    get template() {
      return "systems/dust-system/templates/feature-sheet.hbs"; // Path to your .hbs file
    }
  
    /** @override */
    getData() {
      const data = super.getData();
  
      // Add additional feature-specific data here
      data.system.aetherCost = data.system.aetherCost || 0;
      data.system.actionPointCost = data.system.actionPointCost || 0;
      data.system.description = data.system.description || "No description provided.";
      data.system.effect = data.system.effect || "No effect specified.";
  
      return data;
    }
  
    /** @override */
    activateListeners(html) {
      super.activateListeners(html);
  
      // Handle configure feature button
      html.find(".configure-feature").click((event) => {
        event.preventDefault();
        this._openConfigurationDialog();
      });
    }
  
    /**
     * Open a configuration dialog for the feature.
     */
    _openConfigurationDialog() {
      new Dialog({
        title: "Configure Feature",
        content: `
          <form>
            <div class="form-group">
              <label for="description">Description:</label>
              <textarea id="description" name="description">${this.object.system.description}</textarea>
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
              <label for="effect">Effect:</label>
              <textarea id="effect" name="effect">${this.object.system.effect}</textarea>
            </div>
          </form>
        `,
        buttons: {
          save: {
            label: "Save Changes",
            callback: (html) => this._updateFeatureAttributes(html),
          },
          cancel: {
            label: "Cancel",
          },
        },
        default: "save",
      }).render(true);
    }
  
    /**
     * Update the feature attributes based on configuration dialog input.
     */
    async _updateFeatureAttributes(html) {
      const formData = {
        "system.description": html.find("#description").val(),
        "system.aetherCost": parseInt(html.find("#aether-cost").val()) || 0,
        "system.actionPointCost": parseInt(html.find("#action-point-cost").val()) || 0,
        "system.effect": html.find("#effect").val(),
      };
  
      await this.object.update(formData);
      ui.notifications.info(`${this.object.name} feature updated.`);
    }
  }
  