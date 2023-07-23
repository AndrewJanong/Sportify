import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import MeetupInfoPage from "../../pages/MeetupInfoPage/MeetupInfoPage";
import { AuthContext } from "../../context/AuthContext";
import { MeetupsContext } from "../../context/MeetupContext";
import { BrowserRouter, Router } from "react-router-dom";

// Dummy meetups
const meetups = [
    {
        title: "play tmr",
        sports: "Badminton",
        date: "2023-05-28T13:00",
        location: "PGPR",
        members: [{
            username: 'ADJ0109',
            _id: 'bruh'
        },
        {
            username: 'ADJ2357',
            _id: '2357'
        }],
        vacancy: 4,
        description: "don't forget to bring your own racket",
        creator: {
            username: 'ADJ0109'
        },
        _id: "first"
    },
    {
        title: "again",
        sports: "Basketball",
        date: "2023-05-29T13:00",
        location: "PGPR",
        members: [{
            username: 'ADJ0109',
            _id: 'bruh'
        }],
        vacancy: 4,
        description: "test",
        creator: {
            username: 'ADJ0109'
        },
        _id: "second"
    }
]


// Mock functions 
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useParams: () => ({meetupId: "first"}),
    useRouteMatch: () => ({ url: '/meetups/first' })
}));
    
afterEach(() => {
    jest.restoreAllMocks();
});



describe('Meetups Page', () => {
    // Test that all information about the meetup is displayed in the MeetupInfoPage (title, members, description, etc.)
    test('Renders correctly and displays meetup info', async () => {
        
        const dispatch = jest.fn();
        const user = jest.fn();

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <MeetupsContext.Provider value={{meetups, dispatch}}>
                    <BrowserRouter history={history}>
                        <MeetupInfoPage />
                    </BrowserRouter>
                </MeetupsContext.Provider>
            </AuthContext.Provider>
        );


        // Checking that all expected information are displayed
        expect(screen.getByText(/play tmr/i)).toBeInTheDocument();
        expect(screen.getByText(/Badminton/i)).toBeInTheDocument();
        expect(screen.getByText(/PGPR/i)).toBeInTheDocument();
        expect(screen.getByText(/2023-05-28, 13:00/i)).toBeInTheDocument();
        expect(await screen.findByText(/don't forget to bring your own racket/i)).toBeInTheDocument();
        expect(screen.getByText(/ADJ0109/i)).toBeInTheDocument();
        expect(screen.getByText(/ADJ2357/i)).toBeInTheDocument();
    })


    // Test that users who are not in the meetup are able to join the meetup
    test('Users can join a meetup if not joined', async () => {
        
        const dispatch = jest.fn();
        const user = {
            username: 'ADJ',
            _id: 'adj',
            userId: 'adj'
        };

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <MeetupsContext.Provider value={{meetups, dispatch}}>
                    <BrowserRouter history={history}>
                        <MeetupInfoPage />
                    </BrowserRouter>
                </MeetupsContext.Provider>
            </AuthContext.Provider>
        );

        // Find the button element using its text content "Join"
        const joinButton = screen.getByText('Join');

        // Simulate a click event on the button
        fireEvent.click(joinButton);
    })


    // Test that users who are in the meetup, except the creator, are able to leave the meetup
    test('Users can leave a meetup if joined', async () => {
        
        const dispatch = jest.fn();
        const user = {
            username: 'ADJ2357',
            _id: '2357',
            userId: '2357'
        };

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <MeetupsContext.Provider value={{meetups, dispatch}}>
                    <BrowserRouter history={history}>
                        <MeetupInfoPage />
                    </BrowserRouter>
                </MeetupsContext.Provider>
            </AuthContext.Provider>
        );

        // Find the button element using its text content "Leave"
        const leaveButton = screen.getByText('Leave');

        // Simulate a click event on the button
        fireEvent.click(leaveButton);
    })


    // Test that the creator of the meetup is able to edit or delete the meetup
    test('Creator of a meetup can edit and delete', async () => {
        
        const dispatch = jest.fn();
        const user = {
            username: 'ADJ0109',
            _id: 'bruh',
            userId: 'bruh'
        };

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <MeetupsContext.Provider value={{meetups, dispatch}}>
                    <BrowserRouter history={history}>
                        <MeetupInfoPage />
                    </BrowserRouter>
                </MeetupsContext.Provider>
            </AuthContext.Provider>
        );

        // Find the button element using its text content "Edit" and "Delete"
        const editButton = screen.getByText('Edit');
        const deleteButton = screen.getByText('Delete');

        // Simulate a click event on the button
        fireEvent.click(editButton);
        fireEvent.click(deleteButton);
    })


    // Test that users who are in the meetup are able to open chat section
    test('Users can access chat section if joined', async () => {
        
        const dispatch = jest.fn();
        const user = {
            username: 'ADJ2357',
            _id: '2357',
            userId: '2357'
        };

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <MeetupsContext.Provider value={{meetups, dispatch}}>
                    <BrowserRouter history={history}>
                        <MeetupInfoPage />
                    </BrowserRouter>
                </MeetupsContext.Provider>
            </AuthContext.Provider>
        );

        // Checking that chat section is available
        expect(screen.getByText(/Chat/i)).toBeInTheDocument();
    })
})