import { BaseModel, column, hasMany, HasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import OrderItem from 'App/Models/OrderItem'
import User from 'App/Models/User'
import OrdersStatuses from 'App/Models/OrdersStatus'
import { DateTime } from 'luxon'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public totalPrice: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => OrderItem)
  public items: HasMany<typeof OrderItem>

  // Relation avec OrderStatus pour l'historique des statuts
  @hasMany(() => OrdersStatuses, {
    foreignKey: 'order_id',  // Spécifier la clé étrangère correcte
  })
  public status: HasMany<typeof OrdersStatuses>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

}
