import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/extend-expect';
import { AuthContext } from "../../context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import GroupInfoPage from "../../pages/GroupInfoPage/GroupInfoPage";


const group = 
    {
        name: "group1",
        sports: "Basketball",
        members: ["member1", "member2"],
        test: true
    }

beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(group)
    })
});
    
afterEach(() => {
    jest.restoreAllMocks();
});

describe('GroupInfo Page', () => {
    test('GroupInfoPage renders correctly and displays group info', async () => {
        const dispatch = jest.fn();
        const user = jest.fn();

        render(
            <AuthContext.Provider value={{user, dispatch}}>
                <BrowserRouter>
                    <GroupInfoPage />
                </BrowserRouter>
            </AuthContext.Provider>
        );
        
        expect(await screen.findByText(/group1/i)).toBeInTheDocument();
        expect(await screen.findByText(/Sports: Basketball/i)).toBeInTheDocument();
        expect(await screen.findByText(/member1/i)).toBeInTheDocument();
        expect(await screen.findByText(/member2/i)).toBeInTheDocument();
    })
})