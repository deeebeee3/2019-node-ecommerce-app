const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient
    .connect('mongodb+srv://deeebeee3:P@ssw0rd@clusterdee-wqnun.mongodb.net/test?retryWrites=true&w=majority')
    .then(client => {
      console.log('Connected!');
      _db = client.db(); //can pass in db name if want to connect to different db
      callback(); //execute callback and pass it the client
    })
    .catch(err => {
      console.log(err)
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db
  }
  throw 'No database found!';
}

module.mongoConnect = mongoConnect;
exports.getDb = getDb;