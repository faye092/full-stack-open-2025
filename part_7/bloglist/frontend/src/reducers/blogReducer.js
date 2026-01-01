import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
    name:'blogs',
    initialState:[],
    reducers:{
        //set the blog list
        setBlogs(state, action){
            return action.payload
        },
        //add blogs
        appendBlog(state, action){
            state.push(action.payload)
        },
        //update blogs
        updateBlogState(state, action){
            const updatedBlog = action.payload
            return state.map(blog => 
                blog.id !== updatedBlog.id ? blog : updatedBlog
            )
        },
        //remove blogs, leave the blog of not equal id
        removeBlogState(state, action){
            const id = action.payload
            return state.filter(blog => blog.id !== id)
        }

    }
})

export const {setBlogs, appendBlog, updateBlogState, removeBlogState} = blogSlice.actions

//initialize
export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}

//create blog
export const createBlog = (content) => {
    return async dispatch => {
        const newBlog = await blogService.create(content)
        dispatch(appendBlog(newBlog))
    }
}

//add likes
export const likeBlog = (blog) => {
    return async dispatch => {
        const updatedBlog = {...blog, likes: blog.likes + 1}
        const returnedBlog = await blogService.update(blog.id, updatedBlog)
        dispatch(updateBlogState(returnedBlog))
    }
}

//remove blog
export const removeBlog = (id) => {
    return async dispatch => {
        await blogService.remove(id)
        dispatch(removeBlogState(id))
    }
}

export default blogSlice.reducer