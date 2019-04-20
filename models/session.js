import db from '../db';

const table = 'sessions';

export default class Session {
  /**
   * @description Retrieves an existing session.
   * @param {string} accessToken
   * @returns {Promise}
   */
  static get(accessToken) {
    return db.select('*')
      .from(table)
      .where({ access_token: accessToken })
      .limit(1);
  }

  /**
   * @description Creates a new session.
   * @param {Object} data
   * @returns {Promise}
   */
  static add(data) {
    return db(table)
      .insert(data);
  }

  /**
   * @description Updates an existing session.
   * @param {string} oldAccessToken
   * @param {string} newAccessToken
   * @returns {Promise}
   */
  static update(oldAccessToken, newAccessToken) {
    return db(table)
      .where('access_token', '=', oldAccessToken)
      .update({ access_token: newAccessToken })
      .limit(1);
  }
}
