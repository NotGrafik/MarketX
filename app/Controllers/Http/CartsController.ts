import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cart from 'App/Models/Cart'
import CartItem from 'App/Models/CartItem'
import Shoe from 'App/Models/Shoe'

export default class CartController {
    
    /**
     * @addToCart
     * @operationId add to Cart
     * @description Add a shoe to the authenticated user's cart.
     * @responseBody 200 - { "message": "Article ajouté au panier", "data": "<CartItem>" }
     * @responseBody 400 - { "message": "string" }
     * @responseBody 401 - { "message": "Utilisateur non authentifié." }
     * @responseBody 404 - { "message": "string" }
     */


    public async addToCart({ params, auth, response }: HttpContextContract) {
        const user = auth.user

        // Vérification de l'authentification
        if (!user) {
            return response.unauthorized({ message: 'Utilisateur non authentifié.' })
        }

        // Récupération de l'ID de la chaussure depuis l'URL
        const shoeId = params.id

        // Vérification si la chaussure existe
        const shoe = await Shoe.find(shoeId)
        if (!shoe) {
            return response.notFound({ message: 'Chaussure non trouvée' })
        }

        if (shoe.userId === user.id) {
            return response.badRequest({ message: 'Vous ne pouvez pas ajouter votre propre chaussure à votre panier.' })
        }

        if (!shoe.inStock) {
            return response.badRequest({ message: 'Chaussure en rupture de stock' })
        }

        if (shoe.delivery == false) {
            return response.badRequest({ message: 'Chaussure non disponible pour la livraison' })
        }

        // Vérifier si la chaussure est déjà dans un panier
        const alreadyInCart = await CartItem.query()
            .where('shoe_id', shoe.id)
            .first()

        if (alreadyInCart) {
            return response.badRequest({ message: 'Cette chaussure est déjà dans un panier.' })
        }

        // Récupérer ou créer le panier de l'utilisateur
        let cart = await Cart.findBy('user_id', user.id)
        if (!cart) {
            cart = await Cart.create({ userId: user.id })
        }

        
        // Ajouter la chaussure au panier
        const item = await CartItem.create({
            cartId: cart.id,
            shoeId: shoe.id,
            price: shoe.price,
        })
        
        cart.updateTotalPrice()
        
        return response.ok({
            message: 'Article ajouté au panier',
            data: item,
        })
    }

    /**
     * @show
     * @operationId show Cart
     * @description Return the authenticated user's cart.
     * @responseBody 200 - { "message": "Contenu du panier", "data": "<Cart>" }
     * @responseBody 401 - { "message": "Utilisateur non authentifié." }
     * @responseBody 404 - { "message": "Votre panier est vide" }
     */


    public async show({ auth, response }: HttpContextContract) {
        const user = auth.user
        if (!user) {
            return response.unauthorized({ message: 'Utilisateur non authentifié.' })
        }

        // Charger le panier avec les articles associés
        const cart = await Cart.query()
        .where('user_id', user.id)
        .preload('items')
        .first()

        cart?.serialize({
            fields: {
                pick: ['id', 'totalPrice'],
            },
        })

        if (!cart || cart.items.length === 0) {
        return response.notFound({ message: 'Votre panier est vide' })
        }

        return {
            message: 'Contenu du panier',
            data: cart,
        }
    }

    /**
     * @removeItem
     * @operationId remove Item
     * @description Delete an item from the authenticated user's cart.
     * @responseBody 200 - { "message": "Article supprimé du panier" }
     * @responseBody 401 - { "message": "Utilisateur non authentifié." }
     * @responseBody 404 - { "message": "Panier non trouvé" }
     * @responseBody 404 - { "message": "Article non trouvé dans le panier" }
     * @responseBody 404 - { "message": "Article supprimé du panier" }
     */
    public async removeItem({ params, auth, response }: HttpContextContract) {
        const user = auth.user
        if (!user) {
            return response.unauthorized({ message: 'Utilisateur non authentifié.' })
        }
        const cart_item = params.id

        // Trouver le panier de l'utilisateur
        const cart = await Cart.findBy('user_id', user.id)
        if (!cart) {
        return response.notFound({ message: 'Panier non trouvé' })
        }

        // Trouver l'article correspondant
        const item = await CartItem.query()
        .where('cart_id', cart.id)
        .where('id', cart_item)
        .first()

        if (!item) {
        return response.notFound({ message: 'Article non trouvé dans le panier' })
        }

        // Supprimer l'article
        await item.delete()

        return response.ok({ message: 'Article supprimé du panier' })
    }

    /**
     * @clearCart
     * @operationId clear Cart
     * @description Clear the cart of the authenticated user.
     * @responseBody 200 - { "message": "Votre panier a été vidé" }
     * @responseBody 401 - { "message": "Utilisateur non authentifié." }
     * @responseBody 404 - { "message": "Panier non trouvé" }
     * @responseBody 400 - { "message": "Le panier est déjà vide" }
     */
    public async clearCart({ auth, response }: HttpContextContract) {
        const user = auth.user
        if (!user) {
            return response.unauthorized({ message: 'Utilisateur non authentifié.' })
        }

        // Trouver le panier
        const cart = await Cart.findBy('user_id', user.id)
        if (!cart) {
        return response.notFound({ message: 'Panier non trouvé' })
        }

        if (!cart.items) {
            return response.badRequest({ message: 'Le panier est déjà vide' })
        }

        // Supprimer tous les articles du panier
        await CartItem.query().where('cart_id', cart.id).delete()

        return response.ok({ message: 'Votre panier a été vidé' })
    }
}
