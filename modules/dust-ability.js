// dust-ability.js

// Define the DustAbility class
export class DustAbility {
    constructor(archetype, discipline, aetherCost, actionPointCost, description, effect) {
      this.archetype = archetype; // One of the 4 archetypes
      this.discipline = discipline; // The discipline within the archetype
      this.aetherCost = aetherCost; // Aether cost for the ability
      this.actionPointCost = actionPointCost; // Action Point cost
      this.description = description; // Description of the ability
      this.effect = effect; // Function representing the ability's effect
    }
  
    /**
     * Activate the ability if costs can be paid.
     * @param {number} availableAether - Current Aether points available
     * @param {number} availableActionPoints - Current Action Points available
     */
    activate(availableAether, availableActionPoints) {
      if (availableAether >= this.aetherCost && availableActionPoints >= this.actionPointCost) {
        console.log(`${this.archetype} Ability activated! Discipline: ${this.discipline}. Effect: ${this.description}`);
        this.effect();
        return {
          newAether: availableAether - this.aetherCost,
          newActionPoints: availableActionPoints - this.actionPointCost,
        };
      } else {
        console.log(`Not enough resources to activate the ability: ${this.description}`);
        return null;
      }
    }
  }
  