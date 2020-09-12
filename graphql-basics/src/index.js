import {GraphQLServer, PubSub} from 'graphql-yoga';
import db from './db.js';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Post from './resolvers/Post';
import User from './resolvers/User';
import Comment from './resolvers/Comment';
import Subscription from './resolvers/Subscription'

const pubSub = new PubSub();

const server = new GraphQLServer({
    typeDefs:'./src/schema.graphql', 
    resolvers: {
        Query, 
        Mutation, 
        Post,
        User, 
        Comment,
        Subscription
    },
    context: {
        db,
        pubSub
    }
})
server.start(() => console.log('Server is running on localhost:4000'))