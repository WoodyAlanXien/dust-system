export class DustItem extends Item {
    async rollWeapon() {
      if (this.type !== "weapon") return;
  
      const { defaultSkill, combatApCost, durability, stressDamage, probabilityModifier, specialProperties } = this.system;
      const actor = this.actor;
  
      // Check if there’s enough combat AP
      if (actor.system.combatApAvail < combatApCost) {
        ui.notifications.warn("Not enough combat AP to attack.");
        return;
      }
  
      // Apply probability modifier
      const skillValue = actor.system.skills[defaultSkill] || 0;
      const totalDice = Math.min(skillValue + probabilityModifier, 5); // Cap at 5d8
      const rollFormula = `${totalDice}d8kh`;
  
      const roll = new Roll(rollFormula);
      await roll.roll({ async: false });
  
      // Handle Special Properties
      for (const property of specialProperties) {
        switch (property.type) {
          case "Sharp":
            if (!target.system.armor) {
              stressDamage += 1; // Bonus stress against unarmored targets
            }
            break;
          case "Accurate":
            if (this.system.range !== "melee") {
              stressDamage += 1; // Bonus stress for ranged attacks
            }
            break;
          case "Heavy":
            if (roll.dice[0].results.some(die => die.result === 8)) { // Critical success
              ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor }),
                content: "The target is knocked back 1 foot due to the Heavy property."
              });
            }
            break;
          case "Disintegrate":
            if (target.system.tierLevel < 3 && roll.total >= target.system.resilience) {
              ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor }),
                content: "The target is atomized due to the Disintegrate property!"
              });
            }
            break;
          case "Scattershot":
            // Add probability modifier
            probabilityModifier += 1;
            break;
          // Add more special property logic as needed
          default:
            console.warn(`Unhandled special property: ${property.type}`);
        }
      }
  
      // Deduct combat AP
      await actor.update({
        "system.combatApAvail": actor.system.combatApAvail - combatApCost
      });
  
      // Reduce durability
      if (durability > 0) {
        await this.update({ "system.durability": durability - 1 });
        if (durability - 1 === 0) {
          ui.notifications.warn(`${this.name} has broken.`);
        }
      }
  
      // Create a chat message for the attack
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: `
          <p><strong>${this.name}</strong> Attack</p>
          <p>Rolled: ${roll.formula} → Result: ${roll.total}</p>
          <p>Stress Inflicted: <strong>${stressDamage}</strong></p>
        `,
        flavor: "Weapon Attack"
      });
    
           
          if (this.type === "armor") {
            const { level, quality } = this.system;
      
            // Assign Armor Rating (AR) based on level and quality
            let arValue = 0;
            let stressReduction = 0;
      
            switch (level) {
              case 1: // Mundane
                arValue = 1;
                stressReduction = quality === "basic" ? 1 : quality === "advanced" ? 2 : 3;
                break;
              case 2: // Phase
                arValue = 2;
                stressReduction = quality === "basic" ? 1 : quality === "advanced" ? 2 : 3;
                break;
              case 3: // Advanced Phase
                arValue = 3;
                stressReduction = quality === "basic" ? 1 : quality === "advanced" ? 2 : 3;
                break;
            }
      
            // Combine AR value and quality notation
            this.system.ar = {
              value: arValue,
              notation: `${arValue}${quality.charAt(0)}`
            };
      
            this.system.stressReduction = stressReduction;
          }
        }
      
        /**
         * Apply stress reduction and check critical hit bypass.
         * @param {Object} attack - Details of the incoming attack.
         * @returns {number} The stress damage after reduction.
         */
        reduceStress(attack) {
          if (attack.isCritical && this.system.criticalBypass) {
            ui.notifications.info("Critical hit bypasses armor!");
            return attack.stress; // No reduction on critical hits
          }
      
          // Reduce stress by armor's stress reduction value
          const reducedStress = Math.max(attack.stress - this.system.stressReduction, 0);
          return reducedStress;
        }
      }
      
 
  