/** User class for message.ly */



/** User of the site. */
const bcrypt = require("bcrypt")
const db = require("../db")
const { BCRYPT_WORK_FACTOR } = require("../config")

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) { 
    const hashedPw = await bcrypt.hash(password, BCRYPT_WORK_FACTOR )
    const join_at = Date.now()
    const last_login_at = join_at
    console.log(hashedPw)
    const result = await db.query("INSERT INTO users (username, password, first_name, last_name, phone, join_at, last_login_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING username, password, first_name, last_name, phone", [username, hashedPw, first_name, last_name, phone, join_at, last_login_at])
    return result.rows[0]
  } 


  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const user = await db.query("username, password FROM users where username = $1" [username])
    return bcrypt.compare(password, user.password)




   }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const timeNow = Date.now()
    await db.query ("UPDATE users SET last_login=$1 WHERE username = $2", [timeNow, username])
    return {"message": `Updated Timestamp to  ${timeNow}`}
   }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const results = await db.query("SELECT username, first_name, last_name, phone FROM users")
    return results.rows
   }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const result = await db.query ("SELECT username, first_name, last_name, phone, join_at, last_login_at FROM users WHERE username = $1", [username])
    return result.rows[0]
   }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) { }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) { }
}


module.exports = User;