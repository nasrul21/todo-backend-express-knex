import type { Knex } from 'knex';

const tableName = 'user_organizations';

export async function up(knex: Knex): Promise<void> {
    return await knex.schema.createTable(tableName, function (table) {
        table.increments('id');
        table.integer('user_id');
        table.integer('organization_id');

        table.foreign('user_id').references('users.id');
        table.foreign('organization_id').references('organizations.id');
    });
}

export async function down(knex: Knex): Promise<void> {
    return await knex.schema.dropTable(tableName);
}
