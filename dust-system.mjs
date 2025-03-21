import { DustActor } from "./modules/dust-actor.js";
import {DustItem} from "./modules/dust-item.js";
import {DustGear} from "./modules/dust-gear.js";
import {DustDrive} from "./modules/dust-drive.js";
import {DustQuirk} from "./modules/dust-quirk.js";
import {DustWeapon} from "./modules/dust-weapon.js";
import {DustArmor} from "./modules/dust-armor.js";
import {DustSpeciality} from "./modules/dust-speciality.js";
import {DustAbility} from "./modules/dust-ability.js";
import {DustArchetype} from "./modules/dust-archetype.js";
import {DustFeature} from "./modules/dust-feature.js";
import {DustUpgrade} from "./modules/dust-upgrade.js"
import { DustActorSheet } from "./modules/dust-actor-sheet-option1.js";
//import { DustActorSheetOption2 } from "./modules/dust-actor-sheet-option2.js";
//import { DustActorSheetOption3 } from "./modules/dust-actor-sheet-option3.js";
//import { DustActorSheetOption4 } from "./modules/dust-actor-sheet-option4.js";
// Import sheet classes
import { GearSheet } from "./templates/item/dust-gear-sheet.js";
import { DriveSheet } from "./templates/item/dust-drive-sheet.js";
import { QuirkSheet } from "./templates/item/dust-quirk-sheet.js";
import { WeaponSheet } from "./templates/item/dust-weapon-sheet.js";
import { SpecialitySheet } from "./templates/item/dust-speciality-sheet.js";
import { AbilitySheet } from "./templates/item/dust-ability-sheet.js";
import { ArchetypeSheet } from "./templates/item/dust-archetype-sheet.js";
import { FeatureSheet } from "./templates/item/dust-feature-sheet.js";
import { UpgradeSheet } from "./templates/item/dust-upgrade-sheet.js";

/**
 * Initialize the DUST system
 */
Hooks.once("init", async function () {
  console.log("DUST | Initializing the DUST Game System");

  // Define custom Actor Document class
  CONFIG.Actor.documentClass = DustActor;
  CONFIG.Item.documentClass = DustItem;
  CONFIG.Item.documentClass.gear = DustGear;
  CONFIG.Item.documentClass.drive = DustDrive;
  CONFIG.Item.documentClass.quirk = DustQuirk;
  CONFIG.Item.documentClass.weapon = DustWeapon;
  CONFIG.Item.documentClass.armor = DustArmor;
  CONFIG.Item.documentClass.speciality = DustSpeciality;
  CONFIG.Item.documentClass.ability = DustAbility;
  CONFIG.Item.documentClass.archetype = DustArchetype;
  CONFIG.Item.documentClass.feature = DustFeature;
  CONFIG.Item.documentClass.upgrade = DustUpgrade;

  // Unregister core actor sheet
  Actors.unregisterSheet('core', ActorSheet);

  // Register custom actor sheets (four character sheet options)
  Actors.registerSheet('dust-system', DustActorSheet, {
    label: "DUST Character Sheet Option 1",
    types: ["character"],
    makeDefault: true
  });

  // Preload Handlebars templates
  await preloadHandlebarsTemplates();

  console.log("dust-system | All sheets registered successfully");
});

Hooks.on('ready', function () {
  // Register font settings
  game.settings.register('dust-system', "fontSettingHeaders", {
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

  // Preload fonts with non-dynamic paths
  preloadFont("Vivaldi", "systems/dust-system/fonts/VIVALDII.ttf");
  preloadFont("Roboto", "systems/dust-system/fonts/Roboto-Black.ttf");
  preloadFont("OpenDyslexic", "systems/dust-system/fonts/OpenDyslexic.ttf");
  preloadFont("VinerITC", "systems/dust-system/fonts/VINERITC.ttf");
  preloadFont("Achafont", "systems/dust-system/fonts/Achafont.ttf");
  preloadFont("Vladimir", "systems/dust-system/fonts/VLADIMIR.ttf");

  // Fetch the selected fonts
  const fontHeader = game.settings.get('dust-system', "fontSettingHeaders");
  const fontTooltip = game.settings.get('dust-system', "fontSettingTooltips");

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

  game.settings.register('dust-system', "fontSettingTooltips", {
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

async function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/dust-system/templates/character-sheet-option1.hbs"
    //"systems/dust-system/templates/character-sheet-option2.hbs",
    //"systems/dust-system/templates/character-sheet-option3.hbs",
    //"systems/dust-system/templates/character-sheet-option4.hbs"
  ];
  return loadTemplates(templatePaths);
}

// Register the system settings button
Hooks.once("init", () => {
  game.settings.register('dust-system', "importHandbook", {
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

Hooks.once("ready", function () {
  console.log("DUST | The DUST Game System is ready with multiple character sheet options!");
});
