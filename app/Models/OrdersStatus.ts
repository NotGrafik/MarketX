import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class OrderStatuses extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public order_id: number

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
