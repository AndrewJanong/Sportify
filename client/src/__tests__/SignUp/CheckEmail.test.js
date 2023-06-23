import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import SignupPage from "../../pages/SignupPage/SignupPage";
import { AuthContext } from "../../context/AuthContext";

describe('Test Email', () => {
    test('Empty email is invalid', async () => {
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

    test("String without '@' is an invalid email", async () => {
        const dispatch = jest.fn();
        render(
            <AuthContext.Provider value={{dispatch}}>
                <MemoryRouter>
                    <SignupPage />
                </MemoryRouter>
            </AuthContext.Provider>
        );

        act(() => {
            const emailInput = screen.getByPlaceholderText(/email/i);
            userEvent.type(emailInput, "andrewjanong.gmail.com");
        })
    
        expect(screen.getByText('please enter a valid email')).toBeInTheDocument();
    })

    test("String with more than one '@' is an invalid email", async () => {
        const dispatch = jest.fn();
        render(
            <AuthContext.Provider value={{dispatch}}>
                <MemoryRouter>
                    <SignupPage />
                </MemoryRouter>
            </AuthContext.Provider>
        );

        act(() => {
            const emailInput = screen.getByPlaceholderText(/email/i);
            userEvent.type(emailInput, "andrewjanong@@gmail.com");
        })
    
        expect(screen.getByText('please enter a valid email')).toBeInTheDocument();
    })

    test("String without '.' after '@' is an invalid email", async () => {
        const dispatch = jest.fn();
        render(
            <AuthContext.Provider value={{dispatch}}>
                <MemoryRouter>
                    <SignupPage />
                </MemoryRouter>
            </AuthContext.Provider>
        );

        act(() => {
            const emailInput = screen.getByPlaceholderText(/email/i);
            userEvent.type(emailInput, "andrewjanong@gmailcom");
        })
    
        expect(screen.getByText('please enter a valid email')).toBeInTheDocument();
    })

    test('messi@gmail.com is a valid email' , async () => {
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
            userEvent.type(usernameInput, "MessiTheGOAT");
            userEvent.type(emailInput, "messi@gmail.com");
            userEvent.type(passwordInput, "Messi123$");
        })
    
        expect(await screen.findByRole('button', { name: /sign up/i})).toBeEnabled();
    })

    test('Email dummy1@gmail.com is already taken' , async () => {
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
            userEvent.type(usernameInput, "mario");
            userEvent.type(emailInput, "dummy1@gmail.com");
            userEvent.type(passwordInput, "Messi123$");
            fireEvent.click(signupButton);
        })
    
        expect(await screen.findByText('Email is already in use')).toBeInTheDocument();
    })
})
