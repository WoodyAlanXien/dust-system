// dust-archetype.js

export class DustArchetype {
    constructor(name, startingItems, specialities, abilities) {
      this.name = name; // Archetype name: Warden, Agent, Professor, or Magi
      this.startingItems = startingItems; // Starting items: { weapon, gear, armor }
      this.specialities = specialities; // Array of Speciality objects
      this.abilities = abilities; // Array of Ability objects
    }
  
    /**
     * Displays the archetype's details.
     */
    displayDetails() {
      return `
        Archetype: ${this.name}
        Starting Items:
          - Weapon: ${this.startingItems.weapon}
          - Gear: ${this.startingItems.gear}
          - Armor: ${this.startingItems.armor}
          - Speciality: ${this.speciality}
          - Ability: ${this.ability}
      `;
    }
  
    /**
     * Allows the character to select their starting items.
     */
    selectStartingItems(selection) {
      const { weapon, gear, armor, speciality, ability } = selection;
  
      if (
        this.startingItems.weapon.includes(weapon) &&
        this.startingItems.gear.includes(gear) &&
        this.startingItems.armor.includes(armor) &&
        this.startingItems.speciality.includes(speciality) &&
        this.startingItems.ability.includes(ability)
      ) {
        console.log(`${this.name} selected starting items: Weapon - ${weapon}, Gear - ${gear}, Armor - ${armor}.`);
        return { weapon, gear, armor };
      } else {
        console.log("Invalid selection. Please choose items from the starting options.");
        return null;
      }
    }
  }
  