import {createBrowserRouter, redirect} from "react-router-dom";
import Core from "./pages/_layouts/_core";
import VisitorLayout from "./pages/_layouts/visitor";
import Home from "./pages/home.page";
import SignUp from "./pages/signUp/signUp.page";
import SignIn from "./pages/signIn/signIn.page";
import Invite from "./pages/invite/invite.page";
import AgentLayout from "./pages/_layouts/agent";
import DashboardLayout from "./pages/_layouts/dashboard";
import Dashboard_Invites from "./pages/dashboard/invites.page";
import Dashboard_Calls from "./pages/dashboard/calls.page";

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
					{
						path: "/signIn",
						element: <SignIn />,
					},
				],
			},
			{
				path: "/invite/:id",
				element: <Invite />,
				index: false,
			},
			{
				element: <AgentLayout />,
				children: [
					{
						element: <DashboardLayout />,
						path: "/dashboard",
						children: [
							{
								index: true,
								loader: async () => redirect("/dashboard/invites"),
							},
							{
								path: "invites",
								element: <Dashboard_Invites />,
							},
							{path: "calls", element: <Dashboard_Calls />},
						],
					},
				],
			},
		],
	},
]);
