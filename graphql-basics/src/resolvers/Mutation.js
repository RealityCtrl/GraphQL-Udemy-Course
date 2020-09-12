const { v4: uuidv4 } = require('uuid');

const Mutation = {
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
    updateUser(parent, args, {db}, info){
        const user = db.userData.find((user) => {
            return user.id === args.id;
        })
        if(!user){
            throw new Error(`User ${args.id} not found`);
        }
        if(args.data.email && typeof args.data.email === 'string'){
            const emailInUse = db.userData.some((emailUser) => {
                return (emailUser.email === args.data.email && user.id !== emailUser.id)
            })
            if(emailInUse){
                throw new Error(`Email ${args.id} already in use by another user`);
            }else{
                user.email = args.data.email
            }
        }

        if(args.data.name && typeof args.data.name === 'string'){
            user.name = args.data.name
        }

        if(args.data.age && typeof args.data.age === 'number'){
            user.age = args.data.age
        }
        return user;
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
    updatePost(parent, args, {db}, info){
        const post = db.postsData.find((post) => {
            return post.id === args.id;
        })
        if(!post){
            throw new Error(`Post ${args.id} not found`);
        }
        if(args.data.title && typeof args.data.title === 'string'){
            post.title = args.data.title
        }

        if(args.data.body && typeof args.data.body === 'string'){
            post.body = args.data.body
        }
        if(typeof args.data.published === 'boolean'){
            post.published = args.data.published
        }
        if(args.data.author && typeof args.data.author === 'string'){

            const userExists = db.userData.some((user) => {
                return user.id === args.data.author;
            })
            if(!userExists){
                throw new Error(`User ${args.data.author} not found`);
            }
            post.author = args.data.author
        }

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
    updateComment(parent, args, {db}, info){
        const comment = db.commentData.find((comment) => {
            return comment.id === args.id;
        })
        if(!comment){
            throw new Error(`Post ${args.id} not found`);
        }
        if(args.data.text && typeof args.data.text === 'string'){
            comment.text = args.data.text
        }
        if(args.data.author && typeof args.data.author === 'string'){

            const userExists = db.userData.some((user) => {
                return user.id === args.data.author;
            })
            if(!userExists){
                throw new Error(`User ${args.data.author} not found`);
            }
            comment.author = args.data.author
        }
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
}

export {Mutation as default}