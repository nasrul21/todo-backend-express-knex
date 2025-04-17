import type { Knex } from 'knex';

const tableName = 'user_organizations';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable(tableName, (table) => {
        table.string('role');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable(tableName, (table) => {
        table.dropColumn('role');
    });
}
