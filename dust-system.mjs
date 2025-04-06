// Import necessary modules and classes
import './scripts/trigger-roll.mjs';
import { DustActor } from './module/actor.js';
import { DustActorSheet } from './module/actor-sheet.js';
import { DustItem } from './module/item.js';
import { DustItemSheet } from './module/item-sheet.js';
import './scripts/helpers.js';
import { DustActorConfig } from './module/actor-config.js';
import './libs/mammoth.browser.js';
import { preloadTemplates } from "./module/preloadTemplates.js";
import { DustActorSheet2 } from './module/dust-character-sheet-2.js';



/* -------------------------------------------- */
/*  Initialize system                           */
/* -------------------------------------------- */
Hooks.once('init', async function() {
  console.log('dust-system | Initializing Dust System');

  Handlebars.registerHelper('default', function(value, defaultValue) {
  return value != null ? value : defaultValue;
});

  // Define custom Entity classes
  CONFIG.Actor.documentClass = DustActor;
  CONFIG.Item.documentClass = DustItem;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('dust-system', DustActorSheet, { makeDefault: false });
  Actors.registerSheet('dust-system', DustActorSheet2, {makeDefault: true});
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('dust-system', DustItemSheet, { makeDefault: true });
}),
 
// Register the system settings button
Hooks.once("init", () => {
  game.settings.register("dust-system", "importHandbook", {
      name: "Import Handbook", // Display name
      hint: "Click to import the handbook and generate journal entries.", // Tooltip
      scope: "world", // This is a world-level setting
      config: true, // Show this in the settings menu
      type: Boolean, // Type is Boolean, as this triggers an action
      default: false,
      onChange: async () => { // Trigger logic on click
          await importHandbook();
      }
  });
});

Hooks.once("init", () => {
  Actor.prototype.assignActiveSpclty = async function(type) {
    if (type === "light") {
      await this.update({
        "system.lightActiveSpclty.highlighted": true,
        "system.shadowActiveSpclty.highlighted": false
      });
      ui.notifications.info("Light Specialty assigned.");
    } else if (type === "shadow") {
      await this.update({
        "system.lightActiveSpclty.highlighted": false,
        "system.shadowActiveSpclty.highlighted": true
      });
      ui.notifications.info("Shadow Specialty assigned.");
    } else {
      ui.notifications.warn("Invalid specialty type.");
    }
  };
});

// Function to handle the handbook import process
async function importHandbook() {
  console.log("Starting the handbook import process...");

  const filePath = "systems/dust-system/handbook.docx";
  const fileUrl = `${window.location.origin}/${filePath}`;

  try {
      // Download the Word document
      const fileBuffer = await downloadFile(fileUrl);

      // Extract rich content using Mammoth
      const content = await extractContentAsHtml(fileBuffer);

      // Split content into chapters
      const chapters = splitIntoChapters(content);

      // Create journal entries
      await createJournalEntries(chapters);

      console.log("All journal entries created successfully!");
  } catch (err) {
      console.error("Error processing the Word document:", err);
  }
}

// Supporting functions

async function downloadFile(url) {
  const response = await fetch(url);
  if (!response.ok) {
      throw new Error(`Failed to fetch file from ${url}: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

async function extractContentAsHtml(buffer) {
  const result = await window.mammoth.convertToHtml({ arrayBuffer: buffer });
  return result.value;
}

function splitIntoChapters(content) {
  const chapters = [];
  const chapterRegex = /(Chapter\s\d+:.*?)(?=Chapter\s\d+:|$)/gis;

  let match;
  while ((match = chapterRegex.exec(content)) !== null) {
      const chapterText = match[1].trim(); // Entire chapter, including title and content
      const title = chapterText.split(/[:\n]/)[0]; // Extract just "Chapter X: Title" (remove ": Content")
      chapters.push({ name: title, content: chapterText }); // Push both title and full HTML content
  }
  return chapters;
}

async function createJournalEntries(chapters) {
  for (const chapter of chapters) {
      // Create a base journal entry
      const journalEntry = await JournalEntry.create({
          name: chapter.name, // Title of the journal entry
          folder: null, // Optionally specify a folder
          ownership: { default: 1 } // Permissions: 1 allows all players to view
      });

      console.log(`Journal entry created: ${chapter.name}`);

      // Add a page to the journal entry
      await journalEntry.createEmbeddedDocuments("JournalEntryPage", [
          {
              name: "Content", // Title of the page
              text: {
                  content: chapter.content, // HTML content for this page
                  format: CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML // Ensure HTML format
              },
              type: "text", // Type of the page
              ownership: { default: 1 } // Permissions for the page
          }
      ]);

      console.log(`Page added to journal entry: ${chapter.name}`);
  }
}

Hooks.once("init", async () => {
  console.log("Custom system initializing...");

  // Register custom items and item sheets
  CONFIG.Item.documentClass = DustItem;
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("dust-system", DustItemSheet, { makeDefault: true });
});


Hooks.once("init", async () => {
  console.log("Initializing Custom Foundry System...");

  // Register Handlebars templates
  await loadTemplates([
    "systems/dust-system/templates/weapon.hbs", // Update the path based on your folder structure
  ]);
});



Hooks.on('ready', function () {
  // Register font settings
  game.settings.register("dust-system", "fontSettingHeaders", {
    name: "Font for Headers",
    hint: "Choose a font for headings like h1, h2, and .custom-header.",
    scope: "client",
    config: true,
    default: "Vivaldi",
    type: String,
    choices: {
      "Vivaldi": "Vivaldi",
      "Roboto": "Roboto",
      "OpenDyslexic": "OpenDyslexic",
      "VinerITC": "VinerITC",
      "Achafont": "Achafont",
      "Vladimir": "Vladimir"
    },
    requiresReload: true
  });

  game.settings.register("dust-system", "fontSettingTooltips", {
    name: "Font for Tooltips and Notifications",
    hint: "Choose a font for tooltips and notifications.",
    scope: "client",
    config: true,
    default: "Roboto",
    type: String,
    choices: {
      "Vivaldi": "Vivaldi",
      "Roboto": "Roboto",
      "OpenDyslexic": "OpenDyslexic",
      "VinerITC": "VinerITC",
      "Achafont": "Achafont",
      "Vladimir": "Vladimir"
    },
    requiresReload: true
  });
 

  Hooks.once("init", async function () {
    console.log("dust-system | Initializing Dust System");
  
    // Preload Handlebars templates
    await preloadTemplates();
  });
  
  // Preload fonts with non-dynamic paths
  preloadFont("Vivaldi", "systems/dust-system/fonts/VIVALDII.ttf");
  preloadFont("Roboto", "systems/dust-system/fonts/Roboto-Black.ttf");
  preloadFont("OpenDyslexic", "systems/dust-system/fonts/OpenDyslexic.ttf");
  preloadFont("VinerITC", "systems/dust-system/fonts/VINERITC.ttf");
  preloadFont("Achafont", "systems/dust-system/fonts/Achafont.ttf");
  preloadFont("Vladimir", "systems/dust-system/fonts/VLADIMIR.ttf");

  // Fetch the selected fonts
  const fontHeader = game.settings.get("dust-system", "fontSettingHeaders");
  const fontTooltip = game.settings.get("dust-system", "fontSettingTooltips");

  // Apply user-selected fonts
  document.documentElement.style.setProperty('--header-font', fontHeader);
  document.documentElement.style.setProperty('--tooltip-font', fontTooltip);

  console.log('dust-system | Fonts loaded and applied:', { fontHeader, fontTooltip });
});

// Helper function to preload a font with a fixed path
function preloadFont(fontName, fontPath) {
  if (!document.querySelector(`style[data-font="${fontName}"]`)) {
    const fontStyle = document.createElement('style');
    fontStyle.dataset.font = fontName;
    fontStyle.textContent = `
      @font-face {
        font-family: '${fontName}';
        src: url('${fontPath}') format('truetype');
      }
    `;
    document.head.appendChild(fontStyle);
    console.log(`Font preloaded: ${fontName} from ${fontPath}`);
  }
}



/* -------------------------------------------- */
/*  Setup system                                */
/* -------------------------------------------- */
Hooks.once('setup', function() {
  // Perform any setup actions required after initialization
});

/* -------------------------------------------- */
/*  When ready                                  */
/* -------------------------------------------- */
Hooks.once('ready', function() {
  // Perform any actions required when the system is ready

  // Register the configure actor option
  game.dustSystem = {
    DustActorConfig
  };

  // Add a button to open the configure actor form
  Hooks.on('renderActorSheet', (app, html, data) => {
    if (app.actor.owner) {
      const button = $(`<button type="button" class="configure-actor">Configure Actor</button>`);
      button.on('click', () => {
        new DustActorConfig(app.actor).render(true);
      });
      html.closest('.window-app').find('.window-header .window-title').after(button);
    }
  });
});

/* -------------------------------------------- */
/*  Other Hooks                                 */
/* -------------------------------------------- */
Hooks.on("preCreateActor", (data, options, userId) => {
  if (data.type === "character" && !data.system) {
    data.system = foundry.utils.deepClone(game.system.model.Actor.character);
  }
});

async function migrateActors() {
  for (const actor of game.actors) {
    if (actor.type === "character") {
      await actor.update({ system: foundry.utils.mergeObject(game.system.model.Actor.character, actor.system) });
    }
  }
}



Hooks.on('updateActor', (actor, data, options, userId) => {
  // Perform actions when an actor is updated
  if (!game.user.isGM) {
    const gm = game.users.find(u => u.isGM && u.active);
    if (gm) {
      ChatMessage.create({
        user: game.user.id,
        content: `Actor ${actor.name} was updated by ${game.user.name}`,
        whisper: [gm.id]
      });
    }
  }
});

Hooks.on('deleteActor', (actor, options, userId) => {
  // Perform actions when an actor is deleted
});

// Add a preUpdateActor hook to derive resilienceTotal automatically
Hooks.on("preUpdateActor", (actor, updateData, options, userId) => {
  if (actor.type !== "character") return;
  if (!updateData.system || !updateData.system.attributes) return;

  const currentAttrs = actor.system.attributes;

  // Helper: get updated value from updateData or fallback to current value
  function getUpdated(path) {
    const newVal = getProperty(updateData, `system.attributes.${path}`);
    if (newVal !== undefined) return Number(newVal);
    const currVal = getProperty(currentAttrs, path);
    return currVal !== undefined ? Number(currVal) : 0;
  }

  const relentlessResilience = getUpdated("relentless.attributes.resilience");
  const elusiveResilience = getUpdated("elusive.attributes.resilience");
  const charmingResilience = getUpdated("charming.attributes.resilience");
  const discreetResilience = getUpdated("discreet.attributes.resilience");
  const resilienceTemp = getUpdated("resilienceTemp");

  const totalResilience = relentlessResilience + elusiveResilience + charmingResilience + discreetResilience + resilienceTemp;

  // Set the computed resilienceTotal into the update data so it carries through
  setProperty(updateData, "system.attributes.resilienceTotal", totalResilience);
});

Hooks.on("createActor", async (actor) => {
  if (actor.type === "character") {
    // Define the specific locations and values for each data field
    const characterData = {
      "system.attributes.stress": 0,
      "system.attributes.stressTolerance": 0,
      "system.attributes.corruption": 0,
      "system.attributes.trauma": 0,
      "system.attributes.level": 0,
      "system.attributes.quirk": "none",
      "system.attributes.drive": "none",
      "system.attributes.playerObjective": "none",
      "system.attributes.characterObjectives.objective1": "none",
      "system.attributes.characterObjectives.objective2": "none",
      "system.attributes.characterObjectives.objective3": "none",
      "system.attributes.bonds.bond1.character": "name",
      "system.attributes.bonds.bond1.level": "none",
      "system.attributes.bonds.bond1.health": "none",
      "system.attributes.bonds.bond2.character": "name",
      "system.attributes.bonds.bond2.level": "none",
      "system.attributes.bonds.bond2.health": "none",
      "system.attributes.bonds.bond3.character": "name",
      "system.attributes.bonds.bond3.level": "none",
      "system.attributes.bonds.bond3.health": "none",
      "system.attributes.loadout.weapon1": "none",
      "system.attributes.loadout.weapon2": "none",
      "system.attributes.loadout.armor.mundane": "none",
      "system.attributes.loadout.armor.phase": "none",
      "system.attributes.loadout.armor.advancedPhaase": "none",
      "system.attributes.loadout.smallItem1": "none",
      "system.attributes.loadout.smallItem2": "none",
      "system.attributes.loadout.smallItem3": "none",
      "system.attributes.loadout.smallItem4": "none",
      "system.attributes.loadout.mediumItem1": "none",
      "system.attributes.loadout.mediumItem2": "none",
      "system.attributes.loadout.mediumItem3": "none",
      "system.attributes.loadout.largeItem": "none",
      "system.attributes.loadout.exspansionSlot1": "none",
      "system.attributes.loadout.exspansionSlot2": "none",
      "system.attributes.relentless.attributes.clash": 0,
      "system.attributes.relentless.attributes.push": 0,
      "system.attributes.relentless.attributes.menace": 0,
      "system.attributes.relentless.attributes.nerve.value": 0,
      "system.attributes.relentless.attributes.nerve.max": 0,
      "system.attributes.relentless.attributes.temporaryNerve": 0,
      "system.attributes.relentless.attributes.resilience": 0,
      "system.attributes.elusive.attributes.maneuver": 0,
      "system.attributes.elusive.attributes.control": 0,
      "system.attributes.elusive.attributes.stealth": 0,
      "system.attributes.elusive.attributes.nerve.value": 0,
      "system.attributes.elusive.attributes.nerve.max": 0,
      "system.attributes.elusive.attributes.temporaryNerve": 0,
      "system.attributes.elusive.attributes.resilience": 0,
      "system.attributes.charming.attributes.sense": 0,
      "system.attributes.charming.attributes.influence": 0,
      "system.attributes.charming.attributes.deceive": 0,
      "system.attributes.charming.attributes.nerve.value": 0,
      "system.attributes.charming.attributes.nerve.max": 0,
      "system.attributes.charming.attributes.temporaryNerve": 0,
      "system.attributes.charming.attributes.resilience": 0,
      "system.attributes.discreet.attributes.notice": 0,
      "system.attributes.discreet.attributes.focus": 0,
      "system.attributes.discreet.attributes.invoke": 0,
      "system.attributes.discreet.attributes.nerve.value": 0,
      "system.attributes.discreet.attributes.nerve.max": 0,
      "system.attributes.discreet.attributes.temporaryNerve": 0,
      "system.attributes.discreet.attributes.resilience": 0,
      "system.attributes.resilienceTemp":0,
      "system.attributes.generalAp.value": 2,
      "system.attributes.generalAp.max": 2,
      "system.attributes.combatAp.value": 1,
      "system.attributes.combatAp.max": 1,
      "system.attributes.xp.cumulative": 0,
      "system.attributes.xp.current": 0,
    };

    // Update the actor with the defined data
    await actor.update(characterData);
    console.log(`Character data applied to actor: ${actor.name}`);
  }
});

/* -------------------------------------------- */
/*  Custom Roll Function with Dialog            */
/* -------------------------------------------- */

// Import and initialize Dice So Nice if not already initialized
if (game.dice3d) {
  game.dice3d.showForRoll = true;
}

/**
 * Rolls dice based on the user's inputs and handles exploding dice logic.
 */
export async function rollDicePool(attributeValue, nervePoints, tempNervePoints, maxNerve, probability) {
  let totalRolls = [];
  let nerveSpent = nervePoints + tempNervePoints;
  let totalD8s = attributeValue + nervePoints + tempNervePoints + probability;

  if (isNaN(nervePoints) || isNaN(tempNervePoints) || isNaN(probability)) {
    ui.notifications.error("Invalid input values.");
    return;
  }

  if (totalD8s <= 0) {
    // Roll 2d8 and keep the lowest
    let roll = await new Roll(`2d8kl`).roll({ async: true });
    if (!roll || !roll.dice || !roll.dice[0]) {
      ui.notifications.error("Error in dice roll. Roll result is invalid.");
      return;
    }
    totalRolls = roll.dice[0].results.map(r => r.result);

    // Show the roll with Dice So Nice
    if (game.dice3d) await game.dice3d.showForRoll(roll);
  } else {
    // Roll with the adjusted number of dice and keep the highest, with exploding 8s
    let roll = await new Roll(`${totalD8s}d8kh`).roll({ async: true });
    if (!roll || !roll.dice || !roll.dice[0]) {
      ui.notifications.error("Error in dice roll. Roll result is invalid.");
      return;
    }
    totalRolls = roll.dice[0].results.map(r => r.result);

    // Show the roll with Dice So Nice
    if (game.dice3d) await game.dice3d.showForRoll(roll);

    // Handle exploding 8s
let explodingRolls = totalRolls.filter(r => r === 8);
while (explodingRolls.length > 0) {
  const count = explodingRolls.length;

  // Ensure the dice limit isn't exceeded
  if (totalRolls.length + count > 15) {
    ui.notifications.error("Exploding dice exceeded the 15-dice limit.");
    break;
  }
  if (game.dice3d) await game.dice3d.showForRoll(roll);

  // Roll for each exploding 8
  let additionalRolls = await new Roll(`${count}d8`).roll({ async: true });
  if (!additionalRolls || !additionalRolls.dice || !additionalRolls.dice[0]) {
    ui.notifications.error("Error in exploding dice roll.");
    break;
  }

  // Add only the results of the new rolls
  totalRolls = totalRolls.concat(additionalRolls.dice[0].results.map(r => r.result));

  // Re-check for new explosions only in these additional rolls
  explodingRolls = additionalRolls.dice[0].results.filter(r => r === 8);
}

  }

  // Process roll results
  const ROLL_RESULTS = {
    criticalFailures: [1],
    failures: [2, 3],
    mixedSuccesses: [4, 5],
    successes: [6, 7],
    criticalSuccesses: [8]
  };

  function categorizeRolls(totalRolls) {
    const results = {};
    Object.entries(ROLL_RESULTS).forEach(([key, range]) => {
      results[key] = totalRolls.filter(r => range.includes(r)).length;
    });
    return results;
  }

  const results = categorizeRolls(totalRolls);

  // Calculate doubles and regain nerve
  const rollCounts = totalRolls.reduce((acc, roll) => {
    acc[roll] = (acc[roll] || 0) + 1;
    return acc;
  }, {});

  let nerveRegained = 0;
  for (const count of Object.values(rollCounts)) {
    if (count > 1) {
      nerveRegained += Math.floor(count / 2);
    }
  }
  nerveRegained = Math.min(nerveRegained, maxNerve);

  // Return the results
  return {
    totalRolls: totalRolls,
    results: results,
    nerveSpent: nerveSpent,
    nerveRegained: nerveRegained
  };
}

