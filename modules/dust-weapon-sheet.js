export class WeaponSheet extends ItemSheet {
    /** @override */
    activateListeners(html) {
      super.activateListeners(html);
  
      // Handle configuration icon click
      html.find(".configure-weapon").click((event) => {
        event.preventDefault();
        this._openConfigurationDialog();
      });
    
    // Handle armor configuration icon click
    html.find(".configure-armor").click((event) => {
        event.preventDefault();
        this._openArmorConfigurationDialog();
      });
    }
  
    /**
     * Opens a dialog box for configuring weapon attributes.
     */
    _openConfigurationDialog() {
      // Render the configuration dialog
      new Dialog({
        title: "Configure Weapon",
        content: `
          <form>
            <div class="form-group">
              <label for="default-skill">Default Skill:</label>
              <input type="text" id="default-skill" name="default-skill" value="${this.object.system.defaultSkill}" />
            </div>
            <div class="form-group">
              <label for="combat-ap-cost">Combat AP Cost:</label>
              <input type="number" id="combat-ap-cost" name="combat-ap-cost" value="${this.object.system.combatApCost}" min="1" />
            </div>
            <div class="form-group">
              <label for="durability">Durability:</label>
              <input type="number" id="durability" name="durability" value="${this.object.system.durability}" min="0" />
            </div>
            <div class="form-group">
              <label for="stress-damage">Stress Damage:</label>
              <input type="number" id="stress-damage" name="stress-damage" value="${this.object.system.stressDamage}" min="0" />
            </div>
            <div class="form-group">
              <label for="range">Range:</label>
              <select id="range" name="range">
                <option value="melee" ${this.object.system.range === "melee" ? "selected" : ""}>Melee</option>
                <option value="short" ${this.object.system.range === "short" ? "selected" : ""}>Short</option>
                <option value="long" ${this.object.system.range === "long" ? "selected" : ""}>Long</option>
              </select>
            </div>
            <div class="form-group">
              <label for="probability-modifier">Probability Modifier:</label>
              <input type="number" id="probability-modifier" name="probability-modifier" value="${this.object.system.probabilityModifier}" min="0" />
            </div>
            <div class="form-group">
              <label for="special-properties">Special Properties:</label>
              <textarea id="special-properties" name="special-properties">${this.object.system.specialProperties.map(
  (prop) => `${prop.type}:${prop.effect}`
).join("\n")}</textarea>

            </div>
          </form>
        `,
        buttons: {
          save: {
            label: "Save Changes",
            callback: (html) => this._updateItemAttributes(html),
          },
          cancel: {
            label: "Cancel"
          }
        },
        default: "save"
      }).render(true);
    } 
      
      /**
     * Opens a dialog box for configuring armor attributes.
     */
    _openArmorConfigurationDialog() {
      const { level, quality, stressReduction, criticalBypass, description } = this.object.system;
  
      // Render the configuration dialog
      new Dialog({
        title: "Configure Armor",
        content: `
          <form>
            <div class="form-group">
              <label for="level">Armor Level:</label>
              <select id="level" name="level">
                <option value="1" ${level === 1 ? "selected" : ""}>Mundane</option>
                <option value="2" ${level === 2 ? "selected" : ""}>Phase</option>
                <option value="3" ${level === 3 ? "selected" : ""}>Advanced Phase</option>
              </select>
            </div>
            <div class="form-group">
              <label for="quality">Quality:</label>
              <select id="quality" name="quality">
                <option value="basic" ${quality === "basic" ? "selected" : ""}>Basic</option>
                <option value="advanced" ${quality === "advanced" ? "selected" : ""}>Advanced</option>
                <option value="superior" ${quality === "superior" ? "selected" : ""}>Superior</option>
              </select>
            </div>
            <div class="form-group">
              <label for="stress-reduction">Stress Reduction:</label>
              <input type="number" id="stress-reduction" name="stress-reduction" value="${stressReduction}" min="1" max="3" />
            </div>
            <div class="form-group">
              <label for="critical-bypass">Critical Bypass:</label>
              <input type="checkbox" id="critical-bypass" name="critical-bypass" ${criticalBypass ? "checked" : ""} />
            </div>
            <div class="form-group">
              <label for="description">Description:</label>
              <textarea id="description" name="description">${description}</textarea>
            </div>
          </form>
        `,
        buttons: {
          save: {
            label: "Save Changes",
            callback: (html) => this._updateItemAttributes(html),
          },
          cancel: {
            label: "Cancel",
          },
        },
        default: "save",
      }).render(true);
    }
  
    async _updateItemAttributes(html, type) {
        let formData = {};
      
        if (type === "armor") {
          formData = {
            level: parseInt(html.find("#level").val()) || 1,
            quality: html.find("#quality").val(),
            stressReduction: parseInt(html.find("#stress-reduction").val()) || 0,
            criticalBypass: html.find("#critical-bypass").is(":checked"),
            description: html.find("#description").val(),
          };
        } else if (type === "weapon") {
          formData = {
            defaultSkill: html.find("#default-skill").val(),
            combatApCost: parseInt(html.find("#combat-ap-cost").val()) || 0,
            durability: parseInt(html.find("#durability").val()) || 0,
            stressDamage: parseInt(html.find("#stress-damage").val()) || 0,
            range: html.find("#range").val(),
            probabilityModifier: parseInt(html.find("#probability-modifier").val()) || 0,
            specialProperties: html.find("#special-properties").val().split(",").map((type) => ({
              type: type.trim(),
              effect: "",
            })),
          };
        }
      
        // Update the item's system data
        await this.object.update({ system: formData });
      
        // Notify the user
        ui.notifications.info(`${this.object.name} has been updated.`);
      }
    }      
