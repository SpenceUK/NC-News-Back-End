const { Users, Comments, Topics, Articles } = require('../models');
const mongoose = require('mongoose');
const config = require('../config');
mongoose.Promise = Promise;

function seedTopics(model, name, num) {
  const docPromises = [];
  for (let i = num; i > 0; i--) {
    docPromises.push(
      new model({
        title: `TEST_${name.toUpperCase()}_${i}`,
        slug: `test_${name.toLowerCase()}_${i}`
      }).save()
    );
  }
  return Promise.all(docPromises);
}

function seedUsers(model, name, num) {
  const docPromises = [];
  for (let i = num; i > 0; i--) {
    docPromises.push(
      new model({
        username: `TEST_${name.toUpperCase()}_${i}`,
        name: `test_${name.toLowerCase()}_${i}`,
        avatar_url: `TEST_${name.toLowerCase()}_URL_${i}`
      }).save()
    );
  }
  return Promise.all(docPromises);
}

function seedArticles(model, name, topicIds, userIds) {
  const topicKeys = Object.keys(topicIds);
  const userKeys = Object.keys(userIds);
  const docPromises = topicKeys.map((key, i) => {
    return new model({
      title: `TEST_${name.toUpperCase()}_${i + 1}`,
      body: `test_${name.toLowerCase()}_${i + 1}_article_content`,
      belongs_to: topicIds[topicKeys[i]],
      created_by: userIds[userKeys[i]]
    }).save();
  });
  return Promise.all(docPromises);
}

function seedComments(model, name, userIds, articleIds) {
  const articleKeys = Object.keys(articleIds);
  const userKeys = Object.keys(userIds);
  const docPromises = [...articleKeys, ...userKeys].map((key, i) => {
    return new model({
      body: `TEST_${name.toUpperCase()}_${i + 1}`,
      belongs_to: articleIds[articleKeys[`${i > 1 ? i - 2 : i}`]],
      created_by: userIds[userKeys[`${i > 1 ? i - 2 : i}`]]
    }).save();
  });
  return Promise.all(docPromises);
}

function seedTestDb(DB_URL) {
  const topicIds = {};
  const userIds = {};
  const articleIds = {};

  mongoose
    .connect(DB_URL, { useMongoClient: true })
    .then(() => {
      return mongoose.connection.db.dropDatabase();
    })
    .then(() => {
      return seedTopics(Topics, 'topic', 2);
    })
    .then(topicDocs => {
      topicDocs.forEach(doc => {
        topicIds[doc.title] = doc._id;
      });
    })
    .then(() => {
      return seedUsers(Users, 'user', 2);
    })
    .then(userDocs => {
      userDocs.forEach(doc => {
        userIds[doc.username] = doc._id;
      });
    })
    .then(() => {
      return seedArticles(Articles, 'article', topicIds, userIds);
    })
    .then(articleDocs => {
      articleDocs.forEach(doc => {
        articleIds[doc.title] = doc._id;
      });
    })
    .then(() => {
      return seedComments(Comments, 'comment', userIds, articleIds);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(err => {
      console.log(`Test database seeding ERROR: \n${err}`);
      return mongoose.disconnect();
    });
}

seedTestDb(config.DB.test);

module.exports = seedTestDb;
