// dust-feature.js

export class DustFeature {
    constructor(name, description, effect, aetherCost = 0, actionPointCost = 0) {
      this.name = name; // Feature name
      this.description = description; // Description of the feature
      this.effect = effect; // Function representing the effect
      this.aetherCost = aetherCost; // Aether cost (optional)
      this.actionPointCost = actionPointCost; // Action Point cost (optional)
    }
  
    /**
     * Activate the feature if costs can be paid.
     * @param {number} availableAether - Current Aether points available
     * @param {number} availableActionPoints - Current Action Points available
     */
    activate(availableAether, availableActionPoints) {
      if (availableAether >= this.aetherCost && availableActionPoints >= this.actionPointCost) {
        console.log(`Feature activated: ${this.name}. Effect: ${this.description}`);
        this.effect();
        return {
          newAether: availableAether - this.aetherCost,
          newActionPoints: availableActionPoints - this.actionPointCost,
        };
      } else {
        console.log(`Not enough resources to activate the feature: ${this.name}`);
        return null;
      }
    }
  }
  