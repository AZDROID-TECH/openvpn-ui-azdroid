var Ae = Object.defineProperty;
var Le = (n, e, t) => e in n ? Ae(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var p = (n, e, t) => Le(n, typeof e != "symbol" ? e + "" : e, t);
import $e, { app as L, BrowserWindow as Fe, ipcMain as v, dialog as xe, Tray as Ce, Menu as De } from "electron";
import { promises as g } from "node:fs";
import m from "node:path";
import { fileURLToPath as Ne } from "node:url";
import $ from "path";
import _e from "child_process";
import j from "os";
import D from "fs";
import je from "util";
import ue from "events";
import Te from "http";
import Ie from "https";
import T from "keytar";
import { spawnSync as K, spawn as k } from "node:child_process";
import { EventEmitter as ze } from "node:events";
import Me from "node:os";
function ke(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
const fe = D, C = $;
var Re = {
  findAndReadPackageJson: Ve,
  tryReadJsonAt: A
};
function Ve() {
  return A(qe()) || A(Ue()) || A(process.resourcesPath, "app.asar") || A(process.resourcesPath, "app") || A(process.cwd()) || { name: void 0, version: void 0 };
}
function A(...n) {
  if (n[0])
    try {
      const e = C.join(...n), t = We("package.json", e);
      if (!t)
        return;
      const r = JSON.parse(fe.readFileSync(t, "utf8")), s = (r == null ? void 0 : r.productName) || (r == null ? void 0 : r.name);
      return !s || s.toLowerCase() === "electron" ? void 0 : s ? { name: s, version: r == null ? void 0 : r.version } : void 0;
    } catch {
      return;
    }
}
function We(n, e) {
  let t = e;
  for (; ; ) {
    const r = C.parse(t), s = r.root, i = r.dir;
    if (fe.existsSync(C.join(t, n)))
      return C.resolve(C.join(t, n));
    if (t === s)
      return null;
    t = i;
  }
}
function Ue() {
  const n = process.argv.filter((t) => t.indexOf("--user-data-dir=") === 0);
  return n.length === 0 || typeof n[0] != "string" ? null : n[0].replace("--user-data-dir=", "");
}
function qe() {
  var n;
  try {
    return (n = require.main) == null ? void 0 : n.filename;
  } catch {
    return;
  }
}
const Je = _e, P = j, O = $, Be = Re;
let He = class {
  constructor() {
    p(this, "appName");
    p(this, "appPackageJson");
    p(this, "platform", process.platform);
  }
  getAppLogPath(e = this.getAppName()) {
    return this.platform === "darwin" ? O.join(this.getSystemPathHome(), "Library/Logs", e) : O.join(this.getAppUserDataPath(e), "logs");
  }
  getAppName() {
    var t;
    const e = this.appName || ((t = this.getAppPackageJson()) == null ? void 0 : t.name);
    if (!e)
      throw new Error(
        "electron-log can't determine the app name. It tried these methods:\n1. Use `electron.app.name`\n2. Use productName or name from the nearest package.json`\nYou can also set it through log.transports.file.setAppName()"
      );
    return e;
  }
  /**
   * @private
   * @returns {undefined}
   */
  getAppPackageJson() {
    return typeof this.appPackageJson != "object" && (this.appPackageJson = Be.findAndReadPackageJson()), this.appPackageJson;
  }
  getAppUserDataPath(e = this.getAppName()) {
    return e ? O.join(this.getSystemPathAppData(), e) : void 0;
  }
  getAppVersion() {
    var e;
    return (e = this.getAppPackageJson()) == null ? void 0 : e.version;
  }
  getElectronLogPath() {
    return this.getAppLogPath();
  }
  getMacOsVersion() {
    const e = Number(P.release().split(".")[0]);
    return e <= 19 ? `10.${e - 4}` : e - 9;
  }
  /**
   * @protected
   * @returns {string}
   */
  getOsVersion() {
    let e = P.type().replace("_", " "), t = P.release();
    return e === "Darwin" && (e = "macOS", t = this.getMacOsVersion()), `${e} ${t}`;
  }
  /**
   * @return {PathVariables}
   */
  getPathVariables() {
    const e = this.getAppName(), t = this.getAppVersion(), r = this;
    return {
      appData: this.getSystemPathAppData(),
      appName: e,
      appVersion: t,
      get electronDefaultDir() {
        return r.getElectronLogPath();
      },
      home: this.getSystemPathHome(),
      libraryDefaultDir: this.getAppLogPath(e),
      libraryTemplate: this.getAppLogPath("{appName}"),
      temp: this.getSystemPathTemp(),
      userData: this.getAppUserDataPath(e)
    };
  }
  getSystemPathAppData() {
    const e = this.getSystemPathHome();
    switch (this.platform) {
      case "darwin":
        return O.join(e, "Library/Application Support");
      case "win32":
        return process.env.APPDATA || O.join(e, "AppData/Roaming");
      default:
        return process.env.XDG_CONFIG_HOME || O.join(e, ".config");
    }
  }
  getSystemPathHome() {
    var e;
    return ((e = P.homedir) == null ? void 0 : e.call(P)) || process.env.HOME;
  }
  getSystemPathTemp() {
    return P.tmpdir();
  }
  getVersions() {
    return {
      app: `${this.getAppName()} ${this.getAppVersion()}`,
      electron: void 0,
      os: this.getOsVersion()
    };
  }
  isDev() {
    return process.env.NODE_ENV === "development" || process.env.ELECTRON_IS_DEV === "1";
  }
  isElectron() {
    return !!process.versions.electron;
  }
  onAppEvent(e, t) {
  }
  onAppReady(e) {
    e();
  }
  onEveryWebContentsEvent(e, t) {
  }
  /**
   * Listen to async messages sent from opposite process
   * @param {string} channel
   * @param {function} listener
   */
  onIpc(e, t) {
  }
  onIpcInvoke(e, t) {
  }
  /**
   * @param {string} url
   * @param {Function} [logFunction]
   */
  openUrl(e, t = console.error) {
    const s = { darwin: "open", win32: "start", linux: "xdg-open" }[process.platform] || "xdg-open";
    Je.exec(`${s} ${e}`, {}, (i) => {
      i && t(i);
    });
  }
  setAppName(e) {
    this.appName = e;
  }
  setPlatform(e) {
    this.platform = e;
  }
  setPreloadFileForSessions({
    filePath: e,
    // eslint-disable-line no-unused-vars
    includeFutureSession: t = !0,
    // eslint-disable-line no-unused-vars
    getSessions: r = () => []
    // eslint-disable-line no-unused-vars
  }) {
  }
  /**
   * Sent a message to opposite process
   * @param {string} channel
   * @param {any} message
   */
  sendIpc(e, t) {
  }
  showErrorBox(e, t) {
  }
};
var Ge = He;
const Qe = $, Ye = Ge;
let Ke = class extends Ye {
  /**
   * @param {object} options
   * @param {typeof Electron} [options.electron]
   */
  constructor({ electron: t } = {}) {
    super();
    /**
     * @type {typeof Electron}
     */
    p(this, "electron");
    this.electron = t;
  }
  getAppName() {
    var r, s;
    let t;
    try {
      t = this.appName || ((r = this.electron.app) == null ? void 0 : r.name) || ((s = this.electron.app) == null ? void 0 : s.getName());
    } catch {
    }
    return t || super.getAppName();
  }
  getAppUserDataPath(t) {
    return this.getPath("userData") || super.getAppUserDataPath(t);
  }
  getAppVersion() {
    var r;
    let t;
    try {
      t = (r = this.electron.app) == null ? void 0 : r.getVersion();
    } catch {
    }
    return t || super.getAppVersion();
  }
  getElectronLogPath() {
    return this.getPath("logs") || super.getElectronLogPath();
  }
  /**
   * @private
   * @param {any} name
   * @returns {string|undefined}
   */
  getPath(t) {
    var r;
    try {
      return (r = this.electron.app) == null ? void 0 : r.getPath(t);
    } catch {
      return;
    }
  }
  getVersions() {
    return {
      app: `${this.getAppName()} ${this.getAppVersion()}`,
      electron: `Electron ${process.versions.electron}`,
      os: this.getOsVersion()
    };
  }
  getSystemPathAppData() {
    return this.getPath("appData") || super.getSystemPathAppData();
  }
  isDev() {
    var t;
    return ((t = this.electron.app) == null ? void 0 : t.isPackaged) !== void 0 ? !this.electron.app.isPackaged : typeof process.execPath == "string" ? Qe.basename(process.execPath).toLowerCase().startsWith("electron") : super.isDev();
  }
  onAppEvent(t, r) {
    var s;
    return (s = this.electron.app) == null || s.on(t, r), () => {
      var i;
      (i = this.electron.app) == null || i.off(t, r);
    };
  }
  onAppReady(t) {
    var r, s, i;
    (r = this.electron.app) != null && r.isReady() ? t() : (s = this.electron.app) != null && s.once ? (i = this.electron.app) == null || i.once("ready", t) : t();
  }
  onEveryWebContentsEvent(t, r) {
    var i, o, a;
    return (o = (i = this.electron.webContents) == null ? void 0 : i.getAllWebContents()) == null || o.forEach((c) => {
      c.on(t, r);
    }), (a = this.electron.app) == null || a.on("web-contents-created", s), () => {
      var c, l;
      (c = this.electron.webContents) == null || c.getAllWebContents().forEach((u) => {
        u.off(t, r);
      }), (l = this.electron.app) == null || l.off("web-contents-created", s);
    };
    function s(c, l) {
      l.on(t, r);
    }
  }
  /**
   * Listen to async messages sent from opposite process
   * @param {string} channel
   * @param {function} listener
   */
  onIpc(t, r) {
    var s;
    (s = this.electron.ipcMain) == null || s.on(t, r);
  }
  onIpcInvoke(t, r) {
    var s, i;
    (i = (s = this.electron.ipcMain) == null ? void 0 : s.handle) == null || i.call(s, t, r);
  }
  /**
   * @param {string} url
   * @param {Function} [logFunction]
   */
  openUrl(t, r = console.error) {
    var s;
    (s = this.electron.shell) == null || s.openExternal(t).catch(r);
  }
  setPreloadFileForSessions({
    filePath: t,
    includeFutureSession: r = !0,
    getSessions: s = () => {
      var i;
      return [(i = this.electron.session) == null ? void 0 : i.defaultSession];
    }
  }) {
    for (const o of s().filter(Boolean))
      i(o);
    r && this.onAppEvent("session-created", (o) => {
      i(o);
    });
    function i(o) {
      typeof o.registerPreloadScript == "function" ? o.registerPreloadScript({
        filePath: t,
        id: "electron-log-preload",
        type: "frame"
      }) : o.setPreloads([...o.getPreloads(), t]);
    }
  }
  /**
   * Sent a message to opposite process
   * @param {string} channel
   * @param {any} message
   */
  sendIpc(t, r) {
    var s, i;
    (i = (s = this.electron.BrowserWindow) == null ? void 0 : s.getAllWindows()) == null || i.forEach((o) => {
      var a, c;
      ((a = o.webContents) == null ? void 0 : a.isDestroyed()) === !1 && ((c = o.webContents) == null ? void 0 : c.isCrashed()) === !1 && o.webContents.send(t, r);
    });
  }
  showErrorBox(t, r) {
    var s;
    (s = this.electron.dialog) == null || s.showErrorBox(t, r);
  }
};
var Xe = Ke, he = { exports: {} };
(function(n) {
  let e = {};
  try {
    e = require("electron");
  } catch {
  }
  e.ipcRenderer && t(e), n.exports = t;
  function t({ contextBridge: r, ipcRenderer: s }) {
    if (!s)
      return;
    s.on("__ELECTRON_LOG_IPC__", (o, a) => {
      window.postMessage({ cmd: "message", ...a });
    }), s.invoke("__ELECTRON_LOG__", { cmd: "getOptions" }).catch((o) => console.error(new Error(
      `electron-log isn't initialized in the main process. Please call log.initialize() before. ${o.message}`
    )));
    const i = {
      sendToMain(o) {
        try {
          s.send("__ELECTRON_LOG__", o);
        } catch (a) {
          console.error("electronLog.sendToMain ", a, "data:", o), s.send("__ELECTRON_LOG__", {
            cmd: "errorHandler",
            error: { message: a == null ? void 0 : a.message, stack: a == null ? void 0 : a.stack },
            errorName: "sendToMain"
          });
        }
      },
      log(...o) {
        i.sendToMain({ data: o, level: "info" });
      }
    };
    for (const o of ["error", "warn", "info", "verbose", "debug", "silly"])
      i[o] = (...a) => i.sendToMain({
        data: a,
        level: o
      });
    if (r && process.contextIsolated)
      try {
        r.exposeInMainWorld("__electronLog", i);
      } catch {
      }
    typeof window == "object" ? window.__electronLog = i : __electronLog = i;
  }
})(he);
var Ze = he.exports;
const X = D, et = j, Z = $, tt = Ze;
let ee = !1, te = !1;
var rt = {
  initialize({
    externalApi: n,
    getSessions: e,
    includeFutureSession: t,
    logger: r,
    preload: s = !0,
    spyRendererConsole: i = !1
  }) {
    n.onAppReady(() => {
      try {
        s && nt({
          externalApi: n,
          getSessions: e,
          includeFutureSession: t,
          logger: r,
          preloadOption: s
        }), i && st({ externalApi: n, logger: r });
      } catch (o) {
        r.warn(o);
      }
    });
  }
};
function nt({
  externalApi: n,
  getSessions: e,
  includeFutureSession: t,
  logger: r,
  preloadOption: s
}) {
  let i = typeof s == "string" ? s : void 0;
  if (ee) {
    r.warn(new Error("log.initialize({ preload }) already called").stack);
    return;
  }
  ee = !0;
  try {
    i = Z.resolve(
      __dirname,
      "../renderer/electron-log-preload.js"
    );
  } catch {
  }
  if (!i || !X.existsSync(i)) {
    i = Z.join(
      n.getAppUserDataPath() || et.tmpdir(),
      "electron-log-preload.js"
    );
    const o = `
      try {
        (${tt.toString()})(require('electron'));
      } catch(e) {
        console.error(e);
      }
    `;
    X.writeFileSync(i, o, "utf8");
  }
  n.setPreloadFileForSessions({
    filePath: i,
    includeFutureSession: t,
    getSessions: e
  });
}
function st({ externalApi: n, logger: e }) {
  if (te) {
    e.warn(
      new Error("log.initialize({ spyRendererConsole }) already called").stack
    );
    return;
  }
  te = !0;
  const t = ["debug", "info", "warn", "error"];
  n.onEveryWebContentsEvent(
    "console-message",
    (r, s, i) => {
      e.processMessage({
        data: [i],
        level: t[s],
        variables: { processType: "renderer" }
      });
    }
  );
}
var it = ot;
function ot(n) {
  return Object.defineProperties(e, {
    defaultLabel: { value: "", writable: !0 },
    labelPadding: { value: !0, writable: !0 },
    maxLabelLength: { value: 0, writable: !0 },
    labelLength: {
      get() {
        switch (typeof e.labelPadding) {
          case "boolean":
            return e.labelPadding ? e.maxLabelLength : 0;
          case "number":
            return e.labelPadding;
          default:
            return 0;
        }
      }
    }
  });
  function e(t) {
    e.maxLabelLength = Math.max(e.maxLabelLength, t.length);
    const r = {};
    for (const s of n.levels)
      r[s] = (...i) => n.logData(i, { level: s, scope: t });
    return r.log = r.info, r;
  }
}
let at = class {
  constructor({ processMessage: e }) {
    this.processMessage = e, this.buffer = [], this.enabled = !1, this.begin = this.begin.bind(this), this.commit = this.commit.bind(this), this.reject = this.reject.bind(this);
  }
  addMessage(e) {
    this.buffer.push(e);
  }
  begin() {
    this.enabled = [];
  }
  commit() {
    this.enabled = !1, this.buffer.forEach((e) => this.processMessage(e)), this.buffer = [];
  }
  reject() {
    this.enabled = !1, this.buffer = [];
  }
};
var ct = at;
const lt = it, pt = ct;
var S;
let ut = (S = class {
  constructor({
    allowUnknownLevel: e = !1,
    dependencies: t = {},
    errorHandler: r,
    eventLogger: s,
    initializeFn: i,
    isDev: o = !1,
    levels: a = ["error", "warn", "info", "verbose", "debug", "silly"],
    logId: c,
    transportFactories: l = {},
    variables: u
  } = {}) {
    p(this, "dependencies", {});
    p(this, "errorHandler", null);
    p(this, "eventLogger", null);
    p(this, "functions", {});
    p(this, "hooks", []);
    p(this, "isDev", !1);
    p(this, "levels", null);
    p(this, "logId", null);
    p(this, "scope", null);
    p(this, "transports", {});
    p(this, "variables", {});
    this.addLevel = this.addLevel.bind(this), this.create = this.create.bind(this), this.initialize = this.initialize.bind(this), this.logData = this.logData.bind(this), this.processMessage = this.processMessage.bind(this), this.allowUnknownLevel = e, this.buffering = new pt(this), this.dependencies = t, this.initializeFn = i, this.isDev = o, this.levels = a, this.logId = c, this.scope = lt(this), this.transportFactories = l, this.variables = u || {};
    for (const h of this.levels)
      this.addLevel(h, !1);
    this.log = this.info, this.functions.log = this.log, this.errorHandler = r, r == null || r.setOptions({ ...t, logFn: this.error }), this.eventLogger = s, s == null || s.setOptions({ ...t, logger: this });
    for (const [h, w] of Object.entries(l))
      this.transports[h] = w(this, t);
    S.instances[c] = this;
  }
  static getInstance({ logId: e }) {
    return this.instances[e] || this.instances.default;
  }
  addLevel(e, t = this.levels.length) {
    t !== !1 && this.levels.splice(t, 0, e), this[e] = (...r) => this.logData(r, { level: e }), this.functions[e] = this[e];
  }
  catchErrors(e) {
    return this.processMessage(
      {
        data: ["log.catchErrors is deprecated. Use log.errorHandler instead"],
        level: "warn"
      },
      { transports: ["console"] }
    ), this.errorHandler.startCatching(e);
  }
  create(e) {
    return typeof e == "string" && (e = { logId: e }), new S({
      dependencies: this.dependencies,
      errorHandler: this.errorHandler,
      initializeFn: this.initializeFn,
      isDev: this.isDev,
      transportFactories: this.transportFactories,
      variables: { ...this.variables },
      ...e
    });
  }
  compareLevels(e, t, r = this.levels) {
    const s = r.indexOf(e), i = r.indexOf(t);
    return i === -1 || s === -1 ? !0 : i <= s;
  }
  initialize(e = {}) {
    this.initializeFn({ logger: this, ...this.dependencies, ...e });
  }
  logData(e, t = {}) {
    this.buffering.enabled ? this.buffering.addMessage({ data: e, date: /* @__PURE__ */ new Date(), ...t }) : this.processMessage({ data: e, ...t });
  }
  processMessage(e, { transports: t = this.transports } = {}) {
    if (e.cmd === "errorHandler") {
      this.errorHandler.handle(e.error, {
        errorName: e.errorName,
        processType: "renderer",
        showDialog: !!e.showDialog
      });
      return;
    }
    let r = e.level;
    this.allowUnknownLevel || (r = this.levels.includes(e.level) ? e.level : "info");
    const s = {
      date: /* @__PURE__ */ new Date(),
      logId: this.logId,
      ...e,
      level: r,
      variables: {
        ...this.variables,
        ...e.variables
      }
    };
    for (const [i, o] of this.transportEntries(t))
      if (!(typeof o != "function" || o.level === !1) && this.compareLevels(o.level, e.level))
        try {
          const a = this.hooks.reduce((c, l) => c && l(c, o, i), s);
          a && o({ ...a, data: [...a.data] });
        } catch (a) {
          this.processInternalErrorFn(a);
        }
  }
  processInternalErrorFn(e) {
  }
  transportEntries(e = this.transports) {
    return (Array.isArray(e) ? e : Object.entries(e)).map((r) => {
      switch (typeof r) {
        case "string":
          return this.transports[r] ? [r, this.transports[r]] : null;
        case "function":
          return [r.name, r];
        default:
          return Array.isArray(r) ? r : null;
      }
    }).filter(Boolean);
  }
}, p(S, "instances", {}), S);
var ft = ut;
let ht = class {
  constructor({
    externalApi: e,
    logFn: t = void 0,
    onError: r = void 0,
    showDialog: s = void 0
  } = {}) {
    p(this, "externalApi");
    p(this, "isActive", !1);
    p(this, "logFn");
    p(this, "onError");
    p(this, "showDialog", !0);
    this.createIssue = this.createIssue.bind(this), this.handleError = this.handleError.bind(this), this.handleRejection = this.handleRejection.bind(this), this.setOptions({ externalApi: e, logFn: t, onError: r, showDialog: s }), this.startCatching = this.startCatching.bind(this), this.stopCatching = this.stopCatching.bind(this);
  }
  handle(e, {
    logFn: t = this.logFn,
    onError: r = this.onError,
    processType: s = "browser",
    showDialog: i = this.showDialog,
    errorName: o = ""
  } = {}) {
    var a;
    e = dt(e);
    try {
      if (typeof r == "function") {
        const c = ((a = this.externalApi) == null ? void 0 : a.getVersions()) || {}, l = this.createIssue;
        if (r({
          createIssue: l,
          error: e,
          errorName: o,
          processType: s,
          versions: c
        }) === !1)
          return;
      }
      o ? t(o, e) : t(e), i && !o.includes("rejection") && this.externalApi && this.externalApi.showErrorBox(
        `A JavaScript error occurred in the ${s} process`,
        e.stack
      );
    } catch {
      console.error(e);
    }
  }
  setOptions({ externalApi: e, logFn: t, onError: r, showDialog: s }) {
    typeof e == "object" && (this.externalApi = e), typeof t == "function" && (this.logFn = t), typeof r == "function" && (this.onError = r), typeof s == "boolean" && (this.showDialog = s);
  }
  startCatching({ onError: e, showDialog: t } = {}) {
    this.isActive || (this.isActive = !0, this.setOptions({ onError: e, showDialog: t }), process.on("uncaughtException", this.handleError), process.on("unhandledRejection", this.handleRejection));
  }
  stopCatching() {
    this.isActive = !1, process.removeListener("uncaughtException", this.handleError), process.removeListener("unhandledRejection", this.handleRejection);
  }
  createIssue(e, t) {
    var r;
    (r = this.externalApi) == null || r.openUrl(
      `${e}?${new URLSearchParams(t).toString()}`
    );
  }
  handleError(e) {
    this.handle(e, { errorName: "Unhandled" });
  }
  handleRejection(e) {
    const t = e instanceof Error ? e : new Error(JSON.stringify(e));
    this.handle(t, { errorName: "Unhandled rejection" });
  }
};
function dt(n) {
  if (n instanceof Error)
    return n;
  if (n && typeof n == "object") {
    if (n.message)
      return Object.assign(new Error(n.message), n);
    try {
      return new Error(JSON.stringify(n));
    } catch (e) {
      return new Error(`Couldn't normalize error ${String(n)}: ${e}`);
    }
  }
  return new Error(`Can't normalize error ${String(n)}`);
}
var gt = ht;
let mt = class {
  constructor(e = {}) {
    p(this, "disposers", []);
    p(this, "format", "{eventSource}#{eventName}:");
    p(this, "formatters", {
      app: {
        "certificate-error": ({ args: e }) => this.arrayToObject(e.slice(1, 4), [
          "url",
          "error",
          "certificate"
        ]),
        "child-process-gone": ({ args: e }) => e.length === 1 ? e[0] : e,
        "render-process-gone": ({ args: [e, t] }) => t && typeof t == "object" ? { ...t, ...this.getWebContentsDetails(e) } : []
      },
      webContents: {
        "console-message": ({ args: [e, t, r, s] }) => {
          if (!(e < 3))
            return { message: t, source: `${s}:${r}` };
        },
        "did-fail-load": ({ args: e }) => this.arrayToObject(e, [
          "errorCode",
          "errorDescription",
          "validatedURL",
          "isMainFrame",
          "frameProcessId",
          "frameRoutingId"
        ]),
        "did-fail-provisional-load": ({ args: e }) => this.arrayToObject(e, [
          "errorCode",
          "errorDescription",
          "validatedURL",
          "isMainFrame",
          "frameProcessId",
          "frameRoutingId"
        ]),
        "plugin-crashed": ({ args: e }) => this.arrayToObject(e, ["name", "version"]),
        "preload-error": ({ args: e }) => this.arrayToObject(e, ["preloadPath", "error"])
      }
    });
    p(this, "events", {
      app: {
        "certificate-error": !0,
        "child-process-gone": !0,
        "render-process-gone": !0
      },
      webContents: {
        // 'console-message': true,
        "did-fail-load": !0,
        "did-fail-provisional-load": !0,
        "plugin-crashed": !0,
        "preload-error": !0,
        unresponsive: !0
      }
    });
    p(this, "externalApi");
    p(this, "level", "error");
    p(this, "scope", "");
    this.setOptions(e);
  }
  setOptions({
    events: e,
    externalApi: t,
    level: r,
    logger: s,
    format: i,
    formatters: o,
    scope: a
  }) {
    typeof e == "object" && (this.events = e), typeof t == "object" && (this.externalApi = t), typeof r == "string" && (this.level = r), typeof s == "object" && (this.logger = s), (typeof i == "string" || typeof i == "function") && (this.format = i), typeof o == "object" && (this.formatters = o), typeof a == "string" && (this.scope = a);
  }
  startLogging(e = {}) {
    this.setOptions(e), this.disposeListeners();
    for (const t of this.getEventNames(this.events.app))
      this.disposers.push(
        this.externalApi.onAppEvent(t, (...r) => {
          this.handleEvent({ eventSource: "app", eventName: t, handlerArgs: r });
        })
      );
    for (const t of this.getEventNames(this.events.webContents))
      this.disposers.push(
        this.externalApi.onEveryWebContentsEvent(
          t,
          (...r) => {
            this.handleEvent(
              { eventSource: "webContents", eventName: t, handlerArgs: r }
            );
          }
        )
      );
  }
  stopLogging() {
    this.disposeListeners();
  }
  arrayToObject(e, t) {
    const r = {};
    return t.forEach((s, i) => {
      r[s] = e[i];
    }), e.length > t.length && (r.unknownArgs = e.slice(t.length)), r;
  }
  disposeListeners() {
    this.disposers.forEach((e) => e()), this.disposers = [];
  }
  formatEventLog({ eventName: e, eventSource: t, handlerArgs: r }) {
    var u;
    const [s, ...i] = r;
    if (typeof this.format == "function")
      return this.format({ args: i, event: s, eventName: e, eventSource: t });
    const o = (u = this.formatters[t]) == null ? void 0 : u[e];
    let a = i;
    if (typeof o == "function" && (a = o({ args: i, event: s, eventName: e, eventSource: t })), !a)
      return;
    const c = {};
    return Array.isArray(a) ? c.args = a : typeof a == "object" && Object.assign(c, a), t === "webContents" && Object.assign(c, this.getWebContentsDetails(s == null ? void 0 : s.sender)), [this.format.replace("{eventSource}", t === "app" ? "App" : "WebContents").replace("{eventName}", e), c];
  }
  getEventNames(e) {
    return !e || typeof e != "object" ? [] : Object.entries(e).filter(([t, r]) => r).map(([t]) => t);
  }
  getWebContentsDetails(e) {
    if (!(e != null && e.loadURL))
      return {};
    try {
      return {
        webContents: {
          id: e.id,
          url: e.getURL()
        }
      };
    } catch {
      return {};
    }
  }
  handleEvent({ eventName: e, eventSource: t, handlerArgs: r }) {
    var i;
    const s = this.formatEventLog({ eventName: e, eventSource: t, handlerArgs: r });
    if (s) {
      const o = this.scope ? this.logger.scope(this.scope) : this.logger;
      (i = o == null ? void 0 : o[this.level]) == null || i.call(o, ...s);
    }
  }
};
var yt = mt, N = { transform: vt };
function vt({
  logger: n,
  message: e,
  transport: t,
  initialData: r = (e == null ? void 0 : e.data) || [],
  transforms: s = t == null ? void 0 : t.transforms
}) {
  return s.reduce((i, o) => typeof o == "function" ? o({ data: i, logger: n, message: e, transport: t }) : i, r);
}
const { transform: wt } = N;
var de = {
  concatFirstStringElements: bt,
  format({ message: n, logger: e, transport: t, data: r = n == null ? void 0 : n.data }) {
    switch (typeof t.format) {
      case "string":
        return wt({
          message: n,
          logger: e,
          transforms: [Pt, St, Ot],
          transport: t,
          initialData: [t.format, ...r]
        });
      case "function":
        return t.format({
          data: r,
          level: (n == null ? void 0 : n.level) || "info",
          logger: e,
          message: n,
          transport: t
        });
      default:
        return r;
    }
  }
};
function bt({ data: n }) {
  return typeof n[0] != "string" || typeof n[1] != "string" || n[0].match(/%[1cdfiOos]/) ? n : [`${n[0]} ${n[1]}`, ...n.slice(2)];
}
function Et(n) {
  const e = Math.abs(n), t = n > 0 ? "-" : "+", r = Math.floor(e / 60).toString().padStart(2, "0"), s = (e % 60).toString().padStart(2, "0");
  return `${t}${r}:${s}`;
}
function St({ data: n, logger: e, message: t }) {
  const { defaultLabel: r, labelLength: s } = (e == null ? void 0 : e.scope) || {}, i = n[0];
  let o = t.scope;
  o || (o = r);
  let a;
  return o === "" ? a = s > 0 ? "".padEnd(s + 3) : "" : typeof o == "string" ? a = ` (${o})`.padEnd(s + 3) : a = "", n[0] = i.replace("{scope}", a), n;
}
function Pt({ data: n, message: e }) {
  let t = n[0];
  if (typeof t != "string")
    return n;
  t = t.replace("{level}]", `${e.level}]`.padEnd(6, " "));
  const r = e.date || /* @__PURE__ */ new Date();
  return n[0] = t.replace(/\{(\w+)}/g, (s, i) => {
    var o;
    switch (i) {
      case "level":
        return e.level || "info";
      case "logId":
        return e.logId;
      case "y":
        return r.getFullYear().toString(10);
      case "m":
        return (r.getMonth() + 1).toString(10).padStart(2, "0");
      case "d":
        return r.getDate().toString(10).padStart(2, "0");
      case "h":
        return r.getHours().toString(10).padStart(2, "0");
      case "i":
        return r.getMinutes().toString(10).padStart(2, "0");
      case "s":
        return r.getSeconds().toString(10).padStart(2, "0");
      case "ms":
        return r.getMilliseconds().toString(10).padStart(3, "0");
      case "z":
        return Et(r.getTimezoneOffset());
      case "iso":
        return r.toISOString();
      default:
        return ((o = e.variables) == null ? void 0 : o[i]) || s;
    }
  }).trim(), n;
}
function Ot({ data: n }) {
  const e = n[0];
  if (typeof e != "string")
    return n;
  if (e.lastIndexOf("{text}") === e.length - 6)
    return n[0] = e.replace(/\s?{text}/, ""), n[0] === "" && n.shift(), n;
  const r = e.split("{text}");
  let s = [];
  return r[0] !== "" && s.push(r[0]), s = s.concat(n.slice(1)), r[1] !== "" && s.push(r[1]), s;
}
var ge = { exports: {} };
(function(n) {
  const e = je;
  n.exports = {
    serialize: r,
    maxDepth({ data: s, transport: i, depth: o = (i == null ? void 0 : i.depth) ?? 6 }) {
      if (!s)
        return s;
      if (o < 1)
        return Array.isArray(s) ? "[array]" : typeof s == "object" && s ? "[object]" : s;
      if (Array.isArray(s))
        return s.map((c) => n.exports.maxDepth({
          data: c,
          depth: o - 1
        }));
      if (typeof s != "object" || s && typeof s.toISOString == "function")
        return s;
      if (s === null)
        return null;
      if (s instanceof Error)
        return s;
      const a = {};
      for (const c in s)
        Object.prototype.hasOwnProperty.call(s, c) && (a[c] = n.exports.maxDepth({
          data: s[c],
          depth: o - 1
        }));
      return a;
    },
    toJSON({ data: s }) {
      return JSON.parse(JSON.stringify(s, t()));
    },
    toString({ data: s, transport: i }) {
      const o = (i == null ? void 0 : i.inspectOptions) || {}, a = s.map((c) => {
        if (c !== void 0)
          try {
            const l = JSON.stringify(c, t(), "  ");
            return l === void 0 ? void 0 : JSON.parse(l);
          } catch {
            return c;
          }
      });
      return e.formatWithOptions(o, ...a);
    }
  };
  function t(s = {}) {
    const i = /* @__PURE__ */ new WeakSet();
    return function(o, a) {
      if (typeof a == "object" && a !== null) {
        if (i.has(a))
          return;
        i.add(a);
      }
      return r(o, a, s);
    };
  }
  function r(s, i, o = {}) {
    const a = (o == null ? void 0 : o.serializeMapAndSet) !== !1;
    return i instanceof Error ? i.stack : i && (typeof i == "function" ? `[function] ${i.toString()}` : i instanceof Date ? i.toISOString() : a && i instanceof Map && Object.fromEntries ? Object.fromEntries(i) : a && i instanceof Set && Array.from ? Array.from(i) : i);
  }
})(ge);
var I = ge.exports, U = {
  applyAnsiStyles({ data: n }) {
    return re(n, At, Lt);
  },
  removeStyles({ data: n }) {
    return re(n, () => "");
  }
};
const me = {
  unset: "\x1B[0m",
  black: "\x1B[30m",
  red: "\x1B[31m",
  green: "\x1B[32m",
  yellow: "\x1B[33m",
  blue: "\x1B[34m",
  magenta: "\x1B[35m",
  cyan: "\x1B[36m",
  white: "\x1B[37m",
  gray: "\x1B[90m"
};
function At(n) {
  const e = n.replace(/color:\s*(\w+).*/, "$1").toLowerCase();
  return me[e] || "";
}
function Lt(n) {
  return n + me.unset;
}
function re(n, e, t) {
  const r = {};
  return n.reduce((s, i, o, a) => {
    if (r[o])
      return s;
    if (typeof i == "string") {
      let c = o, l = !1;
      i = i.replace(/%[1cdfiOos]/g, (u) => {
        if (c += 1, u !== "%c")
          return u;
        const h = a[c];
        return typeof h == "string" ? (r[c] = !0, l = !0, e(h, i)) : u;
      }), l && t && (i = t(i));
    }
    return s.push(i), s;
  }, []);
}
const {
  concatFirstStringElements: $t,
  format: Ft
} = de, { maxDepth: xt, toJSON: Ct } = I, {
  applyAnsiStyles: Dt,
  removeStyles: Nt
} = U, { transform: _t } = N, ne = {
  error: console.error,
  warn: console.warn,
  info: console.info,
  verbose: console.info,
  debug: console.debug,
  silly: console.debug,
  log: console.log
};
var jt = ve;
const Tt = process.platform === "win32" ? ">" : "›", ye = `%c{h}:{i}:{s}.{ms}{scope}%c ${Tt} {text}`;
Object.assign(ve, {
  DEFAULT_FORMAT: ye
});
function ve(n) {
  return Object.assign(e, {
    colorMap: {
      error: "red",
      warn: "yellow",
      info: "cyan",
      verbose: "unset",
      debug: "gray",
      silly: "gray",
      default: "unset"
    },
    format: ye,
    level: "silly",
    transforms: [
      It,
      Ft,
      Mt,
      $t,
      xt,
      Ct
    ],
    useStyles: process.env.FORCE_STYLES,
    writeFn({ message: t }) {
      (ne[t.level] || ne.info)(...t.data);
    }
  });
  function e(t) {
    const r = _t({ logger: n, message: t, transport: e });
    e.writeFn({
      message: { ...t, data: r }
    });
  }
}
function It({ data: n, message: e, transport: t }) {
  return typeof t.format != "string" || !t.format.includes("%c") ? n : [
    `color:${kt(e.level, t)}`,
    "color:unset",
    ...n
  ];
}
function zt(n, e) {
  if (typeof n == "boolean")
    return n;
  const r = e === "error" || e === "warn" ? process.stderr : process.stdout;
  return r && r.isTTY;
}
function Mt(n) {
  const { message: e, transport: t } = n;
  return (zt(t.useStyles, e.level) ? Dt : Nt)(n);
}
function kt(n, e) {
  return e.colorMap[n] || e.colorMap.default;
}
const Rt = ue, E = D, se = j;
let Vt = class extends Rt {
  constructor({
    path: t,
    writeOptions: r = { encoding: "utf8", flag: "a", mode: 438 },
    writeAsync: s = !1
  }) {
    super();
    p(this, "asyncWriteQueue", []);
    p(this, "bytesWritten", 0);
    p(this, "hasActiveAsyncWriting", !1);
    p(this, "path", null);
    p(this, "initialSize");
    p(this, "writeOptions", null);
    p(this, "writeAsync", !1);
    this.path = t, this.writeOptions = r, this.writeAsync = s;
  }
  get size() {
    return this.getSize();
  }
  clear() {
    try {
      return E.writeFileSync(this.path, "", {
        mode: this.writeOptions.mode,
        flag: "w"
      }), this.reset(), !0;
    } catch (t) {
      return t.code === "ENOENT" ? !0 : (this.emit("error", t, this), !1);
    }
  }
  crop(t) {
    try {
      const r = Wt(this.path, t || 4096);
      this.clear(), this.writeLine(`[log cropped]${se.EOL}${r}`);
    } catch (r) {
      this.emit(
        "error",
        new Error(`Couldn't crop file ${this.path}. ${r.message}`),
        this
      );
    }
  }
  getSize() {
    if (this.initialSize === void 0)
      try {
        const t = E.statSync(this.path);
        this.initialSize = t.size;
      } catch {
        this.initialSize = 0;
      }
    return this.initialSize + this.bytesWritten;
  }
  increaseBytesWrittenCounter(t) {
    this.bytesWritten += Buffer.byteLength(t, this.writeOptions.encoding);
  }
  isNull() {
    return !1;
  }
  nextAsyncWrite() {
    const t = this;
    if (this.hasActiveAsyncWriting || this.asyncWriteQueue.length === 0)
      return;
    const r = this.asyncWriteQueue.join("");
    this.asyncWriteQueue = [], this.hasActiveAsyncWriting = !0, E.writeFile(this.path, r, this.writeOptions, (s) => {
      t.hasActiveAsyncWriting = !1, s ? t.emit(
        "error",
        new Error(`Couldn't write to ${t.path}. ${s.message}`),
        this
      ) : t.increaseBytesWrittenCounter(r), t.nextAsyncWrite();
    });
  }
  reset() {
    this.initialSize = void 0, this.bytesWritten = 0;
  }
  toString() {
    return this.path;
  }
  writeLine(t) {
    if (t += se.EOL, this.writeAsync) {
      this.asyncWriteQueue.push(t), this.nextAsyncWrite();
      return;
    }
    try {
      E.writeFileSync(this.path, t, this.writeOptions), this.increaseBytesWrittenCounter(t);
    } catch (r) {
      this.emit(
        "error",
        new Error(`Couldn't write to ${this.path}. ${r.message}`),
        this
      );
    }
  }
};
var we = Vt;
function Wt(n, e) {
  const t = Buffer.alloc(e), r = E.statSync(n), s = Math.min(r.size, e), i = Math.max(0, r.size - e), o = E.openSync(n, "r"), a = E.readSync(o, t, 0, s, i);
  return E.closeSync(o), t.toString("utf8", 0, a);
}
const Ut = we;
let qt = class extends Ut {
  clear() {
  }
  crop() {
  }
  getSize() {
    return 0;
  }
  isNull() {
    return !0;
  }
  writeLine() {
  }
};
var Jt = qt;
const Bt = ue, ie = D, oe = $, Ht = we, Gt = Jt;
let Qt = class extends Bt {
  constructor() {
    super();
    p(this, "store", {});
    this.emitError = this.emitError.bind(this);
  }
  /**
   * Provide a File object corresponding to the filePath
   * @param {string} filePath
   * @param {WriteOptions} [writeOptions]
   * @param {boolean} [writeAsync]
   * @return {File}
   */
  provide({ filePath: t, writeOptions: r = {}, writeAsync: s = !1 }) {
    let i;
    try {
      if (t = oe.resolve(t), this.store[t])
        return this.store[t];
      i = this.createFile({ filePath: t, writeOptions: r, writeAsync: s });
    } catch (o) {
      i = new Gt({ path: t }), this.emitError(o, i);
    }
    return i.on("error", this.emitError), this.store[t] = i, i;
  }
  /**
   * @param {string} filePath
   * @param {WriteOptions} writeOptions
   * @param {boolean} async
   * @return {File}
   * @private
   */
  createFile({ filePath: t, writeOptions: r, writeAsync: s }) {
    return this.testFileWriting({ filePath: t, writeOptions: r }), new Ht({ path: t, writeOptions: r, writeAsync: s });
  }
  /**
   * @param {Error} error
   * @param {File} file
   * @private
   */
  emitError(t, r) {
    this.emit("error", t, r);
  }
  /**
   * @param {string} filePath
   * @param {WriteOptions} writeOptions
   * @private
   */
  testFileWriting({ filePath: t, writeOptions: r }) {
    ie.mkdirSync(oe.dirname(t), { recursive: !0 }), ie.writeFileSync(t, "", { flag: "a", mode: r.mode });
  }
};
var Yt = Qt;
const _ = D, Kt = j, F = $, Xt = Yt, { transform: Zt } = N, { removeStyles: er } = U, {
  format: tr,
  concatFirstStringElements: rr
} = de, { toString: nr } = I;
var sr = or;
const ir = new Xt();
function or(n, { registry: e = ir, externalApi: t } = {}) {
  let r;
  return e.listenerCount("error") < 1 && e.on("error", (l, u) => {
    o(`Can't write to ${u}`, l);
  }), Object.assign(s, {
    fileName: ar(n.variables.processType),
    format: "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}",
    getFile: a,
    inspectOptions: { depth: 5 },
    level: "silly",
    maxSize: 1024 ** 2,
    readAllLogs: c,
    sync: !0,
    transforms: [er, tr, rr, nr],
    writeOptions: { flag: "a", mode: 438, encoding: "utf8" },
    archiveLogFn(l) {
      const u = l.toString(), h = F.parse(u);
      try {
        _.renameSync(u, F.join(h.dir, `${h.name}.old${h.ext}`));
      } catch (w) {
        o("Could not rotate log", w);
        const Oe = Math.round(s.maxSize / 4);
        l.crop(Math.min(Oe, 256 * 1024));
      }
    },
    resolvePathFn(l) {
      return F.join(l.libraryDefaultDir, l.fileName);
    },
    setAppName(l) {
      n.dependencies.externalApi.setAppName(l);
    }
  });
  function s(l) {
    const u = a(l);
    s.maxSize > 0 && u.size > s.maxSize && (s.archiveLogFn(u), u.reset());
    const w = Zt({ logger: n, message: l, transport: s });
    u.writeLine(w);
  }
  function i() {
    r || (r = Object.create(
      Object.prototype,
      {
        ...Object.getOwnPropertyDescriptors(
          t.getPathVariables()
        ),
        fileName: {
          get() {
            return s.fileName;
          },
          enumerable: !0
        }
      }
    ), typeof s.archiveLog == "function" && (s.archiveLogFn = s.archiveLog, o("archiveLog is deprecated. Use archiveLogFn instead")), typeof s.resolvePath == "function" && (s.resolvePathFn = s.resolvePath, o("resolvePath is deprecated. Use resolvePathFn instead")));
  }
  function o(l, u = null, h = "error") {
    const w = [`electron-log.transports.file: ${l}`];
    u && w.push(u), n.transports.console({ data: w, date: /* @__PURE__ */ new Date(), level: h });
  }
  function a(l) {
    i();
    const u = s.resolvePathFn(r, l);
    return e.provide({
      filePath: u,
      writeAsync: !s.sync,
      writeOptions: s.writeOptions
    });
  }
  function c({ fileFilter: l = (u) => u.endsWith(".log") } = {}) {
    i();
    const u = F.dirname(s.resolvePathFn(r));
    return _.existsSync(u) ? _.readdirSync(u).map((h) => F.join(u, h)).filter(l).map((h) => {
      try {
        return {
          path: h,
          lines: _.readFileSync(h, "utf8").split(Kt.EOL)
        };
      } catch {
        return null;
      }
    }).filter(Boolean) : [];
  }
}
function ar(n = process.type) {
  switch (n) {
    case "renderer":
      return "renderer.log";
    case "worker":
      return "worker.log";
    default:
      return "main.log";
  }
}
const { maxDepth: cr, toJSON: lr } = I, { transform: pr } = N;
var ur = fr;
function fr(n, { externalApi: e }) {
  return Object.assign(t, {
    depth: 3,
    eventId: "__ELECTRON_LOG_IPC__",
    level: n.isDev ? "silly" : !1,
    transforms: [lr, cr]
  }), e != null && e.isElectron() ? t : void 0;
  function t(r) {
    var s;
    ((s = r == null ? void 0 : r.variables) == null ? void 0 : s.processType) !== "renderer" && (e == null || e.sendIpc(t.eventId, {
      ...r,
      data: pr({ logger: n, message: r, transport: t })
    }));
  }
}
const hr = Te, dr = Ie, { transform: gr } = N, { removeStyles: mr } = U, { toJSON: yr, maxDepth: vr } = I;
var wr = br;
function br(n) {
  return Object.assign(e, {
    client: { name: "electron-application" },
    depth: 6,
    level: !1,
    requestOptions: {},
    transforms: [mr, yr, vr],
    makeBodyFn({ message: t }) {
      return JSON.stringify({
        client: e.client,
        data: t.data,
        date: t.date.getTime(),
        level: t.level,
        scope: t.scope,
        variables: t.variables
      });
    },
    processErrorFn({ error: t }) {
      n.processMessage(
        {
          data: [`electron-log: can't POST ${e.url}`, t],
          level: "warn"
        },
        { transports: ["console", "file"] }
      );
    },
    sendRequestFn({ serverUrl: t, requestOptions: r, body: s }) {
      const o = (t.startsWith("https:") ? dr : hr).request(t, {
        method: "POST",
        ...r,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": s.length,
          ...r.headers
        }
      });
      return o.write(s), o.end(), o;
    }
  });
  function e(t) {
    if (!e.url)
      return;
    const r = e.makeBodyFn({
      logger: n,
      message: { ...t, data: gr({ logger: n, message: t, transport: e }) },
      transport: e
    }), s = e.sendRequestFn({
      serverUrl: e.url,
      requestOptions: e.requestOptions,
      body: Buffer.from(r, "utf8")
    });
    s.on("error", (i) => e.processErrorFn({
      error: i,
      logger: n,
      message: t,
      request: s,
      transport: e
    }));
  }
}
const ae = ft, Er = gt, Sr = yt, Pr = jt, Or = sr, Ar = ur, Lr = wr;
var $r = Fr;
function Fr({ dependencies: n, initializeFn: e }) {
  var r;
  const t = new ae({
    dependencies: n,
    errorHandler: new Er(),
    eventLogger: new Sr(),
    initializeFn: e,
    isDev: (r = n.externalApi) == null ? void 0 : r.isDev(),
    logId: "default",
    transportFactories: {
      console: Pr,
      file: Or,
      ipc: Ar,
      remote: Lr
    },
    variables: {
      processType: "main"
    }
  });
  return t.default = t, t.Logger = ae, t.processInternalErrorFn = (s) => {
    t.transports.console.writeFn({
      message: {
        data: ["Unhandled electron-log error", s],
        level: "error"
      }
    });
  }, t;
}
const xr = $e, Cr = Xe, { initialize: Dr } = rt, Nr = $r, q = new Cr({ electron: xr }), z = Nr({
  dependencies: { externalApi: q },
  initializeFn: Dr
});
var _r = z;
q.onIpc("__ELECTRON_LOG__", (n, e) => {
  e.scope && z.Logger.getInstance(e).scope(e.scope);
  const t = new Date(e.date);
  be({
    ...e,
    date: t.getTime() ? t : /* @__PURE__ */ new Date()
  });
});
q.onIpcInvoke("__ELECTRON_LOG__", (n, { cmd: e = "", logId: t }) => {
  switch (e) {
    case "getOptions":
      return {
        levels: z.Logger.getInstance({ logId: t }).levels,
        logId: t
      };
    default:
      return be({ data: [`Unknown cmd '${e}'`], level: "error" }), {};
  }
});
function be(n) {
  var e;
  (e = z.Logger.getInstance(n)) == null || e.processMessage(n);
}
const jr = _r;
var Tr = jr;
const d = /* @__PURE__ */ ke(Tr), J = m.join(L.getPath("userData"), "config"), B = m.join(J, "client.ovpn"), H = m.join(J, "username.json"), M = "openvpn-ui-azdroid";
async function Ee() {
  await g.mkdir(J, { recursive: !0 });
}
async function G() {
  try {
    const n = await g.readFile(H, "utf-8"), e = JSON.parse(n);
    return e.username ? e : null;
  } catch (n) {
    return d.warn("Username faylı oxunmadı və ya parse edilmədi.", n), null;
  }
}
async function Ir(n) {
  await Ee(), await g.writeFile(B, n, { encoding: "utf-8", mode: 384 }), d.info("OVPN konfiqurasiyası saxlanıldı.");
}
async function zr(n) {
  if (!n.username || !n.password)
    throw new Error("Credentials tam deyil.");
  await Ee(), await g.writeFile(
    H,
    JSON.stringify({ username: n.username }),
    { encoding: "utf-8", mode: 384 }
  ), await T.setPassword(M, n.username, n.password), d.info("Credentials saxlanıldı.");
}
async function Mr(n) {
  if (!n)
    throw new Error("Yeni şifrə boş ola bilməz.");
  const e = await G();
  if (!e)
    throw new Error("Saxlanmış username tapılmadı.");
  await T.setPassword(M, e.username, n), d.info("Şifrə yeniləndi.");
}
async function R() {
  try {
    return await g.readFile(B, "utf-8");
  } catch {
    return null;
  }
}
async function V() {
  const n = await G();
  if (!n)
    return null;
  const e = await T.getPassword(M, n.username);
  return e ? {
    username: n.username,
    password: e
  } : null;
}
async function kr() {
  const [n, e] = await Promise.all([R(), V()]);
  return { hasConfig: !!(n && e) };
}
async function Rr() {
  const n = await G();
  n && await T.deletePassword(M, n.username), await Promise.allSettled([g.rm(B, { force: !0 }), g.rm(H, { force: !0 })]), d.info("Konfiqurasiya və credentials silindi.");
}
const Vr = "Initialization Sequence Completed", ce = "AUTH_FAILED";
class Wr extends ze {
  constructor() {
    super(), this.process = null, this.tempFiles = null, this.elevationCommand = null, this.elevationCommand = this.detectElevationCommand();
  }
  /**
   * Aktiv proses olub-olmadığını qaytarır.
   */
  isRunning() {
    return this.process !== null;
  }
  /**
   * VPN bağlantısını başladır.
   */
  async connect(e, t) {
    if (this.process) {
      d.warn("VPN artıq işləyir, yeni connect sorğusu ignor edildi.");
      return;
    }
    if (!t.username || !t.password)
      throw new Error("Credentials tam deyil.");
    this.tempFiles = await this.prepareTempFiles(e, t), this.process = this.startOpenVpnProcess(this.tempFiles), this.emitStatus("connecting"), this.process.stdout.on("data", (r) => {
      const s = r.toString();
      d.info(`OpenVPN stdout: ${s}`), s.includes(Vr) && this.emitStatus("connected"), s.includes(ce) && (this.emit("auth-failed"), this.disconnect());
    }), this.process.stderr.on("data", (r) => {
      const s = r.toString();
      d.warn(`OpenVPN stderr: ${s}`), s.includes(ce) && (this.emit("auth-failed"), this.disconnect()), (s.toLowerCase().includes("permission denied") || s.toLowerCase().includes("authentication failure") || s.toLowerCase().includes("a terminal is required")) && this.emitStatus("error");
    }), this.process.on("error", async (r) => {
      d.error("OpenVPN spawn xətası:", r), this.emitStatus("error"), await this.cleanupAfterExit();
    }), this.process.on("close", async (r) => {
      d.info(`OpenVPN prosesi bağlandı. code=${r}`), await this.cleanupAfterExit(), this.emitStatus("disconnected");
    });
  }
  /**
   * VPN prosesini normal şəkildə dayandırır.
   */
  async disconnect() {
    await this.stop("SIGTERM");
  }
  /**
   * VPN prosesini məcburi dayandırır.
   */
  async forceStop() {
    await this.stop("SIGKILL");
  }
  emitStatus(e) {
    this.emit("status-changed", e);
  }
  detectElevationCommand() {
    return K("which", ["pkexec"], { stdio: "ignore" }).status === 0 ? "pkexec" : K("which", ["sudo"], { stdio: "ignore" }).status === 0 ? "sudo" : null;
  }
  startOpenVpnProcess(e) {
    const t = [
      "openvpn",
      "--config",
      e.configPath,
      "--auth-user-pass",
      e.authPath,
      "--writepid",
      e.pidPath
    ];
    return this.elevationCommand ? (d.info(`OpenVPN elevated komanda ilə başladılır: ${this.elevationCommand}`), k(this.elevationCommand, t, { stdio: "pipe" })) : k("openvpn", t.slice(1), { stdio: "pipe" });
  }
  async stop(e) {
    if (!this.process)
      return;
    const t = await this.readOpenVpnPid();
    if (t) {
      const r = e === "SIGTERM" ? "-15" : "-9";
      this.elevationCommand ? k(this.elevationCommand, ["kill", r, t], { stdio: "ignore" }) : process.kill(Number(t), e);
    }
    try {
      this.process.kill(e);
    } catch (r) {
      d.warn("Proses kill zamanı xəta baş verdi.", r);
    }
  }
  async prepareTempFiles(e, t) {
    const r = await g.mkdtemp(m.join(Me.tmpdir(), "openvpn-ui-")), s = m.join(r, "client.ovpn"), i = m.join(r, "auth.txt"), o = m.join(r, "openvpn.pid");
    return await g.writeFile(s, e, { encoding: "utf-8", mode: 384 }), await g.writeFile(i, `${t.username}
${t.password}`, { encoding: "utf-8", mode: 384 }), { workDir: r, configPath: s, authPath: i, pidPath: o };
  }
  async readOpenVpnPid() {
    if (!this.tempFiles)
      return null;
    try {
      return (await g.readFile(this.tempFiles.pidPath, "utf-8")).trim() || null;
    } catch {
      return null;
    }
  }
  async cleanupAfterExit() {
    this.tempFiles && await g.rm(this.tempFiles.workDir, { recursive: !0, force: !0 }), this.tempFiles = null, this.process = null;
  }
}
const Ur = Ne(import.meta.url), Q = m.dirname(Ur);
process.env.DIST = m.join(Q, "../dist");
const le = process.env.VITE_DEV_SERVER_URL, y = {
  config: {
    getInitial: "config:get-initial",
    openFileDialog: "config:open-file-dialog",
    saveCredentials: "config:save-credentials",
    retryAuthWithNewPassword: "config:retry-auth-with-new-password",
    reset: "config:reset"
  },
  vpn: {
    connect: "vpn:connect",
    disconnect: "vpn:disconnect",
    statusChanged: "vpn:status-changed",
    authFailed: "vpn:auth-failed"
  },
  app: {
    minimizeWindow: "app:minimize-window",
    closeToTray: "app:close-to-tray"
  }
}, b = new Wr();
let f = null, x = null, Y = !1;
function Se() {
  return m.join(Q, "../build/icons/512x512.png");
}
function W() {
  !f || f.isDestroyed() || (f.isVisible() || f.show(), f.isMinimized() && f.restore(), f.focus());
}
function qr() {
  if (!x) {
    try {
      x = new Ce(Se());
    } catch (n) {
      d.error("Tray yaradıla bilmədi, tray funksiyası deaktiv edildi.", n);
      return;
    }
    x.setToolTip("OpenVPN UI"), x.on("double-click", () => {
      W();
    }), x.setContextMenu(
      De.buildFromTemplate([
        {
          label: "Open OpenVPN UI",
          click: () => W()
        },
        {
          label: "Quit",
          click: async () => {
            await Br();
          }
        }
      ])
    );
  }
}
function Pe() {
  f = new Fe({
    width: 380,
    height: 580,
    resizable: !1,
    frame: !1,
    icon: Se(),
    webPreferences: {
      preload: m.join(Q, "preload.mjs"),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), le ? f.loadURL(le) : f.loadFile(m.join(process.env.DIST ?? "", "index.html")), f.on("close", (n) => {
    Y || (n.preventDefault(), f == null || f.hide());
  }), f.on("closed", () => {
    f = null;
  });
}
function pe(n, e) {
  if (!(!f || f.isDestroyed())) {
    if (typeof e > "u") {
      f.webContents.send(n);
      return;
    }
    f.webContents.send(n, e);
  }
}
function Jr(n) {
  if (typeof n != "object" || n === null || !("username" in n) || !("password" in n) || typeof n.username != "string" || typeof n.password != "string")
    throw new Error("Yanlış credentials payload.");
}
async function Br() {
  Y = !0;
  try {
    await b.forceStop();
  } catch (n) {
    d.warn("VPN dayandırılarkən xəta oldu.", n);
  } finally {
    L.quit();
  }
}
function Hr() {
  v.handle(y.config.getInitial, async () => kr()), v.handle(y.config.openFileDialog, async () => {
    if (!f)
      return !1;
    const n = await xe.showOpenDialog(f, {
      properties: ["openFile"],
      filters: [{ name: "OpenVPN Configuration", extensions: ["ovpn"] }]
    });
    if (n.canceled || n.filePaths.length === 0)
      return !1;
    const e = await g.readFile(n.filePaths[0], "utf-8");
    return await Ir(e), !0;
  }), v.handle(y.config.saveCredentials, async (n, e) => {
    Jr(e), await zr(e);
  }), v.handle(y.config.retryAuthWithNewPassword, async (n, e) => {
    if (typeof e != "string")
      throw new Error("Yanlış password payload.");
    await Mr(e);
    const [t, r] = await Promise.all([
      R(),
      V()
    ]);
    if (!t || !r)
      throw new Error("Konfiqurasiya və ya credentials tapılmadı.");
    await b.forceStop(), await b.connect(t, r);
  }), v.handle(y.config.reset, async () => {
    await b.forceStop(), await Rr();
  }), v.on(y.vpn.connect, async () => {
    const [n, e] = await Promise.all([
      R(),
      V()
    ]);
    if (!n || !e) {
      d.warn("VPN qoşulması üçün lazım olan məlumatlar tam deyil.");
      return;
    }
    await b.connect(n, e);
  }), v.on(y.vpn.disconnect, async () => {
    await b.disconnect();
  }), v.on(y.app.minimizeWindow, () => {
    f == null || f.minimize();
  }), v.on(y.app.closeToTray, () => {
    f == null || f.hide();
  });
}
function Gr() {
  b.on("status-changed", (n) => {
    pe(y.vpn.statusChanged, n);
  }), b.on("auth-failed", () => {
    pe(y.vpn.authFailed);
  });
}
async function Qr() {
  d.initialize(), d.info("OpenVPN UI başladılır..."), Hr(), Gr(), Pe(), qr();
}
L.on("before-quit", () => {
  Y = !0;
});
L.on("activate", () => {
  if (!f) {
    Pe();
    return;
  }
  W();
});
L.on("window-all-closed", () => {
});
L.whenReady().then(() => {
  Qr().catch((n) => {
    d.error("Bootstrap zamanı gözlənilməz xəta baş verdi.", n);
  });
});
