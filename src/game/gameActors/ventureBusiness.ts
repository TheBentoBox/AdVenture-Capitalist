import { Actor } from "../../engine/core/actor";
import { TextComponent } from "../../engine/components/display/textComponent";
import { AssetLoader } from "../../engine/core/assetLoader";
import { SpriteComponent } from "../../engine/components/display/spriteComponent";
import { Observable } from "../../engine/core/observable";

/**
 * Represents one of the buyable businesses in the {@link AdVentureCapitalist} game.
 */
export class VentureBusiness extends Actor {

    /**
     * The number of instances of this business owned.
     */
    public amountOwned: Observable<number>;

    /**
     * Constructs a new business.
     * @param assetKey The asset to use as this business's main display icon.
     * @param baseCost The base cost of the business. The cost increases formulaically as more are purchased.
     */
    public constructor(assetKey: string, baseCost: number, baseCycleDuration: number) {
        super();

        const businessIcon = new SpriteComponent(assetKey);
        this.addDisplayComponent(businessIcon);

        const amountOwnedTextComponent = new TextComponent("");
        amountOwnedTextComponent.transform.position.y = businessIcon.container.height;
        this.addDisplayComponent(amountOwnedTextComponent);

        this.amountOwned = new Observable<number>(0);
        this.amountOwned.subscribe(this, (newValue: number) => amountOwnedTextComponent.setText(String(newValue)));
    }
}