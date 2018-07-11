var express = require('express');
var express_graphql = require('express-graphql');
var {
  buildSchema
} = require('graphql');

var coursesData = require('./data.json')

// GraphQL schema
var schema = buildSchema(`
 type Query {
 course(id: Int!): Course
 courses(topic: String): [Course]
 },
 type Mutation {
 updateCourseTopic(id: Int!, topic: String!): Course
 }
 type Course {
 id: Int
 title: String
 author: String
 description: String
 topic: String
 url: String
 }
`);

var getCourse = function (args) {
  var id = args.id;
  return coursesData.filter(course => course.id === id)[0];
}
var getCourses = function (args) {
  if (args.topic) {
    var topic = args.topic;
    return coursesData.filter(course => course.topic === topic);
  } else {
    return coursesData;
  }
}

// 更新用関数
var updateCourseTopic = function ({
  id,
  topic
}) {
  coursesData.map(course => {
    if (course.id === id) {
      course.topic = topic;
      return course;
    }
  });
  return coursesData.filter(course => course.id === id)[0];
}
var root = {
  course: getCourse,
  courses: getCourses,
  updateCourseTopic: updateCourseTopic
};

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
