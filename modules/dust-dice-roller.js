export class DustDiceRoller {
  // Initialize the dice roller
  static async init() {
    console.log("Dust Dice Roller Initialized");
  }

  // Main renderDiceRoll method using Dice So Nice
  static async renderDiceRoll(formula) {
    console.log("Rendering dice roll with Dice So Nice...");
    console.log(`Formula to render: ${formula}`);

    // Perform the roll
    const roll = new Roll(formula);
    await roll.evaluate({ async: true });

    // Use Dice So Nice to show the dice roll
    if (game.dice3d) {
      await game.dice3d.showForRoll(roll, game.user, true);
    }

    // Log results
    const rollResults = roll.terms[0].results.map((r) => r.result);
    console.log(`Results: ${rollResults.join(", ")}`);
    return rollResults;
  }

  // Exploding dice logic
  static async rollWithExplosions(formula) {
    console.log("Rolling with explosions...");
    const rollResults = [];
    let explosionCount = 0;

    async function explode(formula) {
      const roll = new Roll(formula);
      await roll.evaluate({ async: true });

      for (const die of roll.dice[0].results) {
        rollResults.push(die.result);
        if (die.result === 8 && explosionCount < 10) { // Max 10 explosions
          explosionCount++;
          await explode("1d8");
        }
      }

      // Use Dice So Nice to show explosions
      if (game.dice3d) {
        await game.dice3d.showForRoll(roll, game.user, true);
      }
    }

    await explode(formula);
    console.log(`Final Results (with explosions): ${rollResults.join(", ")}`);
    return rollResults;
  }

  // Play sound effects for dice rolls (optional, Dice So Nice also handles sounds if configured)
  static playDiceSound() {
    AudioHelper.play({ src: "sounds/dice-roll.mp3", volume: 0.8 });
  }
}
