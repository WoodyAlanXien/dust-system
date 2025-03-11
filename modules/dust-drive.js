// File: modules/dust-drive.js

/**
 * The DustDrive class handles Drive items.
 */
export class DustDrive extends Item {
    prepareData() {
      super.prepareData();
      const system = this.system;
      // Ensure default properties exist for drive items.
      system.effect = system.effect || "";
      system.bonus = system.bonus || 0; // Example: a bonus that the drive might grant
      system.description = system.description || "";
    }
  
    /**
     * Optionally trigger the drive’s effect. For instance, activating a resource or a morale boost.
     */
    async triggerEffect() {
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<p><strong>${this.name}</strong> is activated! Effect: ${this.system.effect}</p>`
      });
    }
  }
  