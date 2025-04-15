import type { Knex } from 'knex';

const tableName = 'users';

export async function up(knex: Knex): Promise<void> {
    return await knex.schema.createTable(tableName, function (table) {
        table.increments('id');
        table.string('name');
        table.string('email');
        table.text('password_hash');
        table.string('role');
    });
}

export async function down(knex: Knex): Promise<void> {
    return await knex.schema.dropTable(tableName);
}
