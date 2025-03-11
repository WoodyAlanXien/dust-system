// dust-weapon.js

// Import FoundryVTT's Item class
export class DustWeapon extends Item {
    /** Override default Foundry methods if needed */
  
    /**
     * Prepare data for the weapon when the item is initialized or updated.
     */
    prepareData() {
      super.prepareData();
  
      // Set default values for weapon attributes if undefined
      const data = this.system; // Foundry stores system data under `this.system`
  
      data.defaultSkill = data.defaultSkill || "Unarmed Combat";
      data.combatApCost = data.combatApCost || 2;
      data.durability = data.durability || 6;
      data.stressDamage = data.stressDamage || 0;
      data.range = data.range || "melee";
      data.probabilityModifier = data.probabilityModifier || 0;
      data.specialProperties = data.specialProperties || [];
    }
  
    /**
     * Process weapon-specific actions, like attack logic.
     */
    async attack(target) {
      if (this.system.durability <= 0) {
        ui.notifications.warn(`${this.name} is broken and cannot be used.`);
        return;
      }
  
      const damage = this.system.stressDamage || 0;
      ui.notifications.info(`${this.name} attacks ${target} dealing ${damage} damage!`);
  
      // Reduce weapon durability
      await this.update({ "system.durability": Math.max(this.system.durability - 1, 0) });
    }
  
    /**
     * Reload weapon or repair durability (optional for ranged weapons).
     */
    async reload(amount = 10) {
      const newDurability = Math.min(this.system.durability + amount, 100);
      await this.update({ "system.durability": newDurability });
      ui.notifications.info(`${this.name} has been reloaded/repaired to durability: ${newDurability}.`);
    }
  }
  