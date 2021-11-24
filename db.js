const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

class DB {
  client;

  async connect(){
     this.client = await open({
        filename: './database.db',
        driver: sqlite3.Database
      });
      return Promise.resolve();
  }
}

module.exports = new DB();
