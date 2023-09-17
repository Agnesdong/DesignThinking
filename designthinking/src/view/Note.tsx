// This segment of code is based on FluidExamples (see: https://github.com/microsoft/FluidExamples/tree/main/brainstorm)
import { mergeStyles } from "@fluentui/react";
import { AzureMember } from "@fluidframework/azure-client";
import React from "react";
import { useDrag } from "react-dnd";
import { DefaultColor } from "./Color";
import { getRootStyleForColor } from "./Note.style";
import { NoteData, Position } from "../Types";
import { NoteHeader } from "./NoteHeader";
import { NoteBody } from "./NoteBody";
import { NoteFooter } from "./NoteFooter";
export type NoteProps = Readonly<{
	id: string;
	currentUser: AzureMember;
	setPosition: (position: Position) => void;
	onLike: () => void;
	getLikedUsers: () => AzureMember[];
	onDelete: () => void;
	onColorChange: (color: string) => void;
	setText: (text: string) => void;
}> &
	Pick<
		NoteData,
		| "author"
		| "lastEdited"
		| "position"
		| "color"
		| "didILikeThisCalculated"
		| "numLikesCalculated"
		| "text"
	>;

export function Note(props: NoteProps) {
	const {
		id,
		currentUser,
		lastEdited,
		position: { x: left, y: top },
		color = DefaultColor,
		setText,
		text
	} = props;

	const [, drag] = useDrag(
		() => {
			const content: any = document.querySelector('.canvas-content')
			if (content) {
				content.style.zIndex = 1
			}
			return {
				type: "note",
				item: { id, left, top },
			}
		},
		[id, left, top],
	);

	const rootClass = mergeStyles(getRootStyleForColor(color));

	return (
		<div
			className={rootClass + ' nodeBox'}
			onMouseDown={() => {
				const content: any = document.querySelector('.canvas-content')
				if (content) {
					content.style.zIndex = 0
				}
			}}

			ref={drag} style={{ left, top }}>
			<NoteHeader {...props} />
			<NoteBody setText={setText} text={text} color={color} currentUser={currentUser}/>
			
		</div>
	);
}
