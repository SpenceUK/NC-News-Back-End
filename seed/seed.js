const models = require('../models');
const mongoose = require('mongoose');
const csv = require('csvtojson');
const path = require('path');
const config = require('../config');
const faker = require('faker');

// This should seed your development database using the CSV file data
// Feel free to use the async library, or native Promises, to handle the asynchronicity of the seeding operations.

const articlePath = path.join(__dirname + '/data/articles.csv');
const topicsPath = path.join(__dirname + '/data/topics.csv');
const usersPath = path.join(__dirname + '/data/users.csv');

function parseCSVFile(pathToFile, arrayOfIdsObjects = []) {
  const [topicIds, userIds, articleIds] = arrayOfIdsObjects;
  return new Promise((res, rej) => {
    const arrayOfJSONObjects = [];
    csv()
      .fromFile(pathToFile)
      .on('json', jsonObject => {
        if (path.basename(pathToFile) === 'articles.csv') {
          jsonObject.belongs_to = topicIds[jsonObject.topic];
          jsonObject.created_by = userIds[randomProp(userIds)];
        }
        arrayOfJSONObjects.push(jsonObject);
      })
      .on('done', err => {
        if (err) throw new Error(`➡️ CSV PARSE ERROR: \n${err}`);
        console.log(`📄 - ${path.basename(pathToFile)} successfully parsed.`);
        res(arrayOfJSONObjects);
      });
  });
}

function randomProp(obj) {
  const keys = Object.keys(obj);
  return keys[(keys.length * Math.random()) << 0];
}

function saveInMongo(filePath, model, arrayOfIdsObjects) {
  let ids = {};
  return parseCSVFile(filePath, arrayOfIdsObjects)
    .then(parsedObjects => {
      const objectPromises = parsedObjects.map(object => {
        return new model(object).save().then(objectDoc => {
          if (objectDoc.slug) ids[objectDoc.slug] = objectDoc._id;
          if (objectDoc.username) ids[objectDoc.username] = objectDoc._id;
          if (objectDoc.body) ids[objectDoc.title] = objectDoc._id;
          return objectDoc;
        });
      });
      return Promise.all(objectPromises);
    })
    .then(objectDocsArray => {
      return Promise.all([objectDocsArray, ids]);
      //return model.insertMany(parsedObjects);
    });
}

function seedDatabase(DB_URL, articlePath, topicsPath, usersPath, models) {
  let topicIds;
  let userIds;
  let articleIds;

  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log(`☎️ - connected to: ${DB_URL}`);
      return mongoose.connection.db.dropDatabase();
    })
    .then(() => {
      return saveInMongo(topicsPath, models.Topics);
    })
    .then(([topicDocs, ObjectOfTopicIds]) => {
      topicIds = ObjectOfTopicIds;
      console.log(
        `💾 - ${topicDocs.length} new documents saved in collection Topics.`
      );

      return saveInMongo(usersPath, models.Users);
    })
    .then(([userDocs, objectOfTopicIds]) => {
      userIds = objectOfTopicIds;
      console.log(
        `💾 - ${userDocs.length} new documents saved in collection Users.`
      );
      return saveInMongo(articlePath, models.Articles, [topicIds, userIds]);
    })
    .then(([articleDocs, objectOfArticleIds]) => {
      articleIds = objectOfArticleIds;
      console.log(
        `💾 - ${articleDocs.length} new documents saved in collection Articles.`
      );
      console.log(faker.fake("I think {{company.catchphrase}}, {{company.bs}}, {{bsBuzz}}, I {{hacker.verb}} {{hacker.noun}} this!"))
  //     return new models.Comments({
  //       body: string,
  // belongs_to: random articleId,
  // created_at: epoch time,
  // votes: random number,
  // created_by: random userId
  //     }).save();
    }).then()
      return mongoose.disconnect();
    })
    .then(() => {
      console.log(`☎️ - Disconnected from: ${DB_URL}.`);
    })
    .catch(err => {
      console.log(`⚠️ DATABASE SEEDING ERROR ⚠️ \n${err}`);
    });
}
seedDatabase(config.DB.dev, articlePath, topicsPath, usersPath, models);
