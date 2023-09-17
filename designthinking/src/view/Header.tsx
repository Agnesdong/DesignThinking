import { Text, CommandBar, ICommandBarItemProps, Facepile } from "@fluentui/react";
import { AzureMember } from "@fluidframework/azure-client";

import { BrainstormModel } from "../BrainstormModel";
import { DefaultColor } from "./Color";
import { ColorPicker } from "./ColorPicker";
import { NoteData } from "../Types";
import { NOTE_SIZE } from "./Note.style";
import React, { useEffect, useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import './assumption.css';
import styled from '@emotion/styled';
import { inTeams } from "../utils/inTeams";
import { useNavigate } from "react-router";
import Button from '@mui/material/Button';
const HomePage = ({ setIsBack }: { setIsBack: any }) => {
	const IN_TEAMS = inTeams();
	const [selectedRoute, setSelectedRoute] = useState<string | undefined>(undefined);
	const [selectedItem, setSelectedItem] = useState<string | null>(null);
	const navigate = useNavigate();
	const handleClick = (itemName: string) => {
		if (['Assumptions and Questions', 'Feedback Grid'].includes(itemName)) {
			setSelectedItem(itemName);
			setSelectedRoute('/assumption');
			localStorage.setItem('page', itemName);
		}
	};
	const onNavigate = () => {
		// if (!selectedRoute) return;
		// navigate(selectedRoute);
		location.reload()
		// setTimeout(() => location.reload(), 1000)
	};
	return (
		<div className="layout">
			<div className="home inside">
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
				<Button
					size="large"
					style={{ textAlign: 'center', margin: '0 auto', display: 'block' }}
					variant="contained"
					color="primary"
					onClick={onNavigate}>GO</Button>

			</div>
		</div>
	);
};

function uuidv4() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}
const StyledFormControl = styled(FormControl)`
  width: 300px;
  height: 44px;
  .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border: none;
    }
    fieldset {
      border: none;
    }
  }
  .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input {
	padding:0;
	height:100%;
	line-height:44px;
  }
`;
const MySelect: React.FC = () => {
	const [value, setValue] = useState<string>(localStorage.getItem('page') || 'Assumptions and Questions');
	useEffect(() => {
		if (value === 'Assumptions and Questions') {
			window.location.hash = localStorage.getItem('hash1') || ''
		} else if (value === 'Feedback Grid') {
			document.getElementById('axis-container')?.classList.add('active')
			window.location.hash = localStorage.getItem('hash2') || ''
		}
	}, [])

	const handleChange = (event: any) => {
		setValue(event.target.value);
		localStorage.setItem('page', event.target.value)
		document.getElementById('axis-container')?.classList.remove('active')
		if (event.target.value === 'Assumptions and Questions') {
			window.location.hash = localStorage.getItem('hash1') || ''
		} else if (event.target.value === 'Feedback Grid') {
			document.getElementById('axis-container')?.classList.add('active')
			window.location.hash = localStorage.getItem('hash2') || ''
		}
		location.reload()
	};

	return (
		<StyledFormControl fullWidth>
			<Select
				labelId="demo-simple-select-outlined-label"
				id="demo-simple-select-outlined"
				value={value}
				onChange={handleChange}
				displayEmpty
				autoWidth
				MenuProps={{ variant: 'menu' }}
			>
				<MenuItem value={"Experience-Based Roadmap"} disabled>Experience-Based Roadmap</MenuItem>
				<MenuItem value={"Empathy Map"} disabled>Empathy Map</MenuItem>
				<MenuItem value={"Scenario Map"} disabled>Scenario Map</MenuItem>
				<MenuItem value={"Big idea Vignettes"} disabled>Big idea Vignettes</MenuItem>
				<MenuItem value={"Prioritization Grid"} disabled>Prioritization Grid</MenuItem>
				<MenuItem value={"Needs Statement"} disabled>Needs Statement</MenuItem>
				<MenuItem value={"Assumptions and Questions"}>Assumptions and Questions</MenuItem>
				<MenuItem value={"Feedback Grid"}>Feedback Grid</MenuItem>
				<MenuItem value={"Storyboarding"} disabled>Storyboarding</MenuItem>
			</Select>
		</StyledFormControl>
	);
}
export interface HeaderProps {
	model: BrainstormModel;
	author: AzureMember;
	members: AzureMember[];
	showCanvas: boolean;
	setShowCanvas: (a: boolean) => void;
	userDisplayName: string | null | undefined;
}

export function Header(props: HeaderProps) {
	const colorButtonRef = React.useRef<any>();
	const [color, setColor] = React.useState(DefaultColor);
	const [isBack, setIsBack] = useState(false)
	const personas = React.useMemo(
		() =>
			props.members.map((member) => {
				return { personaName: member.userName };
			}),
		[props.members],
	);

	// add in all the default attributes needed for a new note, including setting the last edited author as the
	// user (since user created the note).
	const onAddNote = () => {
		const { scrollHeight, scrollWidth } = document.getElementById("NoteSpace")!;
		const id = uuidv4();
		const newCardData: NoteData = {
			id,
			position: {
				x: Math.floor(Math.random() * (scrollWidth - NOTE_SIZE.width)),
				y: Math.floor(Math.random() * (scrollHeight - NOTE_SIZE.height)),
			},
			lastEdited: {
				userId: props.author.userId,
				userName: props.author.userName,
				time: Date.now(),
			},
			author: props.author,
			numLikesCalculated: 0,
			didILikeThisCalculated: false,
			color
		};
		newCardData.author.userName = String(props.userDisplayName)
		props.model.SetNote(id, newCardData);
	};
	const [showCanvas, setShowCanvas] = React.useState(false)
	const items: ICommandBarItemProps[] = [
		{
			key: "title",
			onRender: () => (
				<MySelect />
			)
		},
		{
			key: "add",
			text: "Add Sticker",
			onClick: onAddNote,
			iconProps: {
				iconName: "QuickNote",
			},
		},
		{
			componentRef: colorButtonRef,
			key: "color",
			text: "Sticker Color",
			iconProps: {
				iconName: "Color",
			},
			subMenuProps: {
				key: "color-picker",
				items: [{ key: "foo" }],
				onRenderMenuList: () => (
					<ColorPicker
						parent={colorButtonRef}
						selectedColor={color}
						setColor={setColor}
					/>
				),
			},
		},

		{
			key: "highlight",
			text: "highlight",
			iconProps: {
				iconName: "Highlight",
			},
			onClick: () => {
				const iframeRef: any = document.getElementById('canvas_iframe');
				iframeRef.contentWindow.postMessage({ action: "setToHighlighter" }, '*');
			}
		},
		{
			key: "line",
			text: "line",
			iconProps: {
				iconName: "Line",
			},
			onClick: () => {
				const iframeRef: any = document.getElementById('canvas_iframe');
				iframeRef.contentWindow.postMessage({ action: "setToLine" }, '*');
			}
		},
		{
			key: "Arrow",
			text: "Arrow",
			iconProps: {
				iconName: "ArrowTallDownRight",
			},
			onClick: () => {
				const iframeRef: any = document.getElementById('canvas_iframe');
				iframeRef.contentWindow.postMessage({ action: "setToArrow" }, '*');
			}
		},
		{
			key: "Eraser",
			text: "Eraser",
			iconProps: {
				iconName: "EraseTool",
			},
			onClick: () => {
				const iframeRef: any = document.getElementById('canvas_iframe');
				iframeRef.contentWindow.postMessage({ action: "setToEraser" }, '*');
			}
		},
		{
			key: "Back",
			text: "Back",
			iconProps: {
				iconName: "Back",
			},
			onClick: () => {
				setIsBack(true)
				
			}

		},
	
	];

	const farItems: ICommandBarItemProps[] = [
		{
			key: "presence",
			onRender: () => (
				<Facepile styles={{ root: { alignSelf: "center" } }} personas={[]} />
			),
		},
	];
	return <>
		{isBack && <HomePage setIsBack={setIsBack}></HomePage>}
		<CommandBar className="header" styles={{ root: { paddingLeft: 0 } }} items={items} farItems={farItems} />
	</>;
}



