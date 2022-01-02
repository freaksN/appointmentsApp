# AppointmentsApp - Project

The goal of this project is to get more familiar with a modern frontend setup for [AngularJS](https://github.com/angular/angular.js) projects, in such a way that it gets closer to how things are done with Angular. This project is using [NPM](https://github.com/npm/npm) as package manager, [TypeScript](https://github.com/Microsoft/TypeScript) and [Webpack](https://github.com/webpack/webpack) as module loader as well as [Groovy](https://groovy-lang.org/)
and [Grails](https://grails.org/) for the backend development.

This is, by no means, ment to be used blindly in production.

## Features
- [x] Groovy
- [x] Grails (v5.0.0)
- [x] Gradle
- [x] MySQL
- [x] TypeScript 2
- [x] TSLint
- [x] @types
- [x] Webpack 4 + Webpack dev server
- [x] Styling using SASS
- [x] NPM
- [x] Code Coverage
- [x] AngularJS 1.6
- [x] UI Router 1+
- [x] Bootstrap
- [x] Angularjs-datepicker
- [x] Production build containing chunks


## Frontend 
For the front end of this project Font-Awesome, Bootstrap, UI-Router and Angularjs-Datepicker were included.  For more info please refer to: 

https://fontawesome.com/v5.15/icons?d=gallery&p=2&m=free

https://getbootstrap.com/

https://ui-router.github.io/ng1/

https://github.com/720kb/angular-datepicker

## Backend
For the development of the backend mainly Grails/Groovy and plugins for data export were utilized. For more info please refer to:

https://groovy-lang.org/

https://grails.org/

https://plugins.grails.org/plugin/grails/export

# Usage
To download and use the companion project you can simply clone it to your preferred location by using
```
https://git.systaro.de/sandbox/vasil-companion-project.git
```

To _only_ use the starter project utilized for the development of _my_ companion project without the additional features  you can simply clone it to your preferred location by using
```
git clone https://github.com/Systaro/angularjs-webpack-starter.git
```

## Frontend
To start the frontend of this project first you have to install all dependencies by navigating to the ``frontend`` directory of the project and then running:

```
npm install
```
Then you can start the application's frontend by typing:
```
npm start
```

Additionally, you can also use the following CLI commands:
```
npm run build
npm run test
npm run test:coverage
```
To run the production build, use:

```
npm run build:prd
```

If you would like to test the production build by running `http-server`, use

```
npm run serve:prd
```

## Backend
To start the backend and connect to the database, please follow these steps:
1. Make sure you have ``MySQL`` and ``Gradle`` installed. Then create a DB table with the name ``companion_project`` and adjust the settings for your DB address, DB username and password in the ``application.yml`` file.
    * _On my system I have ``MySQL v.5.7.xx``_ installed.
2. Build the gradle project using your preferred way (your IDE's gradle UI or manually using ``gradle build``).
3. Start the backend by running ``./gradle bootRun`` in the console within the ``backend`` directory or by using your IDE's gradle UI.
4. The backend and the frontend of the App should be now running and you can interact with it on the address ``http://localhost:9000/``

**_HINT_**: There is no option to create/edit `doctors` using the frontend of the App. To this end, you could either _hard code_ them into the DB directly or you can do a `POST` request with `fistName` and `lastName` added the body to `http://localhost:8080/doctor`
