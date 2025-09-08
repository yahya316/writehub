// import Navbar from "../test/page";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: 'WriteHub',
  description: 'A content management system for writers.',
};

export default function MainLayout({ children }) {
  return (
    <>
        <Navbar />
        {children}
        <Footer />
    </>
  );
}