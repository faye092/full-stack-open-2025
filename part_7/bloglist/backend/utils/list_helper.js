const _ = require('lodash');

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return 0
    }
    const reducer = (total, blog) => {
        return total + blog.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return null
    }
    let maxBlog = blogs[0]
    for (let blog of blogs) {
        if (blog.likes > maxBlog.likes) {
            maxBlog = blog
        }
    }
    return {
        title: maxBlog.title,
        author: maxBlog.author,
        likes: maxBlog.likes
    }
}

// Corrected Lodash implementation of mostBlogs
const mostBlogs = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return null
    }
    const authorCounts = _.countBy(blogs, 'author')
    const topAuthor = _.maxBy(_.keys(authorCounts), o => authorCounts[o])

    return {
        author: topAuthor,
        blogs: authorCounts[topAuthor]
    }
}

// Corrected Lodash implementation of mostLikes
const mostLikes = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return null
    }

    const authorsTotalLikes = _.map(
        _.groupBy(blogs, 'author'),
        (authorBlogs, author) => ({
            author: author,
            likes: _.sumBy(authorBlogs, 'likes')
        })
    )
    return _.maxBy(authorsTotalLikes, 'likes')
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }

