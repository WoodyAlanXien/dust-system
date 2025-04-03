/**
 * Extend the base Actor class to implement additional system-specific logic.
 */
export class DustActor extends Actor {
  /**
   * Prepare data for the actor.
   */
  prepareData() {
    super.prepareData();

      const system = this.system;
      const actor = this.actor;
      const calculateRes = system.attributes.relentless.attributes.resilience +
      system.attributes.relentless.attributes.temporaryResilience +
      system.attributes.elusive.attributes.resilience +
      system.attributes.elusive.attributes.temporaryResilience +
      system.attributes.charming.attributes.resilience +
      system.attributes.charming.attributes.temporaryResilience +
      system.attributes.discreet.attributes.resilience +
      system.attributes.discreet.attributes.temporaryResilience;
      
      system.attributes = system.attributes || {}
      system.attributes.resilienceTotal = system.attributes.resilienceTotal || calculateRes;
      system.attributes.stress = system.attributes.stress || 0;
      system.attributes.stressTolerance = system.attributes.stressTolerance || 0;
      system.attributes.corruption = system.attributes.corruption || 0;
      system.attributes.trauma = system.attributes.trauma || 0;
      system.attributes.actionPoints = system.attributes.actionPoints || {}
      system.attributes.actionPoints.used = system.attributes.actionPoints.used || 0;
      system.attributes.actionPoints.max = system.attributes.actionPoints.max || 0;
      system.attributes.level = system.attributes.level || 0;
      system.attributes.xp = system.attributes.xp || {}
      system.attributes.xp.cumulative = system.attributes.xp.cumulative || 0;
      system.attributes.xp.current = system.attributes.xp.current || 0;
      system.attributes.aether = system.attributes.aether || {}
      system.attributes.aether.capacity = system.attributes.aether.capacity || 3;
      system.attributes.aether.conserved = system.attributes.aether.conserved || 0;
      system.attributes.aether.supply = system.attributes.aether.supply || 0;
      system.attributes.relentless = system.attributes.relentless || {}
      system.attributes.relentless.attributes = system.attributes.relentless.attributes || {}
      system.attributes.relentless.attributes.clash = system.attributes.relentless.attributes.clash || 0;
      system.attributes.relentless.attributes.push = system.attributes.relentless.attributes.push || 0;
      system.attributes.relentless.attributes.menace = system.attributes.relentless.attributes.menace || 0;
      system.attributes.relentless.attributes.nerveCurrent = system.attributes.relentless.attributes.nerveCurrent || 0;
      system.attributes.relentless.attributes.nerveMax = system.attributes.relentless.attributes.nerveMax || 0;
      system.attributes.relentless.attributes.temporaryNerve = system.attributes.relentless.attributes.temporaryNerve || 0;
      system.attributes.relentless.attributes.resilience = system.attributes.relentless.attributes.resilience || 0;
      system.attributes.relentless.attributes.temporaryResilience = system.attributes.relentless.attributes.temporaryResilience || 0;
      system.attributes.elusive = system.attributes.elusive || {}
      system.attributes.elusive.attributes = system.attributes.elusive.attributes || {}
      system.attributes.elusive.attributes.maneuver = system.attributes.elusive.attributes.maneuver || 0;
      system.attributes.elusive.attributes.control = system.attributes.elusive.attributes.control || 0;
      system.attributes.elusive.attributes.stealth = system.attributes.elusive.attributes.stealth || 0;
      system.attributes.elusive.attributes.nerveCurrent = system.attributes.elusive.attributes.nerveCurrent || 0;
      system.attributes.elusive.attributes.nerveMax = system.attributes.elusive.attributes.nerveMax || 0;
      system.attributes.elusive.attributes.temporaryNerve = system.attributes.elusive.attributes.temporaryNerve || 0;
      system.attributes.elusive.attributes.resilience = system.attributes.elusive.attributes.resilience || 0;
      system.attributes.elusive.attributes.temporaryResilience = system.attributes.elusive.attributes.temporaryResilience || 0;
      system.attributes.charming = system.attributes.charming || {}
      system.attributes.charming.attributes = system.attributes.charming.attributes || {}
      system.attributes.charming.attributes.sense = system.attributes.charming.attributes.sense || 0;
      system.attributes.charming.attributes.influence = system.attributes.charming.attributes.influence || 0;
      system.attributes.charming.attributes.deceive = system.attributes.charming.attributes.deceive || 0;
      system.attributes.charming.attributes.nerveCurrent = system.attributes.charming.attributes.nerveCurrent || 0;
      system.attributes.charming.attributes.nerveMax = system.attributes.charming.attributes.nerveMax || 0;
      system.attributes.charming.attributes.temporaryNerve = system.attributes.charming.attributes.temporaryNerve || 0;
      system.attributes.charming.attributes.resilience = system.attributes.charming.attributes.resilience || 0;
      system.attributes.charming.attributes.temporaryResilience = system.attributes.charming.attributes.temporaryResilience || 0;
      system.attributes.discreet = system.attributes.discreet || {}
      system.attributes.discreet.attributes = system.attributes.discreet.attributes || {}
      system.attributes.discreet.attributes.notice = system.attributes.discreet.attributes.notice || 0;
      system.attributes.discreet.attributes.focus = system.attributes.discreet.attributes.focus || 0;
      system.attributes.discreet.attributes.invoke = system.attributes.discreet.attributes.invoke || 0;
      system.attributes.discreet.attributes.nerveCurrent = system.attributes.discreet.attributes.nerveCurrent || 0;
      system.attributes.discreet.attributes.nerveMax = system.attributes.discreet.attributes.nerveMax || 0;
      system.attributes.discreet.attributes.temporaryNerve = system.attributes.discreet.attributes.temporaryNerve || 0;
      system.attributes.discreet.attributes.resilience = system.attributes.discreet.attributes.resilience || 0;
      system.attributes.discreet.attributes.temporaryResilience = system.attributes.discreet.attributes.temporaryResilience || 0;
      system.attributes.quirk = system.attributes.quirk || "none";
      system.attributes.drive = system.attributes.drive || "none";
      system.attributes.playerObjective = system.attributes.playerObjective || "none";
      system.attributes.characterObjectives = system.attributes.characterObjectives || {}
      system.attributes.characterObjectives.objective1 = system.attributes.characterObjectives.objective1 || "none";
      system.attributes.characterObjectives.objective2 = system.attributes.characterObjectives.objective2 || "none";
      system.attributes.characterObjectives.objective3 = system.attributes.characterObjectives.objective3 || "none";
      system.attributes.bonds = system.attributes.bonds || {}
      system.attributes.bonds.bond1 = system.attributes.bonds.bond1 || {}
      system.attributes.bonds.bond1.character = system.attributes.bonds.bond1.character || "none";
      system.attributes.bonds.bond1.level = system.attributes.bonds.bond1.level || 0;
      system.attributes.bonds.bond1.health = system.attributes.bonds.bond1.health || 0;
      system.attributes.bonds.bond2 = system.attributes.bonds.bond2 || {}
      system.attributes.bonds.bond2.character = system.attributes.bonds.bond2.character || "none";
      system.attributes.bonds.bond2.level = system.attributes.bonds.bond2.level || 0;
      system.attributes.bonds.bond2.health = system.attributes.bonds.bond2.health || 0;
      system.attributes.bonds.bond3 = system.attributes.bonds.bond3 || {}
      system.attributes.bonds.bond3.character = system.attributes.bonds.bond3.character || "none";
      system.attributes.bonds.bond3.level = system.attributes.bonds.bond3.level || 0;
      system.attributes.bonds.bond3.health = system.attributes.bonds.bond3.health || 0;
      system.attributes.loadout = system.attributes.loadout || {}
      system.attributes.loadout.weapon1 = system.attributes.loadout.weapon1 || "none";
      system.attributes.loadout.weapon2 = system.attributes.loadout.weapon2 || "none";
      system.attributes.loadout.armor = system.attributes.loadout.armor || {}
      system.attributes.loadout.armor.mundane = system.attributes.loadout.armor.mundane || "none";
      system.attributes.loadout.armor.phase = system.attributes.loadout.armor.phase || "none";
      system.attributes.loadout.armor.advancedPhaase = system.attributes.loadout.armor.advancedPhaase || "none";
      system.attributes.loadout.smallItem1 = system.attributes.loadout.smallItem1 || "none";
      system.attributes.loadout.smallItem2 = system.attributes.loadout.smallItem2 || "none";
      system.attributes.loadout.smallItem3 = system.attributes.loadout.smallItem3 || "none";
      system.attributes.loadout.smallItem4 = system.attributes.loadout.smallItem4 || "none";
      system.attributes.loadout.mediumItem1 = system.attributes.loadout.mediumItem1 || "none";
      system.attributes.loadout.mediumItem2 = system.attributes.loadout.mediumItem2 || "none";
      system.attributes.loadout.mediumItem3 = system.attributes.loadout.mediumItem3 || "none";
      system.attributes.loadout.largeItem = system.attributes.loadout.largeItem || "none";
      system.attributes.loadout.exspansionSlot1 = system.attributes.loadout.exspansionSlot1 || "none";
      system.attributes.loadout.exspansionSlot2 = system.attributes.loadout.exspansionSlot2 || "none";
  }

    
     
    
 
   
  _calculateCharacterLevel(xp) {
    const xpThresholds = [1, 3, 8, 15, 24, 35, 48, 63, 80, 99, 120];
    let level = 1;

    for (let i = 0; i < xpThresholds.length; i++) {
      if (xp >= xpThresholds[i]) {
        level = i + 1;
      } else {
        break;
      }
    }

    if (xp >= 120) {
      level += Math.floor((xp - 120) / 25);
    }

    return level;
  }
}



