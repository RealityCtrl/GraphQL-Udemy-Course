const Subscription = {
    comment: {
        subscribe(parent, {postID}, {db, pubSub}, info){
            const post = db.postsData.find((post) =>
                post.id === postID && post.published
            )
            if(!post){
                throw new Error(`Post not found for ${postID}`)
            }

            return pubSub.asyncIterator(`comment ${postID}`)
        }
    },
    post: {
        subscribe(parent, {postID}, {pubSub}, info){
            return pubSub.asyncIterator(`post`)
        }
    }
}

export {Subscription as default}