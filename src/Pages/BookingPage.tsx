import BookingComponent from '@/components/BookingComponent';
import { Helmet } from 'react-helmet-async';

function BookingPage() {
    return (
        <div>
            <Helmet>
                <title>Book Netrani Island Scuba Diving | Just Dive Murudeshwar</title>
                <meta name="description" content="Book your Netrani Island scuba diving adventure with Just Dive Scuba, Murudeshwar’s certified PADI dive center. Safe and exciting dives await!" />
                <meta name="keywords" content="PADI Dive Center in Murudeshwar" />
            </Helmet>
            <BookingComponent />
        </div>
    );
}

export default BookingPage;
