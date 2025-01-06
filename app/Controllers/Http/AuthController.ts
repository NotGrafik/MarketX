import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
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
                expiresIn: '7days',
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
