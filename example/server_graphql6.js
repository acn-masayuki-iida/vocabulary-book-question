var express = require('express');
var express_graphql = require('express-graphql');
var {
  buildSchema
} = require('graphql');

var wordData = require('./TOEIC_WordList.json')

// GraphQL schema
var schema = buildSchema(`
 type Query {
 word(ID: Int!): Word
 words(Part: String!): [Word]
 randomWords(Part: String!): [Word]
 },
 type Word {
 ID   : Int
 Word : String
 Part : String
 JP   : String
 }
`);

var getWord = function (args) {
  var id = args.ID;
  return wordData.filter(word => word.ID === id)[0];
}

var getWords = function (args) {
  //引数無ければ全件検索と同義
  if (args.Part) {
    var part = args.Part;
    return wordData.filter(word => word.Part === part);
  } else {
    return wordData;
  }
}

var getRandomWords = function (args) {
    var part = args.Part;
    var randomCount = Math.floor(Math.random() *10);
    var min = randomCount;
    var max = Math.floor(Math.random() * 10);

    // minとmaxの順番整理
    if (max <= min) {
      var temp = max;
      max = min + 1;
      min = temp;
    }

    //取得したデータをランダムに出力する
    return wordData.filter(word => word.Part === part).slice(min, max);
}



var root = {
  //クエリ名：呼び出し関数
  word        : getWord,
  words       : getWords,
  randomWords : getRandomWords
};

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
