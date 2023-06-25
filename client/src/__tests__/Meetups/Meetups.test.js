import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import MeetupsPage from "../../pages/MeetupsPage/MeetupsPage";
import MeetupCard from "../../components/MeetupCard/MeetupCard";
import { AuthContext } from "../../context/AuthContext";
import { MeetupsContext } from "../../context/MeetupContext";
import { BrowserRouter } from "react-router-dom";

const meetups = [
    {
        title: "badminton tmr",
        sports: "Badminton",
        date: "2023-05-28T13:00",
        location: "PGPR",
        members: ["adj", "ad"],
        vacancy: 4,
        description: "test",
        _id: "test",
        ok: true
    }
]

beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(meetups)
    })
});
    
afterEach(() => {
    jest.restoreAllMocks();
});

describe('Meetups Page', () => {
    test('Fetch and display meetups', async () => {
        const dispatch = jest.fn();
        const user = jest.fn();
        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <MeetupsContext.Provider value={{meetups, dispatch}}>
                    <BrowserRouter>
                        <MeetupsPage />
                    </BrowserRouter>
                </MeetupsContext.Provider>
            </AuthContext.Provider>
        );

        expect(global.fetch).toHaveBeenCalled();
        expect(await screen.findByText(/badminton tmr/i)).toBeInTheDocument();
    })

    test('Filter by sports', async () => {
        const dispatch = jest.fn();
        const user = jest.fn();
        const { getByTestId, getAllByTestId } = render(
            <AuthContext.Provider value={{user, dispatch}}>
                <MeetupsContext.Provider value={{meetups, dispatch}}>
                    <BrowserRouter>
                        <MeetupsPage />
                    </BrowserRouter>
                </MeetupsContext.Provider>
            </AuthContext.Provider>
        );

        expect(await screen.findByText(/badminton tmr/i)).toBeInTheDocument();

        const dropdown = screen.getByTestId('select');
        expect(dropdown.value).toBe('Any');
        dropdown.click();
        fireEvent.change(dropdown, { target: { value: 'Basketball' } });
        expect(dropdown.value).toBe('Basketball');

        fireEvent.change(dropdown, { target: { value: 'Badminton' } });
        expect(dropdown.value).toBe('Badminton');
        expect(await screen.findByText(/badminton tmr/i)).toBeInTheDocument();
    })
})