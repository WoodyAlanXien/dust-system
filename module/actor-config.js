export class DustActorConfig {
  constructor(actor) {
    this.actor = actor;
  }
  
  render(show) {
    console.log(`Rendering configuration for actor: ${this.actor.name}`);
    // Add your rendering logic here
  }
}

// Define macro functionalities directly inline:
function macroOne(actor) {
  // Insert logic for Macro "K0HBU3tVPZVfDgey"
  console.log(`Executing Macro One for actor: ${actor.name}`);
  const ownedActors = game.actors.filter(actor => actor.isOwner);

  if (ownedActors.length === 0) {
    ui.notifications.warn("You don't own any actors!");
  } else if (ownedActors.length === 1) {
    const actor = ownedActors[0];
    openDialog(actor);
  } else {
    new Dialog({
      title: "Select an Actor",
      content: `
        <form>
          <div class="form-group">
            <label for="actor">Choose an actor:</label>
            <select id="actor" name="actor">
              ${ownedActors.map(actor => `<option value="${actor.id}">${actor.name}</option>`).join("")}
            </select>
          </div>
        </form>
      `,
      buttons: {
        ok: {
          label: "Confirm",
          callback: (html) => {
            const actorID = html.find('[name="actor"]').val();
            const actor = game.actors.get(actorID);
            openDialog(actor);
          }
        },
        cancel: {
          label: "Cancel"
        }
      },
      default: "ok"
    }).render(true);
  }
  
  function openDialog(actor) {
    new Dialog({
      title: `Update Attributes for ${actor.name}`,
      content: `
        <form>
          <div class="form-group">
            <label for="teamName">Team Name:</label>
            <input type="text" id="teamName" name="teamName" value="${actor.system.teamName || "B.E.S.T."}"/>
          </div>
          <div class="form-group">
            <label for="archetype">Archetype:</label>
            <input type="text" id="archetype" name="archetype" value="${actor.system.archetype || ""}"/>
          </div>
          <div class="form-group">
            <label for="appearance">Appearance:</label>
            <input type="text" id="appearance" name="appearance" value="${actor.system.appearance || ""}"/>
          </div>
          <div class="form-group">
            <label for="origin">Origin:</label>
            <input type="text" id="origin" name="origin" value="${actor.system.origin || ""}"/>
          </div>
          <div class="form-group">
            <label for="level">Level:</label>
            <input type="number" id="level" name="level" value="${actor.system.attributes.level || 0}" min="0"/>
          </div>
        </form>
      `,
      buttons: {
        ok: {
          label: "Update",
          callback: (html) => {
            actor.update({
              "system.teamName": html.find('[name="teamName"]').val(),
              "system.archetype": html.find('[name="archetype"]').val(),
              "system.appearance": html.find('[name="appearance"]').val(),
              "system.origin": html.find('[name="origin"]').val(),
              "system.attributes.level": Number(html.find('[name="level"]').val())
            });
            ui.notifications.info(`${actor.name} has been updated!`);
          }
        },
        cancel: {
          label: "Cancel"
        }
      },
      default: "ok"
    }).render(true);
  }}

function macroTwo(actor) {
  // Insert logic for Macro "kpQ1zVXmfd2ryGR2"
  console.log(`Executing Macro Two for actor: ${actor.name}`);
  const ownedActors = game.actors.filter(actor => actor.isOwner);

  if (ownedActors.length === 0) {
    ui.notifications.warn("You don't own any actors!");
  } else if (ownedActors.length === 1) {
    // Automatically use the single owned actor
    const actor = ownedActors[0];
    promptForAttributes(actor);
  } else {
    // Prompt user to select an actor if multiple are owned
    new Dialog({
      title: "Select an Actor",
      content: `
        <form>
          <div class="form-group">
            <label for="actor">Choose an actor:</label>
            <select id="actor" name="actor">
              ${ownedActors.map(actor => `<option value="${actor.id}">${actor.name}</option>`).join("")}
            </select>
          </div>
        </form>
      `,
      buttons: {
        ok: {
          label: "Confirm",
          callback: (html) => {
            const actorID = html.find('[name="actor"]').val();
            const actor = game.actors.get(actorID);
            promptForAttributes(actor);
          }
        },
        cancel: {
          label: "Cancel"
        }
      },
      default: "ok"
    }).render(true);
  }
  
  // Function to prompt user for attributes and update them
  function promptForAttributes(actor) {
    new Dialog({
      title: `Set Attributes for ${actor.name}`,
      content: `
        <form>
          <div class="form-group">
            <label for="stress">Stress:</label>
            <input type="number" id="stress" name="stress" value="0">
          </div>
          <div class="form-group">
            <label for="stressTolerance">Stress Tolerance:</label>
            <input type="number" id="stressTolerance" name="stressTolerance" value="0">
          </div>
          <div class="form-group">
            <label for="corruption">Corruption:</label>
            <input type="number" id="corruption" name="corruption" value="0">
          </div>
          <div class="form-group">
            <label for="trauma">Trauma:</label>
            <input type="number" id="trauma" name="trauma" value="0">
          </div>
          <div class="form-group">
            <label for="gactionPoints">General Action Points:</label>
            <input type="number" id="gactionPointsv" name="gactionPointsv" value="0">
          </div>
          <div class="form-group">
            <label for="gactionPoints">General Action Points Max:</label>
            <input type="number" id="gactionPointsMax" name="gactionPointsMax" value="0">
          </div>
          <div class="form-group">
            <label for="cactionPoints">CombatAction Points:</label>
            <input type="number" id="cactionPointsv" name="cactionPointsv" value="0">
          </div>
          <div class="form-group">
            <label for="cactionPoints">Combat Action Points Max:</label>
            <input type="number" id="cactionPointsMax" name="cactionPointsMax" value="0">
          </div>
           <div class="form-group">
            <label for="level">XP Current:</label>
            <input type="number" id="xpCur" name="xpCur" value="0">
          </div>
          <div class="form-group">
            <label for="level">XP Cumulative:</label>
            <input type="number" id="xpCum" name="xpCum" value="0">
          </div>
        </form>
      `,
      buttons: {
        ok: {
          label: "Update",
          callback: (html) => {
            const stress = Number(html.find('[name="stress"]').val());
            const stressTolerance = Number(html.find('[name="stressTolerance"]').val());
            const corruption = Number(html.find('[name="corruption"]').val());
            const trauma = Number(html.find('[name="trauma"]').val());
            const gactionPointsv = Number(html.find('[name="gactionPointsv"]').val());
            const gactionPointsMax = Number(html.find('[name="gactionPointsMax"]').val());
            const cactionPointsv = Number(html.find('[name="cactionPointsv"]').val());
            const cactionPointsMax = Number(html.find('[name="cactionPointsMax"]').val());
            const xpCur = Number(html.find('[name="xpCur"]').val());
            const xpCum = Number(html.find('[name="xpCum"]').val());
  
            actor.update({
              "system.attributes.stress": stress,
              "system.attributes.stressTolerance": stressTolerance,
              "system.attributes.corruption": corruption,
              "system.attributes.trauma": trauma,
              "system.attributes.generalAp.value": gactionPointsv,
              "system.attributes.generalAp.max": gactionPointsMax,
              "system.attributes.combatAp.value": cactionPointsv,
              "system.attributes.combatAp.max": cactionPointsMax,
              "system.attributes.xp.current": xpCur,
              "system.attributes.xp.cumulative": xpCum
            });
  
            ui.notifications.info(`Updated attributes for ${actor.name}`);
          }
        },
        cancel: {
          label: "Cancel"
        }
      },
      default: "ok"
    }).render(true);
  }}

function macroThree(actor) {
  // Insert logic for Macro "UohgcpNsXDMgilcn"
  console.log(`Executing Macro Three for actor: ${actor.name}`);
  const ownedActors = game.actors.filter(actor => actor.isOwner); if (ownedActors.length === 0) { ui.notifications.warn("You don't own any actors!"); } else if (ownedActors.length === 1) { const actor = ownedActors[0]; openDialogForSection(actor, "Relentless Attributes"); } else { new Dialog({ title: "Select an Actor", content: ` <form> <div class="form-group"> <label for="actor">Choose an actor:</label> <select id="actor" name="actor"> ${ownedActors.map(actor => `<option value="${actor.id}">${actor.name}</option>`).join("")} </select> </div> </form> `, buttons: { ok: { label: "Confirm", callback: (html) => { const actorID = html.find('[name="actor"]').val(); const actor = game.actors.get(actorID); openDialogForSection(actor, "Relentless Attributes"); } }, cancel: { label: "Cancel" } }, default: "ok" }).render(true); }

  function openDialogForSection(actor, section) {
    let content = "";
  
    // Relentless Attributes Section
    if (section === "Relentless Attributes") {
      content = `
        <form>
          <div class="form-group">
            <label for="clash">Clash:</label>
            <input type="number" id="clash" name="clash" value="0">
          </div>
          <div class="form-group">
            <label for="push">Push:</label>
            <input type="number" id="push" name="push" value="0">
          </div>
          <div class="form-group">
            <label for="menace">Menace:</label>
            <input type="number" id="menace" name="menace" value="0">
          </div>
          <div class="form-group">
            <label for="nerveCurrent">Nerve (Current):</label>
            <input type="number" id="nerveCurrent" name="nerveCurrent" value="0">
          </div>
          <div class="form-group">
            <label for="nerveMax">Nerve (Max):</label>
            <input type="number" id="nerveMax" name="nerveMax" value="0">
          </div>
          <div class="form-group">
            <label for="temporaryNerve">Temporary Nerve:</label>
            <input type="number" id="temporaryNerve" name="temporaryNerve" value="0">
          </div>
          <div class="form-group">
            <label for="resilience">Resilience:</label>
            <input type="number" id="resilience" name="resilience" value="0">
          </div>
          <div class="form-group">
            <label for="temporaryResilience">Temporary Resilience:</label>
            <input type="number" id="temporaryResilience" name="temporaryResilience" value="0">
          </div>
        </form>
      `;
    }
  
    // Elusive Attributes Section
    else if (section === "Elusive Attributes") {
      content = `
        <form>
          <div class="form-group">
            <label for="maneuver">Maneuver:</label>
            <input type="number" id="maneuver" name="maneuver" value="0">
          </div>
          <div class="form-group">
            <label for="control">Control:</label>
            <input type="number" id="control" name="control" value="0">
          </div>
          <div class="form-group">
            <label for="stealth">Stealth:</label>
            <input type="number" id="stealth" name="stealth" value="0">
          </div>
          <div class="form-group">
            <label for="nerveCurrent">Nerve (Current):</label>
            <input type="number" id="nerveCurrent" name="nerveCurrent" value="0">
          </div>
          <div class="form-group">
            <label for="nerveMax">Nerve (Max):</label>
            <input type="number" id="nerveMax" name="nerveMax" value="0">
          </div>
          <div class="form-group">
            <label for="temporaryNerve">Temporary Nerve:</label>
            <input type="number" id="temporaryNerve" name="temporaryNerve" value="0">
          </div>
          <div class="form-group">
            <label for="resilience">Resilience:</label>
            <input type="number" id="resilience" name="resilience" value="0">
          </div>
          <div class="form-group">
            <label for="temporaryResilience">Temporary Resilience:</label>
            <input type="number" id="temporaryResilience" name="temporaryResilience" value="0">
          </div>
        </form>
      `;
    }
  
    // Charming Attributes Section
    else if (section === "Charming Attributes") {
      content = `
        <form>
          <div class="form-group">
            <label for="sense">Sense:</label>
            <input type="number" id="sense" name="sense" value="0">
          </div>
          <div class="form-group">
            <label for="influence">Influence:</label>
            <input type="number" id="influence" name="influence" value="0">
          </div>
          <div class="form-group">
            <label for="deceive">Deceive:</label>
            <input type="number" id="deceive" name="deceive" value="0">
          </div>
          <div class="form-group">
            <label for="nerveCurrent">Nerve (Current):</label>
            <input type="number" id="nerveCurrent" name="nerveCurrent" value="0">
          </div>
          <div class="form-group">
            <label for="nerveMax">Nerve (Max):</label>
            <input type="number" id="nerveMax" name="nerveMax" value="0">
          </div>
          <div class="form-group">
            <label for="temporaryNerve">Temporary Nerve:</label>
            <input type="number" id="temporaryNerve" name="temporaryNerve" value="0">
          </div>
          <div class="form-group">
            <label for="resilience">Resilience:</label>
            <input type="number" id="resilience" name="resilience" value="0">
          </div>
          <div class="form-group">
            <label for="temporaryResilience">Temporary Resilience:</label>
            <input type="number" id="temporaryResilience" name="temporaryResilience" value="0">
          </div>
        </form>
      `;
    }
  
   else if (section === "Discreet Attributes") {
    content = `
      <form>
        <div class="form-group">
          <label for="notice">Notice:</label>
          <input type="number" id="notice" name="notice" value="0">
        </div>
        <div class="form-group">
          <label for="focus">Focus:</label>
          <input type="number" id="focus" name="focus" value="0">
        </div>
        <div class="form-group">
          <label for="invoke">Invoke:</label>
          <input type="number" id="invoke" name="invoke" value="0">
        </div>
        <div class="form-group">
            <label for="nerveCurrent">Nerve (Current):</label>
            <input type="number" id="nerveCurrent" name="nerveCurrent" value="0">
          </div>
          <div class="form-group">
            <label for="nerveMax">Nerve (Max):</label>
            <input type="number" id="nerveMax" name="nerveMax" value="0">
          </div>
        <div class="form-group">
          <label for="temporaryNerve">Temporary Nerve:</label>
          <input type="number" id="temporaryNerve" name="temporaryNerve" value="0">
        </div>
        <div class="form-group">
          <label for="resilience">Resilience:</label>
          <input type="number" id="resilience" name="resilience" value="0">
        </div>
        <div class="form-group">
          <label for="temporaryResilience">Temporary Resilience:</label>
          <input type="number" id="temporaryResilience" name="temporaryResilience" value="0">
        </div>
      </form>
    `;
  }
  
    // Dialog box rendering
    new Dialog({
      title: `Set ${section} for ${actor.name}`,
      content: content,
      buttons: {
        next: {
          label: "Next",
          callback: (html) => {
            // Extract values from the form and update actor attributes
            const updates = {};
            html.find("input").each((index, element) => {
              const input = $(element);
              updates[`system.attributes.${section.toLowerCase().replace(/ /g, ".")}.${input.attr("name")}`] = Number(input.val());
            });
            actor.update(updates);
  
            // Open the next dialog based on the current section
            if (section === "Relentless Attributes") openDialogForSection(actor, "Elusive Attributes");
            else if (section === "Elusive Attributes") openDialogForSection(actor, "Charming Attributes");
            else if (section === "Charming Attributes") openDialogForSection(actor, "Discreet Attributes"); // Add more as needed
          }
        },
        cancel: {
          label: "Cancel"
        }
      },
      default: "next"
    }).render(true);
  }}

function macroFour(actor) {
  // Insert logic for Macro "4LeRy583xHgNDL01"
  console.log(`Executing Macro Four for actor: ${actor.name}`);
  const ownedActors = game.actors.filter(actor => actor.isOwner);

  if (ownedActors.length === 0) {
    ui.notifications.warn("You don't own any actors!");
  } else if (ownedActors.length === 1) {
    const actor = ownedActors[0];
    openDialog(actor);
  } else {
    new Dialog({
      title: "Select an Actor",
      content: `
        <form>
          <div class="form-group">
            <label for="actor">Choose an actor:</label>
            <select id="actor" name="actor">
              ${ownedActors.map(actor => `<option value="${actor.id}">${actor.name}</option>`).join("")}
            </select>
          </div>
        </form>
      `,
      buttons: {
        ok: {
          label: "Confirm",
          callback: (html) => {
            const actorID = html.find('[name="actor"]').val();
            const actor = game.actors.get(actorID);
            openDialog(actor);
          }
        },
        cancel: {
          label: "Cancel"
        }
      },
      default: "ok"
    }).render(true);
  }
  
  function openDialog(actor) {
  const objectives = actor.system.characterObjectives || {};
  const objective1 = actor.system.characterObjectives.objective1 || {};
  const objective2 = actor.system.characterObjectives.objective2 || {};
  const objective3 = actor.system.characterObjectives.objective3 || {};
    new Dialog({
      title: `Update Attributes for ${actor.name}`,
      content: `
        <form>
          <div class="form-group">
            <label for="weapon1">Weapon 1:</label>
            <input type="text" id="weapon1" name="weapon1" value="${actor.system.loadout.weapon1 || ""}"/>
          </div>
          <div class="form-group">
            <label for="weapon2">Weapon 2:</label>
            <input type="text" id="weapon2" name="weapon2" value="${actor.system.loadout.weapon2 || ""}"/>
          </div>
          <div class="form-group">
            <label for="playerobjective">Player Objective:</label>
            <input type="text" id="playerobjective" name="playerobjective" value="${actor.system.playerobjective || ""}"/>
          </div>
          <div class="form-group">
            <label for="objective1">Character Objective 1:</label>
            <input type="text" id="objective1" name="objective1" value="${actor.system.characterObjectives.objective1 || ""}"/>
          </div>
          <div class="form-group">
            <label for="objective2">Character Objective 2:</label>
            <input type="text" id="objective2" name="objective2" value="${actor.system.characterObjectives.objective2 || ""}"/>
          </div>
          <div class="form-group">
            <label for="objective3">Character Objective 3:</label>
            <input type="text" id="objective3" name="objective3" value="${actor.system.characterObjectives.objective3 || ""}"/>
          </div>
          <div class="form-group">
            <label for="bond1name">Bond 1 Name:</label>
            <input type="text" id="bond1name" name="bond1name" value="${actor.system.bonds.bond1.name || ""}"/>
          </div>
          <div class="form-group">
            <label for="bond1level">Bond 1 Level:</label>
            <input type="number" id="bond1level" name="bond1level" value="${actor.system.bonds.bond1.level || 0}" min="0"/>
          </div>
          <div class="form-group">
            <label for="bond1health">Bond 1 Health:</label>
            <input type="number" id="bond1health" name="bond1health" value="${actor.system.bonds.bond1.health || 0}" min="0"/>
          </div>
          <div class="form-group">
            <label for="bond2name">Bond 2 Name:</label>
            <input type="text" id="bond2name" name="bond2name" value="${actor.system.bonds.bond2.name || ""}"/>
          </div>
          <div class="form-group">
            <label for="bond2level">Bond 2 Level:</label>
            <input type="number" id="bond2level" name="bond2level" value="${actor.system.bonds.bond2.level || 0}" min="0"/>
          </div>
          <div class="form-group">
            <label for="bond2health">Bond 2 Health:</label>
            <input type="number" id="bond2health" name="bond2health" value="${actor.system.bonds.bond2.health || 0}" min="0"/>
          </div>
          <div class="form-group">
            <label for="bond3name">Bond 3 Name:</label>
            <input type="text" id="bond3name" name="bond3name" value="${actor.system.bonds.bond3.name || ""}"/>
          </div>
          <div class="form-group">
            <label for="bond3level">Bond 3 Level:</label>
            <input type="number" id="bond3level" name="bond3level" value="${actor.system.bonds.bond3.level || 0}" min="0"/>
          </div>
          <div class="form-group">
            <label for="bond3health">Bond 3 Health:</label>
            <input type="number" id="bond3health" name="bond3health" value="${actor.system.bonds.bond3.health || 0}" min="0"/>
          </div></form>
      `,
      buttons: {
        ok: {
          label: "Update",
          callback: (html) => {
            actor.update({
    "system.characterobjectives": {
      objective1: actor.system.characterobjectives?.objective1 || "",
      objective2: actor.system.characterobjectives?.objective2 || "",
      objective3: actor.system.characterobjectives?.objective3 || "",
    }
  });
  
            ui.notifications.info(`${actor.name} has been updated!`);
          }
        },
        cancel: {
          label: "Cancel"
        }
      },
      default: "ok"
    }).render(true);
  }}

Hooks.on('renderActorSheet', (app, html, data) => {
  const gearIcon = html.find('.fas.fa-wrench.gear-icon');
  
  if (gearIcon.length) {
    gearIcon.on('click', () => {
      const actor = app.actor; // Extract the actor from the app
      const config = new DustActorConfig(actor);
      config.render(true);
  
      // Execute macros directly
      macroOne(actor);
      macroTwo(actor);
      macroThree(actor);
      macroFour(actor);
    });
  } else {
    console.error('Gear icon element not found in rendered actor sheet.');
  }
});