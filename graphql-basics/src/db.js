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
    },
    {
        id: uuidv4(),
        title: 'Yet another blog post!',
        body: ' This is the body of a blog post and its dummy data!',
        published: true,
        author: userData[2].id
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
    {       
        id: uuidv4(),
        text: 'We need to generate better data!',
        author: userData[0].id,
        post: postsData[3].id

    }
]
const db = {
    userData,
    postsData,
    commentData
}
export {db as default}