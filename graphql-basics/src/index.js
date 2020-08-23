import {GraphQLServer} from 'graphql-yoga'
const { v4: uuidv4 } = require('uuid');

const typeDefs = `
    type Query {
        greeting(name: String): String
        me: User
        post: Post,
        add(a: Float!, b: Float!): Float!
        grades: [Int!]!
    },
    type User {
        id: ID!
        name: String!
        email: String
        age: Int
    }
    type Post {
        id: ID!
        title: String!
        body: String,
        published: String
    }
`

const resolvers = {
    Query: {
        greeting(parent, args, ctx, info){
            if(args.name){
                //console.log(parent, args, ctx, info)
                return `Hello ${args.name}, welcome!`
            }else{
                return "Hello"
            }
        },
        add(parent, args, ctx, info){
            return args.a + args.b
        },
        grades(parent, args, ctx, info){
            return [75, 54, 88, 43]
        },
        me(){
            return {
                id: uuidv4(),
                name: 'David McCandless',
                email: null, 
                age: 99
            }
        },
        post(){
            return {
                id: uuidv4(),
                title: 'My first blog post!',
                body: ' This is the body of a blog post',
                published: '2020-08-22'
            }
        }
    }
}

const server = new GraphQLServer({typeDefs, resolvers})
server.start(() => console.log('Server is running on localhost:4000'))