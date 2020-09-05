import {GraphQLServer} from 'graphql-yoga';
const { v4: uuidv4 } = require('uuid');
import db from './db.js';




const resolvers = {
    Query: {
        me(){
            return {
                id: uuidv4(),
                name: 'David McCandless',
                email: null, 
                age: 99
            }
        },
        users(parent, args, {db}, info){
            if(args.query){
                return db.userData.filter((user) => {
                   return user.name.toLowerCase().includes(args.query.toLowerCase())
                })
            }
            return db.userData
        },
        posts(parent, args, {db}, info){
            if(args.query){
                return dbpostsData.filter((post) => {
                   return post.body.toLowerCase().includes(args.query.toLowerCase()) || post.title.toLowerCase().includes(args.query.toLowerCase());
                })
            }
            return db.postsData
        },
        comments(parent, args, {db}, info){
            if(args.query){
                return db.commentData.filter((comment) => {
                   return post.text.toLowerCase().includes(args.query.toLowerCase());
                })
            }
            return db.commentData
        }
    },
    Mutation:{
        createUser(parent, args, {db}, info){
            const emailInUse = db.userData.some((user) => {
                return user.email === args.data.email
            })
            if(emailInUse){
                throw new Error('Email already in use by another user');
            }
            const newUser = {
                id:  uuidv4(),
                ...args.data
            }
            db.userData.push(newUser);
            return newUser;
        },
        createPost(parent, args, {db}, info){
            const userExists = db.userData.some((user) => {
                return user.id === args.data.author;
            })
            if(!userExists){
                throw new Error(`User ${args.data.author} not found`);
            }

            const post = {
                id: uuidv4(),
                ...args.data
            };
            db.postsData.push(post);
            return post;
        },
        createComment(parent, args, {db}, info){

            const userExists = db.userData.some((user) => {
                return user.id === args.data.author;
            })
            if(!userExists){
                throw new Error(`User ${args.data.author} not found`);
            }
            const postExists = db.postsData.some((post)=>{
                return post.id === args.data.post;
            })
            if(!postExists){
                throw new Error(`Post ${args.data.post} not found`);
            }
            const comment = {
                id: uuidv4(),
                ...args.data
            };
            db.commentData.push(comment);
            return comment;
        },
        deleteUser(parent, args, {db}, info){
            const userIndex = db.userData.findIndex((user) => {
                return user.id === args.userID;
            });
            if(userIndex === -1){
                throw new Error(`User ${args.userID} not found`);
            }
            const deletedUsers = db.userData.splice(userIndex,1);
            db.postsData = db.postsData.filter((post)=>{
                const match = post.author === args.userID
                if(match){
                    db.commentData = db.commentData.filter((comment) => {
                        return comment.post !== post.id
                    })
                }
                return !match
            })

            db.commentData = db.commentData.filter((comment)=>{
                return comment.author !== args.userID
            })

            return deletedUsers[0]
        },
        deletePost(parent, args, {db}, info){
            const postIndex = db.postsData.findIndex((post) => {
                return post.id === args.postID;
            });
            if(postIndex === -1){
                throw new Error(`Post ${args.postID} not found`);
            }
            const deletedPosts= db.postsData.splice(postIndex,1);
            db.commentData = db.commentData.filter((comment)=>{
                return comment.post !== args.postID;
            })

            return deletedPosts[0];
        },
        deleteComment(parent, args, {db}, info){
            const commentIndex = db.commentData.findIndex((comment) => {
                return comment.id === args.commentID;
            });
            if(commentIndex === -1){
                throw new Error(`Comment ${args.commentID} not found`);
            }
            const deletedComments= db.commentData.splice(commentIndex,1);
            return deletedComments[0];
        }
    },
    Post: {
        author(parent, args, {db}, info){
            return db.userData.find((user) =>{ 
                return user.id === parent.author
            })
        },
        comments(parent, args, {db}, info){
            return db.commentData.filter((comment) =>{ 
                return comment.post === parent.id
            })
        },
    },
    User: {
        posts(parent, args, {db}, info){
            return db.postsData.filter((post) =>{ 
                return post.author === parent.id
            })
        },
        comments(parent, args, {db}, info){
            return db.commentData.filter((comment) =>{ 
                return comment.author === parent.id
            })
        },
    },
    Comment:{
        author(parent, args, {db}, info){
            return db.userData.find((user) =>{ 
                return user.id === parent.author
            })
        },
        post(parent, args, {db}, info){
            return db.postsData.find((post) =>{ 
                return post.id === parent.post
            })
        },
    }
}

const server = new GraphQLServer({
    typeDefs:'./src/schema.graphql', 
    resolvers,
    context: {
        db
    }
})
server.start(() => console.log('Server is running on localhost:4000'))