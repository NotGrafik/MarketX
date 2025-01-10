import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
    /**
     * @login
     * @operationId login as User
     * @description Créer un nouveau token d'authentification lié à un compte (se connecter).
     * @requestBody { "email": "string", "password": "string" }
     * @responseBody 200 - { "message": "Connexion réussie", "token": "string",
     * "user": "<User>" }
     * @responseBody 400 - { "message": "Les champs email et mot de passe sont requis." }
     * @responseBody 401 - { "message": "L'adresse email fournie n'existe pas." }
     * @responseBody 401 - { "message": "Le mot de passe est incorrect." }
     * @responseBody 401 - { "message": "Vous êtes déjà connecté." }
     * @responseBody 500 - { "message": "Une erreur est survenue lors de la tentative de connexion.",
     * "error": "string", "error_code": "string" }
    */
    public async login({ request, auth, response }: HttpContextContract) {
        const { email, password } = request.only(['email', 'password'])

        // Vérification des champs vides
        if (!email || !password) {
            return response.badRequest({
                message: 'Les champs email et mot de passe sont requis.',
            })
        }

        try {
            // Authentifie l'utilisateur et génère un token
            const token = await auth.use('api').attempt(email, password, {
                expiresIn: '1hour'
            })

            return response.ok({
                message: 'Connexion réussie',
                token: token.token,
                user: token.user,
            })
        } catch (error) {
            // Gestion des erreurs spécifiques
            const errorMessages: { [key: string]: string } = {
                'E_INVALID_AUTH_UID': "L'adresse email fournie n'existe pas.",
                'E_INVALID_AUTH_PASSWORD': 'Le mot de passe est incorrect.',
                'ER_DUP_ENTRY': 'Vous êtes déjà connecté.',
            }

            if (error.code && errorMessages[error.code]) {
                return response.unauthorized({
                    message: errorMessages[error.code],
                })
            }

            // Erreur générique pour les autres cas
            console.error('Erreur lors de la connexion :', error)
            return response.internalServerError({
                message: 'Une erreur est survenue lors de la tentative de connexion.',
                error: error.message,
                error_code: error.code,
            })
        }
    }

    /**
     * @logout
     * @operationId logout User
     * @description Déconnecte un utilisateur en invalidant son token d'authentification.
     * @responseBody 200 - { "message": "Déconnexion réussie" }
     * @responseBody 500 - { "message": "Une erreur est survenue lors de la tentative de déconnexion" }
     */

    public async logout({ auth, response }: HttpContextContract) {
        try {
            await auth.use('api').logout()
            return response.ok({
                message: 'Déconnexion réussie',
            })
        } catch (error) {
            console.error('Erreur lors de la déconnexion :', error)
            return response.internalServerError({
                message: 'Une erreur est survenue lors de la tentative de déconnexion.',
            })
        }
    }
}
