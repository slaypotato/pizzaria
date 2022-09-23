import React, { useState, createContext, ReactNode, useEffect } from 'react';
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
    signOut: () => Promise<void>;
    loadingAuth: boolean;
    loading: boolean;
}

type AuthProviderProps = { 
    children: ReactNode,
}

type SignInProps = {
    email: string;
    password: string;
}

const emptyUser: UserProps = {
    id: '',
    name: '',
    email: '',
    token: '',
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>(emptyUser);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!user.name;

    useEffect(() => {
        async function getUser(){
            
            const userInfo = await AsyncStorage.getItem('@sujeitopizzaria');
            let hasUser: UserProps = JSON.parse(userInfo || '{}');
            if(Object.keys(hasUser).length > 0){
                api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`;
                setUser(hasUser);
            }
            setLoading(false);
        }
        getUser();
    }, [])
    

    async function signIn({email, password}: SignInProps){
        setLoadingAuth(true);
        try {
            const response = await api.post('/session', {
                email,
                password,
            });
            const { id, name, token } = response.data;

            setUser({
                id: id,
                name: name,
                email: email,
                token: token,
            });
            alert('response '+ name)
            await AsyncStorage.setItem('@sujeitopizzaria', JSON.stringify(response.data));
            // alert(await AsyncStorage.getItem('@sujeitopizzaria'))
            api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
            setLoadingAuth(false);

        } catch (err) {
            console.error('Erro ao acessar', err);
            setLoadingAuth(false)
        }
    }

    async function signOut() {
        await AsyncStorage.clear()
            .then(() => {
                setUser(emptyUser);
            })
    }

    return(
        <AuthContext.Provider value={{user, isAuthenticated, signIn, signOut, loading, loadingAuth}}>
            {children}
        </AuthContext.Provider>
    )
    
}