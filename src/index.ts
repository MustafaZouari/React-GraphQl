import {MikroORM} from '@mikro-orm/core'
import { __prod__ } from './constants'
// import { Post } from './entities/Post'
import microConfig from './mikro-orm.config'
import express from 'express'

import {ApolloServer} from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'

const main = async ()=>{
    // db connection
    const orm = await MikroORM.init(microConfig)
    await orm.getMigrator().up()


    // server
    const app = express()
    const apolloServer = new ApolloServer({
        schema : await buildSchema({
            resolvers : [HelloResolver , PostResolver],
            validate : false
        }),
        context : ()=>({em : orm.em})
    })

    
   apolloServer.applyMiddleware({app})
    app.listen(4000 , ()=>{
        console.log('listenning on port 4000')
    })
  
}
main().catch(err=>{console.log(err)})
