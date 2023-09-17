//This segment of code is based on FluidExamples (see: https://github.com/microsoft/FluidExamples/tree/main/brainstorm)
import React from "react";
import { Text } from "@fluentui/react";
import { AzureMember } from "@fluidframework/azure-client";
import { NoteData } from "../Types";

export type NoteFooterProps = { currentUser: AzureMember } & Pick<NoteData, "lastEdited">;


const delay = 2000;

export function NoteFooter(props: NoteFooterProps) {
	const { currentUser, lastEdited } = props;
	let lastEditedMemberName;

	
	if (Date.now() - lastEdited.time >= delay) {
		
		lastEditedMemberName =
			currentUser?.userName === lastEdited.userName ? "you" : lastEdited.userName;
	} else {
		
		lastEditedMemberName = "...";
	}
	return (
		<div style={{ flex: 1 }}>
			<Text
				block={true}
				nowrap={true}
				variant={"medium"}
				styles={{
					root: { alignSelf: "center", marginLeft: 7 },
				}}
			>
				Last edited by {lastEditedMemberName}
				
			</Text>

			
		</div>
	);
}
