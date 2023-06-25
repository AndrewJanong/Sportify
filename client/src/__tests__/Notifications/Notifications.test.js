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
        target_user: "test1",
        sender: "test2",
        message: "test2 has accepted your friend request!",   
        test: true
    },
    {
        type: "friend-request",
        target_user: "test1",
        sender: "test2",
        message: "You got a friend request from test2",   
        test: true
    }
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
        const user = jest.fn();

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <NotificationCard notification={notifications[0]}/>
                </BrowserRouter>
            </AuthContext.Provider>
        );
        
        expect(await screen.findByText(/test2 has accepted your friend request!/i)).toBeInTheDocument();
        expect(await screen.findByText(/Got it/i)).toBeInTheDocument();
    })

    test('Notification Card of type request renders correctly', async () => {
        const dispatch = jest.fn();
        const user = jest.fn();

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <NotificationCard notification={notifications[1]}/>
                </BrowserRouter>
            </AuthContext.Provider>
        );
        
        expect(await screen.findByText(/You got a friend request from test2/i)).toBeInTheDocument();
        expect(await screen.findByText(/Accept/i)).toBeInTheDocument();
        expect(await screen.findByText(/Reject/i)).toBeInTheDocument();
    })

    test('Notification page renders correctly and displays the notfication cards', async () => {
        const dispatch = jest.fn();
        const user = jest.fn();

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <NotificationsPage />
                </BrowserRouter>
            </AuthContext.Provider>
        );
        
        expect(await screen.findByText(/Notifications/i)).toBeInTheDocument();

        expect(await screen.findByText(/test2 has accepted your friend request!/i)).toBeInTheDocument();
        expect(await screen.findByText(/Got it/i)).toBeInTheDocument();

        expect(await screen.findByText(/You got a friend request from test2/i)).toBeInTheDocument();
        expect(await screen.findByText("Accept")).toBeInTheDocument();
        expect(await screen.findByText("Reject")).toBeInTheDocument();
    })
})