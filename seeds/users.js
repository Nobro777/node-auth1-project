exports.seed = function(knex) {
  return knex('users').del()
    .truncate()
      .then(function () {
        return knex('users').insert([
          {id: 1, username: 'test account 1',password:'password1'},
          {id: 2, username: 'test account 2',password:'password2'},
          {id: 3, username: 'test account 3',password:'password3'}
      ]);
    });
};