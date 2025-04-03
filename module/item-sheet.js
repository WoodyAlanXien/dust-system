export class DustItemSheet extends ItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["dust-system", "sheet", "item"],
      template: "systems/dust-system/templates/item-sheet.hbs",
      width: 800,
      height: 700,
      resizable: true,
    });
  }

  getData() {
    const context = super.getData();
    context.system = this.item.system;
    context.name = this.item.name || "Unnamed Item"; // Dynamically pull item name
    context.img = this.item.img || "icons/svg/mystery-man.svg"; // Fallback image
    context.type = this.item.type || "unknown"; // Ensure item type is passed
    context.editMode = this.editMode || false; // Default to View Mode
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Handle image click to open FilePicker
    html.find("#item-image").click(async () => {
      if (this.editMode) {
        const filePicker = new FilePicker({
          type: "image",
          current: this.item.img || "icons/svg/mystery-man.svg",
          callback: (path) => {
            this.item.update({ img: path });
          },
        });
        filePicker.browse();
      }
    });
  }

  _getHeaderButtons() {
    const buttons = super._getHeaderButtons();
    buttons.unshift({
      label: this.editMode ? "View Mode" : "Edit Mode",
      class: "toggle-edit-mode",
      icon: this.editMode ? "fas fa-eye" : "fas fa-edit",
      onclick: () => {
        this.editMode = !this.editMode; // Toggle mode state
        this.render(false); // Re-render the sheet
      },
    });
    return buttons;
  }
}
