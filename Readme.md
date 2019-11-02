# Board Games

Implementation of popular board games specs.

No UI is provided, the structure is made flexible to support many integrations
(REST server, direct imports, databases, etc.).

The purpose of this project is to try new ways of architecting complex business
logic like a board game ruleset. Normally they will contain unit tests or
scripts to run some parts of the functionality.

## Templates

The steps that I have found to work best are (not all projects are following this):

- Proceed in iterations
- Setup strong linter rules and automatic formatting
- Write unit tests of particular functions and integration tests of flows
    - Run them in watch mode
    - Run repeated tests (e.g. loops of 100) when tests involve random values
- Use types
- Modularize the app: decouple modules
- Write TODOs

## License

MIT
