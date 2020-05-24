# VenturaEngine
A small TypeScript game engine experiment &amp; an implementing AdVenture Capitalist clone game.

## Engine Structure
The basic structure of the engine is as follows:
* **Actors**: An actor is an object which can be placed within a level. They can have components and children (other actors) attached to them.
* **Components**: Components can be attached to actors. There are two types of components:
  * **Display Components**: These are components with a visual state, such as sprites and text elements. These generally speaking do not tick as part of the game update cycle and should be treated as a dummy visual object which is controlled externally.
  * **Controller Components**: These are components with no visual state, but which *do* (by default) tick as part of the game update cycle. These should be used to control the behavior of your actors and components.
  
These combine to produce an MVC-esque structure to the engine. Actors are your "models", display components are the view, and controller components are, as the name implies, your controllers. Actors can have components of any kind attached to them willy-nilly, but you are encouraged to give each actor an API to access key display components which controller components can then access. An example of this can be seen in the [VentureBusiness actor](https://github.com/TheBentoBox/VenturaEngine/blob/master/src/game/gameActors/ventureBusiness.ts), which uses an internal (not exported) enum to explicitly define names for some of its components, which it then returns via getters.

### Other bits:
* **Signals**: These are basic subscribable objects which can have values emitted from them with `signal.emit(...values)`. These are primarily useful for event/notification systems.
* **Observable**: These are essentially a field wrapped by a signal. Observables have their value set and retrieved via `observable.setValue(value)` and `observable.getValue()`, respectively. Then, just like with signals, you can `subscribe()` and `unsubscribe()` from an observable, which means you'll be notified when its value changes.
