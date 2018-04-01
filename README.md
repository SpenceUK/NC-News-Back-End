# Northcoders News

* demo:
  https://lychee-surprise-60785.herokuapp.com

## Background

A news app backend hosted on Heroku and Mlabs using MongoDB and NodeJS.

## Documentation

* API end points:
  https://lychee-surprise-60785.herokuapp.com/api

To run locally use `npm start`
To run on development server use `npm run dev`
To run tests use `npm t`

### Step 1 - Seeding

* Clone the project to a folder on your machine using `git clone https://github.com/SpenceUK/BE-FT-northcoders-news.git`
* Install project dependencies using `npm i` on the commandline in the root folder where you cloned the project.
* To seed a test database use `npm run seed:test`
* To seed a dev database use `npm run seed:dev`
* To seed a production database on MLabs, first set up an Mlabs account, add a new database and a new user with a username and password. Open the file `package.json` and edit the "scripts" section for `seed:prod`, swap out `<db_url>` for your database url from MLabs including your username and password. Then use `npm run seed:prod` from the commandline.

### Step 2 - Deploying

To deploy this project to Heroku:

* First sign up to heroku,
* then in the root folder of where you installed this project; on the commandline use this command `heroku create`.
* Once this has completed add your database url as 'DB_URL' to the heroku config variables on the commandline use `heroku config:set DB_URL=<your-db-url>` replacing '<your-db-url>' with the url to your production database.
* Then deploy your app using `git push heroku master` to send the app to heroku for build and deployment.

To view your app use `heroku open` and to view your apps logs use `heroku logs`
