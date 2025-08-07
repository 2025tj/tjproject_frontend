const OAuth2LoginButton = () => {
    const socialProviders = ['google', 'kakao'];

    const handleSocialLogin = (provider) => {
        window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
    };

    return (
        <div>
            {socialProviders.map((provider) => (
                <button key={provider} onClick={() => handleSocialLogin(provider)}>
                    {provider} 로그인
                </button>
            ))}
        </div>
    )
}

export default OAuth2LoginButton