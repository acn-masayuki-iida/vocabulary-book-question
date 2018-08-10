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
 randomWords(Num: Int!): [Word]
 },
 type Word {
 ID   : Int
 Word : String
 Part : String
 JP   : String
 choice : String
 },
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

// 指定した単語の数だけデータを取得する
var getRandomWords = function (args) {
    // 取得したい単語数
    var questionWordCount = args.Num;
    var result = [];

    //出題予定の単語のIDを格納
    var wordIdList = [];

    //wordIdListに格納されている単語数
    var wordCount = 0;

    //wordCountの数だけランダムに単語を取得する
    var index;

    // 条件に合致した単語数取得
    var wordNum = Object.keys(wordData).length;

    // 取得したい単語数が多い場合のエラーハンドリング
    if (questionWordCount > wordNum) {
      questionWordCount = wordNum;
    }

    // wordCount配列に取得したい単語数が格納されるまで繰り返し実行
    // 同じ単語を出題しないようにwordIdListを使用して重複排除
    while (wordCount < questionWordCount) {
      index = getRanomScore(0,wordNum);

      // 既にIDが格納されているかチェック
      // 格納されていない場合のみ、単語を格納
      if (wordIdList.indexOf(index) == -1) {
        wordIdList.push(index);

        result1 = wordData[index];
        result.push(result1);

        //選択肢の作成
        do {
          var choiceIndex = getRanomScore(0, wordNum);
        } while (choiceIndex === index);

        result[wordCount].choice = wordData[choiceIndex].JP

        console.log(result);

        wordCount++

      }
    }

    return result;
}

// 指定された範囲でランダムな整数を返却する
function getRanomScore(min, max) {
  var random = Math.floor(Math.random() * (max + 1 - min)) + min;

  return random;
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
