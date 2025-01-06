import { DateTime } from 'luxon'
import User from 'App/Models/User'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class Shoe extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public brand: string

  @column()
  public model: string

  @column()
  public size: number

  @column()
  public price: number

  @column()
  public condition: number

  @column()
  public inStock: boolean 

  @column()
  public delivery: boolean

  @column()
  public userId: number

  @belongsTo(() => User)
  public seller: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
