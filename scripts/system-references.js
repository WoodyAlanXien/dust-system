// A function to fetch a referenced item by its ID
function getItemReference(actor, itemField) {
    const itemId = actor.getFlag("your-system-name", itemField);
    return itemId ? actor.items.get(itemId) : null;
  }
  
  // A function to set a referenced item in a field
  function setItemReference(actor, itemField, itemId) {
    actor.setFlag("your-system-name", itemField, itemId);
  }
  
  // A function to fetch a referenced character (actor) by its ID
  function getCharacterReference(characterId) {
    return game.actors.get(characterId) || null;
  }
  
  // A function to set a referenced character in a field
  function setCharacterReference(actor, characterField, characterId) {
    actor.setFlag("your-system-name", characterField, characterId);
  }
  
  // Example usage within your system's sheet or application
  Hooks.on("renderActorSheet", (app, html, data) => {
    const actor = app.actor;
  
    // Fetch a referenced item (e.g., weapon1)
    const weapon1 = getItemReference(actor, "weapon1");
    if (weapon1) {
      console.log("Referenced Weapon:", weapon1.name);
    }
  
    // Fetch a referenced character (e.g., bond1)
    const bond1 = getCharacterReference(actor.getFlag("your-system-name", "bond1"));
    if (bond1) {
      console.log("Referenced Bond Character:", bond1.name);
    }
  
    // Set a referenced item (example)
    const itemId = "exampleItemId"; // Replace with the actual item ID
    setItemReference(actor, "weapon1", itemId);
  
    // Set a referenced character (example)
    const characterId = "exampleCharacterId"; // Replace with the actual actor ID
    setCharacterReference(actor, "bond1", characterId);
  });
  