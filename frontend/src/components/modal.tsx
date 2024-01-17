import {useEffect} from "react";
import {createPortal} from "react-dom";
import style from "./modal.module.css";

interface props {
	visibleTruthiness: unknown;
	dismissHandler: () => void;
	children: React.ReactNode;
}
export default function Modal({visibleTruthiness, dismissHandler, children}: props) {
	useEffect(() => {
		function dismissWithKeyboard(event: KeyboardEvent) {
			if (["Esc", "Escape"].includes(event.key)) dismissHandler();
		}

		if (visibleTruthiness) {
			document.addEventListener("keydown", dismissWithKeyboard);
			return () => document.removeEventListener("keydown", dismissWithKeyboard);
		}
	}, [visibleTruthiness]);

	return visibleTruthiness
		? createPortal(
				<div
					className={style.modalBackdrop}
					onClick={(event) => {
						if (event.target === event.currentTarget) dismissHandler();
					}}
				>
					<dialog open={Boolean(visibleTruthiness)} className={style.modal}>
						{children}
					</dialog>
				</div>,
				document.getElementById("root")!,
		  )
		: null;
}
