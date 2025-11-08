var je = Object.defineProperty;
var Qe = (n, e, t) => e in n ? je(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var p = (n, e, t) => Qe(n, typeof e != "symbol" ? e + "" : e, t);
import Ie, { app as P, ipcMain as L, dialog as Re, BrowserWindow as ze } from "electron";
import V from "node:path";
import Ue from "node:fs";
import { fileURLToPath as Me } from "node:url";
import v from "path";
import de, { exec as Te, spawn as We } from "child_process";
import F from "os";
import d from "fs";
import he from "util";
import ge, { EventEmitter as ke } from "events";
import He from "http";
import Ge from "https";
import Z from "keytar";
import Xe from "crypto";
function Je(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
const me = d, D = v;
var Ze = {
  findAndReadPackageJson: Ye,
  tryReadJsonAt: B
};
function Ye() {
  return B(_e()) || B(qe()) || B(process.resourcesPath, "app.asar") || B(process.resourcesPath, "app") || B(process.cwd()) || { name: void 0, version: void 0 };
}
function B(...n) {
  if (n[0])
    try {
      const e = D.join(...n), t = $e("package.json", e);
      if (!t)
        return;
      const r = JSON.parse(me.readFileSync(t, "utf8")), i = (r == null ? void 0 : r.productName) || (r == null ? void 0 : r.name);
      return !i || i.toLowerCase() === "electron" ? void 0 : i ? { name: i, version: r == null ? void 0 : r.version } : void 0;
    } catch {
      return;
    }
}
function $e(n, e) {
  let t = e;
  for (; ; ) {
    const r = D.parse(t), i = r.root, o = r.dir;
    if (me.existsSync(D.join(t, n)))
      return D.resolve(D.join(t, n));
    if (t === i)
      return null;
    t = o;
  }
}
function qe() {
  const n = process.argv.filter((t) => t.indexOf("--user-data-dir=") === 0);
  return n.length === 0 || typeof n[0] != "string" ? null : n[0].replace("--user-data-dir=", "");
}
function _e() {
  var n;
  try {
    return (n = require.main) == null ? void 0 : n.filename;
  } catch {
    return;
  }
}
const Ke = de, O = F, C = v, et = Ze;
let tt = class {
  constructor() {
    p(this, "appName");
    p(this, "appPackageJson");
    p(this, "platform", process.platform);
  }
  getAppLogPath(e = this.getAppName()) {
    return this.platform === "darwin" ? C.join(this.getSystemPathHome(), "Library/Logs", e) : C.join(this.getAppUserDataPath(e), "logs");
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
    return typeof this.appPackageJson != "object" && (this.appPackageJson = et.findAndReadPackageJson()), this.appPackageJson;
  }
  getAppUserDataPath(e = this.getAppName()) {
    return e ? C.join(this.getSystemPathAppData(), e) : void 0;
  }
  getAppVersion() {
    var e;
    return (e = this.getAppPackageJson()) == null ? void 0 : e.version;
  }
  getElectronLogPath() {
    return this.getAppLogPath();
  }
  getMacOsVersion() {
    const e = Number(O.release().split(".")[0]);
    return e <= 19 ? `10.${e - 4}` : e - 9;
  }
  /**
   * @protected
   * @returns {string}
   */
  getOsVersion() {
    let e = O.type().replace("_", " "), t = O.release();
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
        return C.join(e, "Library/Application Support");
      case "win32":
        return process.env.APPDATA || C.join(e, "AppData/Roaming");
      default:
        return process.env.XDG_CONFIG_HOME || C.join(e, ".config");
    }
  }
  getSystemPathHome() {
    var e;
    return ((e = O.homedir) == null ? void 0 : e.call(O)) || process.env.HOME;
  }
  getSystemPathTemp() {
    return O.tmpdir();
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
    const i = { darwin: "open", win32: "start", linux: "xdg-open" }[process.platform] || "xdg-open";
    Ke.exec(`${i} ${e}`, {}, (o) => {
      o && t(o);
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
var nt = tt;
const rt = v, it = nt;
let ot = class extends it {
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
    var r, i;
    let t;
    try {
      t = this.appName || ((r = this.electron.app) == null ? void 0 : r.name) || ((i = this.electron.app) == null ? void 0 : i.getName());
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
    return ((t = this.electron.app) == null ? void 0 : t.isPackaged) !== void 0 ? !this.electron.app.isPackaged : typeof process.execPath == "string" ? rt.basename(process.execPath).toLowerCase().startsWith("electron") : super.isDev();
  }
  onAppEvent(t, r) {
    var i;
    return (i = this.electron.app) == null || i.on(t, r), () => {
      var o;
      (o = this.electron.app) == null || o.off(t, r);
    };
  }
  onAppReady(t) {
    var r, i, o;
    (r = this.electron.app) != null && r.isReady() ? t() : (i = this.electron.app) != null && i.once ? (o = this.electron.app) == null || o.once("ready", t) : t();
  }
  onEveryWebContentsEvent(t, r) {
    var o, s, a;
    return (s = (o = this.electron.webContents) == null ? void 0 : o.getAllWebContents()) == null || s.forEach((A) => {
      A.on(t, r);
    }), (a = this.electron.app) == null || a.on("web-contents-created", i), () => {
      var A, c;
      (A = this.electron.webContents) == null || A.getAllWebContents().forEach((u) => {
        u.off(t, r);
      }), (c = this.electron.app) == null || c.off("web-contents-created", i);
    };
    function i(A, c) {
      c.on(t, r);
    }
  }
  /**
   * Listen to async messages sent from opposite process
   * @param {string} channel
   * @param {function} listener
   */
  onIpc(t, r) {
    var i;
    (i = this.electron.ipcMain) == null || i.on(t, r);
  }
  onIpcInvoke(t, r) {
    var i, o;
    (o = (i = this.electron.ipcMain) == null ? void 0 : i.handle) == null || o.call(i, t, r);
  }
  /**
   * @param {string} url
   * @param {Function} [logFunction]
   */
  openUrl(t, r = console.error) {
    var i;
    (i = this.electron.shell) == null || i.openExternal(t).catch(r);
  }
  setPreloadFileForSessions({
    filePath: t,
    includeFutureSession: r = !0,
    getSessions: i = () => {
      var o;
      return [(o = this.electron.session) == null ? void 0 : o.defaultSession];
    }
  }) {
    for (const s of i().filter(Boolean))
      o(s);
    r && this.onAppEvent("session-created", (s) => {
      o(s);
    });
    function o(s) {
      typeof s.registerPreloadScript == "function" ? s.registerPreloadScript({
        filePath: t,
        id: "electron-log-preload",
        type: "frame"
      }) : s.setPreloads([...s.getPreloads(), t]);
    }
  }
  /**
   * Sent a message to opposite process
   * @param {string} channel
   * @param {any} message
   */
  sendIpc(t, r) {
    var i, o;
    (o = (i = this.electron.BrowserWindow) == null ? void 0 : i.getAllWindows()) == null || o.forEach((s) => {
      var a, A;
      ((a = s.webContents) == null ? void 0 : a.isDestroyed()) === !1 && ((A = s.webContents) == null ? void 0 : A.isCrashed()) === !1 && s.webContents.send(t, r);
    });
  }
  showErrorBox(t, r) {
    var i;
    (i = this.electron.dialog) == null || i.showErrorBox(t, r);
  }
};
var st = ot, ve = { exports: {} };
(function(n) {
  let e = {};
  try {
    e = require("electron");
  } catch {
  }
  e.ipcRenderer && t(e), n.exports = t;
  function t({ contextBridge: r, ipcRenderer: i }) {
    if (!i)
      return;
    i.on("__ELECTRON_LOG_IPC__", (s, a) => {
      window.postMessage({ cmd: "message", ...a });
    }), i.invoke("__ELECTRON_LOG__", { cmd: "getOptions" }).catch((s) => console.error(new Error(
      `electron-log isn't initialized in the main process. Please call log.initialize() before. ${s.message}`
    )));
    const o = {
      sendToMain(s) {
        try {
          i.send("__ELECTRON_LOG__", s);
        } catch (a) {
          console.error("electronLog.sendToMain ", a, "data:", s), i.send("__ELECTRON_LOG__", {
            cmd: "errorHandler",
            error: { message: a == null ? void 0 : a.message, stack: a == null ? void 0 : a.stack },
            errorName: "sendToMain"
          });
        }
      },
      log(...s) {
        o.sendToMain({ data: s, level: "info" });
      }
    };
    for (const s of ["error", "warn", "info", "verbose", "debug", "silly"])
      o[s] = (...a) => o.sendToMain({
        data: a,
        level: s
      });
    if (r && process.contextIsolated)
      try {
        r.exposeInMainWorld("__electronLog", o);
      } catch {
      }
    typeof window == "object" ? window.__electronLog = o : __electronLog = o;
  }
})(ve);
var at = ve.exports;
const te = d, ct = F, ne = v, At = at;
let re = !1, ie = !1;
var lt = {
  initialize({
    externalApi: n,
    getSessions: e,
    includeFutureSession: t,
    logger: r,
    preload: i = !0,
    spyRendererConsole: o = !1
  }) {
    n.onAppReady(() => {
      try {
        i && ut({
          externalApi: n,
          getSessions: e,
          includeFutureSession: t,
          logger: r,
          preloadOption: i
        }), o && ft({ externalApi: n, logger: r });
      } catch (s) {
        r.warn(s);
      }
    });
  }
};
function ut({
  externalApi: n,
  getSessions: e,
  includeFutureSession: t,
  logger: r,
  preloadOption: i
}) {
  let o = typeof i == "string" ? i : void 0;
  if (re) {
    r.warn(new Error("log.initialize({ preload }) already called").stack);
    return;
  }
  re = !0;
  try {
    o = ne.resolve(
      __dirname,
      "../renderer/electron-log-preload.js"
    );
  } catch {
  }
  if (!o || !te.existsSync(o)) {
    o = ne.join(
      n.getAppUserDataPath() || ct.tmpdir(),
      "electron-log-preload.js"
    );
    const s = `
      try {
        (${At.toString()})(require('electron'));
      } catch(e) {
        console.error(e);
      }
    `;
    te.writeFileSync(o, s, "utf8");
  }
  n.setPreloadFileForSessions({
    filePath: o,
    includeFutureSession: t,
    getSessions: e
  });
}
function ft({ externalApi: n, logger: e }) {
  if (ie) {
    e.warn(
      new Error("log.initialize({ spyRendererConsole }) already called").stack
    );
    return;
  }
  ie = !0;
  const t = ["debug", "info", "warn", "error"];
  n.onEveryWebContentsEvent(
    "console-message",
    (r, i, o) => {
      e.processMessage({
        data: [o],
        level: t[i],
        variables: { processType: "renderer" }
      });
    }
  );
}
var pt = dt;
function dt(n) {
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
    for (const i of n.levels)
      r[i] = (...o) => n.logData(o, { level: i, scope: t });
    return r.log = r.info, r;
  }
}
let ht = class {
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
var gt = ht;
const mt = pt, vt = gt;
var S;
let Et = (S = class {
  constructor({
    allowUnknownLevel: e = !1,
    dependencies: t = {},
    errorHandler: r,
    eventLogger: i,
    initializeFn: o,
    isDev: s = !1,
    levels: a = ["error", "warn", "info", "verbose", "debug", "silly"],
    logId: A,
    transportFactories: c = {},
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
    this.addLevel = this.addLevel.bind(this), this.create = this.create.bind(this), this.initialize = this.initialize.bind(this), this.logData = this.logData.bind(this), this.processMessage = this.processMessage.bind(this), this.allowUnknownLevel = e, this.buffering = new vt(this), this.dependencies = t, this.initializeFn = o, this.isDev = s, this.levels = a, this.logId = A, this.scope = mt(this), this.transportFactories = c, this.variables = u || {};
    for (const h of this.levels)
      this.addLevel(h, !1);
    this.log = this.info, this.functions.log = this.log, this.errorHandler = r, r == null || r.setOptions({ ...t, logFn: this.error }), this.eventLogger = i, i == null || i.setOptions({ ...t, logger: this });
    for (const [h, m] of Object.entries(c))
      this.transports[h] = m(this, t);
    S.instances[A] = this;
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
    const i = r.indexOf(e), o = r.indexOf(t);
    return o === -1 || i === -1 ? !0 : o <= i;
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
    const i = {
      date: /* @__PURE__ */ new Date(),
      logId: this.logId,
      ...e,
      level: r,
      variables: {
        ...this.variables,
        ...e.variables
      }
    };
    for (const [o, s] of this.transportEntries(t))
      if (!(typeof s != "function" || s.level === !1) && this.compareLevels(s.level, e.level))
        try {
          const a = this.hooks.reduce((A, c) => A && c(A, s, o), i);
          a && s({ ...a, data: [...a.data] });
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
var yt = Et;
let wt = class {
  constructor({
    externalApi: e,
    logFn: t = void 0,
    onError: r = void 0,
    showDialog: i = void 0
  } = {}) {
    p(this, "externalApi");
    p(this, "isActive", !1);
    p(this, "logFn");
    p(this, "onError");
    p(this, "showDialog", !0);
    this.createIssue = this.createIssue.bind(this), this.handleError = this.handleError.bind(this), this.handleRejection = this.handleRejection.bind(this), this.setOptions({ externalApi: e, logFn: t, onError: r, showDialog: i }), this.startCatching = this.startCatching.bind(this), this.stopCatching = this.stopCatching.bind(this);
  }
  handle(e, {
    logFn: t = this.logFn,
    onError: r = this.onError,
    processType: i = "browser",
    showDialog: o = this.showDialog,
    errorName: s = ""
  } = {}) {
    var a;
    e = bt(e);
    try {
      if (typeof r == "function") {
        const A = ((a = this.externalApi) == null ? void 0 : a.getVersions()) || {}, c = this.createIssue;
        if (r({
          createIssue: c,
          error: e,
          errorName: s,
          processType: i,
          versions: A
        }) === !1)
          return;
      }
      s ? t(s, e) : t(e), o && !s.includes("rejection") && this.externalApi && this.externalApi.showErrorBox(
        `A JavaScript error occurred in the ${i} process`,
        e.stack
      );
    } catch {
      console.error(e);
    }
  }
  setOptions({ externalApi: e, logFn: t, onError: r, showDialog: i }) {
    typeof e == "object" && (this.externalApi = e), typeof t == "function" && (this.logFn = t), typeof r == "function" && (this.onError = r), typeof i == "boolean" && (this.showDialog = i);
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
function bt(n) {
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
var St = wt;
let Ft = class {
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
        "console-message": ({ args: [e, t, r, i] }) => {
          if (!(e < 3))
            return { message: t, source: `${i}:${r}` };
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
    logger: i,
    format: o,
    formatters: s,
    scope: a
  }) {
    typeof e == "object" && (this.events = e), typeof t == "object" && (this.externalApi = t), typeof r == "string" && (this.level = r), typeof i == "object" && (this.logger = i), (typeof o == "string" || typeof o == "function") && (this.format = o), typeof s == "object" && (this.formatters = s), typeof a == "string" && (this.scope = a);
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
    return t.forEach((i, o) => {
      r[i] = e[o];
    }), e.length > t.length && (r.unknownArgs = e.slice(t.length)), r;
  }
  disposeListeners() {
    this.disposers.forEach((e) => e()), this.disposers = [];
  }
  formatEventLog({ eventName: e, eventSource: t, handlerArgs: r }) {
    var u;
    const [i, ...o] = r;
    if (typeof this.format == "function")
      return this.format({ args: o, event: i, eventName: e, eventSource: t });
    const s = (u = this.formatters[t]) == null ? void 0 : u[e];
    let a = o;
    if (typeof s == "function" && (a = s({ args: o, event: i, eventName: e, eventSource: t })), !a)
      return;
    const A = {};
    return Array.isArray(a) ? A.args = a : typeof a == "object" && Object.assign(A, a), t === "webContents" && Object.assign(A, this.getWebContentsDetails(i == null ? void 0 : i.sender)), [this.format.replace("{eventSource}", t === "app" ? "App" : "WebContents").replace("{eventName}", e), A];
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
    var o;
    const i = this.formatEventLog({ eventName: e, eventSource: t, handlerArgs: r });
    if (i) {
      const s = this.scope ? this.logger.scope(this.scope) : this.logger;
      (o = s == null ? void 0 : s[this.level]) == null || o.call(s, ...i);
    }
  }
};
var Lt = Ft, I = { transform: Ot };
function Ot({
  logger: n,
  message: e,
  transport: t,
  initialData: r = (e == null ? void 0 : e.data) || [],
  transforms: i = t == null ? void 0 : t.transforms
}) {
  return i.reduce((o, s) => typeof s == "function" ? s({ data: o, logger: n, message: e, transport: t }) : o, r);
}
const { transform: Pt } = I;
var Ee = {
  concatFirstStringElements: Ct,
  format({ message: n, logger: e, transport: t, data: r = n == null ? void 0 : n.data }) {
    switch (typeof t.format) {
      case "string":
        return Pt({
          message: n,
          logger: e,
          transforms: [xt, Vt, Nt],
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
function Ct({ data: n }) {
  return typeof n[0] != "string" || typeof n[1] != "string" || n[0].match(/%[1cdfiOos]/) ? n : [`${n[0]} ${n[1]}`, ...n.slice(2)];
}
function Bt(n) {
  const e = Math.abs(n), t = n > 0 ? "-" : "+", r = Math.floor(e / 60).toString().padStart(2, "0"), i = (e % 60).toString().padStart(2, "0");
  return `${t}${r}:${i}`;
}
function Vt({ data: n, logger: e, message: t }) {
  const { defaultLabel: r, labelLength: i } = (e == null ? void 0 : e.scope) || {}, o = n[0];
  let s = t.scope;
  s || (s = r);
  let a;
  return s === "" ? a = i > 0 ? "".padEnd(i + 3) : "" : typeof s == "string" ? a = ` (${s})`.padEnd(i + 3) : a = "", n[0] = o.replace("{scope}", a), n;
}
function xt({ data: n, message: e }) {
  let t = n[0];
  if (typeof t != "string")
    return n;
  t = t.replace("{level}]", `${e.level}]`.padEnd(6, " "));
  const r = e.date || /* @__PURE__ */ new Date();
  return n[0] = t.replace(/\{(\w+)}/g, (i, o) => {
    var s;
    switch (o) {
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
        return Bt(r.getTimezoneOffset());
      case "iso":
        return r.toISOString();
      default:
        return ((s = e.variables) == null ? void 0 : s[o]) || i;
    }
  }).trim(), n;
}
function Nt({ data: n }) {
  const e = n[0];
  if (typeof e != "string")
    return n;
  if (e.lastIndexOf("{text}") === e.length - 6)
    return n[0] = e.replace(/\s?{text}/, ""), n[0] === "" && n.shift(), n;
  const r = e.split("{text}");
  let i = [];
  return r[0] !== "" && i.push(r[0]), i = i.concat(n.slice(1)), r[1] !== "" && i.push(r[1]), i;
}
var ye = { exports: {} };
(function(n) {
  const e = he;
  n.exports = {
    serialize: r,
    maxDepth({ data: i, transport: o, depth: s = (o == null ? void 0 : o.depth) ?? 6 }) {
      if (!i)
        return i;
      if (s < 1)
        return Array.isArray(i) ? "[array]" : typeof i == "object" && i ? "[object]" : i;
      if (Array.isArray(i))
        return i.map((A) => n.exports.maxDepth({
          data: A,
          depth: s - 1
        }));
      if (typeof i != "object" || i && typeof i.toISOString == "function")
        return i;
      if (i === null)
        return null;
      if (i instanceof Error)
        return i;
      const a = {};
      for (const A in i)
        Object.prototype.hasOwnProperty.call(i, A) && (a[A] = n.exports.maxDepth({
          data: i[A],
          depth: s - 1
        }));
      return a;
    },
    toJSON({ data: i }) {
      return JSON.parse(JSON.stringify(i, t()));
    },
    toString({ data: i, transport: o }) {
      const s = (o == null ? void 0 : o.inspectOptions) || {}, a = i.map((A) => {
        if (A !== void 0)
          try {
            const c = JSON.stringify(A, t(), "  ");
            return c === void 0 ? void 0 : JSON.parse(c);
          } catch {
            return A;
          }
      });
      return e.formatWithOptions(s, ...a);
    }
  };
  function t(i = {}) {
    const o = /* @__PURE__ */ new WeakSet();
    return function(s, a) {
      if (typeof a == "object" && a !== null) {
        if (o.has(a))
          return;
        o.add(a);
      }
      return r(s, a, i);
    };
  }
  function r(i, o, s = {}) {
    const a = (s == null ? void 0 : s.serializeMapAndSet) !== !1;
    return o instanceof Error ? o.stack : o && (typeof o == "function" ? `[function] ${o.toString()}` : o instanceof Date ? o.toISOString() : a && o instanceof Map && Object.fromEntries ? Object.fromEntries(o) : a && o instanceof Set && Array.from ? Array.from(o) : o);
  }
})(ye);
var T = ye.exports, Y = {
  applyAnsiStyles({ data: n }) {
    return oe(n, Dt, jt);
  },
  removeStyles({ data: n }) {
    return oe(n, () => "");
  }
};
const we = {
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
function Dt(n) {
  const e = n.replace(/color:\s*(\w+).*/, "$1").toLowerCase();
  return we[e] || "";
}
function jt(n) {
  return n + we.unset;
}
function oe(n, e, t) {
  const r = {};
  return n.reduce((i, o, s, a) => {
    if (r[s])
      return i;
    if (typeof o == "string") {
      let A = s, c = !1;
      o = o.replace(/%[1cdfiOos]/g, (u) => {
        if (A += 1, u !== "%c")
          return u;
        const h = a[A];
        return typeof h == "string" ? (r[A] = !0, c = !0, e(h, o)) : u;
      }), c && t && (o = t(o));
    }
    return i.push(o), i;
  }, []);
}
const {
  concatFirstStringElements: Qt,
  format: It
} = Ee, { maxDepth: Rt, toJSON: zt } = T, {
  applyAnsiStyles: Ut,
  removeStyles: Mt
} = Y, { transform: Tt } = I, se = {
  error: console.error,
  warn: console.warn,
  info: console.info,
  verbose: console.info,
  debug: console.debug,
  silly: console.debug,
  log: console.log
};
var Wt = Se;
const kt = process.platform === "win32" ? ">" : "›", be = `%c{h}:{i}:{s}.{ms}{scope}%c ${kt} {text}`;
Object.assign(Se, {
  DEFAULT_FORMAT: be
});
function Se(n) {
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
    format: be,
    level: "silly",
    transforms: [
      Ht,
      It,
      Xt,
      Qt,
      Rt,
      zt
    ],
    useStyles: process.env.FORCE_STYLES,
    writeFn({ message: t }) {
      (se[t.level] || se.info)(...t.data);
    }
  });
  function e(t) {
    const r = Tt({ logger: n, message: t, transport: e });
    e.writeFn({
      message: { ...t, data: r }
    });
  }
}
function Ht({ data: n, message: e, transport: t }) {
  return typeof t.format != "string" || !t.format.includes("%c") ? n : [
    `color:${Jt(e.level, t)}`,
    "color:unset",
    ...n
  ];
}
function Gt(n, e) {
  if (typeof n == "boolean")
    return n;
  const r = e === "error" || e === "warn" ? process.stderr : process.stdout;
  return r && r.isTTY;
}
function Xt(n) {
  const { message: e, transport: t } = n;
  return (Gt(t.useStyles, e.level) ? Ut : Mt)(n);
}
function Jt(n, e) {
  return e.colorMap[n] || e.colorMap.default;
}
const Zt = ge, b = d, ae = F;
let Yt = class extends Zt {
  constructor({
    path: t,
    writeOptions: r = { encoding: "utf8", flag: "a", mode: 438 },
    writeAsync: i = !1
  }) {
    super();
    p(this, "asyncWriteQueue", []);
    p(this, "bytesWritten", 0);
    p(this, "hasActiveAsyncWriting", !1);
    p(this, "path", null);
    p(this, "initialSize");
    p(this, "writeOptions", null);
    p(this, "writeAsync", !1);
    this.path = t, this.writeOptions = r, this.writeAsync = i;
  }
  get size() {
    return this.getSize();
  }
  clear() {
    try {
      return b.writeFileSync(this.path, "", {
        mode: this.writeOptions.mode,
        flag: "w"
      }), this.reset(), !0;
    } catch (t) {
      return t.code === "ENOENT" ? !0 : (this.emit("error", t, this), !1);
    }
  }
  crop(t) {
    try {
      const r = $t(this.path, t || 4096);
      this.clear(), this.writeLine(`[log cropped]${ae.EOL}${r}`);
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
        const t = b.statSync(this.path);
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
    this.asyncWriteQueue = [], this.hasActiveAsyncWriting = !0, b.writeFile(this.path, r, this.writeOptions, (i) => {
      t.hasActiveAsyncWriting = !1, i ? t.emit(
        "error",
        new Error(`Couldn't write to ${t.path}. ${i.message}`),
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
    if (t += ae.EOL, this.writeAsync) {
      this.asyncWriteQueue.push(t), this.nextAsyncWrite();
      return;
    }
    try {
      b.writeFileSync(this.path, t, this.writeOptions), this.increaseBytesWrittenCounter(t);
    } catch (r) {
      this.emit(
        "error",
        new Error(`Couldn't write to ${this.path}. ${r.message}`),
        this
      );
    }
  }
};
var Fe = Yt;
function $t(n, e) {
  const t = Buffer.alloc(e), r = b.statSync(n), i = Math.min(r.size, e), o = Math.max(0, r.size - e), s = b.openSync(n, "r"), a = b.readSync(s, t, 0, i, o);
  return b.closeSync(s), t.toString("utf8", 0, a);
}
const qt = Fe;
let _t = class extends qt {
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
var Kt = _t;
const en = ge, ce = d, Ae = v, tn = Fe, nn = Kt;
let rn = class extends en {
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
  provide({ filePath: t, writeOptions: r = {}, writeAsync: i = !1 }) {
    let o;
    try {
      if (t = Ae.resolve(t), this.store[t])
        return this.store[t];
      o = this.createFile({ filePath: t, writeOptions: r, writeAsync: i });
    } catch (s) {
      o = new nn({ path: t }), this.emitError(s, o);
    }
    return o.on("error", this.emitError), this.store[t] = o, o;
  }
  /**
   * @param {string} filePath
   * @param {WriteOptions} writeOptions
   * @param {boolean} async
   * @return {File}
   * @private
   */
  createFile({ filePath: t, writeOptions: r, writeAsync: i }) {
    return this.testFileWriting({ filePath: t, writeOptions: r }), new tn({ path: t, writeOptions: r, writeAsync: i });
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
    ce.mkdirSync(Ae.dirname(t), { recursive: !0 }), ce.writeFileSync(t, "", { flag: "a", mode: r.mode });
  }
};
var on = rn;
const R = d, sn = F, N = v, an = on, { transform: cn } = I, { removeStyles: An } = Y, {
  format: ln,
  concatFirstStringElements: un
} = Ee, { toString: fn } = T;
var pn = hn;
const dn = new an();
function hn(n, { registry: e = dn, externalApi: t } = {}) {
  let r;
  return e.listenerCount("error") < 1 && e.on("error", (c, u) => {
    s(`Can't write to ${u}`, c);
  }), Object.assign(i, {
    fileName: gn(n.variables.processType),
    format: "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}",
    getFile: a,
    inspectOptions: { depth: 5 },
    level: "silly",
    maxSize: 1024 ** 2,
    readAllLogs: A,
    sync: !0,
    transforms: [An, ln, un, fn],
    writeOptions: { flag: "a", mode: 438, encoding: "utf8" },
    archiveLogFn(c) {
      const u = c.toString(), h = N.parse(u);
      try {
        R.renameSync(u, N.join(h.dir, `${h.name}.old${h.ext}`));
      } catch (m) {
        s("Could not rotate log", m);
        const X = Math.round(i.maxSize / 4);
        c.crop(Math.min(X, 256 * 1024));
      }
    },
    resolvePathFn(c) {
      return N.join(c.libraryDefaultDir, c.fileName);
    },
    setAppName(c) {
      n.dependencies.externalApi.setAppName(c);
    }
  });
  function i(c) {
    const u = a(c);
    i.maxSize > 0 && u.size > i.maxSize && (i.archiveLogFn(u), u.reset());
    const m = cn({ logger: n, message: c, transport: i });
    u.writeLine(m);
  }
  function o() {
    r || (r = Object.create(
      Object.prototype,
      {
        ...Object.getOwnPropertyDescriptors(
          t.getPathVariables()
        ),
        fileName: {
          get() {
            return i.fileName;
          },
          enumerable: !0
        }
      }
    ), typeof i.archiveLog == "function" && (i.archiveLogFn = i.archiveLog, s("archiveLog is deprecated. Use archiveLogFn instead")), typeof i.resolvePath == "function" && (i.resolvePathFn = i.resolvePath, s("resolvePath is deprecated. Use resolvePathFn instead")));
  }
  function s(c, u = null, h = "error") {
    const m = [`electron-log.transports.file: ${c}`];
    u && m.push(u), n.transports.console({ data: m, date: /* @__PURE__ */ new Date(), level: h });
  }
  function a(c) {
    o();
    const u = i.resolvePathFn(r, c);
    return e.provide({
      filePath: u,
      writeAsync: !i.sync,
      writeOptions: i.writeOptions
    });
  }
  function A({ fileFilter: c = (u) => u.endsWith(".log") } = {}) {
    o();
    const u = N.dirname(i.resolvePathFn(r));
    return R.existsSync(u) ? R.readdirSync(u).map((h) => N.join(u, h)).filter(c).map((h) => {
      try {
        return {
          path: h,
          lines: R.readFileSync(h, "utf8").split(sn.EOL)
        };
      } catch {
        return null;
      }
    }).filter(Boolean) : [];
  }
}
function gn(n = process.type) {
  switch (n) {
    case "renderer":
      return "renderer.log";
    case "worker":
      return "worker.log";
    default:
      return "main.log";
  }
}
const { maxDepth: mn, toJSON: vn } = T, { transform: En } = I;
var yn = wn;
function wn(n, { externalApi: e }) {
  return Object.assign(t, {
    depth: 3,
    eventId: "__ELECTRON_LOG_IPC__",
    level: n.isDev ? "silly" : !1,
    transforms: [vn, mn]
  }), e != null && e.isElectron() ? t : void 0;
  function t(r) {
    var i;
    ((i = r == null ? void 0 : r.variables) == null ? void 0 : i.processType) !== "renderer" && (e == null || e.sendIpc(t.eventId, {
      ...r,
      data: En({ logger: n, message: r, transport: t })
    }));
  }
}
const bn = He, Sn = Ge, { transform: Fn } = I, { removeStyles: Ln } = Y, { toJSON: On, maxDepth: Pn } = T;
var Cn = Bn;
function Bn(n) {
  return Object.assign(e, {
    client: { name: "electron-application" },
    depth: 6,
    level: !1,
    requestOptions: {},
    transforms: [Ln, On, Pn],
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
    sendRequestFn({ serverUrl: t, requestOptions: r, body: i }) {
      const s = (t.startsWith("https:") ? Sn : bn).request(t, {
        method: "POST",
        ...r,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": i.length,
          ...r.headers
        }
      });
      return s.write(i), s.end(), s;
    }
  });
  function e(t) {
    if (!e.url)
      return;
    const r = e.makeBodyFn({
      logger: n,
      message: { ...t, data: Fn({ logger: n, message: t, transport: e }) },
      transport: e
    }), i = e.sendRequestFn({
      serverUrl: e.url,
      requestOptions: e.requestOptions,
      body: Buffer.from(r, "utf8")
    });
    i.on("error", (o) => e.processErrorFn({
      error: o,
      logger: n,
      message: t,
      request: i,
      transport: e
    }));
  }
}
const le = yt, Vn = St, xn = Lt, Nn = Wt, Dn = pn, jn = yn, Qn = Cn;
var In = Rn;
function Rn({ dependencies: n, initializeFn: e }) {
  var r;
  const t = new le({
    dependencies: n,
    errorHandler: new Vn(),
    eventLogger: new xn(),
    initializeFn: e,
    isDev: (r = n.externalApi) == null ? void 0 : r.isDev(),
    logId: "default",
    transportFactories: {
      console: Nn,
      file: Dn,
      ipc: jn,
      remote: Qn
    },
    variables: {
      processType: "main"
    }
  });
  return t.default = t, t.Logger = le, t.processInternalErrorFn = (i) => {
    t.transports.console.writeFn({
      message: {
        data: ["Unhandled electron-log error", i],
        level: "error"
      }
    });
  }, t;
}
const zn = Ie, Un = st, { initialize: Mn } = lt, Tn = In, $ = new Un({ electron: zn }), W = Tn({
  dependencies: { externalApi: $ },
  initializeFn: Mn
});
var Wn = W;
$.onIpc("__ELECTRON_LOG__", (n, e) => {
  e.scope && W.Logger.getInstance(e).scope(e.scope);
  const t = new Date(e.date);
  Le({
    ...e,
    date: t.getTime() ? t : /* @__PURE__ */ new Date()
  });
});
$.onIpcInvoke("__ELECTRON_LOG__", (n, { cmd: e = "", logId: t }) => {
  switch (e) {
    case "getOptions":
      return {
        levels: W.Logger.getInstance({ logId: t }).levels,
        logId: t
      };
    default:
      return Le({ data: [`Unknown cmd '${e}'`], level: "error" }), {};
  }
});
function Le(n) {
  var e;
  (e = W.Logger.getInstance(n)) == null || e.processMessage(n);
}
const kn = Wn;
var Hn = kn;
const f = /* @__PURE__ */ Je(Hn), z = v.join(P.getPath("home"), ".config", "openvpn-ui-azdroid"), j = v.join(z, "config.ovpn"), x = v.join(z, "username.json"), q = "openvpn-ui-azdroid";
function Gn(n) {
  d.existsSync(z) || d.mkdirSync(z, { recursive: !0 }), d.writeFileSync(j, n), f.info("OVPN config content saved.");
}
async function Xn(n) {
  if (typeof n.password != "string") {
    f.error("Attempted to save credentials without a password.");
    return;
  }
  d.writeFileSync(x, JSON.stringify({ username: n.username })), await Z.setPassword(q, n.username, n.password), f.info("Username and password saved.");
}
function Oe() {
  return d.existsSync(j) ? (f.info("OVPN config found and read."), d.readFileSync(j, "utf-8")) : (f.warn("OVPN config not found."), null);
}
async function Pe() {
  if (d.existsSync(x))
    try {
      const { username: n } = JSON.parse(d.readFileSync(x, "utf-8")), e = await Z.getPassword(q, n);
      if (n && e)
        return f.info("Credentials found and retrieved."), { username: n, password: e };
    } catch (n) {
      return f.error("Could not parse username file or get password.", n), null;
    }
  return f.warn("Credentials not found."), null;
}
async function ue() {
  f.info("Deleting all saved config...");
  try {
    if (d.existsSync(j) && (d.unlinkSync(j), f.info("OVPN config file deleted.")), d.existsSync(x)) {
      const { username: n } = JSON.parse(d.readFileSync(x, "utf-8"));
      await Z.deletePassword(q, n), f.info("Password deleted from keychain."), d.unlinkSync(x), f.info("Username file deleted.");
    }
    f.info("Config deleted successfully.");
  } catch (n) {
    f.error("Error deleting config:", n);
  }
}
var U = {}, l = {
  child: de,
  crypto: Xe,
  fs: d,
  os: F,
  path: v,
  process,
  util: he
};
function Jn(n, e) {
  var t = l.process.platform;
  if (t === "darwin") return qn(n, e);
  if (t === "linux") return Yn(n, e);
  if (t === "win32") return ir(n, e);
  e(new Error("Platform not yet supported."));
}
function E(n) {
  if (typeof n != "string") throw new Error("Expected a string.");
  return n.replace(/"/g, '\\"');
}
function Zn() {
  if (arguments.length < 1 || arguments.length > 3)
    throw new Error("Wrong number of arguments.");
  var n = arguments[0], e = {}, t = function() {
  };
  if (typeof n != "string")
    throw new Error("Command should be a string.");
  if (arguments.length === 2)
    if (l.util.isObject(arguments[1]))
      e = arguments[1];
    else if (l.util.isFunction(arguments[1]))
      t = arguments[1];
    else
      throw new Error("Expected options or callback.");
  else if (arguments.length === 3) {
    if (l.util.isObject(arguments[1]))
      e = arguments[1];
    else
      throw new Error("Expected options to be an object.");
    if (l.util.isFunction(arguments[2]))
      t = arguments[2];
    else
      throw new Error("Expected callback to be a function.");
  }
  if (/^sudo/i.test(n))
    return t(new Error('Command should not be prefixed with "sudo".'));
  if (typeof e.name > "u") {
    var r = l.process.title;
    if (fe(r))
      e.name = r;
    else
      return t(new Error("process.title cannot be used as a valid name."));
  } else if (!fe(e.name)) {
    var i = "";
    return i += "options.name must be alphanumeric only ", i += "(spaces are allowed) and <= 70 characters.", t(new Error(i));
  }
  if (typeof e.icns < "u") {
    if (typeof e.icns != "string")
      return t(new Error("options.icns must be a string if provided."));
    if (e.icns.trim().length === 0)
      return t(new Error("options.icns must not be empty if provided."));
  }
  if (typeof e.env < "u") {
    if (typeof e.env != "object")
      return t(new Error("options.env must be an object if provided."));
    if (Object.keys(e.env).length === 0)
      return t(new Error("options.env must not be empty if provided."));
    for (var o in e.env) {
      var s = e.env[o];
      if (typeof o != "string" || typeof s != "string")
        return t(
          new Error("options.env environment variables must be strings.")
        );
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(o))
        return t(
          new Error(
            "options.env has an invalid environment variable name: " + JSON.stringify(o)
          )
        );
      if (/[\r\n]/.test(s))
        return t(
          new Error(
            "options.env has an invalid environment variable value: " + JSON.stringify(s)
          )
        );
    }
  }
  var a = l.process.platform;
  if (a !== "darwin" && a !== "linux" && a !== "win32")
    return t(new Error("Platform not yet supported."));
  var A = {
    command: n,
    options: e,
    uuid: void 0,
    path: void 0
  };
  Jn(A, t);
}
function Yn(n, e) {
  $n(
    n,
    function(t, r) {
      if (t) return e(t);
      var i = [];
      i.push('cd "' + E(l.process.cwd()) + '";');
      for (var o in n.options.env) {
        var s = n.options.env[o];
        i.push("export " + o + '="' + E(s) + '";');
      }
      i.push('"' + E(r) + '"'), /kdesudo/i.test(r) ? (i.push(
        "--comment",
        '"' + n.options.name + ' wants to make changes. Enter your password to allow this."'
      ), i.push("-d"), i.push("--")) : /pkexec/i.test(r) && i.push("--disable-internal-agent");
      var a = `SUDOPROMPT
`;
      i.push(
        '/bin/bash -c "echo ' + E(a.trim()) + "; " + E(n.command) + '"'
      ), i = i.join(" "), l.child.exec(
        i,
        { encoding: "utf-8", maxBuffer: ur },
        function(A, c, u) {
          var h = c && c.slice(0, a.length) === a;
          h && (c = c.slice(a.length)), A && !h && (/No authentication agent found/.test(u) ? A.message = lr : A.message = k), e(A, c, u);
        }
      );
    }
  );
}
function $n(n, e) {
  var t = 0, r = ["/usr/bin/kdesudo", "/usr/bin/pkexec"];
  function i() {
    if (t === r.length)
      return e(new Error("Unable to find pkexec or kdesudo."));
    var o = r[t++];
    l.fs.stat(
      o,
      function(s) {
        if (s) {
          if (s.code === "ENOTDIR" || s.code === "ENOENT") return i();
          e(s);
        } else
          e(void 0, o);
      }
    );
  }
  i();
}
function qn(n, e) {
  var t = l.os.tmpdir();
  if (!t) return e(new Error("os.tmpdir() not defined."));
  var r = l.process.env.USER;
  if (!r) return e(new Error("env['USER'] not defined."));
  Be(
    n,
    function(i, o) {
      if (i) return e(i);
      n.uuid = o, n.path = l.path.join(
        t,
        n.uuid,
        n.options.name + ".app"
      );
      function s(a, A, c) {
        Ce(
          l.path.dirname(n.path),
          function(u) {
            if (a) return e(a);
            if (u) return e(u);
            e(void 0, A, c);
          }
        );
      }
      _n(
        n,
        function(a, A, c) {
          if (a) return s(a, A, c);
          er(
            n,
            function(u) {
              if (u) return s(u);
              nr(
                n,
                function(h, m, X) {
                  if (h) return s(h, m, X);
                  Kn(
                    n,
                    function(K) {
                      if (K) return s(K);
                      tr(
                        n,
                        function(ee, Ne, De) {
                          if (ee) return s(ee, Ne, De);
                          rr(n, s);
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
}
function _n(n, e) {
  var t = l.path.dirname(n.path);
  l.fs.mkdir(
    t,
    function(r) {
      if (r) return e(r);
      var i = l.path.join(t, "sudo-prompt-applet.zip");
      l.fs.writeFile(
        i,
        Ar,
        "base64",
        function(o) {
          if (o) return e(o);
          var s = [];
          s.push("/usr/bin/unzip"), s.push("-o"), s.push('"' + E(i) + '"'), s.push('-d "' + E(n.path) + '"'), s = s.join(" "), l.child.exec(s, { encoding: "utf-8" }, e);
        }
      );
    }
  );
}
function Kn(n, e) {
  var t = l.path.join(
    n.path,
    "Contents",
    "MacOS",
    "sudo-prompt-command"
  ), r = [];
  r.push('cd "' + E(l.process.cwd()) + '"');
  for (var i in n.options.env) {
    var o = n.options.env[i];
    r.push("export " + i + '="' + E(o) + '"');
  }
  r.push(n.command), r = r.join(`
`), l.fs.writeFile(t, r, "utf-8", e);
}
function er(n, e) {
  if (!n.options.icns) return e();
  l.fs.readFile(
    n.options.icns,
    function(t, r) {
      if (t) return e(t);
      var i = l.path.join(
        n.path,
        "Contents",
        "Resources",
        "applet.icns"
      );
      l.fs.writeFile(i, r, e);
    }
  );
}
function tr(n, e) {
  var t = l.path.join(n.path, "Contents", "MacOS", "applet"), r = {
    cwd: l.path.dirname(t),
    encoding: "utf-8"
  };
  l.child.exec("./" + l.path.basename(t), r, e);
}
function nr(n, e) {
  var t = l.path.join(n.path, "Contents", "Info.plist"), r = E(t), i = E("CFBundleName"), o = n.options.name + " Password Prompt";
  if (/'/.test(o))
    return e(new Error("Value should not contain single quotes."));
  var s = [];
  s.push("/usr/bin/defaults"), s.push("write"), s.push('"' + r + '"'), s.push('"' + i + '"'), s.push("'" + o + "'"), s = s.join(" "), l.child.exec(s, { encoding: "utf-8" }, e);
}
function rr(n, e) {
  var t = l.path.join(n.path, "Contents", "MacOS");
  l.fs.readFile(
    l.path.join(t, "code"),
    "utf-8",
    function(r, i) {
      if (r) {
        if (r.code === "ENOENT") return e(new Error(k));
        e(r);
      } else
        l.fs.readFile(
          l.path.join(t, "stdout"),
          "utf-8",
          function(o, s) {
            if (o) return e(o);
            l.fs.readFile(
              l.path.join(t, "stderr"),
              "utf-8",
              function(a, A) {
                if (a) return e(a);
                i = parseInt(i.trim(), 10), i === 0 ? e(void 0, s, A) : (a = new Error(
                  "Command failed: " + n.command + `
` + A
                ), a.code = i, e(a, s, A));
              }
            );
          }
        );
    }
  );
}
function Ce(n, e) {
  if (typeof n != "string" || !n.trim())
    return e(new Error("Argument path not defined."));
  var t = [];
  if (l.process.platform === "win32") {
    if (/"/.test(n))
      return e(new Error("Argument path cannot contain double-quotes."));
    t.push('rmdir /s /q "' + n + '"');
  } else
    t.push("/bin/rm"), t.push("-rf"), t.push('"' + E(l.path.normalize(n)) + '"');
  t = t.join(" "), l.child.exec(t, { encoding: "utf-8" }, e);
}
function Be(n, e) {
  l.crypto.randomBytes(
    256,
    function(t, r) {
      t && (r = Date.now() + "" + Math.random());
      var i = l.crypto.createHash("SHA256");
      i.update("sudo-prompt-3"), i.update(n.options.name), i.update(n.command), i.update(r);
      var o = i.digest("hex").slice(-32);
      if (!o || typeof o != "string" || o.length !== 32)
        return e(new Error("Expected a valid UUID."));
      e(void 0, o);
    }
  );
}
function fe(n) {
  return !(!/^[a-z0-9 ]+$/i.test(n) || n.trim().length === 0 || n.length > 70);
}
function ir(n, e) {
  var t = l.os.tmpdir();
  if (!t) return e(new Error("os.tmpdir() not defined."));
  Be(
    n,
    function(r, i) {
      if (r) return e(r);
      if (n.uuid = i, n.path = l.path.join(t, n.uuid), /"/.test(n.path))
        return e(
          new Error("instance.path cannot contain double-quotes.")
        );
      n.pathElevate = l.path.join(n.path, "elevate.vbs"), n.pathExecute = l.path.join(n.path, "execute.bat"), n.pathCommand = l.path.join(n.path, "command.bat"), n.pathStdout = l.path.join(n.path, "stdout"), n.pathStderr = l.path.join(n.path, "stderr"), n.pathStatus = l.path.join(n.path, "status"), l.fs.mkdir(
        n.path,
        function(o) {
          if (o) return e(o);
          function s(a, A, c) {
            Ce(
              n.path,
              function(u) {
                if (a) return e(a);
                if (u) return e(u);
                e(void 0, A, c);
              }
            );
          }
          cr(
            n,
            function(a) {
              if (a) return s(a);
              ar(
                n,
                function(A) {
                  if (A) return s(A);
                  or(
                    n,
                    function(c, u, h) {
                      if (c) return s(c, u, h);
                      Ve(
                        n,
                        function(m) {
                          if (m) return s(m);
                          sr(n, s);
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
}
function or(n, e) {
  var t = [];
  t.push("powershell.exe"), t.push("Start-Process"), t.push("-FilePath"), t.push(`"'` + n.pathExecute.replace(/'/g, "`'") + `'"`), t.push("-WindowStyle hidden"), t.push("-Verb runAs"), t = t.join(" ");
  var r = l.child.exec(
    t,
    { encoding: "utf-8" },
    function(i, o, s) {
      if (i) return e(new Error(k), o, s);
      e();
    }
  );
  r.stdin.end();
}
function sr(n, e) {
  l.fs.readFile(
    n.pathStatus,
    "utf-8",
    function(t, r) {
      if (t) return e(t);
      l.fs.readFile(
        n.pathStdout,
        "utf-8",
        function(i, o) {
          if (i) return e(i);
          l.fs.readFile(
            n.pathStderr,
            "utf-8",
            function(s, a) {
              if (s) return e(s);
              r = parseInt(r.trim(), 10), r === 0 ? e(void 0, o, a) : (s = new Error(
                "Command failed: " + n.command + `\r
` + a
              ), s.code = r, e(s, o, a));
            }
          );
        }
      );
    }
  );
}
function Ve(n, e) {
  l.fs.stat(
    n.pathStatus,
    function(t, r) {
      t && t.code === "ENOENT" || r.size < 2 ? setTimeout(
        function() {
          l.fs.stat(
            n.pathStdout,
            function(i) {
              if (i) return e(new Error(k));
              Ve(n, e);
            }
          );
        },
        1e3
      ) : t ? e(t) : e();
    }
  );
}
function ar(n, e) {
  var t = l.process.cwd();
  if (/"/.test(t))
    return e(new Error("process.cwd() cannot contain double-quotes."));
  var r = [];
  r.push("@echo off"), r.push("chcp 65001>nul"), r.push('cd /d "' + t + '"');
  for (var i in n.options.env) {
    var o = n.options.env[i];
    r.push("set " + i + "=" + o.replace(/([<>\\|&^])/g, "^$1"));
  }
  r.push(n.command), r = r.join(`\r
`), l.fs.writeFile(n.pathCommand, r, "utf-8", e);
}
function cr(n, e) {
  var t = [];
  t.push("@echo off"), t.push(
    'call "' + n.pathCommand + '" > "' + n.pathStdout + '" 2> "' + n.pathStderr + '"'
  ), t.push('(echo %ERRORLEVEL%) > "' + n.pathStatus + '"'), t = t.join(`\r
`), l.fs.writeFile(n.pathExecute, t, "utf-8", e);
}
U.exec = Zn;
var Ar = "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", k = "User did not grant permission.", lr = "No polkit authentication agent found.", ur = 134217728;
const y = new ke(), fr = "Initialization Sequence Completed", pr = "AUTH_FAILED", Q = v.join(F.tmpdir(), "openvpn.pid");
let w = null;
const J = {
  name: "OpenVPN UI"
};
d.existsSync(Q) && U.exec(`rm ${Q}`, J, (n) => {
  n ? f.warn(`Could not remove leftover PID file on startup: ${n.message}`) : f.info("Removed leftover PID file on startup.");
});
function _() {
  return new Promise((n) => {
    Te("pgrep -x openvpn", (e, t) => {
      n(!(e || !t));
    });
  });
}
function dr(n, e) {
  var a, A;
  if (w) {
    f.warn("Connect called while a VPN process is already running.");
    return;
  }
  const { username: t, password: r } = e, i = v.join(F.tmpdir(), "ovpn-auth.txt");
  d.writeFileSync(i, `${t}
${r}`, { mode: 384 });
  const o = v.join(F.tmpdir(), "config.ovpn");
  d.writeFileSync(o, n);
  const s = ["openvpn", "--config", o, "--auth-user-pass", i, "--writepid", Q];
  try {
    w = We("sudo", s, { detached: !1 }), y.emit("vpn-status-changed", "connecting"), (a = w.stdout) == null || a.on("data", (c) => {
      const u = c.toString();
      f.info(`VPN Stdout: ${u}`), u.includes(pr) && (f.warn("Authentication failed."), y.emit("auth-failed"), H()), u.includes(fr) && (f.info("VPN connection sequence completed."), y.emit("vpn-status-changed", "connected"));
    }), (A = w.stderr) == null || A.on("data", (c) => {
      const u = c.toString();
      f.error(`VPN Stderr: ${u}`), u.includes("sudo: a password is required") && y.emit("vpn-status-changed", "disconnected");
    }), w.on("error", (c) => {
      f.error("VPN spawn error:", c), y.emit("vpn-status-changed", "error"), w = null;
    }), w.on("close", (c) => {
      f.info(`VPN process spontaneously closed with code: ${c}`), d.existsSync(i) && d.unlinkSync(i), d.existsSync(o) && d.unlinkSync(o), y.emit("vpn-status-changed", "disconnected"), w = null;
    });
  } catch (c) {
    f.error("Error in connect function:", c), y.emit("vpn-status-changed", "error");
  }
}
function xe(n, e) {
  if (!d.existsSync(Q)) {
    f.warn("PID file not found. Falling back to pkill.");
    const i = `pkill ${n} openvpn`;
    U.exec(i, J, (o) => {
      o ? f.error(`sudo-prompt fallback error for command "${i}":`, o) : f.info(`Successfully executed fallback "${i}".`), e && e();
    });
    return;
  }
  const t = d.readFileSync(Q, "utf-8").trim(), r = `kill ${n} ${t}`;
  f.info(`Executing: ${r} via sudo-prompt...`), U.exec(r, J, (i) => {
    i ? f.error(`sudo-prompt error for command "${r}":`, i) : f.info(`Successfully executed "${r}".`), e && e();
  });
}
function H(n) {
  xe("-9", n);
}
function hr() {
  xe("-15");
}
process.on("SIGHUP", () => {
  f.warn("Received SIGHUP signal. Ignoring to prevent unexpected shutdown.");
});
const gr = Me(import.meta.url), M = V.dirname(gr);
process.env.DIST = V.join(M, "../dist");
process.env.DIST_ELECTRON = V.join(M, "../dist-electron");
const pe = process.env.VITE_DEV_SERVER_URL;
f.initialize();
f.info("App starting...");
let g, G = !1;
function mr() {
  f.info("Creating main window..."), g = new ze({
    width: 380,
    height: 580,
    resizable: !1,
    frame: !1,
    icon: V.join(M, "../build/icons/512x512.png"),
    webPreferences: {
      preload: V.join(M, "preload.mjs"),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), pe ? g.loadURL(pe) : g.loadFile(V.join(process.env.DIST, "index.html"));
}
P.on("window-all-closed", async () => {
  G = !0, process.platform !== "darwin" && (f.info("All windows closed. Checking if VPN is running before quit."), await _() ? H(() => P.quit()) : P.quit(), g = null);
});
P.whenReady().then(mr);
L.on("quit-app", async () => {
  G = !0, f.info("Quit app requested. Checking if VPN is running before quit."), await _() ? H(() => P.quit()) : P.quit();
});
L.on("minimize-app", () => {
  g == null || g.minimize();
});
L.handle("get-initial-config", async () => {
  const n = Oe(), e = await Pe();
  return {
    hasConfig: !!(n && e)
  };
});
L.handle("open-file-dialog", async () => {
  const n = await Re.showOpenDialog(g, {
    properties: ["openFile"],
    filters: [{ name: "OpenVPN Konfiqurasiyası", extensions: ["ovpn"] }]
  });
  if (!n.canceled && n.filePaths.length > 0) {
    const e = n.filePaths[0], t = Ue.readFileSync(e, "utf-8");
    return Gn(t), !0;
  }
  return !1;
});
L.handle("save-credentials", async (n, e) => (await Xn(e), !0));
L.handle("reset-app", async () => (f.info("Reset app requested. Checking if VPN is running."), await _() ? H(async () => {
  await ue();
}) : await ue(), !0));
L.on("connect-vpn", async () => {
  const n = Oe(), e = await Pe();
  n && e ? dr(n, e) : f.error("Attempted to connect without full configuration.");
});
L.on("disconnect-vpn", () => {
  hr();
});
y.on("vpn-status-changed", (n) => {
  try {
    !G && g && !g.isDestroyed() && g.webContents.send("vpn-status-changed", n);
  } catch (e) {
    f.warn('IPC message "vpn-status-changed" could not be sent. The window was likely destroyed.', e);
  }
});
y.on("auth-failed", () => {
  try {
    !G && g && !g.isDestroyed() && g.webContents.send("auth-failed");
  } catch (n) {
    f.warn('IPC message "auth-failed" could not be sent. The window was likely destroyed.', n);
  }
});
