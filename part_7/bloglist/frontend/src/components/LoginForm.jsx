const LoginForm = ({handleSubmit, username, password, handleUsernameChange, handlePasswordChange}) => {
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    username
                    <input 
                        value={username}
                        onChange={handleUsernameChange}
                        name="username"
                    />
                </div>
                <div>
                    password
                    <input 
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        name="password"
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default LoginForm