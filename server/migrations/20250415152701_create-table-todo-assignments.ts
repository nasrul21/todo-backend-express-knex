import type { Knex } from 'knex';

const tableName = 'todo_assignments';

export async function up(knex: Knex): Promise<void> {
    return await knex.schema.createTable(tableName, function (table) {
        table.increments('id');
        table.integer('todo_id');
        table.integer('user_id');

        table.foreign('todo_id').references('todos.id');
        table.foreign('user_id').references('users.id');
    });
}

export async function down(knex: Knex): Promise<void> {
    return await knex.schema.dropTable(tableName);
}
