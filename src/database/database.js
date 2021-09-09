const sqlite3 = require('sqlite3').verbose();


class DAO {

    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
              console.log('Could not connect to database', err);
            } else {
              console.log('Connected to database');
            }
        })
    }

    all(sql, params) {
        return new Promise((res, rej) => {
            this.db.all(sql, params, (error, result) => {
                if (error) {
                    return rej(error.message);
                }
                return res(result);
            });
        })
    }
    
    get(sql, params) {
        return new Promise((res, rej) => {
            this.db.get(sql, params, (error, result) => {
                if (error) {
                    return rej(error);
                }
                return res(result);
            });
        })
    }
}


const db_path = `${__dirname}/database.sqlite3`;
const dao = new DAO(db_path);

/* const db = new sqlite3.Database(db_path, (err) => {
    if (err) {
      console.log('Could not connect to database', err);
    } else {
      console.log('Connected to database');
    }
})
 */
module.exports = {dao};