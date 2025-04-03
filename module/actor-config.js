export class DustActorConfig {
  constructor(actor) {
    this.actor = actor;
  }
  
  render(show) {
    console.log(`Rendering configuration for actor: ${this.actor.name}`);
    // Add your rendering logic here
  }
}

Hooks.on('renderActorSheet', (app, html, data) => {
  const gearIcon = html.find('.fas.fa-wrench.gear-icon');
  
  if (gearIcon.length) {
    gearIcon.on('click', () => {
      const actor = app.actor; // Extract the actor from the app

      // Replace these with the IDs of the macros you want to run
      const macroIds = ["K0HBU3tVPZVfDgey", "kpQ1zVXmfd2ryGR2", "UohgcpNsXDMgilcn", "4LeRy583xHgNDL01"];
      const config = new DustActorConfig(actor);
      config.render(true);
  
      macroIds.forEach(id => {
        const macro = game.macros.get(id) || game.macros.find(m => m.name === id);
        if (macro) {
          macro.execute();
        } else {
          console.warn(`Macro "${id}" not found.`);
        }
      });
    });
  } else {
    console.error('Gear icon element not found in rendered actor sheet.');
  }
});

  
  