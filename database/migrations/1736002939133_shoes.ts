import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Shoes extends BaseSchema {
  protected tableName = 'shoes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Clé primaire auto-incrémentée

      table.string('brand', 255).notNullable() // Marque
      table.string('model', 255).notNullable() // Modèle
      table.integer('size').unsigned().notNullable() // Taille (nombre positif uniquement)

      table.decimal('price', 10, 2).notNullable() // Prix (avec 2 décimales)

      table.integer('condition').unsigned().notNullable() // État
        .checkBetween([1, 10]) // Contraintes : entre 1 et 10

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE') // Clé étrangère vers `users`

      table.boolean('in_stock').notNullable() // Stock (quantité positive uniquement)
      table.boolean('delivery').notNullable() // Livraison (vrai/faux)


      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
