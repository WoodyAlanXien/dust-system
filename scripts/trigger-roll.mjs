import { rollDicePool } from '../dust-system.mjs';


function triggerRoll(attributeKey, actorId, attributeType) {
  // Fetch the actor dynamically using their ID
  const actor = game.actors.get(actorId);

  if (!actor) {
    ui.notifications.error("Actor not found.");
    return;
  }

  // Retrieve values dynamically for the relevant attribute type (e.g., relentless, elusive, charming, discreet)
  const attributeValue = getProperty(actor.system, attributeKey);
  const maxNerve = getProperty(actor.system, `attributes.${attributeType}.nerve.max`);
  const currentNerve = getProperty(actor.system, `attributes.${attributeType}.nerve.value`);
  const tempNerve = getProperty(actor.system, `attributes.${attributeType}.temporaryNerve`);

  // Open the dialog box to prompt for nerve spending
  new Dialog({
    title: `Spend Nerve Points (${attributeType}) and Probability`,
    content: `
      <form>
        <div class="form-group">
          <label for="nerve-input">How many regular Nerve points would you like to spend? (Max: ${currentNerve})</label>
          <input id="nerve-input" type="number" min="0" max="${currentNerve}" value="0" />
        </div>
        <div class="form-group">
          <label for="temp-nerve-input">How many temporary Nerve points would you like to spend? (Max: ${tempNerve})</label>
          <input id="temp-nerve-input" type="number" min="0" max="${tempNerve}" value="0" />
        </div>
        <div class="form-group">
          <label for="probability">Probability Adjustment (-3 to 3):</label>
          <select id="probability" name="probability">
            <option value="-3">-3</option>
            <option value="-2">-2</option>
            <option value="-1">-1</option>
            <option value="0" selected>0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
      </form>
    `,
    buttons: {
      roll: {
        icon: '<i class="fas fa-dice"></i>',
        label: "Roll",
        callback: async (html) => { // Make the callback function asynchronous
          // Retrieve input values
          const nervePoints = parseInt(html.find("#nerve-input").val() || "0", 10);
          const tempNervePoints = parseInt(html.find("#temp-nerve-input").val() || "0", 10);
          const probability = parseInt(html.find("#probability").val());

          // Validate inputs
          if (isNaN(nervePoints) || isNaN(tempNervePoints) || isNaN(probability)) {
            ui.notifications.error("Invalid input values.");
            return;
          }
          if (nervePoints > currentNerve || tempNervePoints > tempNerve) {
            ui.notifications.error("Invalid number of nerve points.");
            return;
          }

          // Ensure attributeValue is valid
          if (!attributeValue && attributeValue !== 0) {
            ui.notifications.error("Attribute value is not found.");
            return;
          }

          // Call the rollDicePool function asynchronously
          try {
            const rollResult = await rollDicePool(attributeValue, nervePoints, tempNervePoints, maxNerve, probability);
            // Assuming attributeKey = "attributes.relentless.clash.value"
            const keyParts = attributeKey.split('.'); // Split the string into parts
            const extractedPart = keyParts[3]; // Access the part you want (e.g., "clash")
            const extractedPartUppercase = extractedPart.toUpperCase(); 
            // Create a string of rolled values for the chat
            const rolledValuesString = rollResult.totalRolls.join(", "); // Access totalRolls and join as a string

            let rollType = "";
let rollFormula = ""; // Example roll formula

if (attributeValue === 0) {
  rollFormula = "2d8kl"; // Roll 2d8 and keep the lowest
  rollType = "Keeping the Lowest";
} else {
  rollFormula = `${attributeValue + nervePoints + tempNervePoints}d8kh`; // Keep the highest by default
  rollType = "Keeping the Highest";
}

// Example roll:
let roll = await new Roll(rollFormula).roll();



            // Display roll results in chat with color-coded categories
            const chatMessage = `
  <strong>Roll Results (${extractedPart} - ${rollType}):</strong><br>
  <span style="font-weight: bold; color: black;">Rolled Values:</span> [${rolledValuesString}]<br>
  <span style="font-weight: bold; color: black;">Critical Failures:</span> 
  <span class="fa-stack" style="font-size: 1em; line-height: 1;">
    <i class="fa-solid fa-dice-d8 fa-stack-2x" style="color: red;"></i>
    <span class="fa-stack-2x" style="color: black; font-weight: bold;">${rollResult.results.criticalFailures}</span>
  </span><br>
  <span style="font-weight: bold; color: black;">Failures:</span> 
  <span class="fa-stack" style="font-size: 1em; line-height: 1;">
    <i class="fa-solid fa-dice-d8 fa-stack-2x" style="color: orange;"></i>
    <span class="fa-stack-2x" style="color: black; font-weight: bold;">${rollResult.results.failures}</span>
  </span><br>
  <span style="font-weight: bold; color: black;">Mixed Successes:</span> 
  <span class="fa-stack" style="font-size: 1em; line-height: 1;">
    <i class="fa-solid fa-dice-d8 fa-stack-2x" style="color: #f1c40f;"></i>
    <span class="fa-stack-2x" style="color: black; font-weight: bold;">${rollResult.results.mixedSuccesses}</span>
  </span><br>
  <span style="font-weight: bold; color: black;">Successes:</span> 
  <span class="fa-stack" style="font-size: 1em; line-height: 1;">
    <i class="fa-solid fa-dice-d8 fa-stack-2x" style="color: lightgreen;"></i>
    <span class="fa-stack-2x" style="color: black; font-weight: bold;">${rollResult.results.successes}</span>
  </span><br>
  <span style="font-weight: bold; color: black;">Critical Successes:</span> 
  <span class="fa-stack" style="font-size: 1em; line-height: 1;">
    <i class="fa-solid fa-dice-d8 fa-stack-2x" style="color: green;"></i>
    <span class="fa-stack-2x" style="color: black; font-weight: bold;">${rollResult.results.criticalSuccesses}</span>
  </span><br>
  <span style="font-weight: bold; color: black;">Regular Nerve Spent:</span> ${nervePoints}<br>
  <span style="font-weight: bold; color: black;">Temporary Nerve Spent:</span> ${tempNervePoints}<br>
`;

ChatMessage.create({
  content: chatMessage,
  speaker: ChatMessage.getSpeaker({ actor })

  });
          } catch (error) {
            ui.notifications.error("An error occurred during the roll.");
            console.error("Error in rollDicePool:", error);
          }
        }
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: "Cancel"
      }
    },
    default: "roll"
  }).render(true);
}

window.triggerRoll = triggerRoll;

console.log("trigger-rolls.js loaded successfully!");


