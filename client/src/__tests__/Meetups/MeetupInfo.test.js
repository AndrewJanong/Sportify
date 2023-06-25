import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import MeetupInfoPage from "../../pages/MeetupInfoPage/MeetupInfoPage";
import { AuthContext } from "../../context/AuthContext";
import { MeetupsContext } from "../../context/MeetupContext";
import { BrowserRouter, Router } from "react-router-dom";

const meetups = [
    {
        title: "badminton tmr",
        sports: "Badminton",
        date: "2023-05-28T13:00",
        location: "PGPR",
        members: ["adj", "ad"],
        vacancy: 4,
        description: "this is a badminton meetup for testing purposes only",
        _id: "testId",
        ok: true
    }
]

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useParams: () => ({meetupId: "testId"}),
    useRouteMatch: () => ({ url: '/meetups/testId' })
}));
    
afterEach(() => {
    jest.restoreAllMocks();
});

describe('Meetups Page', () => {
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

        expect(await screen.findByText(/this is a badminton meetup for testing purposes only/i)).toBeInTheDocument();
    })
})