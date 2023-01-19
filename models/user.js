const db = require('../db');
const pgp = require('pg-promise')({ capSQL: true });

module.exports = class UserModel {

  /**
   * Gets a user record by ID
   * @param  {String}      id [User ID]
   * @return {Object|null}    [User Record]
   */
  async getUserById(id) {
    try {

      // Generate SQL statement
      const statement = `SELECT *
                         FROM users
                         WHERE id = $1`;
      const values = [id];
  
      // Execute SQL statment
      const result = await db.query(statement, values);
      if (result.rows?.length) {
        return result.rows[0]
      }
  
      return null;

    } catch(err) {
      throw new Error(err);
    }
  }
}