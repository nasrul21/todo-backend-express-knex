import type { Knex } from 'knex';

const tableName = 'projects';

export async function up(knex: Knex): Promise<void> {
    return await knex.schema.createTable(tableName, function (table) {
        table.increments('id');
        table.string('name');
        table.text('description');
        table.integer('organization_id');

        table.foreign('organization_id').references('organizations.id');
    });
}

export async function down(knex: Knex): Promise<void> {
    return await knex.schema.dropTable(tableName);
}
