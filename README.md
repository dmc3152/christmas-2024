# Christmas2024

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Personal Notes
- For the Family Feud idea, randomize the order the questions are delivered per user. Hopefully this will allow a variety of users to answer different questions. Maybe also limit the number of questions per user until all questions are answered. Only allow up to 8 answers per question. Once all 8 answers are provided, future users can only vote on the answers. Use a session cookie to identify each 
user individually so that a single user cannot enter multiple responses.
- Have volunteers come up to represent each team. Create a page to display the questions and a separate answer key that can be viewed on a phone. The presenter will have to click on the appropriate answer to display it and award points. 100 points are divided into the 8 questions in percentages based on the number of votes. The team with the most points at the end wins.