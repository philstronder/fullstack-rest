const checkAuthentication = () => {
    if (localStorage.getItem(TOKEN_KEY) !== null) {
        const token = localStorage.getItem(TOKEN_KEY);

        //check on API if token is valid

        return true;
    }

    return false;
}

export const TOKEN_KEY = '@fullstack-Token';
export const isAuthenticated = checkAuthentication(); 
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const login = token => {
    localStorage.setItem(TOKEN_KEY, token);
};
export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
};