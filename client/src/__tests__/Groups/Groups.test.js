import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/extend-expect';
import { AuthContext } from "../../context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import GroupsPage from "../../pages/GroupsPage/GroupsPage";
import GroupCard from "../../pages/GroupsPage/GroupCard";


const groups = [
    {
        name: "group1",
        sports: "Basketball",
        members: ["member1", "member2"],
        test: true
    },
    {
        name: "group2",
        sports: "Badminton",
        members: ["member1", "member2"]
    }
]

beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(groups)
    })
});
    
afterEach(() => {
    jest.restoreAllMocks();
});

describe('Groups Page', () => {
    test('Group Card renders correctly', async () => {
        const dispatch = jest.fn();
        const user = jest.fn();

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <GroupCard group={groups[0]}/>
                </BrowserRouter>
            </AuthContext.Provider>
        );
        
        expect(await screen.findByText(/group1/i)).toBeInTheDocument();
        expect(await screen.findByText(/Basketball/i)).toBeInTheDocument();
    })

    test('Groups page renders correctly and displays the group cards', async () => {
        const dispatch = jest.fn();
        const user = jest.fn();

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <GroupsPage />
                </BrowserRouter>
            </AuthContext.Provider>
        );
        
        expect(await screen.findByText(/My Groups/i)).toBeInTheDocument();

        expect(await screen.findByText(/group1/i)).toBeInTheDocument();
        expect(await screen.findByText(/Basketball/i)).toBeInTheDocument();

        expect(await screen.findByText(/group2/i)).toBeInTheDocument();
        expect(await screen.findByText("Badminton")).toBeInTheDocument();
    })
})