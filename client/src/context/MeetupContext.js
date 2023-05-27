import { createContext, useReducer } from "react";

export const MeetupsContext = createContext();

export const meetupsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_MEETUPS':
            return {
                meetups: action.payload
            }
        case 'CREATE_MEETUP':
            return {
                meetups: [action.payload, ...state.meetups]
            }
        case 'DELETE_MEETUP': 
            return {
                meetups: state.meetups.filter((meetup) => meetup._id !== action.payload._id)
            }
        default:
            return state;
    }
}

export const MeetupsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(meetupsReducer, {
        meetups: null
    })

    return (
        <MeetupsContext.Provider value={({...state, dispatch})}>
            { children }
        </MeetupsContext.Provider>
    )
}
  
