import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload };
        case 'LOGOUT':
            return { user: null };
        case 'EDIT':
            return { user: {...state.user, ...action.payload}};
        default:
            return state;
    }
}


// Context provider for user info to help authentication
export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    
    // Gets the user value in the local storage and change the state
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            dispatch({type: 'LOGIN', payload: user});
        }
    }, [])

    return (
        <AuthContext.Provider value={({...state, dispatch})}>
            { children }
        </AuthContext.Provider>
    )
}