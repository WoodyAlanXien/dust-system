// dust-upgrade.js

export class DustUpgrade {
    constructor(name, description, costXp, effect) {
      this.name = name; // Name of the upgrade
      this.description = description; // Description of the upgrade's benefit
      this.costXp = costXp; // Cost in unspent XP
      this.effect = effect; // Function representing the effect
    }
  
    /**
     * Purchase the upgrade if the player has enough unspent XP.
     * @param {number} availableXp - Current unspent XP available
     */
    purchase(availableXp) {
      if (availableXp >= this.costXp) {
        console.log(`Upgrade purchased: ${this.name}. Effect: ${this.description}`);
        this.effect();
        return availableXp - this.costXp; // Deduct cost from available XP
      } else {
        console.log(`Not enough XP to purchase: ${this.name}`);
        return availableXp; // No change in XP
      }
    }
  }
  