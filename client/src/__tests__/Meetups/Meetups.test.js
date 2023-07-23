import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import MeetupsPage from "../../pages/MeetupsPage/MeetupsPage";
import { AuthContext } from "../../context/AuthContext";
import { MeetupsContext } from "../../context/MeetupContext";
import { BrowserRouter } from "react-router-dom";

// Dummy meetups
const meetups = [
    {
        title: "play tmr",
        sports: "Badminton",
        date: "2023-05-28T13:00",
        location: "PGPR",
        members: [{
            username: 'ADJ0109'
        }],
        vacancy: 4,
        description: "test",
        creator: {
            username: 'ADJ0109'
        }
    },
    {
        title: "again",
        sports: "Basketball",
        date: "2023-05-29T13:00",
        location: "PGPR",
        members: [{
            username: 'ADJ0109'
        }],
        vacancy: 4,
        description: "test",
        creator: {
            username: 'ADJ0109'
        }
    }
]


// Set mock output for fetch (fetching the meetups)
beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(meetups)
    })
});
    
afterEach(() => {
    jest.restoreAllMocks();
});

describe('Meetups Page', () => {
    
    // Test that users are able to see all meetups displayed in cards in the meetups page
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

        // Checking that meetups have been fetched and all are displayed 
        expect(global.fetch).toHaveBeenCalled();
        expect(await screen.findByText(/play tmr/i)).toBeInTheDocument();
        expect(await screen.findByText(/again/i)).toBeInTheDocument();
    })


    // Test that user can filter meetups by sports
    test('Filter by sports', async () => {
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

        // Checking that all meetups are originally displayed
        expect(await screen.findByText(/play tmr/i)).toBeInTheDocument();
        expect(await screen.findByText(/again/i)).toBeInTheDocument();

        const dropdown = screen.getByTestId('select-sport');
        expect(dropdown.value).toBe('Any');
        dropdown.click();

        // Filter by sports: Basketball
        fireEvent.change(dropdown, { target: { value: 'Basketball' } });
        expect(dropdown.value).toBe('Basketball');

        // Checking that only the meetups with sports basketball are displayed
        let firstMeetupNotFound = false;
        try {
            await screen.findByText(/play tmr/i);
        } catch (error) {
            firstMeetupNotFound = true;
        }
        expect(firstMeetupNotFound).toBe(true);
        expect(await screen.findByText(/again/i)).toBeInTheDocument();


        // Filter by sports: Badminton
        fireEvent.change(dropdown, { target: { value: 'Badminton' } });
        expect(dropdown.value).toBe('Badminton');

        // Checking that only the meetups with sports badminton are displayed
        expect(await screen.findByText(/play tmr/i)).toBeInTheDocument();
        let secondMeetupNotFound = false;
        try {
            await screen.findByText(/again/i);
        } catch (error) {
            secondMeetupNotFound = true;
        }
        expect(secondMeetupNotFound).toBe(true);
    })


    // Test that user can filter meetups by date
    test('Filter by meetup date', async () => {
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

        // Checking that all meetups are originally displayed
        expect(await screen.findByText(/play tmr/i)).toBeInTheDocument();
        expect(await screen.findByText(/again/i)).toBeInTheDocument();

        const dateInput = screen.getByTestId('input-date');

        // Filtering by given date
        const newDateValue = '2023-05-29';
        fireEvent.change(dateInput, { target: { value: newDateValue } });

        // Checking that only the meetups with the given date are displayed
        let firstMeetupNotFound = false;
        try {
            await screen.findByText(/play tmr/i);
        } catch (error) {
            firstMeetupNotFound = true;
        }
        expect(firstMeetupNotFound).toBe(true);
        expect(await screen.findByText(/again/i)).toBeInTheDocument();
    })
})