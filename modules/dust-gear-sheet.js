export class GearSheet extends ItemSheet {
    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Handle configuration icon click in the window bar
        html.find(".configure-gear").click((event) => {
            event.preventDefault();
            this._openGearConfigurationDialog();
        });

        // Optionally, handle the activate button for triggering the gear's effect
        html.find(".trigger-gear").click((event) => {
            event.preventDefault();
            this.object.triggerEffect(); // Assumes your DustGear class defines triggerEffect()
        });
    }

    /**
     * Opens a dialog for configuring the gear's properties.
     */
    _openGearConfigurationDialog() {
        // Destructure the current properties from the gear's system data
        const { effect, bonus, weight, description } = this.object.system;

        // Create and render the configuration dialog
        new Dialog({
            title: "Configure Gear",
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
                        <label for="weight">Weight:</label>
                        <input type="number" id="weight" name="weight" value="${weight || 0}" min="0" />
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
                    callback: (html) => this._updateGearAttributes(html)
                },
                cancel: {
                    label: "Cancel"
                }
            },
            default: "save"
        }).render(true);
    }

    /**
     * Updates the gear item properties based on the dialog input.
     * @param {HTMLElement} html - The HTML content of the dialog.
     */
    async _updateGearAttributes(html) {
        // Retrieve values from the dialog
        const formData = {
            effect: html.find("#effect").val(),
            bonus: parseInt(html.find("#bonus").val()) || 0,
            weight: parseInt(html.find("#weight").val()) || 0,
            description: html.find("#description").val()
        };

        // Update the gear's system data
        await this.object.update({ system: formData });

        // Provide user feedback
        ui.notifications.info(`Gear '${this.object.name}' has been updated.`);
    }
}
