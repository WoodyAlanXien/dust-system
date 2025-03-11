// sheet.js - Archetype Sheet Logic
export class ArchetypeSheet extends ItemSheet {
    /** @override */
    get template() {
      return "systems/dust-system/templates/archetype-sheet.hbs"; // Path to your .hbs file
    }
  
    /** @override */
    getData() {
      const data = super.getData();
  
      // Add additional archetype-specific data here
      data.system.startingItems = data.system.startingItems || {
        weapon: "None",
        gear: "None",
        armor: "None",
      };
      data.system.specialities = data.system.specialities || [];
      data.system.abilities = data.system.abilities || [];
  
      return data;
    }
  
    /** @override */
    activateListeners(html) {
      super.activateListeners(html);
  
      // Handle configure archetype button
      html.find(".configure-archetype").click((event) => {
        event.preventDefault();
        this._openConfigurationDialog();
      });
    }
  
    /**
     * Open a configuration dialog for the archetype.
     */
    _openConfigurationDialog() {
      new Dialog({
        title: "Configure Archetype",
        content: `
          <form>
            <div class="form-group">
              <label for="description">Description:</label>
              <textarea id="description" name="description">${this.object.system.description}</textarea>
            </div>
            <div class="form-group">
              <label for="starting-weapon">Starting Weapon:</label>
              <input type="text" id="starting-weapon" name="starting-weapon" value="${this.object.system.startingItems.weapon}" />
            </div>
            <div class="form-group">
              <label for="starting-gear">Starting Gear:</label>
              <input type="text" id="starting-gear" name="starting-gear" value="${this.object.system.startingItems.gear}" />
            </div>
            <div class="form-group">
              <label for="starting-armor">Starting Armor:</label>
              <input type="text" id="starting-armor" name="starting-armor" value="${this.object.system.startingItems.armor}" />
            </div>
            <div class="form-group">
              <label for="specialities">Specialities:</label>
              <textarea id="specialities" name="specialities">${this.object.system.specialities.join(", ")}</textarea>
            </div>
            <div class="form-group">
              <label for="abilities">Abilities:</label>
              <textarea id="abilities" name="abilities">${this.object.system.abilities.map(
                (ability) => ability.description
              ).join(", ")}</textarea>
            </div>
          </form>
        `,
        buttons: {
          save: {
            label: "Save Changes",
            callback: (html) => this._updateArchetypeAttributes(html),
          },
          cancel: {
            label: "Cancel",
          },
        },
        default: "save",
      }).render(true);
    }
  
    /**
     * Update the archetype attributes based on configuration dialog input.
     */
    async _updateArchetypeAttributes(html) {
      const formData = {
        "system.description": html.find("#description").val(),
        "system.startingItems.weapon": html.find("#starting-weapon").val(),
        "system.startingItems.gear": html.find("#starting-gear").val(),
        "system.startingItems.armor": html.find("#starting-armor").val(),
        "system.specialities": html
          .find("#specialities")
          .val()
          .split(",")
          .map((s) => s.trim()),
        "system.abilities": html
          .find("#abilities")
          .val()
          .split(",")
          .map((desc) => ({ description: desc.trim() })),
      };
  
      await this.object.update(formData);
      ui.notifications.info(`${this.object.name} archetype updated.`);
    }
  }
  