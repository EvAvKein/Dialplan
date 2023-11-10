import {Input} from "../../components/inputs";
import styles from "./signUp.module.css";

export default function Home() {
	return (
		<section className={styles.signUpWrapper}>
			<h2>Sign Up</h2>
			<form
				onSubmit={() => {
					window.alert("Fetch didn't happen (am currently considering whether to use React Query)");
				}}
			>
				<Input placeholder="Organization" handler={() => {}} />
				<button>Submit</button>
			</form>
			<p>^ Just for testing PostgreSQL setup ^</p>
		</section>
	);
}
