import {type InvitePayload} from "../../../../shared/objects/inv";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {apiFetch} from "../../helpers/apiFetch";
import {InviteCard} from "../../components/inviteCard";
import styles from "./invite.module.css";

export default function Invite() {
	const {id} = useParams<{id: string}>();

	useEffect(() => {
		apiFetch<InvitePayload>("GET", `/invites/${id}`)
			.then((response) => setInvite(response.error ? null : response.data))
			.catch(() => setInvite(null));
	}, []);

	const [invite, setInvite] = useState<InvitePayload | null | undefined>(undefined);

	return (
		<div className={styles.pageWrapper}>
			{invite === undefined ? (
				<div className={styles.loading}>Loading...</div>
			) : invite === null ? (
				<div className={styles.invNotFound}>Invite not found</div>
			) : (
				<InviteCard invite={invite} />
			)}
		</div>
	);
}
