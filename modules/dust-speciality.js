// dust-speciality.js

// Define the DustSpeciality class
export class DustSpeciality {
    constructor(type, aetherCost, actionPointCost, description, effect) {
      this.type = type; // "Light" or "Shadow"
      this.aetherCost = aetherCost; // Cost in Aether points
      this.actionPointCost = actionPointCost; // Cost in Action Points
      this.description = description; // Description of the speciality
      this.effect = effect; // Function representing the effect
    }
  
    /**
     * Activate the speciality if costs can be paid.
     * @param {number} availableAether - Current Aether points available
     * @param {number} availableActionPoints - Current Action Points available
     */
    activate(availableAether, availableActionPoints) {
      if (availableAether >= this.aetherCost && availableActionPoints >= this.actionPointCost) {
        console.log(`${this.type} Speciality activated! Effect: ${this.description}`);
        this.effect();
        return {
          newAether: availableAether - this.aetherCost,
          newActionPoints: availableActionPoints - this.actionPointCost,
        };
      } else {
        console.log(`Not enough resources to activate the ${this.type} Speciality.`);
        return null;
      }
    }
  }
  