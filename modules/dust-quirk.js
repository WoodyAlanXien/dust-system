// File: modules/dust-quirk.js
export class DustQuirk extends Item {
    /**
     * Prepare additional data specifically for quirk items.
     */
    prepareData() {
      super.prepareData();
      const system = this.system;
  
      // Ensure default properties exist. For example, a quirk might have an effect or bonus.
      system.effect = system.effect || "";
      system.bonus = system.bonus || 0; // For example, a quirk could grant a bonus under certain conditions
    }
  
    /**
     * Optionally trigger the quirk’s effect.
     * For example, this method could be called from a button on the item sheet.
     */
    async triggerEffect() {
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<p><strong>${this.name}</strong> is activated! Effect: ${this.system.effect}</p>`
      });
    }
  }
  