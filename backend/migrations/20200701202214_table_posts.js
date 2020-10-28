
exports.up = function(knex, Promise) {
    return knex.schema.createTable('posts', table => {
        table.increments('id').primary()
        table.string('title').notNull()
        table.string('content').notNull()
        table.timestamp('date_created')
            .defaultTo(knex.fn.now())  
    })  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('posts')
};
