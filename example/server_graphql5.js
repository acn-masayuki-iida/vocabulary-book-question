var express = require('express');
var express_graphql = require('express-graphql');
var {
  buildSchema
} = require('graphql');

var wordData = require('./wordList.json')

// GraphQL schema
var schema = buildSchema(`
 type Query {
 course(id: Int!): Course
 test(testId: Int!): Course
 courses(topic: String): [Course]
 },
 type Course {
 id: Int
 testId: Int
 title: String
 author: String
 description: String
 topic: String
 word: String
 }
`);

var getCourse = function (args) {
  var id = args.id;
  return wordData.filter(course => course.id === id)[0];
}
var getCourses = function (args) {
  if (args.topic) {
    var topic = args.topic;
    return wordData.filter(course => course.topic === topic);
  } else {
    return wordData;
  }
}

var getTestWords = function (args) {
    var testId = args.testId;
    var randomCount = Math.floor(Math.random() * 10);
    //取得したデータをランダムに出力する
    return wordData.filter(course => course.testId === testId)[randomCount];
}

var root = {
  //クエリ名：呼び出し関数
  course  : getCourse,
  courses : getCourses,
  test    : getTestWords
};

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
