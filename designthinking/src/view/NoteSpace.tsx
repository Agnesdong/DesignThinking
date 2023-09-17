//This segment of code is based on FluidExamples (see: https://github.com/microsoft/FluidExamples/tree/main/brainstorm)
import { IStyle, mergeStyles, ThemeProvider } from "@fluentui/react";
import { AzureMember } from "@fluidframework/azure-client";
import React from "react";
import { useDrop } from "react-dnd";
import { NoteData, Position } from "../Types";
import { Note } from "./Note";
import { BrainstormModel } from "../BrainstormModel";
import { lightTheme } from "./Themes";
import './BrainstormView.css';
import { LiveCanvasPage } from './LiveCanvasPage'
export type NoteSpaceProps = Readonly<{
	model: BrainstormModel;
	author: AzureMember;
	showCanvas: boolean;
}>;

export function NoteSpace(props: NoteSpaceProps) {
	const { model } = props;
	const [notes, setNotes] = React.useState<readonly NoteData[]>([]);
	const [time, setTime] = React.useState(Date.now());

	// This runs when model changes whether initiated by user or from external
	React.useEffect(() => {
		const syncLocalAndFluidState = () => {
			const noteDataArr = [];
			const ids: string[] = model.NoteIds;
			// Recreate the list of cards to re-render them via setNotes
			for (let noteId of ids) {
				const newCardData: NoteData = model.CreateNote(noteId, props.author);
				noteDataArr.push(newCardData);
			}
			setNotes(noteDataArr);
		};

		// Use SetInterval to trigger useEffect() every 3 secs and refresh the note states.
		// This allows the last edited author name to be updated when there is no more edits
		// to trigger refreshing the view.

		// Note: We are aware that this probably isn't the most optimal and intuitive
		// solution for a feature like this, in fact, there is actually a
		// last edited package (https://github.com/microsoft/FluidFramework/blob/main/experimental/framework/last-edited/README.md)
		// within Fluid Framework that helps us achieve this task. However, for the purpose
		// of demonstration and what we can use the `audience` propety to achieve, we think
		// the implementation of this feature is justified. We are also planning on refactoring
		// the app to allow for an easier experience when updating both local and remote states.
		setInterval(() => {
			setTime(Date.now());
		}, 3000);

		syncLocalAndFluidState();

		// Add a listener on the BrainstormModel listener
		// The listener will call syncLocalAndFluidState everytime there a "valueChanged" event.
		model.setChangeListener(syncLocalAndFluidState);

		return () => {
			model.removeChangeListener(syncLocalAndFluidState);
		};
	}, [model, props.author, time]);
	React.useEffect(() => {
		localStorage.setItem('notes', JSON.stringify(notes))
	}, [notes])
	const rootStyle: IStyle = {
		flexGrow: 1,
		position: "relative",
		margin: "10px",
		borderRadius: "2px",
	};

	const spaceClass = mergeStyles(rootStyle);

	const [, drop] = useDrop(
		() => ({
			accept: "note",
			drop(item: any, monitor) {
				const delta = monitor.getDifferenceFromInitialOffset()!;
				const left = Math.round(item.left + delta.x);
				const top = Math.round(item.top + delta.y);
				model.MoveNote(item.id, {
					x: left > 0 ? left : 0,
					y: top > 0 ? top : 0,
				});
				return undefined;
			},
		}),
		[model],
	);
	return (
		<div id="NoteSpace" ref={drop} className={spaceClass}>
			<ThemeProvider theme={lightTheme}>
			<LiveCanvasPage></LiveCanvasPage>
			<div className="axis-container" id="axis-container">
					<div className="bg bg1"><span>Things that worked</span></div>
					<div className="bg bg2"><span>Things to change</span></div>
					<div className="bg bg3"><span>New idea to try</span></div>
					<div className="bg bg4"><span>Questions we still have</span></div>

					<div className="x-axis"></div>
					<div className="y-axis"></div>
					<div className="point high-risk">High Risk</div>
					<div className="point uncertainty">Uncertainty</div>
					<div className="point certainty">Certainty</div>
					<div className="point low-risk">Low Risk</div>
				</div>
				{notes.map((note, i) => {
					const setPosition = (position: Position) => {
						model.MoveNote(note.id, position);
					};

					const setText = (text: string) => {
						model.SetNoteText(
							note.id,
							text,
							props.author.userId,
							props.author.userName,
							Date.now(),
						);
					};

					const onLike = () => {
						model.LikeNote(note.id, props.author);
					};

					const getLikedUsers = () => {
						return model.GetNoteLikedUsers(note.id);
					};

					const onDelete = () => {
						model.DeleteNote(note.id);
					};

					const onColorChange = (color: string) => {
						model.SetNoteColor(note.id, color);
					};

					return (
						<Note
							{...note}
							id={note.id}
							currentUser={props.author}
							lastEdited={note.lastEdited}
							author={note.author}
							key={note.id}
							text={note.text}
							setPosition={setPosition}
							onLike={onLike}
							getLikedUsers={getLikedUsers}
							onDelete={onDelete}
							onColorChange={onColorChange}
							setText={setText}
						/>
					);
				})}
			</ThemeProvider>
		</div>
	);
}
