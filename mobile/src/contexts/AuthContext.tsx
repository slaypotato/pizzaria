import React, { useState, createContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

type UserProps = {
    id: string;
    name: string;
    email: string;
    token: string;
}

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
}

type AuthProviderProps = { 
    children: ReactNode,
}

type SignInProps = {
    email: string;
    password: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
    const[user, setUser] = useState<UserProps>({
        id: '',
        name: '',
        email: '',
        token: '',
    });
    const [loadingAuth, setLoadingAuth] = useState(false);
    const isAuthenticated = !!user.name;

    async function signIn({email, password}: SignInProps){
        setLoadingAuth(true);
        try {
            const response = await api.post('/session', {
                email,
                password,
            });

            setUser(response.data);

            await AsyncStorage.setItem('@sujeitopizzaria', JSON.stringify(user));

            api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
            setLoadingAuth(false);

        } catch (err) {
            console.error('Erro ao acessar', err);
            setLoadingAuth(false)
        }
    }

    return(
        <AuthContext.Provider value={{user, isAuthenticated, signIn}}>
            {children}
        </AuthContext.Provider>
    )
    
}