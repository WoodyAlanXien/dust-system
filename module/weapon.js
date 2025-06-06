export default class WeaponItem extends Item {
    prepareData() {
      super.prepareData();
      const system = this.system;
      const { damage, durability, specialProperties } = this.system;
  
      // Example logic for setting defaults
      system.damage = damage || 2; // Default common weapon damage
      system.durability = durability || { current: 5, max: 5 };
      system.specialProperties = specialProperties || [];
    }
  
    rollDurabilityCheck() {
      const roll = new Roll("1d6");
      roll.evaluate({ async: false });
      const result = roll.total;
      console.log(`Durability Check: ${result}`);
      if (result >= 4) {
        console.log("Weapon durability is safe.");
      } else {
        console.log("Weapon takes damage!");
        this.update({ "system.durability.current": this.system.durability.current - 1 });
      }
    }
  }
  