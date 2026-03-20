import { Outlet, useLocation } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"


export const Layout = () => {
    const location = useLocation();
    const isHome = location.pathname === "/";
  


    return (


        <ScrollToTop>
           
            {/* Si es la Home (Landing), sale el Navbar */}
            <Navbar />
            {/* Aquí se carga Home.jsx (en "/") o Dashboard.jsx (en "/dashboard") */}
             <Outlet />
            <Footer />
        </ScrollToTop>
    );
};
