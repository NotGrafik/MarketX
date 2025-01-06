import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import CartItem from './CartItem'
import { DateTime } from 'luxon'
import Database from '@ioc:Adonis/Lucid/Database'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @hasMany(() => CartItem)
  public items: HasMany<typeof CartItem>

  @column()
  public totalPrice: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // @no-swagger
  public async updateTotalPrice(): Promise<void> {
    const total = await Database
      .from('cart_items')
      .where('cart_id', this.id)
      .sum('price as total')
  
    this.totalPrice = total[0].total || 0
    await this.save()
  }
}