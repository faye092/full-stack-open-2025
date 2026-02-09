import { Link } from 'react-router-dom'

const Menu = ({ user, handleLogout }) => {
    const padding = { 
        padding:5
    }

    return (
        <div style={{background:'lightgray', padding:5, marginBottom: 20}}>
            <Link style={padding} to="/">blogs</Link>
            <Link style={padding} to="/users">users</Link>

            <span style={padding}>
                {user.name} logged in
                <button onClick={handleLogout}>logout</button>
            </span>
        </div>
    )
}

export default Menu