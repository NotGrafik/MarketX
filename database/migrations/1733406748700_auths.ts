import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Auth extends BaseSchema {

  public async up () {
    this.schema.createTable('users', (table) => {
      table.increments('id')
      table.string('name', 255).notNullable() // Nom de l'utilisateur
      table.string('email', 255).notNullable().unique() // Email unique
      table.string('password', 255).notNullable() // Mot de passe haché
      table.string('postal_code', 20).notNullable() // Code postal
      table.integer('purchases_count').defaultTo(0).notNullable() // Nombre d'achats
      table.integer('sales_count').defaultTo(0).notNullable() // Nombre de ventes
      table.decimal('total_spent', 10, 2).defaultTo(0).notNullable() // Argent total dépensé
      table.decimal('total_earned', 10, 2).defaultTo(0).notNullable() // Argent total gagné
      table.timestamps(true)
    })

    this.schema.createTable('api_tokens', (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').unique() // Clé étrangère vers `users`
      table.string('name', 255).notNullable() // Nom du token (ex : "Mobile App")
      table.string('type', 80).notNullable() // Type de token (par exemple : "bearer")
      table.string('token', 64).notNullable().unique() // Le token en lui-même
      table.timestamp('expires_at', { useTz: true }).nullable() // Expiration du token
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable('user')
    this.schema.dropTable('api_tokens')
  }
}
