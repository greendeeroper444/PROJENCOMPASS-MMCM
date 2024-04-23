import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios';

export const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthContextProvider({ children }) {

    const [darkMode, setDarkMode] = useState(() => {
       
        const storedDarkMode = localStorage.getItem('darkMode');
        return storedDarkMode ? JSON.parse(storedDarkMode) : false;
    });

    useEffect(() => {
        document.body.classList.toggle('dark-mode-body', darkMode);
    }, [darkMode]);

    const toggleMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);

        localStorage.setItem('darkMode', JSON.stringify(newMode));
    };



    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get('/profile');
                setUser(userResponse.data);
    
                const adminResponse = await axios.get('/admin/profile');
                setAdmin(adminResponse.data); 
                setIsLoading(false);
                
            } catch (error) {
                console.error('Error fetching profiles:', error);
                setIsLoading(false);
            }
        };
    
        fetchData();
    }, []);
    

    return (
        <AuthContext.Provider value={{  
            darkMode, 
            toggleMode, 
            user, 
            setUser, 
            admin, 
            setAdmin, 
            isLoading 
        }}>
            {isLoading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
}