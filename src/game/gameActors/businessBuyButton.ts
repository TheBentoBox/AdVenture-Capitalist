import { Button } from "../../engine/actors/ui/button";
import { TextComponent } from "../../engine/components/display/textComponent";

/**
 * The names of key labels attached to this business button.
 */
enum LabelNames {

    /**
     * The label denoting the current buy price for this business.
     * This should change based on the number of owned businesses and the global purchase mode.
     */
    PRICE = "priceLabel",

    /**
     * The label denoting the number of units that will be purchased.
     * This is based on the global purchase mode.
     */
    AMOUNT = "amountLabel",
}

/**
 * A button tied to purchasing businesses. This is just a custom button with accessors to let
 * the controller manipulate its labels as the business and global states change.
 */
export class BusinessBuyButton extends Button {

    /**
     * The label displaying the current price of this business.
     */
    public get priceLabel(): TextComponent {
        return this.displayComponents[LabelNames.PRICE] as TextComponent;
    }

    /**
     * The label displaying the number of units that would be purchased.
     */
    public get amountLabel(): TextComponent {
        return this.displayComponents[LabelNames.AMOUNT] as TextComponent;
    }
}