import {useEffect, useRef, useState} from "react";
import {basicSetup, EditorView} from "codemirror";
import {css as codemirrorCss} from "@codemirror/lang-css";
import {LabelledInput} from "../inputs";
import codeMirrorStyles from "../../helpers/codemirrorTheme.module.css?raw";
import {type Org} from "../../../../shared/objects/org";
import {type recursiveRecord} from "../../../../shared/helpers/dataRecord";
import {type InputState} from "../../helpers/inputState";
import coreStyles from "../../core.module.css";
import styles from "./orgForm.module.css";

type formState = recursiveRecord<Omit<Org, "id" | "internals">, InputState>;

interface props {
	formState: formState;
	setFormState: (formState: formState) => void;
}
export function OrgForm({formState, setFormState}: props) {
	const cssEditorRef = useRef<HTMLDivElement | null>(null);
	const [cssEditor] = useState(
		new EditorView({
			extensions: [basicSetup, codemirrorCss()],
		}),
	);
	useEffect(() => {
		cssEditorRef.current?.appendChild(cssEditor.dom);
	}, []);

	return (
		<section id={styles.orgFormWrapper}>
			<LabelledInput
				label={"Name"}
				id={"orgNameInput"}
				data-testid={"orgNameInput"}
				aria-invalid={!formState.name.valid}
				autoFocus={true}
				collapsedLabel={true}
				value={formState.name.value}
				handler={(value) => (formState.name.set(value), setFormState({...formState}))}
			/>
			<LabelledInput
				label={"Color"}
				id={"orgColorInput"}
				data-testid={"orgColorInput"}
				aria-invalid={!formState.color.valid}
				type={"color"}
				collapsedLabel={true}
				value={"#" + formState.color.value}
				handler={(value) => (formState.color.set(value.slice(1)), setFormState({...formState}))}
			/>
			<details className={styles.orgCustomCssSection}>
				<summary className={coreStyles.contentButton}>Custom invitation style (CSS)</summary>
				<label id={styles.orgCustomCssOverridesLabel} className={coreStyles.contentButton}>
					<span>Override default styles:</span>
					<input
						data-testid="orgCustomCssOverridesCheckbox"
						type="checkbox"
						value={formState.customInvCssOverrides.value}
						onInput={(event) => formState.customInvCssOverrides.set(String(event.currentTarget.checked))}
					/>
				</label>
				<style>{codeMirrorStyles}</style>
				<div
					ref={cssEditorRef}
					id={styles.cssEditor}
					onInput={() => (formState.customInvCss.set(cssEditor.state.doc.toString()), setFormState({...formState}))}
				/>
				<div id={styles.orgCustomCssLinks}>
					<a
						className={coreStyles.contentButton}
						target={"_blank"}
						rel={"noreferrer"}
						href="https://github.com/EvAvKein/Dialplan/blob/main/frontend/src/components/inviteCard.tsx"
					>
						Markup (TSX)
					</a>
					<a
						className={coreStyles.contentButton}
						target={"_blank"}
						rel={"noreferrer"}
						href="https://github.com/EvAvKein/Dialplan/blob/main/frontend/src/components/inviteCard.css"
					>
						Default styles
					</a>
				</div>
			</details>
		</section>
	);
}
