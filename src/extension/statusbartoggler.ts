import { Disposable, StatusBarItem, window } from "vscode";
import { Config } from "./config";

export class StatusBarToggler implements Disposable {
    private static readonly watchCommand = "coverage-gutters.watchCoverageAndVisibleEditors";
    private static readonly removeCommand = "coverage-gutters.removeWatch";
    private static readonly watchText = "Watch";
    private static readonly coverageText = "Coverage";
    private static readonly listIcon = "$(list-ordered) ";
    private static readonly loadingIcon = "$(loading~spin) ";
    private static readonly watchToolTip = "Coverage Gutters: Click to watch workspace.";
    private static readonly removeWatchToolTip = "Coverage Gutters: Click to remove watch from workspace.";

    public isActive: boolean;
    public isLoading: boolean;
    public lineCoverage: string | undefined;
    private statusBarItem: StatusBarItem;
    private configStore: Config;

    constructor(configStore: Config) {
        this.statusBarItem = window.createStatusBarItem();
        this.statusBarItem.command = StatusBarToggler.watchCommand;
        this.statusBarItem.text = StatusBarToggler.watchText;
        this.statusBarItem.tooltip = StatusBarToggler.watchToolTip;
        this.configStore = configStore;
        this.isLoading = false;
        this.lineCoverage = undefined;

        if (this.configStore.showStatusBarToggler) { this.statusBarItem.show(); }
    }

    public get statusText() {
        return this.statusBarItem.text;
    }

    /**
     * Toggles the status bar item from watch to remove and vice versa
     */
    public toggle(active: boolean) {
        this.isActive = active;

        this.update();
    }

    public setLoading(loading: boolean = !this.isLoading) {
        this.isLoading = loading;
        this.update();
    }

    public setCoverage(linePercentage: number | undefined ) {
        if (Number.isFinite(linePercentage)) {
            this.lineCoverage = `${linePercentage}%`;
        } else {
            this.lineCoverage = undefined;
        }
        this.update();
    }

    /**
     * Cleans up the statusBarItem if asked to dispose
     */
    public dispose() {
        this.statusBarItem.dispose();
    }

    private getCoverageText() {
        return [this.lineCoverage || "No", StatusBarToggler.coverageText].join(" ");
    }

    /**
     * update
     * @description Updates the text and tooltip displayed by the StatusBarToggler
     */
    private update() {
        if (this.isActive) {
            this.statusBarItem.command = StatusBarToggler.removeCommand;
            this.statusBarItem.tooltip = StatusBarToggler.removeWatchToolTip;
            this.statusBarItem.text = this.getCoverageText();
        } else {
            this.statusBarItem.command = StatusBarToggler.watchCommand;
            this.statusBarItem.tooltip = StatusBarToggler.watchToolTip;
            this.statusBarItem.text = StatusBarToggler.watchText;
        }
        if (this.isLoading) {
            this.statusBarItem.text = StatusBarToggler.loadingIcon + this.statusBarItem.text;
        } else {
            this.statusBarItem.text = StatusBarToggler.listIcon + this.statusBarItem.text;
        }
    }
}
