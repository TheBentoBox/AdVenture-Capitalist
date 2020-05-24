import { Actor } from "../../engine/core/actor";
import { TextComponent } from "../../engine/components/display/textComponent";
import { SpriteComponent } from "../../engine/components/display/spriteComponent";
import { Observable } from "../../engine/core/observable";
import { BusinessTicker } from "../gameComponents/businessTicker";
import { Signal } from "../../engine/core/signal";

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
    public onCycleComplete: Signal<(business: VentureBusiness) => {}>;

    /**
     * Constructs a new business.
     * @param assetName The asset to use as this business's main display icon.
     * @param baseCost The base cost of the business. The cost increases formulaically as more are purchased.
     * @param baseCycleDuration The duration one business cycle should take in seconds.
     */
    public constructor(assetName: string, baseCost: number, baseCycleDuration: number) {
        super();

        // Attach the icon.
        const businessIcon = new SpriteComponent({ assetName });
        this.addDisplayComponent(businessIcon);

        // Create the text indicating the # of owned businesses.
        const amountOwnedTextComponent = new TextComponent({ text: "" });
        amountOwnedTextComponent.transform.position.y = businessIcon.container.height;
        this.addDisplayComponent(amountOwnedTextComponent);

        // Hook up the value changer ot the amount owned to update the associated text element.
        this.amountOwned = new Observable<number>(0);
        amountOwnedTextComponent.attachTo(this.amountOwned);

        this.timeInCycle = new Observable<number>(0);
        this.onCycleComplete = new Signal<(business: VentureBusiness) => {}>();

        this.baseCost = baseCost;
        this.baseCycleDuration = baseCycleDuration;
        this.addTickingComponent(new BusinessTicker(this));

        // const filter = new PIXI.filters.ColorMatrixFilter();
        // filter.desaturate();
        // this.container.filters = [filter];
    }

    /**
     * The progress towards the next completion of this business cycle, when it will reward money.
     * This is a normalized value between 0 and 1 representing % completion.
     */
    public get progress(): number {
        return (this.timeInCycle.getValue() / this.baseCycleDuration);
    }
}