import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {

  public async up () {

    this.schema.createTable('orders', (table) => {
      table.increments('id') // Clé primaire auto-incrémentée

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE') // Clé étrangère vers `users`
      table.decimal('total_price', 10, 2).notNullable()
      table.timestamps(true)
    })

    this.schema.createTable('order_statuses', (table) => {
      table.increments('id')
      table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE')
      table.string('status').notNullable()  // Statut de la commande (ex: pending, shipped)
      table.timestamp('created_at', { useTz: true }).notNullable()  // Date du changement
    })

    this.schema.createTable('order_items', (table) => {
      table.increments('id')
      table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE')
      table.integer('shoe_id').unsigned().references('id').inTable('shoes').onDelete('CASCADE')
      table.decimal('price', 10, 2).notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable('orders')
    this.schema.dropTable('order_status')
    this.schema.dropTable('order_items')
  }
}