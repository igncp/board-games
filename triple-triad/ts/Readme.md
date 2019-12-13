# Triple Triad

Implementation of the rules for FF VIII version.

- Reference:
    - https://finalfantasy.fandom.com/wiki/Triple_Triad_(Final_Fantasy_VIII)
    - https://finalfantasy.fandom.com/wiki/Final_Fantasy_VIII_Triple_Triad_cards

- Patterns:
    - Data-Driven:
        - Types are the base and are separated from functions
    - Non mutation of input
    - Heavily using:
        - linting (many rules, 0 warnings / errors allowed)
        - static types (100% coverage)
        - unit / integration tests (100% coverage)
    - No UI
    - Async API

- Alternatives:
    - https://github.com/itdelatrisu/triple-triad
    - https://github.com/itdelatrisu/triple-triad-html5

- Objectives
    - Modularity
    - Extendability:
        - Make assumptions only when complexity decreases considerably (to support different rules in future)
        - Create function hooks (outside of game data structure)
        - Some defaults can be overridden via options and via the game type
    - Be able to be used by (basic) simulations

## TODO

### Features

- Initial MVP
    - Create Game
    - Run turn
        - Apply card effects
    - Finish game
- Add game hooks
- Add game types

### Infra

- Documentation: docsify installed
- Different builds: organize scripts
- Minimize

## Notes

- A player can have the same card multiple times
