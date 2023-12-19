import {type notif} from "./stores/notifs.ts";
import styles from "./notifications.module.css";

// TODO - resolve accessibility issue: according to MDN, aria-live (which is implicit in role="alert") doesn't trigger when the element is added to the DOM

interface notificationProps extends notif {
	dismissHandler: (id: notif["id"]) => void;
}
export function Notification({id, text, desirability, manualDismiss, dismissHandler}: notificationProps) {
	return (
		<div
			role="alert"
			className={`${styles.notification} ${desirability ? styles.positive : null}`}
			data-testid={desirability ? "notifPositive" : "notifNegative"}
		>
			{text}
			{manualDismiss ? (
				<button
					className={styles.dismissButton}
					onClick={() => {
						dismissHandler(id);
					}}
				>
					X
				</button>
			) : null}
		</div>
	);
}

interface notificationsProps {
	notifs: notif[];
	dismissHandler: (id: notif["id"]) => void;
}
export function Notifications({notifs, dismissHandler}: notificationsProps) {
	return (
		<div id={styles.notifsWrapper}>
			{notifs.map((notif) => (
				<Notification key={notif.id} {...notif} dismissHandler={dismissHandler} />
			))}
			<div id={styles.notifsScrollAnchor}></div>
		</div>
	);
}
