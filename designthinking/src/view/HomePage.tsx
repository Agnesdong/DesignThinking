import * as React from "react";
import { pages } from "@microsoft/teams-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppRoutes } from "../utils/AppRoutes";
import { inTeams } from "../utils/inTeams";
import Button from '@mui/material/Button';
export const HomePage: React.FC = () => {

    const IN_TEAMS = inTeams();

    const [selectedRoute, setSelectedRoute] = useState<string | undefined>(undefined);
    const navigate = useNavigate();

    
    const onSelectedRouteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRoute(e.currentTarget.value);
    };

    
    const onNavigate = () => {
        if (!selectedRoute) return;
        navigate(`${selectedRoute}?inTeams=${IN_TEAMS}`);
    };

    
    useEffect(() => {
        if (!IN_TEAMS) return;

        pages.config.registerOnSaveHandler(function (saveEvent) {
            pages.config.setConfig({
                suggestedDisplayName: 'IBM Design ThinkingToolkit',
                contentUrl: `${window.location.origin}${selectedRoute}?inTeams=true`,
            });
            saveEvent.notifySuccess();
        });

        pages.config.setValidityState(!!selectedRoute);
    }, [selectedRoute]);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const handleClick = (itemName: string) => {
        if (['Assumptions and Questions', 'Feedback Grid'].includes(itemName)) {
            setSelectedItem(itemName);
            setSelectedRoute(AppRoutes.Assumption);
            localStorage.setItem('page', itemName);
        }
    };
    return (
        <div className="home">
            <a className="link" href="https://www.ibm.com/design/thinking/page/courses/Practitioner" target="_blank">
                IBM SkillsBuild - Design Thinking
            </a>
            <h1>{"IBM Design Thinking Toolkit"}</h1>
            <h1></h1>
            <div className="items">
            {[
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
            ].map(itemName => (
                <div 
                    key={itemName}
                    data-testid={itemName}
                    className={`item ${selectedItem === itemName ? 'selected' : ''}`}
                    onClick={() => handleClick(itemName)}
                >
                    {itemName}
                </div>
            ))}
        </div>
            {!IN_TEAMS && <Button size="large" style={{textAlign:'center',margin:'0 auto', display:'block'}} variant="contained" color="primary" onClick={onNavigate}>GO</Button>}

        </div>
    );
};

