/* eslint-disable no-console */
const models = require('../models');
const mongoose = require('mongoose');
const csv = require('csvtojson');
const path = require('path');
const faker = require('faker');
const DB_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.DB_URL
    : require('../config').DB[process.env.NODE_ENV];

mongoose.Promise = Promise;

const articlePath = path.join(__dirname + '/data/articles.csv');
const topicsPath = path.join(__dirname + '/data/topics.csv');
const usersPath = path.join(__dirname + '/data/users.csv');

function parseCSVFile(pathToFile, arrayOfIdsObjects = []) {
  const [topicIds, userIds] = arrayOfIdsObjects;
  return new Promise(res => {
    const arrayOfJSONObjects = [];
    csv()
      .fromFile(pathToFile)
      .on('json', jsonObject => {
        if (path.basename(pathToFile) === 'articles.csv') {
          jsonObject.belongs_to = topicIds[jsonObject.topic];
          jsonObject.created_by = userIds[randomProp(userIds)];
          jsonObject.votes = (Math.random() * 50) << 0;
        }
        arrayOfJSONObjects.push(jsonObject);
      })
      .on('done', err => {
        if (err) {
          throw new Error(`CSV PARSE ERROR:\n${err}`);
        }
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
    });
}

function seedDatabase(DB_URL, articlePath, topicsPath, usersPath, models) {
  let topicIds;
  let userIds;
  let articleIds;

  mongoose
    .connect(DB_URL, { useMongoClient: true })
    .then(() => {
      console.log(
        `☎️ successfully connected to mongo: ${process.env.NODE_ENV} DB`
      );
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
      const commentPromises = [];
      Object.keys(articleIds).forEach(() => {
        for (let i = Math.random() * 15 + 6; i > 0; i--) {
          commentPromises.push(
            new models.Comments({
              body: faker.fake(
                'Who ever has written this is a {{random.word}}, I really {{hacker.verb}} with this article! I think they should {{hacker.verb}} {{random.word}}. Why do they think {{random.word}} is a good idea? what a total {{random.word}}! I feel like a {{random.word}}.'
              ),
              belongs_to: articleIds[randomProp(articleIds)],
              created_at: new Date(
                (Math.random() * 18 + 2000) << 0,
                (Math.random() * 11) << 0,
                (Math.random() * 31) << 0,
                (Math.random() * 24) << 0,
                (Math.random() * 60) << 0,
                (Math.random() * 60) << 0
              ),
              votes: (Math.random() * 50) << 0,
              created_by: userIds[randomProp(userIds)]
            }).save()
          );
        }
      });
      return Promise.all(commentPromises);
    })
    .then(commentDocs => {
      console.log(`📝 - ${commentDocs.length} new comments created.`);
      console.log(
        `💾 - ${commentDocs.length} new documents saved in collection Comments.`
      );
      return mongoose.disconnect();
    })
    .then(() => {
      console.log(`☎️ - Disconnected from mongo: ${process.env.NODE_ENV} DB`);
    })
    .catch(err => {
      console.log(`DATABASE SEEDING ERROR\n${err}`);
      return mongoose.disconnect();
    });
}

seedDatabase(DB_URL, articlePath, topicsPath, usersPath, models);
