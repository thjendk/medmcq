import _ from 'lodash';
import sampleUsers from './data/02_sample_users.json';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('user')
    .del()
    .then(async () => {
      const userRoles = await knex.from('user_role').select('name', 'id');

      const users = sampleUsers.map((user) => {
        user.role_id = _.find(userRoles, { name: user.role_id }).id;
        return user;
      });
      // Inserts seed entries
      return knex('user').insert(users);
    });
};
