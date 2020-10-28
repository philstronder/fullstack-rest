require('dotenv-safe').config()
var jwt = require('jsonwebtoken')
var http = require('http'); 
const express = require('express') 
const app = express() 
var cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const db = require('./config/db')
const bcrypt = require('bcrypt-nodejs')


app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser()); 
 
app.get('/', (req, res, next) => {
    console.log(req)
    res.json({message: "Txudo ok por aqui!"});
})

//delete user by ID
app.delete('/users/:id', verifyJWT, async function (req, res, next)  {
    const id = req.params.id

    try {
        await db('users_profiles')
            .where({user_id: id})
            .delete()
    
        await db('users')
            .where({id})
            .delete()

    } catch (e) {
        console.log(e)
    }
    
})

//get user by ID
app.get('/users/:id', (req, res, next) => {
    
    db('users')
        .where({id: req.params.id})
        .then(user => res.json(
            user
        ))
})

//get all users
app.get('/users', verifyJWT, (req, res, next) => {
    
    db('users')
        .then(users => res.json(
            users
        ))
})

//update user
app.put('/user', async (req, res, next) => {
    const data = req.body
    const {id} = data

    try {
        let user = db('users')
        .where({id})
        .first()
    
        if(user){
            await db('users_profiles')
                .where({user_id: id}).delete()

            for(let filter of data.profiles) {
                const profile = await db('profiles')
                    .where({id: 1}) //TODO: change to "profile.id"
                    .first()

                if(profile) {
                    await db('users_profiles')
                        .insert({
                            profile_id: profile.id,
                            user_id: id
                        })
                }
            }

            if(data.password) {
                const salt = bcrypt.genSaltSync()
                data.password = bcrypt.hashSync(data.password, salt)
            }

            delete data.profiles

            await db('users')
                .where({id})
                .update(data)
            
            //get updated data fom database
            user = await db('users')
                .where({id})
                .first()

            return res.json({...user})  
        }

        return res.json({message: 'User does not exist!'})
        
    } catch(e) {
        console.log(e)
        res.json({message: 'Error updating user'})
    }
    
    //const { id } = user
})

//insert user
app.post('/user', async (req, res, next) => {
    const data = req.body

    try{
        //get profiles ids
        const profile = await db('profiles')
                .where({name: 'common'})
                .first()
        profileIds = []
        profileIds.push(profile.id)

        //password encryption
        const salt = bcrypt.genSaltSync()
        data.password = bcrypt.hashSync(data.password, salt)
        
        delete data.profiles

        //insert in users table
        const [id] = await db('users')
                        .insert(data)
        
        //insert in users_profiles table
        for(let profile_id of profileIds) {
            await db('users_profiles')
                .insert({profile_id, user_id: id})
        }
        
        const addedUser = await db('users')
            .where({id}).first()
            
        return res.json(addedUser)

    } catch(e) {
        throw new Error(e.sqlMessage)
    }
})

app.post('/login', async function (req, res, next) {
    //params should be passed as x-www-form-urlencoded

    if(!req.body.email || !req.body.password)
        res.status(500).json({message: 'Email/password cannot be blank'});
        //throw new Error('Username/password cannot be blank')

    const user = await db('users')
        .where({email: req.body.email})
        .first()

    if(!user) 
        res.status(500).json({message: 'Invalid email/password'})

    const passwordMatch = bcrypt.compareSync(req.body.password, user.password)

    if(!passwordMatch) 
        res.status(500).json({message: 'Password not match'})

    //get logged user
    const profiles = await db('profiles')
        .join(
            'users_profiles',
            'profiles.id',
            'users_profiles.profile_id'
        )
        .where({user_id: user.id})

    const now = Math.floor(Date.now() / 1000)

    const userInfo = {
        id: user.id,
        name: user.name,
        email: user.email,
        profiles: profiles.map(p => p.name),
        iat: now,
        exp: now + (3 * 24 * 60 * 60)
    }

    return res.json({
        ...userInfo,
        token: jwt.sign(userInfo, process.env.SECRET)
    })
})

//get all posts
app.get('/posts', async (req, res, next) => {
    db('posts')
        .then(posts => {
            res.json(posts)
        })
})

//get post by id
app.get('/post/:id', (req, res, next) => {
    const {id} = req.params
    
    db('posts')
        .where({id})
        .then(post => {
            res.json(post)
        })
})

//delete post
app.delete('/post/:id', async (req, res, next) => {
    const {id} = req.params
    await db('posts')
        .where({id})
        .delete()

    res.json({message: 'Post ' + id + ' deleted'})
})

//insert post
app.post('/post', async (req, res, next) => {
    const data = req.body

    const [id] = await db('posts')
        .insert(data)

    const addedPost = await db('posts')
        .where({id})
    
    res.json(addedPost)
})

//update post
app.put('/post/:id', async (req, res, next) => {
    const {id} = req.params
    const data = req.body

    if(!data.title) res.json({message: 'Title is required'})
    if(!data.content) res.json({message: 'Content is required'})

    const post = await db('posts')
        .where({id})
        .first()

    if(post) {
        await db('posts')
            .where({id})
            .update(data)

        const updatedPost = await db('posts')
            .where({id})

        res.json(...updatedPost)
    } else{
        res.json({message: 'Invalid post'})
    }
})

function verifyJWT(req, res, next){
    //const auth = req.headers.authorization
    //const token = auth && auth.substring(7) //not considering the 'Bearer' word

    var token = req.headers['x-access-token'];
    if (!token) 
        return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) 
        return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
}
 
var server = http.createServer(app); 
server.listen(3000);
console.log("Server running on pot 3000...")