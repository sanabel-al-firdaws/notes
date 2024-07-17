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

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => OutlinePlus
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// node_modules/monkey-around/mjs/index.js
function around(obj, factories) {
  const removers = Object.keys(factories).map((key) => around1(obj, key, factories[key]));
  return removers.length === 1 ? removers[0] : function() {
    removers.forEach((r) => r());
  };
}
function around1(obj, method, createWrapper) {
  const original = obj[method], hadOwn = obj.hasOwnProperty(method);
  let current = createWrapper(original);
  if (original)
    Object.setPrototypeOf(current, original);
  Object.setPrototypeOf(wrapper, current);
  obj[method] = wrapper;
  return remove;
  function wrapper(...args) {
    if (current === original && obj[method] === wrapper)
      remove();
    return current.apply(this, args);
  }
  function remove() {
    if (obj[method] === wrapper) {
      if (hadOwn)
        obj[method] = original;
      else
        delete obj[method];
    }
    if (current === original)
      return;
    current = original;
    Object.setPrototypeOf(wrapper, original || Function);
  }
}

// src/settings.ts
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  renderMarkdown: false
};
var OutlinePlusSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(plugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }
  addToggleSetting(settingName, extraOnChange) {
    return new import_obsidian.Setting(this.containerEl).addToggle((toggle) => {
      toggle.setValue(this.plugin.settings[settingName]).onChange(async (value) => {
        this.plugin.settings[settingName] = value;
        await this.plugin.saveSettings();
        extraOnChange == null ? void 0 : extraOnChange(value);
      });
    });
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    this.addToggleSetting("renderMarkdown", () => this.plugin.updateOutlineView()).setName("Render markdown in outline");
  }
};

// src/main.ts
var OutlinePlus = class extends import_obsidian2.Plugin {
  async onload() {
    await this.loadSettings();
    await this.saveSettings();
    this.addSettingTab(new OutlinePlusSettingTab(this));
    this.app.workspace.onLayoutReady(() => {
      const success = this.patchOutlineView();
      if (!success) {
        const eventRef = this.app.workspace.on("layout-change", () => {
          const success2 = this.patchOutlineView();
          if (success2)
            this.app.workspace.offref(eventRef);
        });
        this.registerEvent(eventRef);
      }
    });
  }
  onunload() {
    this.updateOutlineView();
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  patchOutlineView() {
    var _a;
    const outlineView = (_a = this.app.workspace.getLeavesOfType("outline")[0]) == null ? void 0 : _a.view;
    if (!outlineView)
      return false;
    const plugin = this;
    const app = this.app;
    const uninstaller = around(outlineView.constructor.prototype, {
      createItemDom(old) {
        return function(originalHeading) {
          const prefix = "ABC ";
          const tmpHeading = Object.assign({}, originalHeading, { heading: prefix + originalHeading.heading });
          const dom = old.call(this, tmpHeading);
          dom.heading = originalHeading;
          const renderMarkdownIfNeeded = async () => {
            var _a2, _b, _c, _d;
            if (plugin.settings.renderMarkdown) {
              const tmpContainer = createDiv();
              await import_obsidian2.MarkdownRenderer.render(app, tmpHeading.heading, tmpContainer, (_b = (_a2 = dom.view.file) == null ? void 0 : _a2.path) != null ? _b : "", dom.view);
              dom.innerEl.replaceChildren(...(_d = (_c = tmpContainer.firstChild) == null ? void 0 : _c.childNodes) != null ? _d : []);
              dom.innerEl.addClass("markdown-rendered");
            }
          };
          renderMarkdownIfNeeded().then(() => {
            const child = dom.innerEl.firstChild;
            if ((child == null ? void 0 : child.nodeType) === Node.TEXT_NODE && child.textContent) {
              child.textContent = child.textContent.slice(prefix.length).trimStart();
            }
          });
          return dom;
        };
      }
    });
    this.register(uninstaller);
    this.updateOutlineView();
    return true;
  }
  updateOutlineView() {
    this.app.workspace.getLeavesOfType("outline").forEach((leaf) => {
      const view = leaf.view;
      view.update();
    });
  }
};