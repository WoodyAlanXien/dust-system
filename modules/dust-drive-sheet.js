// File: modules/dust-drive-sheet.js

export class DriveSheet extends ItemSheet {
    /** @override */
    activateListeners(html) {
      super.activateListeners(html);
  
      // Handle configuration icon click in the window bar
      html.find(".configure-drive").click((event) => {
        event.preventDefault();
        this._openDriveConfigurationDialog();
      });
  
      // Optionally, handle the activate button for triggering the drive's effect
      html.find(".trigger-drive").click((event) => {
        event.preventDefault();
        this.object.triggerEffect();  // Assumes your DustDrive class defines triggerEffect()
      });
    }
  
    /**
     * Opens a dialog for configuring the drive's properties.
     */
    _openDriveConfigurationDialog() {
      // Destructure the current properties from the drive's system data
      const { effect, bonus, description } = this.object.system;
  
      // Create and render the configuration dialog
      new Dialog({
        title: "Configure Drive",
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
            callback: (html) => this._updateDriveAttributes(html)
          },
          cancel: {
            label: "Cancel"
          }
        },
        default: "save"
      }).render(true);
    }
  
    /**
     * Updates the drive item properties based on the dialog input.
     * @param {HTMLElement} html - The HTML content of the dialog.
     */
    async _updateDriveAttributes(html) {
      // Retrieve values from the dialog
      const formData = {
        effect: html.find("#effect").val(),
        bonus: parseInt(html.find("#bonus").val()) || 0,
        description: html.find("#description").val()
      };
  
      // Update the drive's system data
      await this.object.update({ system: formData });
  
      // Provide user feedback
      ui.notifications.info(`Drive '${this.object.name}' has been updated.`);
    }
  }
  