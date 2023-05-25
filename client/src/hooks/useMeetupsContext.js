import { MeetupsContext } from "../context/MeetupContext";
import { useContext } from "react";

export const useMeetupsContext = () => {
    const context = useContext(MeetupsContext);

    if (!context) {
        throw Error('useMeetupContext Error');
    }

    return context;
}