import { createContext, useReducer } from "react";

export const DiscussionsContext = createContext();

export const discussionsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_DISCUSSIONS':
            return {
                discussions: action.payload
            }
        case 'CREATE_DISCUSSION':
            return {
                discussions: [action.payload, ...state.discussions]
            }
        case 'DELETE_DISCUSSION': 
            return {
                discussions: state.discussions.filter((discussion) => discussion._id !== action.payload._id)
            }
        default:
            return state;
    }
}


// Context provider for all discussions
export const DiscussionsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(discussionsReducer, {
        discussions: null
    })

    return (
        <DiscussionsContext.Provider value={({...state, dispatch})}>
            { children }
        </DiscussionsContext.Provider>
    )
}
  