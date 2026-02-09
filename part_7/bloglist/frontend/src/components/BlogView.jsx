import { useDispatch } from "react-redux";
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { useNavigate } from "react-router-dom";

const BlogView = ({blog}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    if(!blog) return null

    const handleLike = () => {
        dispatch(likeBlog(blog))
    }

    const handleRemove = () => {
        if(window.confirm(`Remove blog ${blog.title}?`)){
            dispatch(removeBlog(blog))
            navigate('/')
        }
    }

    return (
        <div>
            <h2>{blog.title}{blog.author}</h2>
            <div><a href={blog.url}>{blog.url}</a></div>
            <div>
                {blog.likes} likes
                <button onClick={handleLike}>like</button>
            </div>

            <div>added by {blog.user ? blog.user.name : 'unknown'}</div>
            <button onClick={handleRemove}>remove</button>
        </div>
    )
}

export default BlogView