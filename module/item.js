export class DustItem extends Item {
 
  /**
   * Prepare data for the item.
   */
  prepareData() {
    super.prepareData();

    const system = this.system;
    const itemType = this.type;

    // Example: Default damage for weapon items
    if (itemType === "weapon") {
      system.damage = system.damage || 2; // Set a default damage value if none is specified
      system.durability = system.durability || { current: 5, max: 5 }; // Default durability
    }
  }

  /**
   * Handle custom item rolls or behaviors.
   */
  async rollItemAction() {
    const roll = new Roll("1d20");
    await roll.evaluate({ async: true });
    console.log(`Rolled ${roll.total} for item action.`);
  }
}
