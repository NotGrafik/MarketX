import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Shoe from 'App/Models/Shoe'
import Cart from 'App/Models/Cart'
import CartItem from 'App/Models/CartItem'

export default class DatabaseSeeder extends BaseSeeder {
  public async run() {
    // 1. Création d'utilisateurs
    const users = await User.updateOrCreateMany('email', [
      {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: 'password123',
        postal_code: 75001,
      },
      {
        email: 'jane.doe@example.com',
        name: 'Jane Doe',
        password: 'password123',
        postal_code: 75002,
      },
    ])

    // 2. Création de chaussures
    const shoes = await Shoe.updateOrCreateMany('model', [
      {
        brand: 'Nike',
        model: 'Air Jordan 1',
        size: 42,
        price: 200,
        condition: 9,
        inStock: true,
        delivery: true,
        userId: users[0].id,
      },
      {
        brand: 'Adidas',
        model: 'Yeezy Boost 350',
        size: 44,
        price: 300,
        condition: 8,
        inStock: true,
        delivery: false,
        userId: users[1].id,
      },
      {
        brand: 'Adidas',
        model: 'Yeezy Boost 700 Wave Runner',
        size: 42,
        price: 449.99,
        condition: 8,
        inStock: true,
        delivery: true,
        userId: users[1].id,
      },
    ])

    // 3. Création de paniers avec des articles
    const cart = await Cart.create({
      userId: users[0].id,
      totalPrice: 0,
    })

    await CartItem.createMany([
      {
        cartId: cart.id,
        shoeId: shoes[2].id,
        price: shoes[2].price,
      }
    ])

    // Mise à jour du total du panier
    await cart.updateTotalPrice()

    console.log('🌱 Base de données peuplée avec succès')
  }
}
