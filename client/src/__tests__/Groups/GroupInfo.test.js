import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/extend-expect';
import { AuthContext } from "../../context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import GroupInfoPage from "../../pages/GroupInfoPage/GroupInfoPage";
import Group from "../../pages/Group/Group";


const group = 
    {
        name: "group1",
        sports: "Basketball",
        members: [{
            username: 'ADJ0109',
            _id: 'ADJ0109'
        },
        {
            username: 'ADJ2357',
            _id: 'ADJ2357'
        }],
        captain: {
            username: 'ADJ0109',
            _id: 'ADJ0109'
        },
        test: true
    }

beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(group)
    })
});
    
afterEach(() => {
    jest.restoreAllMocks();
});

describe('GroupInfo Page', () => {
    test('GroupInfoPage renders correctly and displays group info', async () => {
        const dispatch = jest.fn();
        const user = {
            username: 'ADJ0109',
            userId: 'ADJ0109',
            test: true
        }

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <GroupInfoPage />
                </BrowserRouter>
            </AuthContext.Provider>
        );
        
        expect(await screen.findByText(/group1/i)).toBeInTheDocument();
        expect(await screen.findByText(/Sports: Basketball/i)).toBeInTheDocument();
        expect(await screen.findByText(/ADJ0109/i)).toBeInTheDocument();
        expect(await screen.findByText(/ADJ2357/i)).toBeInTheDocument();
    })

    test('All members except the captain can leave the group', async () => {
        const dispatch = jest.fn();
        const user = {
            username: 'ADJ2357',
            userId: 'ADJ2357',
            test: true
        }

        const mockCallback = jest.fn(() => '');

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <GroupInfoPage testCallback={mockCallback}/>
                </BrowserRouter>
            </AuthContext.Provider>
        );

        expect(await screen.findByText(/group1/i)).toBeInTheDocument();
        
        // Find the button element using its text content "Leave"
        const leaveButton = screen.getByTestId('leave-button');

        // Simulate a click event on the button
        fireEvent.click(leaveButton);

        // Assert that the mock function was called exactly once
        expect(mockCallback).toHaveBeenCalledTimes(1);

    })

    test('Only the captain of the group is able to edit and delete the group', async () => {
        const dispatch = jest.fn();
        const user = {
            username: 'ADJ0109',
            userId: 'ADJ0109',
            test: true
        }

        const mockCallback = jest.fn(() => '');

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <GroupInfoPage testCallback={mockCallback}/>
                </BrowserRouter>
            </AuthContext.Provider>
        );

        expect(await screen.findByText(/group1/i)).toBeInTheDocument();
        
        // Find the button element using its text content "Delete" and "Edit"
        const deleteButton = screen.getByTestId('delete-button');
        const editButton = screen.getByTestId('edit-button');

        // Simulate a click event on the button
        fireEvent.click(deleteButton);
        fireEvent.click(editButton);

        // Assert that the mock function was called exactly once
        expect(mockCallback).toHaveBeenCalledTimes(1);

    })

    test('Only the captain of the group is invite new members to the group', async () => {
        const dispatch = jest.fn();
        const user = {
            username: 'ADJ0109',
            userId: 'ADJ0109',
            test: true
        }

        const mockCallback = jest.fn(() => '');

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <GroupInfoPage testCallback={mockCallback}/>
                </BrowserRouter>
            </AuthContext.Provider>
        );

        expect(await screen.findByText(/group1/i)).toBeInTheDocument();
        
        // Find the button element using its text content "Add"
        const addButton = screen.getByTestId('add-button');

        // Simulate a click event on the button
        fireEvent.click(addButton);

        // Assert that the mock function was called exactly once
        expect(mockCallback).toHaveBeenCalledTimes(1);

    })

    test('Members are able to send messages in the group chat', async () => {
        const dispatch = jest.fn();
        const user = {
            username: 'ADJ0109',
            userId: 'ADJ0109',
            test: true
        }

        const mockCallback = jest.fn(() => '');

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <Group testCallback={mockCallback}/>
                </BrowserRouter>
            </AuthContext.Provider>
        );

        expect(await screen.findByText(/group1/i)).toBeInTheDocument();

        // Find the input to text the message
        const searchInput = screen.getByTestId('chat-input');
        act(() => {
            userEvent.type(searchInput, "test");
        })
        
        // Find the button element for sending a message
        const sendMessageButton = screen.getByTestId('send-message-button');

        // Simulate a click event on the button
        fireEvent.click(sendMessageButton);

        // Assert that the mock function was called exactly once
        expect(mockCallback).toHaveBeenCalledTimes(1);

    })

})