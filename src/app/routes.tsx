import { createBrowserRouter, Navigate, Outlet } from "react-router"
import { AppStateProvider } from "./AppState"
import ContactPage from "../pages/ContactPage"
import PaymentPage from "../pages/PaymentPage"
import ThankYouPage from "../pages/ThankYouPage"
import WelcomePage from "../pages/WelcomePage"

function RootLayout() {
  return (
    <AppStateProvider>
      <Outlet />
    </AppStateProvider>
  )
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: WelcomePage },
      { path: "contact", Component: ContactPage },
      { path: "payment", Component: PaymentPage },
      { path: "thank-you", Component: ThankYouPage },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
])
