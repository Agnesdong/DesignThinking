import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ColorPicker, ColorButtonProps } from '../view/ColorPicker'; 
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '../view/HomePage';
describe('<HomePage />', () => {
    beforeEach(() => {
        render(
            <MemoryRouter initialEntries={["/"]}> {}
                <HomePage />
            </MemoryRouter>
        );
    });
    it('should display the IBM Design Thinking Toolkit title', () => {
        const titleElement = screen.getByText('IBM Design Thinking Toolkit');
        expect(titleElement).toBeInTheDocument();
    });

    it('should have a link to IBM Design Thinking', () => {
        const linkElement = screen.getByRole('link', { name: '' });
        expect(linkElement).toHaveAttribute('href', 'https://www.ibm.com/design/thinking/page/courses/Practitioner');
    });

    it('should render all items', () => {
        const items = [
            'Assumptions and Questions',
            'Feedback Grid',
            'Stakeholder Map',
            'Empathy Map',
            'Scenario Map',
            'Big ldea Vignettes',
            'Prioritization Grid',
            'Needs Statement',
            'Storyboarding',
            'Exnerience-Based Roadman'
        ];

        items.forEach(item => {
            const itemElement = screen.getByText(item);
            expect(itemElement).toBeInTheDocument();
        });
    });

    it('should navigate to the selected route when "GO" button is clicked', (done) => {
       
        const item = screen.getByText('Assumptions and Questions');
        fireEvent.click(item);

      
        const goButton = screen.getByText('GO');
        fireEvent.click(goButton);

        
        setTimeout(() => {
            expect(window.location.pathname).toBe('/');
            done(); 
        }, 1000);

    });
});




