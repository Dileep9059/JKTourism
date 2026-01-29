import { useState } from 'react';
import scss from './hotelregister.module.scss';
import clsx from 'clsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

import { toast } from 'sonner';
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../ui/field';
import BasicInfo from './BasicInfo';
import LocationDetails from './LocationDetails';
import ManagerDetails from './ManagerDetails';
import PropertyDetails from './PropertyDetails';
import OwnerDetails from './OwnerDetails';
import HotelAmenity from './HotelAmenity';
import FoodDetail from './FoodDetail';
import DirectrateRegistration from './DirectrateRegistration';
import BankDetails from './BankDetails';
import Declaration from './Declaration';

function Hotelregister() {
  const [currentTab, setCurrentTab] = useState("basic-information");



  // Define the order of tabs
  const tabOrder = [
    "basic-information",
    "location-details",
    "owner-details",
    "manager-details",
    "property-details",
    "amenity-details",
    "food",
    "registration-details",
    "banking-details",
    "declaration",
  ];

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([
    { roomType: "", roomCount: 0, tariff: 0 },
  ]);

  const [hotelId, setHotelId] = useState<string>("8c608176-681e-45ae-99fd-b9068f5f0dfc");

  const addRoomType = () => {
    // max 5 types can be added if already selected then cannot add same type
    if (roomTypes.length >= 5) {
      toast.error("Maximum 5 room types can be added");
      return;
    }
    setRoomTypes([...roomTypes, { roomType: "", roomCount: 0, tariff: 0 }]);
  };

  const removeRoomType = (index: number) => {
    setRoomTypes(roomTypes.filter((_, i) => i !== index));
  };

  const updateRoomType = (index: number, field: string, value: string) => {
    if (field === "roomType" && roomTypes.some((type) => type.roomType === value)) {
      toast.error("Room type already exists");
      return;
    }
    const updated = [...roomTypes];
    updated[index][field] = field === "roomCount" || field === "tariff" ? Number(value) : value;
    setRoomTypes(updated);
  };


  // Function to handle "Next" button click
  const handleNext = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex < tabOrder.length - 1) {
      setCurrentTab(tabOrder[currentIndex + 1]);
    }
  };

  // Function to handle "Previous" button click
  const handlePrev = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabOrder[currentIndex - 1]);
    }
  };

  const [date, setDate] = useState<Date | undefined>(undefined)
  return (
    <>
      <div className={scss.common_page}>
        <div className={scss.banner}>
          <div className={scss.filter_bg}>
            <img
              src={`${import.meta.env.VITE_BASE}assets/images/hotel-booking/hotelsearch-bg.png`}
              alt="Banner"
              className={clsx(
                scss.banner_image,
              )}
            />
            <img
              src={`${import.meta.env.VITE_BASE}assets/images/hotel-booking/hotelsearch-img.png`}
              alt="image"
            />
          </div>
          <section className={scss.tab_wrapper}>
            <div className={clsx(scss.tab_container, "container mx-auto")}>
              <div className={scss.destination_title}>
                <h2 className={clsx(scss.cattitle, "mt-5")}>List Your Hotel</h2>
              </div>
              <Tabs value={currentTab} onValueChange={setCurrentTab} className={scss.custom_tab}>
                <TabsList className={scss.custom_tablist}>
                  <TabsTrigger value="basic-information" className='w-full'>Property Basic Information</TabsTrigger>
                  <TabsTrigger value="location-details" className='w-full'>Location Details</TabsTrigger>
                  <TabsTrigger value="owner-details" className='w-full'>Owner / Contact Details</TabsTrigger>
                  <TabsTrigger value="manager-details" className='w-full'>Manager Details</TabsTrigger>
                  <TabsTrigger value="property-details" className='w-full'>Property Details</TabsTrigger>
                  <TabsTrigger value="amenity-details" className='w-full'>Hotel Amenities</TabsTrigger>
                  <TabsTrigger value="food" className='w-full'>Food & Beverage</TabsTrigger>
                  <TabsTrigger value="registration-details" className='w-full'>Registration Details with Directorate</TabsTrigger>
                  <TabsTrigger value="banking-details" className='w-full'>Banking Details (for Payments)</TabsTrigger>
                  <TabsTrigger value="declaration" className='w-full'>Declaration</TabsTrigger>
                </TabsList>

                <div className={scss.tab_content_wrapper}>
                  {/* Basic Information Tab */}
                  <TabsContent value="basic-information" className={scss.custom_tabcontent}>
                    <BasicInfo handleNext={handleNext} />
                  </TabsContent>

                  {/* Location Details Tab */}
                  <TabsContent value="location-details" className={scss.custom_tabcontent}>
                    <LocationDetails handleNext={handleNext} handlePrev={handlePrev} hotelId={hotelId} />
                  </TabsContent>

                  {/* Owner Details Tab */}
                  <TabsContent value="owner-details" className={scss.custom_tabcontent}>
                    <OwnerDetails handleNext={handleNext} handlePrev={handlePrev} hotelId={hotelId} />
                  </TabsContent>

                  {/* Manager Details Tab */}
                  <TabsContent value="manager-details" className={scss.custom_tabcontent}>
                    <ManagerDetails handleNext={handleNext} handlePrev={handlePrev} hotelId={hotelId} />
                  </TabsContent>

                  {/* Property Details Tab */}
                  <TabsContent value="property-details" className={scss.custom_tabcontent}>
                    <PropertyDetails handleNext={handleNext} handlePrev={handlePrev} hotelId={hotelId} />
                  </TabsContent>


                  {/* Amenity Details Tab */}
                  <TabsContent value="amenity-details" className={scss.custom_tabcontent}>
                    <HotelAmenity handleNext={handleNext} handlePrev={handlePrev} hotelId={hotelId} />
                  </TabsContent>

                  {/* Food Tab */}
                  <TabsContent value="food" className={scss.custom_tabcontent}>
                    <FoodDetail handleNext={handleNext} handlePrev={handlePrev} hotelId={hotelId} />
                  </TabsContent>

                  {/* Registration Details Tab */}
                  <TabsContent value="registration-details" className={scss.custom_tabcontent}>
                    <DirectrateRegistration handleNext={handleNext} handlePrev={handlePrev} hotelId={hotelId} />
                  </TabsContent>

                  {/* Banking Details Tab */}
                  <TabsContent value="banking-details" className={scss.custom_tabcontent}>
                    <BankDetails handleNext={handleNext} handlePrev={handlePrev} hotelId={hotelId} />
                  </TabsContent>

                  {/* Declaration Tab */}
                  <TabsContent value="declaration" className={scss.custom_tabcontent}>
                    <Declaration handleNext={handleNext} handlePrev={handlePrev} hotelId={hotelId} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default Hotelregister


type RoomType = {
  roomType: string;
  roomCount: number;
  tariff: number;
};