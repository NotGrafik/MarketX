import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Cart from './Cart'
import { DateTime } from 'luxon'

export default class CartItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public cartId: number

  @column()
  public shoeId: number

  @column()
  public price: number

  @belongsTo(() => Cart)
  public cart: BelongsTo<typeof Cart>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}