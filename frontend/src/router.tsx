import {createBrowserRouter} from "react-router-dom";
import Core from "./pages/_layouts/_core.layout";
import VisitorLayout from "./pages/_layouts/visitor.layout";
import Home from "./pages/home.page";
import SignUp from "./pages/signUp/signUp.page";

export const router = createBrowserRouter([
	{
		element: <Core />,
		children: [
			{
				element: <VisitorLayout />,
				children: [
					{
						path: "/",
						element: <Home />,
					},
					{
						path: "/signUp",
						element: <SignUp />,
					},
				],
			},
		],
	},
]);
