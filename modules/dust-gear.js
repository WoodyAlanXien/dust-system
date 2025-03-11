/**
 * The DustGear class handles the data and behavior of gear items.
 */
export class DustGear extends Item {
    prepareData() {
      super.prepareData();
  
      // Ensure system data has default values for gear.
      const system = this.system;
      system.gearCategory = system.gearCategory || "Fantasy"; // or "Sci-fi"
      system.subtype = system.subtype || "";
      system.description = system.description || "";
      system.quantity = system.quantity || 1;
      system.specialProperties = system.specialProperties || [];
    }
  
    // Example method: Use the gear (expand this as needed)
    async useItem() {
      // For example, you could print a chat message saying this gear was used.
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: `<p>You use ${this.name}. ${this.system.description}</p>`
      });
    }
  }
  