# machina-typescript
Author: [MartinRamm](https://github.com/MartinRamm).

This is a typesafe wrapper around [machina](https://github.com/ifandelse/machina.js), a FSM library by
[ifandelse](https://github.com/ifandelse). As the interfaces towards machina are changed, this project is **not** part
of the [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) project.

## Features
Only partial support of the `machina` library are implemented by this wrapper. But the features that are implemented,
are implemented in a typesafe manner. Specifically:
* You can only transition/deferUntilTransition to states that actually exist
* States may require parameters to be given when transitioning into them
* Input (fsm.handle) may require certain parameters to be given to them
* You can only emit events that are defined
* Events may require parameters to be provided when firing the event
* Instantiating the fsm may require specific constructor parameters to be given to them

Furthermore, the functionality of `machina` is extended by adding a default handler for input, that each state
automatically receives but may choose to override.

## UNSTABLE VERSION
This is a preview of the library I am currently working on. The interfaces (and implementation) should be
considered unstable and will likely change before V1 is released. Hence, they are currently not documented.
The author is currently actively working on this library, the public is invited to leave feedback (by opening an issue).
