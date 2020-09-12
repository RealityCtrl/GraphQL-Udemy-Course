const { v4: uuidv4 } = require('uuid');

const Query = {
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
}
export {Query as default}