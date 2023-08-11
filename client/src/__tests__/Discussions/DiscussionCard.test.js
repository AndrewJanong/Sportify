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

const discussion = {
    title: "Tennis Tuesday",
    sports: "Tennis",
    date: "2023-06-25T13:00",
    text: "It is Tennis Time everyone",
    likes: ["null", "mario", "mario2"],
    picture: "",
    creator: "64a547d3f43172885fcdfc3f",
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
        creator: "64a547d3f43172885fcdfc3f",
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
        expect(screen.getByText(/It is Tennis time everyone/i)).toBeInTheDocument();
        
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

    //delete button clickable for user
    test('Delete button is clickable', () => {
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
        const deleteButton = screen.getByTestId("deletetest");
        fireEvent.click(deleteButton);
    })


})


const comments =[{
    text: "hi there!",
    replies: [''],
    creator: user
}, {
    text: "I am here!",
    replies: [''],
    creator: "64a547d3f43172885fcdfc3f"
}];

const comment = {
    text: "hi there!",
    replies: [''],
    creator: "64a547d3f43172885fcdfc3f"
};

const discussion2 = {
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

describe('Comment', () => {
//comment button clickable
    test('Comment button is clickable', () => {
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
    const commentButton = screen.getByTestId("commenttest");
    fireEvent.click(commentButton);
})


//show more/less button is clickable
test('Show more button is clickable', () => {
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
    const showButton = screen.getByTestId("showtest");
    fireEvent.click(showButton);
})

    test('Fetch and display comment', async () => {
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

        expect(await screen.findByText(/hi there!/i)).toBeInTheDocument();
    });

    test('More comments shown after clicking show more', async () => {
        const dispatch = jest.fn();
        const user = jest.fn();
        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <DiscussionsContext.Provider value={{discussions, dispatch}}>
                    <BrowserRouter>
                        <DiscussionCard key={discussion2._id} discussion={discussion2}/>
                    </BrowserRouter>
                </DiscussionsContext.Provider>
            </AuthContext.Provider>
        );

        const showButton = screen.getByTestId("showtest");
        fireEvent.click(showButton);

        expect(await screen.findByText(/hi there!/i)).toBeInTheDocument();
        expect(await screen.findByText(/I am here!/i)).toBeInTheDocument();
        
    });

});