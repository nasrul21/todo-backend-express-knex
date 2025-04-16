import { Knex } from 'knex';

export default class Repository {
    protected db: Knex;

    constructor(db: Knex) {
        this.db = db;
    }
}
