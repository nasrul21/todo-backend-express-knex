import type { Knex } from 'knex';

const tableName = 'comments';

export async function up(knex: Knex): Promise<void> {
    return await knex.schema.createTable(tableName, function (table) {
        table.increments('id');
        table.text('content');
        table.integer('todo_id');
        table.integer('user_id');
        table.datetime('created_at').defaultTo(knex.fn.now());

        table.foreign('todo_id').references('todos.id');
        table.foreign('user_id').references('users.id');
    });
}

export async function down(knex: Knex): Promise<void> {
    return await knex.schema.dropTable(tableName);
}
