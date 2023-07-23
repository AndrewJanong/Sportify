import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/extend-expect';
import { AuthContext } from "../../context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import NotificationsPage from "../../pages/NotificationsPage/NotificationsPage";
import NotificationCard from "../../pages/NotificationsPage/NotificationCard";


const notifications = [
    {
        type: "message",
        target_user: {
            username: 'ADJ0109',
            _id: 'ADJ0109'
        },
        sender: {
            username: 'ADJ',
            _id: 'ADJ'
        },
        message: "ADJ has accepted your friend request!",   
        test: true
    },
    {
        type: "friend-request",
        target_user: {
            username: 'ADJ0109',
            _id: 'ADJ0109'
        },
        sender: {
            username: 'ADJ',
            _id: 'ADJ'
        },
        message: "You got a friend request from ADJ",   
        test: true
    },
    {
        type: "group-request",
        target_user: {
            username: 'ADJ0109',
            _id: 'ADJ0109'
        },
        sender: {
            name: 'ADJgroup',
            _id: 'ADJgroup'
        },
        message: "You have been invited to join ADJgroup",   
        test: true
    },
]

beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(notifications)
    })
});
    
afterEach(() => {
    jest.restoreAllMocks();
});

describe('Notifications Page', () => {

    test('Notification Card of type message renders correctly', async () => {
        const dispatch = jest.fn();
        const user = {
            username: 'ADJ0109',
            userId: 'ADJ0109'
        }

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <NotificationCard notification={notifications[0]}/>
                </BrowserRouter>
            </AuthContext.Provider>
        );
        
        expect(await screen.findByText(/ADJ has accepted your friend request!/i)).toBeInTheDocument();
        expect(await screen.findByText("Got it")).toBeInTheDocument();
    })


    test('Notification Card of type friend-request renders correctly', async () => {
        const dispatch = jest.fn();
        const user = {
            username: 'ADJ0109',
            userId: 'ADJ0109'
        }

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <NotificationCard notification={notifications[1]}/>
                </BrowserRouter>
            </AuthContext.Provider>
        );
        
        expect(await screen.findByText(/You got a friend request from ADJ/i)).toBeInTheDocument();
        expect(await screen.findByText("Accept")).toBeInTheDocument();
        expect(await screen.findByText("Reject")).toBeInTheDocument();
    })

    test('User can accept a friend request', async () => {
        const dispatch = jest.fn();
        const user = {
            username: 'ADJ0109',
            userId: 'ADJ0109'
        }

        const mockCallback = jest.fn(() => '');

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <NotificationCard notification={notifications[1]} testCallback={mockCallback}/>
                </BrowserRouter>
            </AuthContext.Provider>
        );
        
        expect(await screen.findByText(/You got a friend request from ADJ/i)).toBeInTheDocument();
        expect(await screen.findByText("Accept")).toBeInTheDocument();
        expect(await screen.findByText("Reject")).toBeInTheDocument();

        // Find the button element using its text content "Accept"
        const acceptButton = screen.getByText('Accept');

        // Simulate a click event on the button
        fireEvent.click(acceptButton);

        // Assert that the mock function was called exactly once
        expect(mockCallback).toHaveBeenCalledTimes(1);
    })

    test('User can reject a friend request', async () => {
        const dispatch = jest.fn();
        const user = {
            username: 'ADJ0109',
            userId: 'ADJ0109'
        }

        const mockCallback = jest.fn(() => '');

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <NotificationCard notification={notifications[1]} testCallback={mockCallback}/>
                </BrowserRouter>
            </AuthContext.Provider>
        );
        
        expect(await screen.findByText(/You got a friend request from ADJ/i)).toBeInTheDocument();
        expect(await screen.findByText("Accept")).toBeInTheDocument();
        expect(await screen.findByText("Reject")).toBeInTheDocument();

        // Find the button element using its text content "Reject"
        const rejectButton = screen.getByText('Reject');

        // Simulate a click event on the button
        fireEvent.click(rejectButton);

        // Assert that the mock function was called exactly once
        expect(mockCallback).toHaveBeenCalledTimes(1);
    })

    test('Notification Card of type group-request renders correctly', async () => {
        const dispatch = jest.fn();
        const user = {
            username: 'ADJ0109',
            userId: 'ADJ0109'
        }

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <NotificationCard notification={notifications[2]}/>
                </BrowserRouter>
            </AuthContext.Provider>
        );
        
        expect(await screen.findByText(/You have been invited to join ADJgroup/i)).toBeInTheDocument();
        expect(await screen.findByText("Accept")).toBeInTheDocument();
        expect(await screen.findByText("Reject")).toBeInTheDocument();
    })


    test('User can accept a group request', async () => {
        const dispatch = jest.fn();
        const user = {
            username: 'ADJ0109',
            userId: 'ADJ0109'
        }

        const mockCallback = jest.fn(() => '');

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <NotificationCard notification={notifications[2]} testCallback={mockCallback}/>
                </BrowserRouter>
            </AuthContext.Provider>
        );
        
        expect(await screen.findByText(/You have been invited to join ADJgroup/i)).toBeInTheDocument();
        expect(await screen.findByText("Accept")).toBeInTheDocument();
        expect(await screen.findByText("Reject")).toBeInTheDocument();

        // Find the button element using its text content "Accept"
        const acceptButton = screen.getByText('Accept');

        // Simulate a click event on the button
        fireEvent.click(acceptButton);

        // Assert that the mock function was called exactly once
        expect(mockCallback).toHaveBeenCalledTimes(1);
    })

    test('User can reject a group request', async () => {
        const dispatch = jest.fn();
        const user = {
            username: 'ADJ0109',
            userId: 'ADJ0109'
        }

        const mockCallback = jest.fn(() => '');

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <NotificationCard notification={notifications[2]} testCallback={mockCallback}/>
                </BrowserRouter>
            </AuthContext.Provider>
        );
        
        expect(await screen.findByText(/You have been invited to join ADJgroup/i)).toBeInTheDocument();
        expect(await screen.findByText("Accept")).toBeInTheDocument();
        expect(await screen.findByText("Reject")).toBeInTheDocument();

        // Find the button element using its text content "Reject"
        const rejectButton = screen.getByText('Reject');

        // Simulate a click event on the button
        fireEvent.click(rejectButton);

        // Assert that the mock function was called exactly once
        expect(mockCallback).toHaveBeenCalledTimes(1);
    })


    test('Notifications page renders correctly and displays the notfication cards', async () => {
        const dispatch = jest.fn();
        const user = {
            username: 'ADJ0109',
            userId: 'ADJ0109',
            test: true
        }

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <NotificationsPage />
                </BrowserRouter>
            </AuthContext.Provider>
        );
        
        expect(await screen.findByText(/Notifications/i)).toBeInTheDocument();

        expect(await screen.findByText(/ADJ has accepted your friend request!/i)).toBeInTheDocument();
        expect(await screen.findByText("Got it")).toBeInTheDocument();  

        expect(await screen.findByText(/You got a friend request from ADJ/i)).toBeInTheDocument();

        expect(await screen.findByText(/You have been invited to join ADJgroup/i)).toBeInTheDocument();
    })


})