# VenturaEngine
A small TypeScript game engine and an implementing AdVenture Capitalist clone game.

## Engine Structure
The basic structure of the engine is as follows:
* **Actors**: An actor is an object which can be placed within a level. They can have components and children (other actors) attached to them.
* **Components**: Components can be attached to actors. There are two types of components:
  * **Display Components**: These are components with a visual state, such as sprites and text elements. These do not tick as part of the game update cycle and should be treated as a dummy visual object which is controlled externally.
  * **Controller Components**: These are components with no visual state, but which *do* (by default) tick as part of the game update cycle. These should be used to control the behavior of your actors and components.
  
These combine to produce an MVC-esque structure to the engine. Actors are your "models", display components are the view, and controller components are, as the name implies, your controllers. Actors can have components of any kind attached to them willy-nilly, but you are encouraged to give each actor an API to access key display components which controller components can then access. An example of this can be seen in the [VentureBusiness actor](https://github.com/TheBentoBox/VenturaEngine/blob/master/src/game/gameActors/ventureBusiness.ts), which uses an internal (not exported) enum to explicitly define names for some of its components, which it then returns via getters.

### Other bits:
* **Signals**: These are basic subscribable objects which can have values emitted from them with `signal.emit(...values)`. These are primarily useful for event/notification systems.
* **Observable**: These are essentially a field wrapped by a signal. Observables have their value set and retrieved via `observable.setValue(value)` and `observable.getValue()`, respectively. Then, just like with signals, you can `subscribe()` and `unsubscribe()` from an observable, which means you'll be notified when its value changes.

## The Game
The game itself has most of the basic features, including:
* **10 Businesses**: Clicking on the business's icon runs a business cycle, completing after an amount of time to earn money. These businesses are themed as cheeky or silly alternative versions of those in the original game.
* **Managers**: Each business has a manager associated with a cost drawn from the game config. Unfortunately I wasn't able to draw a unique manager icon for each business, but I think the menu for them still looks decent.
* **Save & Restore**: The session saves when the browser is closed and auto-saves every 60 seconds, and simulates the business cycles that would've run while you were away. This respects whether each business had a purchased manager and if it was exited mid-cycle.
* **Art**: I'm not an amazing artist but I did try to raw up actual visuals for stuff to make it look better than a basic text interface.
* **Config-driven**: All of the data surrounding business is drawn from `assets/gameConfig.json`, and the menu for purchasing their managers is dynamically generated and sized based on the number of configured businesses.


## Issues/Trade-Offs:
* I decided to write my own engine over the course of the weekend to build this instead of using somethig pre-existing like Phaser. I don't do this out of hubris, but rather just to better test my own capabilities. Naturally, that does lead to areas of messiness in the code than I'm not so happy with, as it's being built in an ecosystem that's too young to have cleaner ways to address everything.
* The line gets a bit blurred between not only observables and signals, but owned ones vs. static ones. Part of this just comes from having written the engine over the weekend; the structure for something like this fleshes itself out as you work on it. I'd normally prefer minimal `static`s, but in this case I'm leaning towards the [GameEvents](https://github.com/TheBentoBox/VenturaEngine/blob/master/src/game/gameEvents.ts) structure that I've admittedly underutilized in this project. It would allow for decoupling some of the direct actor/component references.
* Creating objects from config/data is still a bit manual right now. The engine would lend itself well to a generic factory pattern which could be used to generate both actors and components. Right now each system needs to be aware of what types of actors/components it's generating.
* The "MVC structure" mentioned above is purely a result of the way the systems work together rather than being anything enforced, so it's another place where the lines can get blurred. Some of the game actors and controllers right now likely have too much responsibility in one area. I'd like to split these up, primarily the business controller component.
* "Purchase modes" (1x, 10x, 100x, Max) are largely implemented, but not accessible. I wouldn't have enough time to test them properly so I'd rather just leave them out entirely, at least for now. I may revisit soon to finish that feature off just for fun.
