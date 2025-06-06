Hooks.on("renderActorSheet", (app, html, data) => {
    const actor = app.object;

    

    // Initialize Nerve and Resilience values with ARIA
    const initializeAttributes = (prefix, attributes) => {
        const { attributes: { nerveCurrent, resilience, temporaryNerve, temporaryResilience } } = attributes;
    
        html.find(`#${prefix}nerveValue`).attr({
            "aria-label": `${prefix} Nerve`,
            "role": "status"
        }).text(nerveCurrent || 0);
    
        html.find(`#${prefix}resilienceValue`).attr({
            "aria-label": `${prefix} Resilience`,
            "role": "status"
        }).text(resilience || 0);
    
        html.find(`#${prefix}tempNerveValue`).attr({
            "aria-label": `${prefix} Temporary Nerve`,
            "role": "status"
        }).text(temporaryNerve || 0);
    
        html.find(`#${prefix}tempResilienceValue`).attr({
            "aria-label": `${prefix} Temporary Resilience`,
            "role": "status"
        }).text(temporaryResilience || 0);
    };
    

    // Apply ARIA attributes for each category
    initializeAttributes("relentless", actor.system.attributes.relentless);
    initializeAttributes("elusive", actor.system.attributes.elusive);
    initializeAttributes("charming", actor.system.attributes.charming);
    initializeAttributes("discreet", actor.system.attributes.discreet);

    // Add dynamic updates to attributes with ARIA notifications
    class AttributeUpdater {
        constructor(actor, html) {
            this.actor = actor;
            this.html = html;
        }

        updateValue(attribute, key, increment) {
            const currentValue = this.actor.system.attributes[attribute].attributes[key] || 0;
            const newValue = currentValue + increment;
        
            if (newValue >= 0) {
                const attributeKey = `system.attributes.${attribute}.attributes.${key}`;
                this.actor.update({ [attributeKey]: newValue });
        
                const element = this.html.find(`#${attribute}${key.charAt(0).toUpperCase() + key.slice(1)}`);
                element.text(newValue);
        
                // Notify assistive technologies of the updated value
                element.attr({
                    "aria-live": "polite",
                    "aria-label": `Updated ${key.replace(/([A-Z])/g, " $1")} for ${attribute} to ${newValue}`
                });
            } else {
                ui.notifications.warn(`${key.replace(/([A-Z])/g, " $1")} for ${attribute} cannot be negative.`);
            }
            console.log(`Updated ${attribute}.attributes.${key}:`, newValue);
        }
        

        addListeners() {
            this.html.find("[data-action]").each((index, element) => {
                const $element = $(element);
                const action = $element.data("action");
                const attribute = $element.data("attribute");
                const key = $element.data("key");
                const increment = action === "plus" ? 1 : -1;

                // Enhance interactive elements with ARIA
                $element.attr({
                    "role": "button",
                    "aria-label": `${action === "plus" ? "Increase" : "Decrease"} ${key.replace(/([A-Z])/g, " $1")} for ${attribute}`,
                    "tabindex": "0"
                }).on("click", () => {
                    this.updateValue(attribute, key, increment);
                });
            });
        }
    }

    // Instantiate and attach the updater with ARIA support
    const updater = new AttributeUpdater(actor, html);
    updater.addListeners();




});


