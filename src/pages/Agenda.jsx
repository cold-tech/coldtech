import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Table from '../components/Table';

const Agenda = () => {
    return ( 
    <>
        <Navbar />
        <div className="bg-gray-100 py-10 min-h-screen">
            <Table />
        </div>
        <Footer />
    </> 
    );
}
 
export default Agenda;