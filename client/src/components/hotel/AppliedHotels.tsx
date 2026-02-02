
import DocumentTitle from '../DocumentTitle'

import SummaryCards from './SummaryCards';
import HotelTable from './HotelTable';

const AppliedHotels = () => {



    return (
        <>
            <DocumentTitle title="Applied Hotels" />

            <main className='p-4'>
                <SummaryCards />
                <HotelTable />
            </main>

        </>
    )
}

export default AppliedHotels

