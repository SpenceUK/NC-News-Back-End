const { Users, Comments, Topics, Articles } = require('../models');
const mongoose = require('mongoose');
const config = require('../config');
mongoose.Promise = Promise;

function seedTopics(model) {
  const topicPromises = [];
  topicPromises.push(
    new model({
      title: `TEST_TOPIC_1`,
      slug: `test_topic_1`
    }).save()
  );
  topicPromises.push(
    new model({
      title: `TEST_TOPIC_2`,
      slug: `test_topic_2`
    }).save()
  );
  return Promise.all(topicPromises);
}

function seedUsers(model) {
  const userPromises = [];
  userPromises.push(
    new model({
      username: `test_user_1`,
      name: `TEST_USER_1`,
      avatar_url: `test_user_url_1`
    }).save()
  );
  userPromises.push(
    new model({
      username: `test_user_2`,
      name: `TEST_USER_2`,
      avatar_url: `test_user_url_2`
    }).save()
  );
  return Promise.all(userPromises);
}

function seedArticles(model, data) {
  const articlePromises = [];
  articlePromises.push(
    new model({
      title: `TEST_ARTICLE_1`,
      body: `test_article_1_article_content`,
      belongs_to: data.topics[0]._id,
      created_by: data.users[0]._id
    }).save()
  );
  articlePromises.push(
    new model({
      title: `TEST_ARTICLE_2`,
      body: `test_article_2_article_content`,
      belongs_to: data.topics[1]._id,
      created_by: data.users[1]._id
    }).save()
  );
  return Promise.all(articlePromises);
}

function seedComments(model, data) {
  const commentPromises = [];
  commentPromises.push(
    new model({
      body: `TEST_COMMENT_1`,
      belongs_to: data.articles[0]._id,
      created_by: data.users[0]._id
    }).save()
  );
  commentPromises.push(
    new model({
      body: `TEST_COMMENT_2`,
      belongs_to: data.articles[1]._id,
      created_by: data.users[1]._id
    }).save()
  );
  return Promise.all(commentPromises);
}

function seedTestDb(DB_URL) {
  const data = {};

  return seedTopics(Topics)
    .then(topicDocs => {
      data.topics = topicDocs.map(doc =>
        JSON.parse(JSON.stringify(doc.toObject()))
      );
      return seedUsers(Users);
    })
    .then(userDocs => {
      data.users = userDocs.map(doc =>
        JSON.parse(JSON.stringify(doc.toObject()))
      );
      return seedArticles(Articles, data);
    })
    .then(articleDocs => {
      data.articles = articleDocs.map(doc =>
        JSON.parse(JSON.stringify(doc.toObject()))
      );
      return seedComments(Comments, data);
    })
    .then(commentDocs => {
      data.comments = commentDocs.map(doc =>
        JSON.parse(JSON.stringify(doc.toObject()))
      );
      return Promise.all([data]);
    });
}

seedTestDb(config.DB.test);

module.exports = seedTestDb;
