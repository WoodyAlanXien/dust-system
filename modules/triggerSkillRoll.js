import { DustDiceRoller } from './dust-dice-roller.js';

export default async function triggerSkillRoll(skillName, skillValue, actor) {
    // Step 1: Determine Base Dice Pool
    let baseRollFormula = "";
    if (skillValue === 0) {
        baseRollFormula = "2d8kl"; // Unskilled: Roll 2d8 keep the lowest
    } else if (skillValue === 1) {
        baseRollFormula = "1d8"; // Skilled: Roll 1d8
    } else if (skillValue === 2) {
        baseRollFormula = "2d8kh"; // Skilled: Roll 2d8 keep the highest
    } else if (skillValue === 3) {
        baseRollFormula = "3d8kh"; // Skilled: Roll 3d8 keep the highest
    }

    // Step 2: Open a Dialog for Nerve Spending and Adjustments
    const result = await new Promise((resolve) => {
        new Dialog({
            title: `${skillName.toUpperCase()} Roll`,
            content: `
                <p>Select Nerve to Spend:</p>
                <form>
                    <div class="form-group">
                        <label for="nerve-attribute">Attribute:</label>
                        <select id="nerve-attribute" name="nerve-attribute">
                            <option value="relentless">Relentless</option>
                            <option value="elusive">Elusive</option>
                            <option value="charming">Charming</option>
                            <option value="discreet">Discreet</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="nerve-spend">Nerve Points to Spend:</label>
                        <input type="number" id="nerve-spend" name="nerve-spend" value="0" min="0" max="${actor.system.tempNerve}">
                    </div>
                    <div class="form-group">
                        <label for="probability-adjustment">Probability Adjustment (-5 to 5):</label>
                        <input type="number" id="probability-adjustment" name="probability-adjustment" value="0" min="-5" max="5">
                    </div>
                </form>
            `,
            buttons: {
                roll: {
                    label: "Roll",
                    callback: (html) => {
                        const nerveSpend = parseInt(html.find("#nerve-spend").val()) || 0;
                        const probabilityAdjustment = parseInt(html.find("#probability-adjustment").val()) || 0;
                        const nerveAttribute = html.find("#nerve-attribute").val();
                        resolve({ nerveSpend, probabilityAdjustment, nerveAttribute });
                    },
                },
                cancel: {
                    label: "Cancel",
                    callback: () => resolve(null),
                },
            },
            default: "roll",
        }).render(true);
    });

    if (!result) {
        ui.notifications.warn("Skill roll canceled.");
        return;
    }

    const { nerveSpend, probabilityAdjustment, nerveAttribute } = result;

    // Step 3: Adjust the Dice Pool
    let additionalDice = Math.min(nerveSpend + probabilityAdjustment, 5); // Limit the maximum to 5 dice
    let totalDice = skillValue + additionalDice;

    if (totalDice < 0) {
        // For negative dice pools, roll the absolute value of dice + 1 and keep the lowest
        totalDice = Math.abs(totalDice) + 1;
        baseRollFormula = `${totalDice}d8kl`; // Roll with "keep lowest"
    } else {
        // Regular dice pool logic
        totalDice = Math.min(totalDice, 5); // Cap at 5d8
        baseRollFormula = `${totalDice}d8`; // Default roll formula
    }

    // Step 4: Perform the Roll with Dice So Nice Visualization
    const roll = new Roll(baseRollFormula);
    await roll.evaluate({ async: true });

    // Use Dice So Nice to show the dice roll
    if (game.dice3d) {
        await game.dice3d.showForRoll(roll, game.user, true);
    }

    // Step 5: Process the Results Based on Skill Value
    const rollResults = roll.terms[0].results.map((r) => r.result);
    let finalResult = 0;
    if (skillValue === 0) {
        // Unskilled: Keep the lowest
        finalResult = Math.min(...rollResults);
    } else {
        // Skilled: Keep the highest X rolls based on skill value
        const rollsToKeep = Math.min(skillValue + additionalDice, 5); // Maximum 5 dice
        finalResult = rollResults
            .sort((a, b) => b - a) // Sort highest to lowest
            .slice(0, rollsToKeep) // Keep top X rolls
            .reduce((a, b) => a + b, 0); // Sum the results
    }

    // Step 6: Send Roll Result to Chat
    const rollSummary = rollResults.join(", ");
    const content = `
        <div class="roll-summary">
            <h3>${skillName.toUpperCase()} Roll</h3>
            <p><strong>Dice Rolled:</strong> ${rollSummary}</p>
            <p><strong>Final Result:</strong> <span style="color: green;">${finalResult}</span></p>
        </div>`;
    ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content });

    // Step 7: Deduct Nerve Points
    if (nerveSpend > actor.system.tempNerve) {
        // Spend tempNerve first
        actor.update({ "system.tempNerve": 0 });
        const remainingNerve = nerveSpend - actor.system.tempNerve;
        actor.update({
            [`system.${nerveAttribute}.nerveMax`]:
                actor.system[nerveAttribute].nerveMax - remainingNerve,
        });
    } else {
        actor.update({ "system.tempNerve": actor.system.tempNerve - nerveSpend });
    }
}
