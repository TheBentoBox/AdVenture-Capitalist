import { Actor } from "../../engine/core/actor";
import { TextComponent } from "../../engine/components/display/textComponent";
import { SpriteComponent } from "../../engine/components/display/spriteComponent";
import { Observable } from "../../engine/core/observable";
import { BusinessTicker } from "../gameComponents/businessTicker";
import { Signal } from "../../engine/core/signal";

enum BusinessActorComponents {
    ICON = "icon",
    TIMER = "timer",
    AMOUNT_OWNED = "amountOwned",
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
     * The amount of time the current cycle has been running for, in seconds.
     */
    public timeInCycle: Observable<number>;

    /**
     * The number of instances of this business owned.
     */
    public amountOwned: Observable<number>;

    /**
     * Signal to notify that this business has completed a full cycle.
     */
    public onCycleComplete: Signal<(business: VentureBusiness) => void>;

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

        // Attach the main display components.
        this.addDisplayComponent(new SpriteComponent(BusinessActorComponents.ICON, { assetName }));
        this.addDisplayComponent(new TextComponent(BusinessActorComponents.AMOUNT_OWNED, { text: "0" }));
        this.addDisplayComponent(new TextComponent(BusinessActorComponents.TIMER, { text: "" }));

        // Hook up the value changer of the amount owned to update the associated text element.
        this.amountOwned = new Observable<number>(1);
        this.amountOwnedTextComponent.attachTo(this.amountOwned);
        this.amountOwnedTextComponent.transform.position.y = this.iconComponent.container.height;

        this.timerTextComponent.transform.position.x = this.iconComponent.container.width;
        this.timeInCycle = new Observable<number>(0);
        this.onCycleComplete = new Signal<(business: VentureBusiness) => {}>();

        this.baseCost = baseCost;
        this.baseProfit = baseProfit;
        this.baseCycleDuration = baseCycleDuration;

        this.addTickingComponent(new BusinessTicker(this.name + "Ticker", this));
    }

    /**
     * Returns the sprite component displaying this business's configured icon.
     */
    public get iconComponent(): SpriteComponent {
        return this.displayComponents[BusinessActorComponents.ICON] as SpriteComponent;
    }

    /**
     * Returns the text component displaying the amount of this business that have been purchased.
     */
    public get amountOwnedTextComponent(): TextComponent {
        return this.displayComponents[BusinessActorComponents.AMOUNT_OWNED] as TextComponent;
    }

    /**
     * Returns the text component displaying the timer before this business's next cycle completes.
     */
    public get timerTextComponent(): TextComponent {
        return this.displayComponents[BusinessActorComponents.TIMER] as TextComponent;
    }
}