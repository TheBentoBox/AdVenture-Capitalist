import { Actor, ActorData } from "../../engine/core/actor";
import { TextComponent, TextFormatMode } from "../../engine/components/display/textComponent";
import { SpriteComponent } from "../../engine/components/display/spriteComponent";
import { ButtonData } from "../../engine/actors/ui/button";
import { Observable } from "../../engine/core/observable";
import { BusinessController } from "../gameComponents/businessController";
import { AdVentureCapitalist } from "../adVentureCapitalist";
import { DisplayComponentData } from "../../engine/components/display/displayComponent";
import { BusinessBuyButton } from "./businessBuyButton";
import { Engine } from "../../engine/core/engine";

/**
 * For internal use within the game class.
 * The names of the main components & children representing the view of this business.
 */
enum VentureBusinessUIParts {

    /**
     * The icon used to represent this business.
     */
    ICON = "icon",

    /**
     * The text component displaying the current profit of this business.
     */
    PROFIT = "profitText",

    /**
     * The sprite component representing the area where the timer text should go.
     */
    TIMER_AREA = "timerArea",

    /**
     * The text component displaying the time remaining in the current business cycle.
     */
    TIMER = "timerText",

    /**
     * The text component displaying the number of units of this business that have been purchased.
     */
    UNITS_OWNED = "unitsOwnedText",

    /**
     * The text component displaying the number of units of this business that have been purchased.
     */
    PROGRESS_BAR = "progressBar",

    /**
     * The child representing the buy button.
     */
    BUY_BUTTON = "buyButton",
}

/**
 * The shape of the data that should be passed into the business on creation.
 * This is drawn from the game config.
 */
export interface VentureBusinessData extends ActorData {

    /**
     * The config for sprite components which should be displayed at the back of the business view.
     */
    backSprites: DisplayComponentData[],

    /**
     * The button that lets users buy units of this business.
     */
    buyButton: ButtonData,

    /**
     * The config for the sprite that should be used as the progress bar for the business cycle.
     */
    progressBarSprite: DisplayComponentData,

    /**
     * The asset to use as this business's main display icon.
     */
    icon: string,

    /**
     * The base cost of the business.The cost increases formulaically as more are purchased.
     */
    baseCost: number,

    /**
     * The base profit of this business.The profit increases as more units of the business are purchased.
     */
    baseProfit: number,

    /**
     * The duration one business cycle should take in seconds.
     */
    baseCycleDuration: number,

    /**
     * The amount this business's manager costs.
     */
    managerCost: number,

    /**
     * The number of units of this business that should be owned by default for a fresh game.
     */
    initialUnitsOwned: number,
}

/**
 * Represents one of the buyable businesses in the {@link AdVentureCapitalist} game.
 */
export class VentureBusiness extends Actor<VentureBusinessData> {

    /**
     * How much the first unit of this business costs to purchase.
     * The cost of buying a business costs more as more of them are purchased.
     */
    protected _baseCost: number;

    /**
     * How much this business earns per cycle per unit.
     */
    protected _baseProfit: number;

    /**
     * The amount of time one cycle should take to run for this business.
     */
    protected _baseCycleDuration: number;

    /**
     * The amount this business's manager costs.
     */
    protected _managerCost: number;

    /**
     * The profit multiplier applied to this business.
     */
    public profitMultipler: number;

    /**
     * The amount of time the current cycle has been running for, in seconds.
     */
    public timeInCycle: Observable<number>;

    /**
     * The number of units of this business owned.
     */
    public unitsOwned: Observable<number>;

    /**
     * Constructs a new business.
     * @param businessData The configured data defining this business.
     */
    public constructor(businessData: VentureBusinessData) {
        super(businessData);
        this.profitMultipler = 1;
        this.unitsOwned = new Observable<number>(this._objectData.initialUnitsOwned ?? 0);
        this.timeInCycle = new Observable<number>(0);

        this._baseCost = this._objectData.baseCost;
        this._baseProfit = this._objectData.baseProfit;
        this._baseCycleDuration = this._objectData.baseCycleDuration;
        this._managerCost = this._objectData.managerCost;

        // Attach the back sprites.
        for (const spriteData of businessData.backSprites) {
            this.addDisplayComponent(new SpriteComponent(spriteData));
        }

        // Attach the icon representing this business.
        const businessIcon = new SpriteComponent({ name: VentureBusinessUIParts.ICON, assetName: this._objectData.icon });
        businessIcon.transform.scale.set(0.75);
        this.addDisplayComponent(businessIcon);

        // Attach the descriptive text components.
        this.addDisplayComponent(new TextComponent({ name: VentureBusinessUIParts.UNITS_OWNED, text: this.unitsOwned }));
        this.addDisplayComponent(new TextComponent({ name: VentureBusinessUIParts.TIMER, text: "", style: { fontFamily: "Arial", fill: 0xFFFFFF } }));
        this.addDisplayComponent(new TextComponent({ name: VentureBusinessUIParts.PROFIT, text: `${this._baseProfit}`, format: TextFormatMode.CURRENCY, maxSize: { x: 200 } }));

        // Add the buy button after everything but before the controller.
        this.addChild(new BusinessBuyButton({ ...this._objectData.buyButton, name: VentureBusinessUIParts.BUY_BUTTON }))

        // Add the controller. This comes last because it requires everything else to exist to hook into.
        this.addControllerComponent(new BusinessController(this.name + "Controller", this));
    }

    /**
     * Loads the busines object, initializing the positions of view elements and hooking them up appropriately.
     */
    public load(): void {
        super.load();

        // Align the business amount owned with the bottom-middle of its icon.
        this.unitsOwnedTextComponent.transform.position.x = ((this.iconComponent.container.width / 2) - (this.unitsOwnedTextComponent.container.width / 2));
        this.unitsOwnedTextComponent.transform.position.y = (this.iconComponent.container.height + 10);

        // Align the business profit value to the left-middle of the progress bar.
        this.profitTextComponent.transform.position.x = (this.progressBar.transform.position.x + 35);
        this.profitTextComponent.transform.position.y = (this.progressBar.transform.position.y + (this.progressBar.container.height / 2) - (this.profitTextComponent.container.height / 2));

        // Align the business timer to the right-middle of its icon.
        this.timerTextComponent.transform.position.x = (this.timerAreaComponent.transform.position.x + (this.timerAreaComponent.container.width / 2) - (this.timerTextComponent.container.width / 2));
        this.timerTextComponent.transform.position.y = (this.timerAreaComponent.transform.position.y + (this.timerAreaComponent.container.height / 2) - (this.timerTextComponent.container.height / 2));

        // Now that alignment is done, add the mask to the progress bar.
        // The mask affects the container width/height measurements.
        const progressBarMask = new PIXI.Graphics().beginFill().drawRect(0, 0, this.progressBar.container.width, this.progressBar.container.height);
        progressBarMask.scale.set(0, 1);
        this.progressBar.mask = progressBarMask;
    }

    /**
     * Saves this business's data in the local storage.
     */
    public save(): void {
        super.save();
        Engine.localStorage.setValue(`${this.name}:baseCycleDuration`, this.baseCycleDuration);
        Engine.localStorage.setValue(`${this.name}:profitMultipler`, this.profitMultipler);
        Engine.localStorage.setValue(`${this.name}:timeInCycle`, this.timeInCycle.getValue());
        Engine.localStorage.setValue(`${this.name}:unitsOwned`, this.unitsOwned.getValue());
    }

    /**
     * Restores this business's data from the local storage.
     */
    public restore(): void {
        this._baseCycleDuration = Engine.localStorage.getNumber(`${this.name}:baseCycleDuration`, this.baseCycleDuration);
        this.profitMultipler = Engine.localStorage.getNumber(`${this.name}:profitMultipler`, this.profitMultipler);
        this.timeInCycle.setValue(Engine.localStorage.getNumber(`${this.name}:timeInCycle`, 0));
        this.unitsOwned.setValue(Engine.localStorage.getNumber(`${this.name}:unitsOwned`, this._objectData.initialUnitsOwned ?? 0));
        super.restore();
    }

    /**
     * Gets how much the first unit of this business costs to purchase.
     * The cost of buying a business costs more as more of them are purchased.
     */
    public get baseCost(): number {
        return this._baseCost;
    }

    /**
     * Gets how much this business earns per cycle per unit.
     */
    public get baseProfit(): number {
        return this._baseProfit;
    }

    /**
     * Gets the amount of time one cycle should take to run for this business.
     */
    public get baseCycleDuration(): number {
        return this._baseCycleDuration;
    }

    /**
     * Gets the amount this business's manager costs.
     */
    public get managerCost(): number {
        return this._managerCost;
    }

    /**
     * Returns the sprite component displaying this business's configured icon.
     */
    public get iconComponent(): SpriteComponent {
        return this.displayComponents[VentureBusinessUIParts.ICON] as SpriteComponent;
    }

    /**
     * Returns the text component displaying the current profit value of this business.
     */
    public get profitTextComponent(): TextComponent {
        return this.displayComponents[VentureBusinessUIParts.PROFIT] as TextComponent;
    }

    /**
     * Returns the text component displaying the timer before this business's next cycle completes.
     */
    public get timerTextComponent(): TextComponent {
        return this.displayComponents[VentureBusinessUIParts.TIMER] as TextComponent;
    }

    /**
     * Returns the button used to buy more units of this business
     */
    public get buyButton(): BusinessBuyButton {
        return this.children[VentureBusinessUIParts.BUY_BUTTON] as BusinessBuyButton;
    }

    /**
     * Returns the sprite component representing this .
     */
    public get progressBar(): SpriteComponent {
        return this.displayComponents[VentureBusinessUIParts.PROGRESS_BAR] as SpriteComponent;
    }

    /**
     * Gets the profit of this business based on the number of owned units.
     */
    public get profit(): number {
        return (
            this.baseProfit
            * this.unitsOwned.getValue()
            * this.profitMultipler
            * AdVentureCapitalist.getInstance().bank.globalProfitMultiplier.getValue()
        );
    }

    /**
     * Gets the amount it should cost to purchase the next N unit of this business.
     * @param n The theoretical purchase amount. Defaults to 1.
     * @returns The amount the next n units of this business would cost.
     */
    public getNextNextNthUnitsCost(n: number = AdVentureCapitalist.getInstance().bank.purchaseMode.getValue()): number {

        let cost = 0;
        for (let i = 0; i < n; ++i) {

            // In the special case that this would be the first unit, don't apply the exponent to it.
            if (i === 0 && (this.unitsOwned.getValue() === 0 || this.unitsOwned.getValue() === this._objectData.initialUnitsOwned)) {
                cost += this.baseCost;

            } else {

                // Otherwise, each units costs 7% more than the last.
                const power = Math.max(1, this.unitsOwned.getValue() - 1 + i);
                cost += (this.baseCost * Math.pow(1.07, power));
            }
        }
        return cost;
    }

    /**
     * Returns the text component displaying the amount of this business that have been purchased.
     */
    protected get unitsOwnedTextComponent(): TextComponent {
        return this.displayComponents[VentureBusinessUIParts.UNITS_OWNED] as TextComponent;
    }

    /**
     * Returns the text component displaying the timer before this business's next cycle completes.
     */
    protected get timerAreaComponent(): TextComponent {
        return this.displayComponents[VentureBusinessUIParts.TIMER_AREA] as TextComponent;
    }
}