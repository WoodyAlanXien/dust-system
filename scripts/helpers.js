Handlebars.registerHelper('range', function(start, end) {
  let result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
});

Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("ifThen", function (condition, ifTrue, ifFalse) {
  return condition ? ifTrue : ifFalse;
});

Handlebars.registerHelper("getWeaponProperties", function (weaponId, items) {
  console.log("Helper invoked with:", { weaponId, items });

  const weapon = items.find(item => item.id === weaponId);
  if (!weapon) return "No weapon equipped.";

  console.log("Found weapon:", weapon);

  return new Handlebars.SafeString(`
    <div>
      <strong>Name:</strong> ${weapon.name || "Unknown"} <br />
      <strong>Type:</strong> ${weapon.type || "Unknown"} <br />
      <strong>Damage:</strong> ${weapon.system.damage || "N/A"} <br />
      <strong>Range:</strong> ${weapon.system.range || "N/A"} <br />
    </div>
  `);
});

Handlebars.registerHelper("getSpecialityProperties", (specialityId, items) => {
  const speciality = items.find((item) => item.id === specialityId);
  return speciality ? `${speciality.name}: ${speciality.system.description}` : "None";
});

