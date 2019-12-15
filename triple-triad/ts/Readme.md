# Triple Triad

Implementation of the rules for FF VIII version.

- Reference:
    - https://finalfantasy.fandom.com/wiki/Triple_Triad_(Final_Fantasy_VIII)
    - https://finalfantasy.fandom.com/wiki/Final_Fantasy_VIII_Triple_Triad_cards

- Patterns:
    - Data-Driven:
        - Types are the base and are separated from functions
    - Non mutation of input (without deep-copy of whole structure)
    - Heavily using:
        - linting (many rules, 0 warnings / errors allowed)
        - static types (100% coverage)
        - unit / integration tests (100% coverage)
    - No GUI
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

## Features

- [x] Trade Rules
- Special rules
    - [x] Elemental
    - [x] Random
    - [x] Open
    - [ ] Rest
- [x] Regions (with special rules)
- [ ] Simulations
    - [x] Basic structure
    - [ ] Easy declarative setup of initial cards

## TODO

### Features

- Periodic: Refactor tests
    - Use existing utils functions
    - Cover more edge cases (without greatly increasing code)
- Periodic: Move code to helpers when cleaner (same level of abstraction)
- Periodic: Move steps to generic template

### Infra

- Documentation: docsify installed
    - Add game hooks options
    - Add checklist for when update docs
- Different builds: organize scripts
    - Source maps
    - Extra helpers
