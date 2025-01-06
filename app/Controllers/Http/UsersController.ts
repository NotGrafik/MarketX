import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

type badRequestResponse = {
    message: string
    errors: string[]
}

export default class UsersController {
    
    /**
     * @index
     * @operationId get Users
     * @description Retourne une liste de tous les utilisateurs dans la base de données.
     * @responseBody 200 - <User[]>
     * @paramUse(sortable, filterable)
     * @example(User)
     */

    public async index() {
        return await User.all()
    }
    
    /**
     * @create
     * @operationId create User
     * @description Crée un nouvel utilisateur dans la base de données.
     * @requestBody { "name": "string", "email": "string", "password": "string", "password_confirmation": "string", "postal_code": "number" }
     * @responseBody 201 - <User>
     * @responseBody 400 - { "message": "string", "errors": "string[]" }
     * @exampleRequest {
     *   "name": "Jean Dupont",
     *   "email": "jean.dupont@example.com",
     *   "password": "123456",
     *   "password_confirmation": "123456",
     *   "postal_code": 75001
     * }
     * @exampleResponse 201 - {
     *   "message": "Utilisateur créé avec succès",
     *   "data": {
     *     "id": 1,
     *     "name": "Jean Dupont",
     *     "email": "jean.dupont@example.com",
     *     "postal_code": 75001
     *   }
     * }
     * @exampleResponse 400 - {
     *   "message": "Échec de la création de l’utilisateur",
     *   "errors": ["Email déjà utilisé", "Mot de passe trop court"]
     * }
     */ 

    public async create({ request, response }: HttpContextContract) {
        try {
            const userSchema = schema.create({
                name: schema.string({}, [rules.maxLength(255)]),
                email: schema.string({}, [
                    rules.email(),
                    rules.unique({ table: 'users', column: 'email' }), // Email unique
                ]),
                password: schema.string({}, [
                    rules.confirmed(),
                    rules.minLength(6)
                ]),
                postal_code: schema.number(),
            })

            const data = await request.validate({ schema: userSchema })

            const user = await User.create({
                name: data.name,
                email: data.email,
                password: data.password,
                postal_code: data.postal_code,
            })

            return response.created({
                message: 'Utilisateur créé avec succès',
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    postal_code: user.postal_code,
                },
            })
        } catch (error) {
            return response.badRequest({
                message: 'Échec de la création de l’utilisateur',
                errors: error.messages || error.message,
            })
        }
    }
}
