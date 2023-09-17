//This segment of code is based on FluidExamples (see: https://github.com/microsoft/FluidExamples/tree/main/brainstorm)

import { initializeIcons, ThemeProvider } from "@fluentui/react";
import { AzureClient, AzureContainerServices } from "@fluidframework/azure-client";
import { ConnectionState, IFluidContainer } from "fluid-framework";
import React from "react";
import ReactDOM from "react-dom";
import { BrainstormView } from "./view/BrainstormView";
import "./view/index.css";
import "./view/App.css";
import { themeNameToTheme } from "./view/Themes";
import { connectionConfig, containerSchema } from "./Config";
import AppRenderer from "./AppRenderer";
import { insert, getHash } from './api'
export async function start() {
	initializeIcons();

	const getContainerId = (): { containerId: string; isNew: boolean } => {
		let isNew = false;
		if (location.hash.length === 0) {
			isNew = true;
		}
		const containerId = location.hash.substring(1);
		return { containerId, isNew };
	};

	const { containerId, isNew } = getContainerId();
	const client = new AzureClient(connectionConfig);

	let container: IFluidContainer;
	let services: AzureContainerServices;

	if (isNew) {
		({ container, services } = await client.createContainer(containerSchema));
		const containerId = await container.attach();
		localStorage.setItem('hash1', containerId)		
		{
			({ container, services } = await client.createContainer(containerSchema));
			const containerId = await container.attach();
			localStorage.setItem('hash2', containerId)
			
		}
		const hash1 = localStorage.getItem('hash1')
		const hash2 = localStorage.getItem('hash2')
		const page = localStorage.getItem('page')
		location.hash = (page === 'Feedback Grid'? hash2: hash1) || ''
	} else {
		({ container, services } = await client.getContainer(containerId, containerSchema));
	}

	if (container.connectionState !== ConnectionState.Connected) {
		await new Promise<void>((resolve) => {
			container.once("connected", () => {
				resolve();
			});
		});
	}

	ReactDOM.render(
		<React.StrictMode>
			<AppRenderer container={container} services={services} />
		</React.StrictMode>,
		document.getElementById("root"),
	);
}

start().catch((error) => console.error(error));
