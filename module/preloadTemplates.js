export const preloadTemplates = async function () {
    const templatePaths = [
      "systems/dust-system/templates/partials/weapon.hbs"
    
    ];
  
    return loadTemplates(templatePaths);
  };
  