import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/extend-expect';
import { AuthContext } from "../../context/AuthContext";
import SearchPage from "../../pages/SearchPage/SearchPage";
import { BrowserRouter } from "react-router-dom";

const users = [
    {
        username: "testUser",
        picture: "https://www.tutorialspoint.com/assets/questions/media/426142-1668760872.png",
        test: true
    }
]

beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(users)
    })
});
    
afterEach(() => {
    jest.restoreAllMocks();
});

describe('Search Page', () => {
    test('Renders search input', async () => {
        const dispatch = jest.fn();
        const user = jest.fn();

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <SearchPage />
                </BrowserRouter>
            </AuthContext.Provider>
        );
        
        expect(await screen.findByPlaceholderText(/Search/i)).toBeInTheDocument();
    })

    test('Search feature works correctly displaying users based on input', async () => {
        const dispatch = jest.fn();
        const user = jest.fn();

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <SearchPage />
                </BrowserRouter>
            </AuthContext.Provider>
        );
        
        const searchInput = await screen.findByPlaceholderText(/Search/i);
        act(() => {
            userEvent.type(searchInput, "test");
        })

        expect(await screen.findByText(/testUser/i)).toBeInTheDocument();
        
    })
})