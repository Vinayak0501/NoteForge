import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({children}){

    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(localStorage.getItem('user'));

    function login(token, name){
        localStorage.setItem('token', token);
        localStorage.setItem('user', name);
        setToken(token);
        setUser(name);
    }

    function logout(){

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);

    }

    return(
        <AuthContext.Provider value = {{ token, user,login, logout}}>
            {children}
        </AuthContext.Provider>
    )
};

export function useAuth(){
    return useContext(AuthContext);
}