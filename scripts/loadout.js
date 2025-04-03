Hooks.on("renderActorSheet", (app, html, data) => {
    const actor = app.object;

    // Populate input fields with existing actor data
    html.find("#weapon1").attr("aria-label", "Wielded Weapon 1").val(actor.system.loadout.weapon1 || "");
    html.find("#weapon2").attr("aria-label", "Wielded Weapon 2").val(actor.system.loadout.weapon2 || "");
    html.find("#armor").attr("aria-label", "Worn Armor").val(actor.system.loadout.armor || "");

    // Add event listeners for updates
    html.find("#weapon1").on("change", (event) => actor.update({ "system.loadout.weapon1": event.target.value }));
    html.find("#weapon2").on("change", (event) => actor.update({ "system.loadout.weapon2": event.target.value }));
    html.find("#armor").on("change", (event) => actor.update({ "system.loadout.armor": event.target.value }));

    // Initialize Aether values
    const aetherCapacity = actor.system.attributes.aether.capacity || 0;
    const aetherConserved = actor.system.attributes.aether.conserved || 0;
    const aetherSupply = actor.system.attributes.aether.supply || 0;

    html.find("#aetherCapacity").text(aetherCapacity);
    html.find("#aetherConserved").text(aetherConserved);
    html.find("#aetherSupply").text(aetherSupply);

    // Function to update values
    const updateValue = (key, increment) => {
        const currentValue = actor.system.attributes.aether[key] || 0;
        const newValue = currentValue + increment;
        if (newValue >= 0) {
            actor.update({ [`system.attributes.aether.${key}`]: newValue });
            html.find(`#aether${key.charAt(0).toUpperCase() + key.slice(1)}`).text(newValue);
        } else {
            ui.notifications.warn(`${key.replace(/([A-Z])/g, " $1")} cannot be negative.`);
        }
    };

    // Add click event listeners
    html.find(".aether-capacity-minus").on("click", () => updateValue("capacity", -1));
    html.find(".aether-capacity-plus").on("click", () => updateValue("capacity", 1));
    html.find(".aether-conserved-minus").on("click", () => updateValue("conserved", -1));
    html.find(".aether-conserved-plus").on("click", () => updateValue("conserved", 1));
    html.find(".aether-supply-minus").on("click", () => updateValue("supply", -1));
    html.find(".aether-supply-plus").on("click", () => updateValue("supply", 1));
});
