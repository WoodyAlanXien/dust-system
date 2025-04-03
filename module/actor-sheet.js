import { DustActor } from './actor.js';


export const TemplateCache = {
  templates: new Map(),

  async load(path) {
    if (!this.templates.has(path)) {
      const template = await renderTemplate(path);
      this.templates.set(path, template);
    }
    return this.templates.get(path);
  },
};


Hooks.once('init', () => {
  game.settings.register('dust-system', 'debug', {
    name: 'Enable Debug Logging',
    hint: 'If enabled, detailed logs will be output to the console.',
    scope: 'client',
    config: true,
    type: Boolean,
    default: false,
  });
});

// Register partial templates
Hooks.once('init', async () => {
  try {
    await Promise.all([
      TemplateCache.load("systems/dust-system/templates/partials/attributes.hbs"),
      TemplateCache.load("systems/dust-system/templates/partials/objectives.hbs"),
      TemplateCache.load("systems/dust-system/templates/partials/loadout.hbs"),
      TemplateCache.load("systems/dust-system/templates/partials/specialities.hbs"),
      TemplateCache.load("systems/dust-system/templates/partials/features.hbs"),
      TemplateCache.load("systems/dust-system/templates/partials/notes.hbs")
    ]);
  } catch (error) {
    console.error(`Failed to load template: ${path}`, error);
  }
});

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class DustActorSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["dust-system", "sheet", "actor"],
      template: "systems/dust-system/templates/actor-sheet.hbs",
      width: 1098,
      height: 700,
      resizable: true, // Makes the actor sheet resizable
    });
  }

  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();

    // Add the Edit/View toggle button
    buttons.unshift({
      label: this.options.editMode ? "View Mode" : "Edit Mode", // Dynamic label
      class: "toggle-edit-mode",
      icon: this.options.editMode ? "fas fa-eye" : "fas fa-edit", // Dynamic icon
      onclick: () => {
        this.options.editMode = !this.options.editMode; // Toggle the mode state
        this.render(false); // Re-render the sheet
        ui.notifications.info(
          `Switched to ${this.options.editMode ? "Edit Mode" : "View Mode"}.`
        );
      },
    });

    return buttons;
  }

  getData() {
    const context = super.getData();
    context.editMode = this.options.editMode || false; // Default to false
    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Gear icon functionality
    const gearIcon = html.find('.gear-icon');
    if (gearIcon.length) {
      gearIcon.on('click', () => {
        try {
          const actorId = this.actor?.id;
          if (!actorId) throw new Error('Actor not found');
          new game.dustSystem.DustActorConfig(this.actor).render(true);
        } catch (error) {
          console.error(error.message);
          ui.notifications.error('Actor configuration cannot be opened: ' + error.message);
        }
      });
    }
  }
}
