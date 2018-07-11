var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// GraphQL使用したスキーマの構築
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// リゾルバ関数。rootに対して、返却する
var root = {
  hello: () => {
    return 'Hello world!';
  },
};

var app = express();
  app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
