import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { useMeetupsContext } from "./useMeetupsContext";

export const useLogout = () => {

    const navigate = useNavigate();

    const { dispatch } = useAuthContext();
    const { dispatch: meetupsDispatch } = useMeetupsContext();

    const logout = () => {
        localStorage.removeItem('user');

        dispatch({type: 'LOGOUT'});
        meetupsDispatch({type: 'SET_MEETUPS', payload: null});
        navigate("/login");
    }

    return {logout};

}