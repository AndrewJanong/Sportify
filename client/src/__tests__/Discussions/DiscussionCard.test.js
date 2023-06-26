import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import DiscussionsPage from "../../pages/DiscussionsPage/DiscussionsPage";
import { AuthContext } from "../../context/AuthContext";
import { DiscussionsContext } from "../../context/DiscussionContext";
import DiscussionCard from "../../components/DiscussionCard/DiscussionCard";
import { BrowserRouter } from "react-router-dom";
import { ShallowRenderer } from "react-dom/test-utils";

const discussion = {
    title: "Tennis Tuesday",
    sports: "Tennis",
    date: "2023-06-25T13:00",
    text: "It is Tennis Time everyone",
    likes: ["null", "mario", "mario2"],
    picture: "",
    creator: "mario",
    comments: [''],
}

const discussions = [
    {
        title: "Tennis Tuesday",
        sports: "Tennis",
        date: "2023-06-25T13:00",
        text: "It is Tennis time everyone",
        likes: ["null", "mario", "mario2"],
        picture: "test",
        creator: "mario",
        comments: [''],
        _id: "test",
        ok: true
    }
]


describe('Discussion Card', () => {
    test('Discussion card renders properly containing the discussion', () => {
        const dispatch = jest.fn();
        const user = jest.fn();
        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <DiscussionsContext.Provider value={{discussions, dispatch}}>
                    <BrowserRouter>
                        <DiscussionCard key={discussion._id} discussion={discussion} />
                    </BrowserRouter>
                </DiscussionsContext.Provider>
            </AuthContext.Provider>
        );

        expect(screen.getByText(/Tennis Tuesday/i)).toBeInTheDocument();
    })

    test('Likes button is clickable', () => {
        const dispatch = jest.fn();
        const user = jest.fn();
        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <DiscussionsContext.Provider value={{discussions, dispatch}}>
                    <BrowserRouter>
                        <DiscussionCard key={discussion._id} discussion={discussion}/>
                    </BrowserRouter>
                </DiscussionsContext.Provider>
            </AuthContext.Provider>
        );
        const likeButton = screen.getByTestId("likestest");
        fireEvent.click(likeButton);
    })
})