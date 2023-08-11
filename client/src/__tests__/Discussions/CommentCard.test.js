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
import { useAuthContext } from "../../hooks/useAuthContext";
import CommentCard from "../../components/CommentCard/CommentCard";

const user = {
    "username": "marioalvaro",
    "email": "marioalvaro131@gmail.com",
    "friends": [],
    "token": "",
    "userId": "64a547d3f43172885fcdfc3f",
    "verified": true
};

const comments =[{
    text: "hi there!",
    replies: [''],
    creator: user
}, {
    text: "I am here!",
    replies: [''],
    creator: "64a547d3f43172885fcdfc3f"
}];

const reply = {
    text: "This is reply",
    replies: [''],
    creator: "64a547d3f43172885fcdfc3f"
};

const comment = {
    text: "hi there!",
    replies: [reply],
    creator: "64a547d3f43172885fcdfc3f"
};


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

const discussion = {
    title: "Tennis Tuesday",
    sports: "Tennis",
    date: "2023-06-25T13:00",
    text: "It is Tennis Time everyone",
    likes: ["null", "mario", "mario2"],
    picture: "",
    creator: "64a547d3f43172885fcdfc3f",
    comments: comments,
}

beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(comments)
    })
});
    
afterEach(() => {
    jest.restoreAllMocks();
});

describe('Reply', () => {
//reply button clickable
    test('Reply button is clickable', () => {
        const dispatch = jest.fn();
        const user = jest.fn();
        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <DiscussionsContext.Provider value={{discussions, dispatch}}>
                    <BrowserRouter>
                        <CommentCard key={comment._id} comment={comment}/>
                    </BrowserRouter>
                </DiscussionsContext.Provider>
            </AuthContext.Provider>
        );

        const replyButton = screen.getByTestId("replytest");
        fireEvent.click(replyButton);
    })

    test('Delete button is clickable', () => {
        const dispatch = jest.fn();
        const user = jest.fn();
        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <DiscussionsContext.Provider value={{discussions, dispatch}}>
                    <BrowserRouter>
                        <CommentCard key={comment._id} comment={comment}/>
                    </BrowserRouter>
                </DiscussionsContext.Provider>
            </AuthContext.Provider>
        );

        const deleteButton = screen.getByTestId("replydeletetest");
        fireEvent.click(deleteButton);
    })

    test('reply button shows form when clicked', () => {
        const dispatch = jest.fn();
        const user = jest.fn();
        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <DiscussionsContext.Provider value={{discussions, dispatch}}>
                    <BrowserRouter>
                        <CommentCard key={comment._id} comment={comment}/>
                    </BrowserRouter>
                </DiscussionsContext.Provider>
            </AuthContext.Provider>
        );

        const showButton = screen.getByTestId("replytest");
        fireEvent.click(showButton);

        expect(screen.getByTestId("replyform")).toBeInTheDocument();

    })

    test('Fetch and display reply', async () => {
        const dispatch = jest.fn();
        const user = jest.fn();
        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <DiscussionsContext.Provider value={{discussions, dispatch}}>
                    <BrowserRouter>
                        <CommentCard key={comment._id} comment={comment}/>
                    </BrowserRouter>
                </DiscussionsContext.Provider>
            </AuthContext.Provider>
        );

        expect(await screen.findByText(/This is reply/i)).toBeInTheDocument();

    })
});


// show reply button only exist when replies > 1

// when replied shown on screen?

