import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import MeetupsPage from "../../pages/MeetupsPage/MeetupsPage";
import { AuthContext } from "../../context/AuthContext";
import { MeetupsContext } from "../../context/MeetupContext";
import MeetupCard from "../../components/MeetupCard/MeetupCard";
import { BrowserRouter } from "react-router-dom";
import { ShallowRenderer } from "react-dom/test-utils";

const meetup = {
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
}

describe('Meetup Card', () => {
    test('Meetup card renders properly containing the meetup info', () => {
        render(
            <BrowserRouter>
                <MeetupCard meetup={meetup}/>
            </BrowserRouter>
        );

        expect(screen.getByText(/created by ADJ0109/i)).toBeInTheDocument();
        expect(screen.getByText(/play tmr/i)).toBeInTheDocument();
        expect(screen.getByText(/Badminton/i)).toBeInTheDocument();
        expect(screen.getByText(/PGPR/i)).toBeInTheDocument();
        expect(screen.getByText(/2023-05-28, 13:00/i)).toBeInTheDocument();
    })

    test('View button is clickable', () => {

        render(
            <BrowserRouter>
                <MeetupCard meetup={meetup}/>
            </BrowserRouter>
        );

        const viewButton = screen.getByText('View');
        fireEvent.click(viewButton);
    })
})