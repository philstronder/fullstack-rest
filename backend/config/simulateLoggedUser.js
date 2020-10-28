const db = require('./db')
const {getLoggedUser} = require('../resolvers/common/user') 

const sql = `
    select 
        u.*
    from
        users u,
        users_profiles up,
        profiles p
    where
        up.user_id = u.id and
        up.profile_id = p.id and
        u.active = 1 and
        p.name = :profileName
    limit 1
`

const getUser = async profileName => {
    const res = await db.raw(sql, { profileName })
    return res ? res[0][0] : null
}

module.exports = async req => {
    const user = await getUser('admin')
    
    if(user) {
        const { token } = await getLoggedUser(user)
        req.headers = {
            authorization: `Bearer ${token}`
        }
    }
}
