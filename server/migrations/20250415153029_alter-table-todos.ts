import type { Knex } from 'knex';

const tableName = 'todos';

export async function up(knex: Knex): Promise<void> {
    return await knex.schema.alterTable(tableName, function (table) {
        table.text('description');
        table.string('status');
        table.dateTime('due_date');
        table.integer('project_id');
        table.integer('created_by');

        table.foreign('project_id').references('projects.id');
        table.foreign('created_by').references('users.id');
    });
}

export async function down(knex: Knex): Promise<void> {
    return await knex.schema.alterTable(tableName, function (table) {
        table.dropColumn('description');
        table.dropColumn('status');
        table.dropColumn('due_date');
        table.dropColumn('project_id');
        table.dropColumn('created_by');
    });
}
