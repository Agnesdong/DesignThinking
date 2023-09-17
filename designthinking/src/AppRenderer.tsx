import { useRef, useEffect, useState } from "react";
import { ThemeProvider } from "@fluentui/react";
import microsoftTeams, { app, Context } from "@microsoft/teams-js";
import { IFluidContainer } from "fluid-framework";
import { AzureContainerServices } from "@fluidframework/azure-client";
import { inTeams } from "./utils/inTeams";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppRoutes } from "./utils/AppRoutes.js";
import { BrainstormView } from "./view/BrainstormView";
import { themeNameToTheme } from "./view/Themes";
import { HomePage } from "./view/HomePage";
import { LiveCanvasPage } from './view/LiveCanvasPage'
import { insert, getHash } from './api'
interface AppRendererProps {
    container: IFluidContainer;
    services: AzureContainerServices;
}

const IN_TEAMS = inTeams();

const AppRenderer: React.FC<AppRendererProps> = ({ container, services }) => {
    const initializeStartedRef = useRef(false);
    const [initialized, setInitialized] = useState(false);
    const [meetingId, setMeetingId] = useState<string | null | undefined>(null);
    const [userDisplayName, setUserDisplayName] = useState<string | null | undefined>(localStorage.getItem('userPrincipalName') || '');

    useEffect(() => {
        if (initializeStartedRef.current || !IN_TEAMS) return;
        initializeStartedRef.current = true;

        const initialize = async () => {
            try {
                console.log("App.js: initializing client SDK initialized");
                await app.initialize();
                app.notifyAppLoaded();
                app.notifySuccess();

                // Use the new way of accessing the meetingId and userId
                const context: any = await app.getContext();
                /*...*/
                console.log(context.meeting.id)
                getHash(context.meeting.id).then((res) => {
                    const hash1 = res.data.hash1
                    const hash2 = res.data.hash2
                    const page = localStorage.getItem('page')
                    const hash = page === 'Assumptions and Questions' ? hash1 : hash2
                    if (location.hash === hash) {
                        return
                    }
                    localStorage.setItem('hash1', hash1)
                    localStorage.setItem('hash2', hash2)
                    location.hash = hash
                    // location.reload()
                }).catch(err => {
                    insert({ 
                        mId: String(context.meeting.id), 
                        hash1: localStorage.getItem('hash1') || '', 
                        hash2: localStorage.getItem('hash2') || ''
                    })
                })
                if (context.user.userPrincipalName) {
                    setUserDisplayName(context.user.userPrincipalName)
                    localStorage.setItem('userPrincipalName', context.user.userPrincipalName)
                }
                
                setInitialized(true);
            } catch (error) {
                console.error(error);
            }
        };

        console.log("App.js: initializing client SDK");
        initialize();
    }, []);

    const appReady = (IN_TEAMS && initialized) || !IN_TEAMS;

    return (
        <ThemeProvider theme={themeNameToTheme("default")}>
            {appReady && (
                <Router>
                    <Routes>
                        <Route
                            path={AppRoutes.default}
                            element={<HomePage />}
                        />
                        <Route
                            path={AppRoutes.Assumption}
                            element={<BrainstormView container={container} services={services} userDisplayName={userDisplayName} />}
                        />
                        <Route
                            path={'/canvas'}
                            element={<LiveCanvasPage />}
                        />

                    </Routes>
                </Router>)}
            {/* <BrainstormView container={container} services={services} /> */}
        </ThemeProvider>
    );
};

export default AppRenderer;