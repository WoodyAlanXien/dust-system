// File: modules/dust-quirk-sheet.js

export class QuirkSheet extends ItemSheet {
    /** @override */
    activateListeners(html) {
      super.activateListeners(html);
  
      // Handle configuration icon click in the window bar
      html.find(".configure-quirk").click((event) => {
        event.preventDefault();
        this._openQuirkConfigurationDialog();
      });
  
      // Optionally, handle the activate button for triggering the quirk's effect
      html.find(".trigger-quirk").click((event) => {
        event.preventDefault();
        this.object.triggerEffect();  // Assumes your DustQuirk class defines triggerEffect()
      });
    }
  
    /**
     * Opens a dialog for configuring the quirk's properties.
     */
    _openQuirkConfigurationDialog() {
      // Destructure the current properties from the quirk's system data
      const { effect, bonus, description } = this.object.system;
  
      // Create and render the configuration dialog
      new Dialog({
        title: "Configure Quirk",
        content: `
          <form>
            <div class="form-group">
              <label for="effect">Effect:</label>
              <textarea id="effect" name="effect">${effect || ""}</textarea>
            </div>
            <div class="form-group">
              <label for="bonus">Bonus:</label>
              <input type="number" id="bonus" name="bonus" value="${bonus || 0}" min="0" />
            </div>
            <div class="form-group">
              <label for="description">Description:</label>
              <textarea id="description" name="description">${description || ""}</textarea>
            </div>
          </form>
        `,
        buttons: {
          save: {
            label: "Save Changes",
            callback: (html) => this._updateQuirkAttributes(html)
          },
          cancel: {
            label: "Cancel"
          }
        },
        default: "save"
      }).render(true);
    }
  
    /**
     * Updates the quirk item properties based on the dialog input.
     * @param {HTMLElement} html - The HTML content of the dialog.
     */
    async _updateQuirkAttributes(html) {
      // Retrieve values from the dialog
      const formData = {
        effect: html.find("#effect").val(),
        bonus: parseInt(html.find("#bonus").val()) || 0,
        description: html.find("#description").val()
      };
  
      // Update the quirk's system data
      await this.object.update({ system: formData });
  
      // Provide user feedback
      ui.notifications.info(`Quirk '${this.object.name}' has been updated.`);
    }
  }
  