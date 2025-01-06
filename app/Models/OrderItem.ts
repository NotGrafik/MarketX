import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Order from 'App/Models/Order'
import Shoe from 'App/Models/Shoe'
import { DateTime } from 'luxon'

export default class OrderItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public orderId: number

  @column()
  public shoeId: number

  @column()
  public price: number

  @belongsTo(() => Order)
  public order: BelongsTo<typeof Order>

  @belongsTo(() => Shoe)
  public shoe: BelongsTo<typeof Shoe>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
