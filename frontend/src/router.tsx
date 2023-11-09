import {createBrowserRouter} from "react-router-dom";
import VisitorLayout from "./pages/_layouts/visitor.layout";
import Home from "./pages/home.page";

export const router = createBrowserRouter([
	{
		element: <VisitorLayout />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
		],
	},
]);
