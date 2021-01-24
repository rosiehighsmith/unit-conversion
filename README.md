# Unit Conversion Grading Tool

## Installation

After cloning the repo, run `npm install` to grab all dependencies.

## Running the app

Run `ng serve`, then navigate to `http://localhost:4200/`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Accessing the hosted app

This app has CI/CD implemented with AWS CodePipeline and is statically hosted on S3. To access this production build, click [here](todo).

## Next steps in development to improve the solution

1. Form Improvements
  * Show specific validation errors if controls are left blank or have invalid input
  * Reset form when switching conversion types
2. Improve UI design for better workflow
  * Could add Angular Material for better built-in styling and animation
3. Feature to check multiple responses
  * Update conversion.component to conversion-item.component to clarify intent
  * Create a parent conversion-grid component to contain child conversion-item components
4. Based on multiple responses, calculate final grade on assignment
  * Add a service for calculating grades
5. Hook up database to store grades per student
6. Add login so multiple teachers could use the app


