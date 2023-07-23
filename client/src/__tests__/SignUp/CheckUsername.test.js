import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import SignupPage from "../../pages/SignupPage/SignupPage";
import { AuthContext } from "../../context/AuthContext";

// Testing username
describe('Test Username', () => {
    test('Empty username is invalid', async () => {
        const dispatch = jest.fn();
        render(
            <AuthContext.Provider value={{dispatch}}>
                <MemoryRouter>
                    <SignupPage />
                </MemoryRouter>
            </AuthContext.Provider>
        );
    
        expect(await screen.findByRole('button', { name: /sign up/i})).toBeDisabled();
    })

    test('Username longer than 12 characters is invalid', async () => {
        const dispatch = jest.fn();
        render(
            <AuthContext.Provider value={{dispatch}}>
                <MemoryRouter>
                    <SignupPage />
                </MemoryRouter>
            </AuthContext.Provider>
        );

        act(() => {
            const usernameInput = screen.getByPlaceholderText(/username/i);
            userEvent.type(usernameInput, "ilovemathematics");
        })
    
        expect(screen.getByText('username can only be up to 12 characters')).toBeInTheDocument();
    })

    test('Username with non-alphanumeric characters is invalid', async () => {
        const dispatch = jest.fn();
        render(
            <AuthContext.Provider value={{dispatch}}>
                <MemoryRouter>
                    <SignupPage />
                </MemoryRouter>
            </AuthContext.Provider>
        );

        act(() => {
            const usernameInput = screen.getByPlaceholderText(/username/i);
            userEvent.type(usernameInput, "#cool");
        })
    
        expect(screen.getByText('username must be alphanumeric')).toBeInTheDocument();
    })

    test('andrewjanong is a valid username' , async () => {
        const dispatch = jest.fn();
        render(
            <AuthContext.Provider value={{dispatch}}>
                <MemoryRouter>
                    <SignupPage />
                </MemoryRouter>
            </AuthContext.Provider>
        );

        act(() => {
            const usernameInput = screen.getByPlaceholderText(/username/i);
            const emailInput = screen.getByPlaceholderText(/email/i);
            const passwordInput = screen.getByPlaceholderText(/password/i);
            userEvent.type(usernameInput, "andrewjanong");
            userEvent.type(emailInput, "messi@gmail.com");
            userEvent.type(passwordInput, "Messi123$");
        })
    
        expect(await screen.findByRole('button', { name: /sign up/i})).toBeEnabled();
    })

    test('Username ADJ0109 is already taken' , async () => {
        const dispatch = jest.fn();
        render(
            <AuthContext.Provider value={{dispatch}}>
                <MemoryRouter>
                    <SignupPage />
                </MemoryRouter>
            </AuthContext.Provider>
        );

        act(() => {
            const signupButton = screen.getByRole('button', { name: /sign up/i});
            const usernameInput = screen.getByPlaceholderText(/username/i);
            const emailInput = screen.getByPlaceholderText(/email/i);
            const passwordInput = screen.getByPlaceholderText(/password/i);
            userEvent.type(usernameInput, "ADJ0109");
            userEvent.type(emailInput, "messi@gmail.com");
            userEvent.type(passwordInput, "Messi123$");
            fireEvent.click(signupButton);
        })
    
        expect(await screen.findByText('Username is already in use')).toBeInTheDocument();
    })
})