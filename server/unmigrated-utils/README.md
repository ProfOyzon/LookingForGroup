# Un-migrated utils

## Utils

The utils are not currently integrated with the rest of the server, so im putting them here so we can have a reference to bring them back in/move them where they need to be. We can go through, and copy the parts of code that can be added to the reformatted project, move the client related stuff to the client project, and delete the rest.

## Util tests

The tests are still sound in idea, but will need to be adjusted to whatever changes are made to the main utils. We also need to update some of the fetchUtils tests to the vitest syntax.

Additionally, we should use supertest for making http requests, and pass in the app to the request. This will make it so we don't need to run the local dev server every time we want to run the tests.
