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
    createPost(parent, {data}, {db, pubSub}, info){
        const userExists = db.userData.some((user) => {
            return user.id === data.author;
        })
        if(!userExists){
            throw new Error(`User ${data.author} not found`);
        }

        const post = {
            id: uuidv4(),
            ...data
        };
        db.postsData.push(post);
        if(post.published){
            pubSub.publish(`post`, {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        }
        return post;
    },
    createComment(parent, {data}, {db, pubSub}, info){

        const userExists = db.userData.some((user) => {
            return user.id === data.author;
        })
        if(!userExists){
            throw new Error(`User ${data.author} not found`);
        }
        const postExists = db.postsData.some((post)=>{
            return post.id === data.post;
        })
        if(!postExists){
            throw new Error(`Post ${data.post} not found`);
        }
        const comment = {
            id: uuidv4(),
            ...data
        };
        db.commentData.push(comment);
        pubSub.publish(`comment ${data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })
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
    updatePost(parent, {id, data}, {db, pubSub}, info){
        const post = db.postsData.find((post) => {
            return post.id === id;
        })
        if(!post){
            throw new Error(`Post ${id} not found`);
        }
        if(data.title && typeof data.title === 'string'){
            post.title = data.title
        }

        if(data.body && typeof data.body === 'string'){
            post.body = data.body
        }
        if(data.author && typeof data.author === 'string'){

            const userExists = db.userData.some((user) => {
                return user.id === data.author;
            })
            if(!userExists){
                throw new Error(`User ${data.author} not found`);
            }
            post.author = data.author
        }
        let event = "UPDATED";
        if(typeof data.published === 'boolean'){
            if(data.published && !post.published){
                event = 'CREATED';
            }else if(!data.published && post.published){
                event = 'DELETED';
            }else if(!data.published && !post.published){
                event = ''
            }
            post.published = data.published
        }else if(!post.published){
            event = ''
        }
        if(event){
            pubSub.publish(`post`, {
                post: {
                    mutation: event,
                    data: post
                }
            })
        }

        return post;
    },
    updateComment(parent, {id, data}, {db, pubSub}, info){
        const comment = db.commentData.find((comment) => {
            return comment.id === id;
        })
        if(!comment){
            throw new Error(`Post ${id} not found`);
        }
        if(data.text && typeof data.text === 'string'){
            comment.text = data.text
        }
        if(data.author && typeof data.author === 'string'){

            const userExists = db.userData.some((user) => {
                return user.id === data.author;
            })
            if(!userExists){
                throw new Error(`User ${data.author} not found`);
            }
            comment.author = data.author
        }
        pubSub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })
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
    deletePost(parent, {postID}, {db,pubSub}, info){
        const postIndex = db.postsData.findIndex((post) => {
            return post.id === postID;
        });
        if(postIndex === -1){
            throw new Error(`Post ${postID} not found`);
        }
        const [deletedPost]= db.postsData.splice(postIndex,1);
        db.commentData = db.commentData.filter((comment)=>{
            return comment.post !== postID;
        })
        if(deletedPost.published){
            pubSub.publish(`post`, {
                post: {
                    mutation: 'DELETED',
                    data: deletedPost
                }
            })
        }
        return deletedPost;
    },
    deleteComment(parent, {commentID}, {db, pubSub}, info){
        const commentIndex = db.commentData.findIndex((comment) => {
            return comment.id === commentID;
        });
        if(commentIndex === -1){
            throw new Error(`Comment ${commentID} not found`);
        }
        const [deletedComment]= db.commentData.splice(commentIndex,1);
        pubSub.publish(`comment ${deletedComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deletedComment
            }
        })
        return deletedComment;
    }
}

export {Mutation as default}