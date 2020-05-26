import { Actor, ActorData } from "../../engine/core/actor";
import { TextComponent } from "../../engine/components/display/textComponent";
import { SpriteComponent } from "../../engine/components/display/spriteComponent";
import { ButtonData } from "../../engine/actors/ui/button";
import { Observable } from "../../engine/core/observable";
import { BusinessController } from "../gameComponents/businessController";
import { AdVentureCapitalist } from "../adVentureCapitalist";
import { DisplayComponentData } from "../../engine/components/display/displayComponent";
import { BusinessBuyButton } from "./businessBuyButton";

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
    AMOUNT_OWNED = "amountOwnedText",

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
    initialAmountOwned: number,
}

/**
 * Represents one of the buyable businesses in the {@link AdVentureCapitalist} game.
 */
export class VentureBusiness extends Actor<VentureBusinessData> {

    /**
     * How much the first unit of this business costs to purchase.
     * The cost of buying a business costs more as more of them are purchased.
     */
    public readonly baseCost: number;

    /**
     * How much this business earns per cycle per unit.
     */
    public readonly baseProfit: number;

    /**
     * The amount of time one cycle should take to run for this business.
     * This can decrease based on upgrades.
     */
    public readonly baseCycleDuration: number;

    /**
     * The amount this business's manager costs.
     */
    public readonly managerCost: number;

    /**
     * The profit multiplier applied to this business.
     */
    public profitMultipler: number;

    /**
     * The amount of time the current cycle has been running for, in seconds.
     */
    public timeInCycle: Observable<number>;

    /**
     * The number of instances of this business owned.
     */
    public amountOwned: Observable<number>;

    /**
     * Constructs a new business.
     * @param businessData The configured data defining this business.
     */
    public constructor(businessData: VentureBusinessData) {
        super(businessData);
        this.profitMultipler = 1;
        this.amountOwned = new Observable<number>(this._objectData.initialAmountOwned ?? 0);
        this.timeInCycle = new Observable<number>(0);

        this.baseCost = this._objectData.baseCost;
        this.baseProfit = this._objectData.baseProfit;
        this.baseCycleDuration = this._objectData.baseCycleDuration;
        this.managerCost = this._objectData.managerCost;

        // Attach the back sprites.
        for (let i = 0; i < businessData.backSprites.length; ++i) {
            this.addDisplayComponent(new SpriteComponent(businessData.backSprites[i]));
        }

        // Attach the main display components.
        const businessIcon = new SpriteComponent({ name: VentureBusinessUIParts.ICON, assetName: this._objectData.icon });
        businessIcon.transform.scale.set(0.75);
        this.addDisplayComponent(businessIcon);
        this.addDisplayComponent(new TextComponent({ name: VentureBusinessUIParts.AMOUNT_OWNED, text: this.amountOwned }));

        // Attach the timer last so it appears on top of the progress bar.
        this.addDisplayComponent(new TextComponent({ name: VentureBusinessUIParts.TIMER, text: "", style: { fontFamily: "Arial", fill: 0xFFFFFF } }));

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
        this.amountOwnedTextComponent.transform.position.x = ((this.iconComponent.container.width / 2) - (this.amountOwnedTextComponent.container.width / 2));
        this.amountOwnedTextComponent.transform.position.y = (this.iconComponent.container.height + 10);

        // Align the business timer to the right-middle of its icon.
        this.timerTextComponent.transform.position.x = (this.progressBar.transform.position.x + (this.progressBar.container.width / 2) - (this.timerTextComponent.container.width / 2));
        this.timerTextComponent.transform.position.y = (this.progressBar.transform.position.y + (this.progressBar.container.height / 2) - (this.timerTextComponent.container.height / 2));

        // Now that alignment is done, add the mask to the progress bar.
        // The mask affects the container width/height measurements.
        const progressBarMask = new PIXI.Graphics().beginFill().drawRect(0, 0, this.progressBar.container.width, this.progressBar.container.height);
        progressBarMask.scale.set(0, 1);
        this.progressBar.mask = progressBarMask;
    }

    /**
     * Returns the sprite component displaying this business's configured icon.
     */
    public get iconComponent(): SpriteComponent {
        return this.displayComponents[VentureBusinessUIParts.ICON] as SpriteComponent;
    }

    /**
     * Returns the text component displaying the amount of this business that have been purchased.
     */
    public get amountOwnedTextComponent(): TextComponent {
        return this.displayComponents[VentureBusinessUIParts.AMOUNT_OWNED] as TextComponent;
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
            * this.amountOwned.getValue()
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
            if (i === 0 && (this.amountOwned.getValue() === 0 || this.amountOwned.getValue() === this._objectData.initialAmountOwned)) {
                cost += this.baseCost;

            } else {

                // Otherwise, each units costs 7% more than the last.
                const power = Math.max(1, this.amountOwned.getValue() - 1 + i);
                cost += (this.baseCost * Math.pow(1.07, power));
            }
        }
        return cost;
    }
}