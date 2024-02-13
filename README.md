# Dialplan

Schedule calls via invite links! Currently in very early development

---

## Table of Contents

- [Execution](#execution)
- [Maintainers](#maintainers)
- [License](#license)

---

## Execution

DISCLAIMER: The project is very early development and currently lacks essential features

### Software Requirements

- Docker
- Node.js - optional (dependency intellisense, live test runner, package.json script aliases for docker commands below)

### Prerequisites

1. Clone this project via Git/download  
   (If browsing code, run `npm run installAll` in project's root for intellisense)
2. Launch Docker

### Commands

- Serve (build & host): `docker-compose up`
- Serve in dev mode: `docker-compose -f compose.yaml -f compose.devOverride.yaml up`
- Run automated tests: `docker-compose -f compose.test.yaml up`
- Run code analysis: `docker-compose -f compose.staticAnalysis.yaml up`

(When relaunching the basic serve mode or rewriting tests, append ` --build --force-recreate`)

---

## Maintainers

Eve Aviv Keinan  
GitHub: [github.com/evavkein](https://github.com/EvAvKein)

---

## License

This project is under the AGPL-3.0 license - see the LICENSE.txt file for details
