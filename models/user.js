const db = require('../db');
const pgp = require('pg-promise')({ capSQL: true });

module.exports = class UserModel {

  /**
   * Creates a new user record
   * @param {Object}        data  [User data]
   * @returns {Object|null}     [Created user record]
   */
  async createUser(data){
    try{

      //Generate SQL statement
      const statement = pgp.helpers.insert(data, null, 'users') + 'RETURNING *';

      //Execute SQL statement
      const result = await db.query(statement);

      if(result.rows?.length){
        return result.rows[0];
      }

      return null;

    }catch(err){
      throw new Error(err);
    }
  }
  
  /**
   * Gets a user record by Enauk
   * @param  {String}      email [Email Address]
   * @return {Object|null}    [User Record]
   */
  async getUserByEmail(email) {
    try {

      // Generate SQL statement
      const statement = `SELECT *
                         FROM users
                         WHERE email = $1`;
      const values = [email];
  
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