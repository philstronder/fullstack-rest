const jwt = require('jwt-simple')

module.exports = async ({ req }) => {
    //in development
    //await require('./simulateLoggedUser')(req)
    
    const auth = req.headers.authorization
    const token = auth && auth.substring(7) //not considering the 'Bearer' word

    let user = null
    let admin = false

    if(token) {
        try {
            let tokenContent = jwt.decode(token,
                    process.env.APP_AUTH_SECRET)

            if(new Date(tokenContent.exp * 1000) > new Date()) {
                user = tokenContent
            }
        } catch (e) {
            //invalid token
        }
    }

    if(user && user.profiles) {
        admin = user.profiles.includes('admin')
    }

    const err = new Error('Access denied!')

    return {
        user,
        admin,
        validateUser() {
            if(!user) throw err
        },
        validateAdmin() {
            if(!admin) throw err
        },
        validateUserFilter(filter) {
            if(admin) return

            if(!user) throw err
            if(!filter) throw err

            const {id, email} = filter
            if(!id && !email) throw err
            if(id && id !== user.id) throw err
            if(email && email !== user.email) throw err
        }
    }
}