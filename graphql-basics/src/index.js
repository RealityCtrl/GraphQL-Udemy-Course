import {GraphQLServer} from 'graphql-yoga'

const typeDefs = `
    type Query {
        hello: String!
        name: String!
    }
`

const resolvers = {
    Query: {
        hello(){
            return 'This is my first query!'
        },
        name(){
            return 'David McCandless'
        }
    }
}

const server = new GraphQLServer({typeDefs, resolvers})
server.start(() => console.log('Server is running on localhost:4000'))