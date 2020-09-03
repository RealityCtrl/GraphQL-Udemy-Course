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
        published: true,
        author: userData[0].id
    },
    {
        id: uuidv4(),
        title: 'My second blog post!',
        body: ' This a new blog post to test querying',
        published: true,
        author: userData[0].id
    },
    {
        id: uuidv4(),
        title: 'My Third blog post!',
        body: ' This is the body of a blog post and its dummy data!',
        published: false,
        author: userData[1].id
    }
]

const commentData = [
    {
        id: uuidv4(),
        text: 'This is a comment on a post!',
        author: userData[1].id,
        post: postsData[0].id
    },
    {
        id: uuidv4(),
        text: 'This is another comment on a post!',
        author: userData[2].id,
        post: postsData[0].id
    },
    {
        id: uuidv4(),
        text: 'Writing dummy data is boring!',
        author: userData[2].id,
        post: postsData[1].id
    },
    {
        id: uuidv4(),
        text: 'We need to generate better data!',
        author: userData[0].id,
        post: postsData[1].id
    },
]

const typeDefs = `
    type Query {
        me: User
        post: Post,
        add(a: Float!, b: Float!): Float!
        addNumbers(numbers: [Float]!): Float!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
    }
    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
        createPost(title: String!, body: String!, published: Boolean!, author: String!): Post!
        createComment(text: String!, author: String!, post: String!): Comment!
    }
    type User {
        id: ID!
        name: String!
        email: String
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
    type Post {
        id: ID!
        title: String!
        body: String,
        published: Boolean,
        author: User!
        comments: [Comment!]!
    }
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

const resolvers = {
    Query: {
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
                published: '2020-08-22',
                author: userData[0]
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
        },
        comments(parent, args, ctx, info){
            if(args.query){
                return commentData.filter((comment) => {
                   return post.text.toLowerCase().includes(args.query.toLowerCase());
                })
            }
            return commentData
        }
    },
    Mutation:{
        createUser(parent, args, ctx, info){
            const emailInUse = userData.some((user) => {
                return user.email === args.email
            })
            if(emailInUse){
                throw new Error('Email already in use by another user');
            }
            const newUser = {
                id:  uuidv4(),
                name: args.name,
                email: args.email,
                age: args.age
            }
            userData.push(newUser);
            return newUser;
        },
        createPost(parent, args, ctx, info){
            const userExists = userData.some((user) => {
                return user.id === args.author;
            })
            if(!userExists){
                throw new Error(`User ${args.author} not found`);
            }

            const post = {
                id: uuidv4(),
                title: args.title,
                body: args.body,
                published: args.published,
                author: args.author
            };
            postsData.push(post);
            return post;
        },
        createComment(parent, args, ctx, info){

            const userExists = userData.some((user) => {
                return user.id === args.author;
            })
            if(!userExists){
                throw new Error(`User ${args.author} not found`);
            }
            const postExists = postsData.some((post)=>{
                return post.id === args.post;
            })
            if(!postExists){
                throw new Error(`Post ${args.post} not found`);
            }
            const comment = {
                id: uuidv4(),
                text: args.text,
                author: args.author,
                post: args.post
            };
            commentData.push(comment);
            return comment;
        }
    },
    Post: {
        author(parent, args, ctx, info){
            return userData.find((user) =>{ 
                return user.id === parent.author
            })
        },
        comments(parent, args, ctx, info){
            return commentData.filter((comment) =>{ 
                return comment.post === parent.id
            })
        },
    },
    User: {
        posts(parent, args, ctx, info){
            return postsData.filter((post) =>{ 
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info){
            return commentData.filter((comment) =>{ 
                return comment.author === parent.id
            })
        },
    },
    Comment:{
        author(parent, args, ctx, info){
            return userData.find((user) =>{ 
                return user.id === parent.author
            })
        },
        post(parent, args, ctx, info){
            return postsData.find((post) =>{ 
                return post.id === parent.post
            })
        },
    }
}

const server = new GraphQLServer({typeDefs, resolvers})
server.start(() => console.log('Server is running on localhost:4000'))