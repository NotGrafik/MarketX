import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Carts extends BaseSchema {

  public async up () {
    this.schema.createTable('carts', (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.decimal('total_price', 10, 2).unsigned().notNullable().defaultTo(0)
      table.timestamps(true)
    })

    this.schema.createTable('cart_items', (table) => {
      table.increments('id')
      table.integer('cart_id').unsigned().references('id').inTable('carts').onDelete('CASCADE')
      table.integer('shoe_id').unsigned().references('id').inTable('shoes').onDelete('CASCADE')
      table.decimal('price', 10, 2).unsigned().notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable('carts')
    this.schema.dropTable('cart_items')
  }
}
