// dust-armor.js

// Import FoundryVTT's Item class
export class DustArmor extends Item {
    /**
     * Prepare the armor item data when initialized or updated.
     */
    prepareData() {
      super.prepareData();
  
      // Set default values for armor attributes if undefined
      const data = this.system;
  
      data.level = data.level || 1; // Default to Mundane (Level 1)
      data.quality = data.quality || "basic"; // Default to Basic quality
      data.stressReduction = data.stressReduction || 1; // Default stress reduction value
      data.criticalBypass = data.criticalBypass || false; // Default critical bypass to false
      data.description = data.description || ""; // Default empty description
    }
  
    /**
     * Method to calculate total damage reduction based on stress reduction and quality.
     * @returns {number} Total reduction
     */
    calculateDamageReduction() {
      const baseReduction = this.system.stressReduction || 0;
  
      // Additional reduction based on quality
      let qualityModifier = 0;
      switch (this.system.quality) {
        case "advanced":
          qualityModifier = 1;
          break;
        case "superior":
          qualityModifier = 2;
          break;
      }
  
      return baseReduction + qualityModifier;
    }
  
    /**
     * Apply armor damage (reduce durability or effectiveness).
     * @param {number} damage - Amount of damage to apply
     */
    async applyDamage(damage) {
      const currentDurability = this.system.durability || 100;
      const newDurability = Math.max(0, currentDurability - damage);
  
      await this.update({ "system.durability": newDurability });
  
      if (newDurability === 0) {
        ui.notifications.warn(`${this.name} is broken and no longer provides protection!`);
      } else {
        ui.notifications.info(`${this.name} has ${newDurability} durability remaining.`);
      }
    }
  
    /**
     * Repair armor to restore durability.
     * @param {number} amount - Amount to repair
     */
    async repair(amount) {
      const maxDurability = 100; // Assuming max durability is 100
      const currentDurability = this.system.durability || 100;
      const newDurability = Math.min(maxDurability, currentDurability + amount);
  
      await this.update({ "system.durability": newDurability });
      ui.notifications.info(`${this.name} repaired to ${newDurability} durability.`);
    }
  }
  