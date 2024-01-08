import {useState} from "react";
import coreStyles from "../../core.module.css";
import styles from "./headerDropdown.module.css";

interface props {
	buttonText: string;
	children: React.ReactNode;
}

export default function HeaderDropdown({buttonText, children}: props) {
	const [expanded, setExpanded] = useState(false);

	function toggleExpanded() {
		setExpanded(!expanded);
	}

	return (
		<div className={`${styles.dropdownWrapper} ${expanded ? styles.expanded : ""}`}>
			<button className={coreStyles.contentButton} aria-hidden={!expanded} onClick={toggleExpanded}>
				{buttonText}
			</button>
			{expanded && (
				<section className={styles.dropdown}>
					<button className={coreStyles.contentButton} onClick={toggleExpanded}>
						{buttonText}
					</button>
					{children}
				</section>
			)}
		</div>
	);
}
