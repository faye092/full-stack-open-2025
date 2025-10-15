import { useState } from 'react'

const BlogForm = ( {createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }

    const handleAuthorChange = (event) => {
        setAuthor(event.target.value)
    }

    const handleUrlChange = (event) => {
        setUrl(event.target.value)
    }

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: title,
            author: author,
            url: url,
        })

        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <h2>Create a new blog</h2>

            <form onSubmit={addBlog}>
                <div>
                    title:
                    <input 
                      type='text'
                      value={title}
                      name='Title'
                      onChange={handleTitleChange} 
                      placeholder='write title here'
                      id='title'
                    />
                </div>

                <div>
                    author:
                    <input 
                      type="text" 
                      value={author}
                      name='author'
                      onChange={handleAuthorChange}
                      placeholder='write author here'
                      id='author'
                    />
                </div>

                <div>
                    url:
                    <input 
                      type="text" 
                      value={url}
                      name='url'
                      onChange={handleUrlChange}
                      placeholder='write url here'
                      id='url'
                    />
                </div>
                <button type="submit" id= 'create-button'>create</button>
            </form>
        </div>
    )
} 

export default BlogForm