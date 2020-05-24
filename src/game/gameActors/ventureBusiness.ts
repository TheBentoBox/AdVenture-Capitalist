import { Actor } from "../../engine/core/actor";
import { TextComponent } from "../../engine/components/display/textComponent";
import { SpriteComponent } from "../../engine/components/display/spriteComponent";
import { Observable } from "../../engine/core/observable";
import { BusinessController } from "../gameComponents/businessController";
import { AdVentureCapitalist } from "../adVentureCapitalist";

/**
 * For internal use within the game class.
 * The names of the main display components representing the view of this business.
 */
enum VentureBusinessComponents {

    /**
     * The icon used to represent this business.
     */
    ICON = "icon",

    /**
     * The text component displaying the time remaining in the current business cycle.
     */
    TIMER = "timerText",

    /**
     * The text component displaying the number of units of this business that have been purchased.
     */
    AMOUNT_OWNED = "amountOwnedText",
}

/**
 * Represents one of the buyable businesses in the {@link AdVentureCapitalist} game.
 */
export class VentureBusiness extends Actor {

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
     * @param name The name of this business actor.
     * @param assetName The asset to use as this business's main display icon.
     * @param baseCost The base cost of the business. The cost increases formulaically as more are purchased.
     * @param baseProfit The base profit of this business. The profit increases as more units of the business are purchased.
     * @param baseCycleDuration The duration one business cycle should take in seconds.
     */
    public constructor(name: string, assetName: string, baseCost: number, baseProfit: number, baseCycleDuration: number) {
        super(name);
        this.profitMultipler = 1;
        this.amountOwned = new Observable<number>(1);
        this.timeInCycle = new Observable<number>(0);

        // Attach the main display components.
        this.addDisplayComponent(new SpriteComponent(VentureBusinessComponents.ICON, { assetName }));
        this.addDisplayComponent(new TextComponent(VentureBusinessComponents.AMOUNT_OWNED, { text: this.amountOwned }));
        this.addDisplayComponent(new TextComponent(VentureBusinessComponents.TIMER, { text: "" }));

        // Align the business amount owned with the bottom-middle of its icon.
        this.amountOwnedTextComponent.transform.position.x = ((this.iconComponent.container.width / 2) - (this.timerTextComponent.container.width / 2));
        this.amountOwnedTextComponent.transform.position.y = (this.iconComponent.container.height + 5);

        // Align the business timer to the right-middle of its icon.
        this.timerTextComponent.transform.position.x = this.iconComponent.container.width + 15;
        this.timerTextComponent.transform.position.y = ((this.iconComponent.container.height / 2) - (this.timerTextComponent.container.height / 2));

        this.baseCost = baseCost;
        this.baseProfit = baseProfit;
        this.baseCycleDuration = baseCycleDuration;

        this.addControllerComponent(new BusinessController(this.name + "Controller", this));
    }

    /**
     * Returns the sprite component displaying this business's configured icon.
     */
    public get iconComponent(): SpriteComponent {
        return this.displayComponents[VentureBusinessComponents.ICON] as SpriteComponent;
    }

    /**
     * Returns the text component displaying the amount of this business that have been purchased.
     */
    public get amountOwnedTextComponent(): TextComponent {
        return this.displayComponents[VentureBusinessComponents.AMOUNT_OWNED] as TextComponent;
    }

    /**
     * Returns the text component displaying the timer before this business's next cycle completes.
     */
    public get timerTextComponent(): TextComponent {
        return this.displayComponents[VentureBusinessComponents.TIMER] as TextComponent;
    }

    /**
     * Gets the profit of this business based on the number of owned units.
     */
    public get profit(): number {
        return (this.baseProfit * this.amountOwned.getValue() * this.profitMultipler * AdVentureCapitalist.instance.bank.globalProfitMultiplier);
    }
}