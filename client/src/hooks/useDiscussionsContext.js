import { DiscussionsContext } from "../context/DiscussionContext";
import { useContext } from "react";

export const useDiscussionsContext = () => {
    const context = useContext(DiscussionsContext);

    if (!context) {
        throw Error('useDiscussionsContext Error');
    }
    return context;
}