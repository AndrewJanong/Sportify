import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import DiscussionsPage from "../../pages/DiscussionsPage/DiscussionsPage";
import DiscussionCard from "../../components/DiscussionCard/DiscussionCard";
import { AuthContext } from "../../context/AuthContext";
import { DiscussionsContext } from "../../context/DiscussionContext";
import { BrowserRouter } from "react-router-dom";

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

beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(discussions)
    })
});
    
afterEach(() => {
    jest.restoreAllMocks();
});

describe('Discussions Page', () => {
    test('Fetch and display discussions', async () => {
        const dispatch = jest.fn();
        const user = jest.fn();
        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <DiscussionsContext.Provider value={{discussions, dispatch}}>
                    <BrowserRouter>
                        <DiscussionsPage />
                    </BrowserRouter>
                </DiscussionsContext.Provider>
            </AuthContext.Provider>
        );

        expect(global.fetch).toHaveBeenCalled();
        expect(await screen.findByText(/Tennis Tuesday/i)).toBeInTheDocument();
    })

    test('Filter by sports', async () => {
        const dispatch = jest.fn();
        const user = jest.fn();
        const { getByTestId, getAllByTestId } = render(
            <AuthContext.Provider value={{user, dispatch}}>
                <DiscussionsContext.Provider value={{discussions, dispatch}}>
                    <BrowserRouter>
                        <DiscussionsPage />
                    </BrowserRouter>
                </DiscussionsContext.Provider>
            </AuthContext.Provider>
        );

        expect(await screen.findByText(/Tennis Tuesday/i)).toBeInTheDocument();

        const dropdown = screen.getByTestId('select2');
        expect(dropdown.value).toBe('Any');
        dropdown.click();
        fireEvent.change(dropdown, { target: { value: 'Basketball' } });
        expect(dropdown.value).toBe('Basketball');

        fireEvent.change(dropdown, { target: { value: 'Tennis' } });
        expect(dropdown.value).toBe('Tennis');
        expect(await screen.findByText(/Tennis Tuesday/i)).toBeInTheDocument();
    })

    //delete a discussion

    
})