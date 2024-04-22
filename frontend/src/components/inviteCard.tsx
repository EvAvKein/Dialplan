import {CallCreationRequest, InvitePayload} from "../../../shared/objects/inv";
import {secsToReadableDuration} from "../helpers/secsToReadableDuration";
import {useState} from "react";
import defaultStyles from "./inviteCard.css?raw";

export function InviteCard({invite, handler}: {invite: InvitePayload; handler: (output: CallCreationRequest) => void}) {
	document.documentElement.style.setProperty("--orgColor", invite.org.color ? "#" + invite.org.color : "#000000");

	const [selectedCallTime, setSelectedCallTime] = useState("");
	const [messageToOrg, setMessageToOrg] = useState("");
	function emitData() {
		handler({inviteId: invite.id, time: selectedCallTime, note: messageToOrg});
	}

	return (
		<section className={"invCard" + (selectedCallTime ? " timeSelected" : "")}>
			{!invite.org.customInvCssOverrides && <style>{defaultStyles}</style>}
			{invite.org.customInvCss && <style>{invite.org.customInvCss}</style>}

			<section className={"orgSection"}>
				<div className={"orgLogoPlaceholder"}>📷</div>
				<h1 className={"orgName"}>{invite.org.name}</h1>
			</section>

			<section className={"agentSection"}>
				<div className={"agentDepartment"}>{invite.agent.department}</div>
				<div className={"agentName"}>{invite.agent.name}</div>
			</section>

			<p className={"message"}>{invite.message}</p>

			<section className={"recipientAndCallSection"}>
				<div className={"recipientSection"}>
					<div className={"recipientName"}>{invite.recipient.name}</div>
					<div className={"recipientNumber"}>
						<span>{invite.recipient.phone.countryCode}</span>
						<span>{invite.recipient.phone.number}</span>
					</div>
				</div>

				<div aria-description="Duration of phone call" className={"callDuration"}>
					{secsToReadableDuration(invite.secCallDuration)}
				</div>
			</section>

			<section className={"schedulingSection"}>
				<button
					className={"schedulingComponentPlaceholder"}
					onClick={() => setSelectedCallTime(selectedCallTime ? "" : "timestamp")}
				>
					{selectedCallTime ? "Clear" : "🗓️"}
				</button>
				<p aria-description="Call invitation's expiration time" className={"schedulingExpiry"}>
					{new Date(invite.expiry).toLocaleDateString()}
				</p>
			</section>

			<section className={"submitSection"}>
				<textarea
					aria-label={"Optional message to " + invite.org.name}
					placeholder={"Add message?"}
					className={"submitNoteInput"}
					onInput={(event) => setMessageToOrg(event.currentTarget.value)}
				/>

				<button className={"submitButton"} onClick={emitData}>
					Submit
				</button>
			</section>

			<div className={"inviteId"} aria-description={"Invite ID"}>
				{invite.id}
			</div>
		</section>
	);
}
