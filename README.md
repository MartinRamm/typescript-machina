# machina-typescript
Author: [MartinRamm](https://github.com/MartinRamm).

This is a typesafe wrapper around [machina](https://github.com/ifandelse/machina.js), a FSM library by
[ifandelse](https://github.com/ifandelse). As the interfaces towards machina are changed, this project is not part of
the [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) project.

## Features
Only partial support of the `machina` library are implemented by this wrapper. But the features that are implemented,
are implemented in a typesafe manner. Specifically:
* You can only transition/deferUntilTransition to states that actually exist
* States may require parameters to be given when transitioning into them
* You can only emit events that are defined
* Events may require parameters to be provided when firing the event

Furthermore, the functionality of `machina` is extended by adding a default handler for events, that each state 
automatically receives, but may override.