import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Shoe from 'App/Models/Shoe'
import User from 'App/Models/User'
import Order from 'App/Models/Order'
import { schema, rules } from '@ioc:Adonis/Core/Validator'


export default class ShoesController {
    /**
     * @index
     * @operationId get Shoes
     * @description Retourne une liste de chaussures filtrées par différents paramètres.
     * @responseBody 200 - <Shoe[]>
     * @responseBody 404 - { "message": "string" }
     * @param {string} brand - Filtrer par marque
     * @param {string} model - Filtrer par modèle
     * @param {number} size - Filtrer par taille
     * @param {number} price - Filtrer par prix
     * @param {number} condition - Filtrer par condition (1 à 10)
     * @param {boolean} inStock - Filtrer si en stock
     * @param {boolean} delivery - Filtrer si livraison disponible
     */
    public async index({ request }: HttpContextContract) {
        const { brand, model, size, price, condition, inStock, delivery } = request.qs()
        const query = Shoe.query()
            
        if (brand) {
            query.where('brand', 'LIKE', `%${brand}%`)
        }
    
        if (model) {
            query.where('model', 'LIKE', `%${model}%`)
        }
    
        if (size) {
            query.where('size', size)
        }
    
        if (price) {
            query.where('price', price)
        }
    
        if (condition) {
            query.where('condition', condition)
        }
    
        if (inStock !== undefined) {
            query.where('inStock', inStock === 'true')
        }
    
        if (delivery !== undefined) {
            query.where('delivery', delivery === 'true')
        }
    
        const shoes = await query.exec()

        if (shoes.length === 0) {
            return {
                message: 'Aucune chaussure trouvée',
            }
        }

        console.log(shoes)
    
        return shoes

    }

    /**
     * @create
     * @operationId create Shoe
     * @description Crée une nouvelle chaussure dans la base de données.
     * @requestBody { "brand": "string", "model": "string", "size": "number", "price": "number", "condition": "number", "inStock": "boolean", "delivery": "boolean" }
     * @responseBody 201 - <Shoe>
     * @responseBody 400 - { "message": "string", "errors": "string[]" }
     * @exampleRequest {
     *   "brand": "Nike",
     *   "model": "Air Max",
     *   "size": 42,
     *   "price": 120,
     *   "condition": 9,
     *   "inStock": true,
     *   "delivery": true
     * }
     * @exampleResponse 201 - {
     *   "message": "Chaussure créée avec succès",
     *   "data": {
     *     "id": 1,
     *     "brand": "Nike",
     *     "model": "Air Max",
     *     "size": 42,
     *     "price": 120,
     *     "condition": 9,
     *     "inStock": true,
     *     "delivery": true,
     *     "userId": 5
     *   }
     * }
     * @exampleResponse 400 - {
     *   "message": "Échec de la création de la chaussure",
     *   "errors": ["Marque obligatoire", "Prix invalide"]
     * }
     */

    public async create({ request, response, auth }: HttpContextContract) {
        try {
            const shoeSchema = schema.create({
                brand: schema.string({}, [rules.maxLength(255)]),
                model: schema.string({}, [rules.maxLength(255)]),
                size: schema.number(),
                price: schema.number(),
                condition: schema.number(),
                inStock: schema.boolean(),
                delivery: schema.boolean(),
            })

            const data = await request.validate({ schema: shoeSchema })

            const user = auth.user as User

            const shoe = await Shoe.create({
                brand: data.brand,
                model: data.model,
                size: data.size,
                price: data.price,
                condition: data.condition,
                inStock: data.inStock,
                delivery: data.delivery,
                userId: user.id
            })

            return response.created({
                message: 'Chaussure créée avec succès',
                data: {
                    id: shoe.id,
                    brand: shoe.brand,
                    model: shoe.model,
                    size: shoe.size,
                    price: shoe.price,
                    condition: shoe.condition,
                    inStock: shoe.inStock,
                    delivery: shoe.delivery,
                    userId: shoe.userId,
                },
            })
        } catch (error) {
            return response.badRequest({
                message: 'Échec de la création de la chaussure',
                errors: error.messages || error.message,
            })
        }
    }
    /**
     * @update
     * @operationId update Shoe
     * @description Met à jour les détails d'une chaussure existante appartenant à l'utilisateur.
     * @requestBody { "brand": "string", "model": "string", "size": "number", "price": "number", "condition": "number", "inStock": "boolean", "delivery": "boolean" }
     * @responseBody 200 - { "message": "string", "data": <Shoe> }
     * @responseBody 404 - { "message": "Chaussure introuvable ou non autorisée." }
     * @exampleRequest {
     *   "brand": "Adidas",
     *   "model": "Superstar",
     *   "size": 41,
     *   "price": 90,
     *   "condition": 8,
     *   "inStock": false,
     *   "delivery": true
     * }
     * @exampleResponse 200 - {
     *   "message": "Chaussure mise à jour avec succès",
     *   "data": {
     *     "id": 2,
     *     "brand": "Adidas",
     *     "model": "Superstar",
     *     "size": 41,
     *     "price": 90,
     *     "condition": 8,
     *     "inStock": false,
     *     "delivery": true,
     *     "userId": 5
     *   }
     * }
     * @exampleResponse 404 - {
     *   "message": "Chaussure introuvable ou non autorisée."
     * }
     */

    public async update({ request, response, params, auth }: HttpContextContract) {
        const user = auth.user as User
    
        // Récupérer la chaussure par son id tout en vérifiant l'appartenance
        const shoe = await Shoe.query()
            .where('id', params.id)  // Utilise params.id pour récupérer la chaussure
            .andWhere('user_id', user.id)  // Vérifie que l'utilisateur est bien le vendeur
            .first()
    
        // Si la chaussure n'existe pas ou n'appartient pas à l'utilisateur
        if (!shoe) {
            return response.notFound({
                message: 'Chaussure introuvable ou non autorisée.',
            })
        }
    
        // Validation des données de mise à jour
        const shoeSchema = schema.create({
            brand: schema.string.optional({}, [rules.maxLength(255)]),
            model: schema.string.optional({}, [rules.maxLength(255)]),
            size: schema.number.optional(),
            price: schema.number.optional(),
            condition: schema.number.optional([rules.range(1, 10)]),
            inStock: schema.boolean.optional(),
            delivery: schema.boolean.optional(),
        })
    
        const data = await request.validate({ schema: shoeSchema })
    
        // Mise à jour des champs
        shoe.brand = data.brand ?? shoe.brand
        shoe.model = data.model ?? shoe.model
        shoe.size = data.size ?? shoe.size
        shoe.price = data.price ?? shoe.price
        shoe.condition = data.condition ?? shoe.condition
        shoe.inStock = data.inStock ?? shoe.inStock
        shoe.delivery = data.delivery ?? shoe.delivery
    
        await shoe.save()
    
        return {
            message: 'Chaussure mise à jour avec succès',
            data: {
                id: shoe.id,
                brand: shoe.brand,
                model: shoe.model,
                size: shoe.size,
                price: shoe.price,
                condition: shoe.condition,
                inStock: shoe.inStock,
                delivery: shoe.delivery,
                userId: shoe.userId,
            },
        }
    }

    /**
     * @delete
     * @operationId delete Shoe
     * @description Supprime une chaussure appartenant à l'utilisateur.
     * @responseBody 200 - { "message": "Chaussure supprimée avec succès" }
     * @responseBody 404 - { "message": "Chaussure introuvable ou non autorisée." }
     * @exampleResponse 200 - {
     *   "message": "Chaussure supprimée avec succès"
     * }
     * @exampleResponse 404 - {
     *   "message": "Chaussure introuvable ou non autorisée."
     * }
     */
    public async delete({ response, params, auth }: HttpContextContract) {
        const user = auth.user as User
    
        // Récupérer la chaussure par son id tout en vérifiant l'appartenance
        const shoe = await Shoe.query()
            .where('id', params.id)  // Utilise params.id pour récupérer la chaussure
            .andWhere('user_id', user.id)  // Vérifie que l'utilisateur est bien le vendeur
            .first()
    
        // Si la chaussure n'existe pas ou n'appartient pas à l'utilisateur
        if (!shoe) {
            return response.notFound({
                message: 'Chaussure introuvable ou non autorisée.',
            })
        }
    
        await shoe.delete()
    
        return {
            message: 'Chaussure supprimée avec succès',
        }
    }
    
}
