//This segment of code is based on FluidExamples (see: https://github.com/microsoft/FluidExamples/tree/main/brainstorm)
import React from "react";
import { TextField } from "@fluentui/react";
import { NoteData } from "../Types";
import { ColorOptions, DefaultColor } from "./Color";
import { AzureMember } from "@fluidframework/azure-client";
export type NoteBodyProps = Readonly<{
	setText(text: string): void;
	currentUser: AzureMember;
}> &
	Pick<NoteData, "text" | "color">;

export function NoteBody(props: NoteBodyProps) {
	const { setText, text, color = DefaultColor } = props;

	return (
		<div style={{ flex: 1 }}>
			<TextField
				styles={{ fieldGroup: { background: ColorOptions[color].light } }}
				borderless
				multiline
				resizable={false}
				autoAdjustHeight
				onChange={(event) => setText(event.currentTarget.value)}
				value={text}
				placeholder={"Enter Text Here"}
			/>
		</div>
	);
}
