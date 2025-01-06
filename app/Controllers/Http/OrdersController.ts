import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cart from 'App/Models/Cart'
import CartItem from 'App/Models/CartItem'
import Order from 'App/Models/Order'
import OrderItem from 'App/Models/OrderItem'
import OrderStatus from 'App/Models/OrdersStatus'

export default class OrdersController {
    /**
     * @index
     * @operationId get Orders
     * @description Retourne une liste de commandes pour l'utilisateur connecté.
     * @responseBody 200 - <Order[]>
     * @responseBody 401 - { "message": "Vous devez être connecté." }
     * @responseBody 404 - { "message": "Aucune commande trouvée." }
    */
    public async index({ auth, response }: HttpContextContract) {
        const user = auth.user

        if (!user) {
            return response.unauthorized({ message: 'Vous devez être connecté.' })
        }
        
        const orders = await (await Order.query().where('user_id', user.id).preload('items').preload('status').exec())

        if (orders.length === 0) {
            return response.notFound({ message: 'Aucune commande trouvée.' })
        }

        return orders
    }

    /**
     * @checkout
     * @operationId checkout Order
     * @description Crée une commande à partir du panier de l'utilisateur connecté.
     * @responseBody 200 - { "message": "Commande crééé avec succès.", "order": "<Order>" }
     * @responseBody 400 - { "message": "Votre panier est vide." }
     * @responseBody 401 - { "message": "Vous devez être connecté." }
     */
    public async checkout({ auth, response }: HttpContextContract) {
        const user = auth.user

        if (!user) {
            return response.unauthorized({ message: 'Vous devez être connecté.' })
        }

        const cart = await Cart.query().where('user_id', user.id).preload('items').first()

        if (!cart || cart.items.length === 0) {
            return response.badRequest({ message: 'Votre panier est vide.' })
        }

        const order = await Order.create({
            userId: user.id,
            totalPrice: cart.totalPrice,
        })

        for (const item of cart.items) {
            await OrderItem.create({
            orderId: order.id,
            shoeId: item.shoeId,
            price: item.price,
            })
        }

        await OrderStatus.create({
            order_id: order.id,
            status: 'pending',
        })

        await CartItem.query().where('cart_id', cart.id).delete()
        await cart.updateTotalPrice()

        return response.ok({ message: 'Commande créée avec succès', order })
    }

    /**
     * @updateStatus
     * @operationId update Order Status
     * @description Met à jour le statut d'une commande existante.
     * @requestBody { "status": "string" }
     * @responseBody 200 - { "message": "Status mis à jour.", "order": "<Order>" }
     * @responseBody 404 - { "message": "Commande non trouvé." }
    */
    public async updateStatus({ params, request, response }: HttpContextContract) {
        const order = await Order.find(params.id)

        
        if (!order) {
            return response.notFound({ message: 'Commande non trouvée' })
        }

        const status = request.input('status')

        if (!status) {
            return response.badRequest({ message: 'Le statut est requis' })
        }

        const lastStatus = await OrderStatus.query().where('order_id', order.id).orderBy('created_at', 'desc').first()

        if (lastStatus && lastStatus.status === status) {
            return response.badRequest({ message: 'Le statut est déjà défini à cette valeur' })
        }

        if(status !== 'pending' && status !== 'confirmed' && status !== 'shipped' && status !== 'delivered') {
            return response.badRequest({ message: 'Invalid status, must be one of: pending, confirmed, shipped, delivered' })
        }

        await OrderStatus.create({
            order_id: order.id,
            status: status,
        })

        return response.ok({ message: 'Statut mis à jour', order })
    }

    /**
     * @show
     * @operationId get Order Status History
     * @description Retourne l'historique des statuts d'une commande.
     * @responseBody 200 - <OrdersStatus[]>
     * @responseBody 404 - { "message": "Cette commande n'existe pas." }
     */
    public async statusHistory({ params, response }: HttpContextContract) {
        const statuses = await OrderStatus.query().where('order_id', params.id)

        if (statuses.length === 0) {
        return response.notFound({ message: "Cette commande n'existe pas." })
        }

        return response.ok(
            {
                message: 'Historique des statuts',
                data: statuses,
            }
        )
    }
}
