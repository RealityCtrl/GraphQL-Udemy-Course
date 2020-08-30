import {GraphQLServer} from 'graphql-yoga'
const { v4: uuidv4 } = require('uuid');

const userData = [
    {
        id: uuidv4(),
        name: 'David McCandless',
        email: null, 
        age: 99
    },
    {
        id: uuidv4(),
        name: 'User2',
        email: 'a@b.com', 
        age: 33
    },
    {
        id: uuidv4(),
        name: 'User3',
        email: 'a@example.com', 
        age: 44
    }
]

const postsData = [
    {
        id: uuidv4(),
        title: 'My first blog post!',
        body: ' This is the body of a blog post',
        published: '2020-08-22'
    },
    {
        id: uuidv4(),
        title: 'My second blog post!',
        body: ' This a new blog post to test querying',
        published: '2020-08-23'
    },
    {
        id: uuidv4(),
        title: 'My Third blog post!',
        body: ' This is the body of a blog post and its dummy data!',
        published: '2020-08-24'
    }
]

const typeDefs = `
    type Query {
        greeting(name: String): String
        me: User
        post: Post,
        add(a: Float!, b: Float!): Float!
        grades: [Int!]!
        addNumbers(numbers: [Float]!): Float!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
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
        addNumbers(parent, args, ctx, info){
            let result = 0
            if(args.numbers.lenghth !== 0){
                result = args.numbers.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue;
                })
            }
            return result
        },
        grades(){
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
        },
        users(parent, args, ctx, info){
            if(args.query){
                return userData.filter((user) => {
                   return user.name.toLowerCase().includes(args.query.toLowerCase())
                })
            }
            return userData
        },
        posts(parent, args, ctx, info){
            if(args.query){
                return postsData.filter((post) => {
                   return post.body.toLowerCase().includes(args.query.toLowerCase()) || post.title.toLowerCase().includes(args.query.toLowerCase());
                })
            }
            return postsData
        }
    }
}

const server = new GraphQLServer({typeDefs, resolvers})
server.start(() => console.log('Server is running on localhost:4000'))