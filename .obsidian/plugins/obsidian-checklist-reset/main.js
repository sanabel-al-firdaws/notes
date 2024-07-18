/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ChecklistReset
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// src/setChecklistItems.ts
var CHECK_REGEX = " \\[.{1}\\])";
var UNCHECKED_REGEX = " \\[ \\])";
var LIST_SYMBOLS = ["-", "*", "+", "."];
function setChecklistItems(content, checked = false) {
  const newValue = checked ? "[x]" : "[ ]";
  const checkboxRegex = checked ? UNCHECKED_REGEX : CHECK_REGEX;
  return LIST_SYMBOLS.reduce((value, listSymbol) => {
    const regex = new RegExp(`(\\${listSymbol}${checkboxRegex}`, "g");
    return value.replaceAll(regex, `${listSymbol} ${newValue}`);
  }, content);
}

// main.ts
function handleAction(view, checked = false) {
  const currentValue = view.getViewData();
  const newValue = setChecklistItems(currentValue, checked);
  view.setViewData(newValue, false);
  view.save();
}
var ChecklistReset = class extends import_obsidian.Plugin {
  async onload() {
    this.addCommand({
      id: "checklist-reset",
      name: "Reset checklists",
      checkCallback: (checking) => {
        if (checking) {
          return !!this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
        }
        const view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
        if (view) {
          handleAction(view);
        }
      }
    });
    this.addCommand({
      id: "checklist-check-all",
      name: "Check all",
      checkCallback: (checking) => {
        if (checking) {
          return !!this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
        }
        const view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
        if (view) {
          handleAction(view, true);
        }
      }
    });
  }
};
