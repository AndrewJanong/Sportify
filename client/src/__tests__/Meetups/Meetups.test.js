import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import MeetupsPage from "../../pages/MeetupsPage/MeetupsPage";
import { AuthContext } from "../../context/AuthContext";
import { MeetupsContext } from "../../context/MeetupContext";

global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve([
        {
            title: "badminton",
            sports: "Badminton",
            date: "2023-05-28T13:00",
            location: "PGPR",
            members: ["adj", "ad"],
            vacancy: 4,
            description: "test"
        }
    ])
}))

describe('Meetups', () => {
    test('Fetch and display meetups', () => {
        const dispatch = jest.fn();
        const {findByTestId, getAllByTestId} = render(
            <AuthContext.Provider value={{dispatch}}>
                <MeetupsContext.Provider value={{dispatch}}>
                    <MeetupsPage />
                </MeetupsContext.Provider>
            </AuthContext.Provider>
        );
    })
})

describe('Test Meetup Filter', () => {
    test('Filter works perfectly', async () => {
        const dispatch = jest.fn();
        const {findByTestId, getAllByTestId} = render(
            <AuthContext.Provider value={{dispatch}}>
                <MeetupsContext.Provider value={{dispatch}}>
                    <MeetupsPage />
                </MeetupsContext.Provider>
            </AuthContext.Provider>
        );
    
        fireEvent.change(await findByTestId('select'), { target: { value: 2 } });
        let options = getAllByTestId('select-option')
        expect(options[0].selected).toBeFalsy();
        expect(options[1].selected).toBeTruthy();
        expect(options[2].selected).toBeFalsy();
    })
})