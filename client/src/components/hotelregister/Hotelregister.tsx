import { useState } from 'react';
import scss from './hotelregister.module.scss';
import clsx from 'clsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../ui/field';
import BasicInfo from './BasicInfo';
import LocationDetails from './LocationDetails';
import ManagerDetails from './ManagerDetails';

function Hotelregister() {
  const [currentTab, setCurrentTab] = useState("basic-information");



  // Define the order of tabs
  const tabOrder = [
    "basic-information",
    "location-details",
    "owner-details",
    "nodal-details",
    "property-details",
    "amenity-details",
    "food",
    "registration-details",
    "banking-details",
    "presnce",
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
                    <div className={scss.form_details}>
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Owner’s Full Name</label>
                            <Input type="text" placeholder="Enter Owner's Full Name" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Mobile Number</label>
                            <Input type="text" placeholder="Enter Mobile Number" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Email Address</label>
                            <Input type="email" placeholder='Enter Email Address' />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">ID Proof Type</label>
                            <Input type="text" placeholder='Enter ID Proof Type' />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">ID Proof File</label>
                            <Input type="file" placeholder='Upload ID Proof File' accept='image/jpg, image/png, image/jpeg' />
                          </div>
                          {/* error message place here  */}
                        </div>
                      </div>
                    </div>
                    <div className={scss.btn_wrapper}>
                      <button onClick={handlePrev} className={scss.prev_btn}>Prev</button>
                      <button onClick={handleNext} className={scss.next_btn}>Next</button>
                    </div>
                  </TabsContent>

                  {/* Manager Details Tab */}
                  <TabsContent value="manager-details" className={scss.custom_tabcontent}>
                    <ManagerDetails handleNext={handleNext} handlePrev={handlePrev} hotelId={hotelId} />
                  </TabsContent>

                  {/* Property Details Tab */}
                  <TabsContent value="property-details" className={scss.custom_tabcontent}>
                    <div className={scss.form_details}>

                      {/* PROPERTY LEVEL DETAILS */}
                      <div className="grid grid-cols-2 gap-4 md:gap-6">

                        <div className={scss.form_block}>
                          <label>Check-in Time</label>
                          <Input type="time" />
                        </div>

                        <div className={scss.form_block}>
                          <label>Check-out Time</label>
                          <Input type="time" />
                        </div>
                        <div className={scss.form_block}>
                          <label>Parking Capacity</label>
                          <Input type="number" />
                        </div>
                        <div className={scss.form_block}>
                          <FieldGroup>
                            <Field orientation="horizontal">
                              <Checkbox id="lift-available" name="lift-available" />
                              <FieldLabel htmlFor="lift-available">
                                Lift Available
                              </FieldLabel>
                            </Field>
                          </FieldGroup>
                        </div>
                        <div className={scss.form_block}>
                          <FieldGroup>
                            <Field orientation="horizontal">
                              <Checkbox id="power-backup" name="power-backup" />
                              <FieldLabel htmlFor="power-backup">
                                Power Backup
                              </FieldLabel>
                            </Field>
                          </FieldGroup>
                        </div>
                        <div className={scss.form_block}>
                          <FieldGroup>
                            <Field orientation="horizontal">
                              <Checkbox id="wheelchair-accessible" name="wheelchair-accessible" />
                              <FieldLabel htmlFor="wheelchair-accessible">
                                Wheelchair Accessible
                              </FieldLabel>
                            </Field>
                          </FieldGroup>
                        </div>
                      </div>

                      {/* ROOM TYPES SECTION */}
                      <div className="mt-8 space-y-4">
                        <div className='flex items-center justify-between'>
                          <h4 className="font-semibold text-sm">Room Types & Tariff</h4>
                          <Button
                            type="button"
                            onClick={addRoomType}
                            className="bg-white text-blue-600 text-sm hover:text-white"
                          >
                            + Add another room type
                          </Button>
                        </div>

                        {roomTypes.map((room: any, index: any) => (
                          <div
                            key={index}
                            className="grid grid-cols-4 gap-4 items-end border p-4 rounded-md"
                          >
                            {/* Room Type */}
                            <div>
                              <label>Room Type</label>
                              <select
                                className="w-full border rounded px-2 py-2"
                                value={room.roomType}
                                onChange={(e) =>
                                  updateRoomType(index, "roomType", e.target.value)
                                }
                              >
                                <option value="">Select</option>
                                {ROOM_TYPES.map((type) => (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Number of Rooms */}
                            <div>
                              <label>No. of Rooms</label>
                              <Input
                                type="number"
                                placeholder="e.g. 10"
                                value={room.roomCount}
                                onChange={(e) =>
                                  updateRoomType(index, "roomCount", e.target.value)
                                }
                              />
                            </div>

                            {/* Tariff */}
                            <div>
                              <label>Tariff (per night)</label>
                              <Input
                                type="number"
                                placeholder="₹"
                                value={room.tariff}
                                onChange={(e) =>
                                  updateRoomType(index, "tariff", e.target.value)
                                }
                              />
                            </div>

                            {/* Remove */}
                            <Button
                              type="button"
                              onClick={() => removeRoomType(index)}
                              className="bg-red-500 text-white text-sm"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* NAVIGATION */}
                    <div className={scss.btn_wrapper}>
                      <button onClick={handlePrev} className={scss.prev_btn}>
                        Prev
                      </button>
                      <button onClick={handleNext} className={scss.next_btn}>
                        Next
                      </button>
                    </div>
                  </TabsContent>


                  {/* Amenity Details Tab */}
                  <TabsContent value="amenity-details" className={scss.custom_tabcontent}>
                    <div className={scss.form_details}>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                        <div className={scss.form_block}>
                          <div className={scss.inputblock_wrapper}>
                            <div className={scss.input_block}>
                              <Checkbox id="air" />
                              <label htmlFor="air">Air Conditioning</label>
                            </div>
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.inputblock_wrapper}>
                            <div className={scss.input_block}>
                              <Checkbox id="center" />
                              <label htmlFor="center">Business Center</label>
                            </div>
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.inputblock_wrapper}>
                            <div className={scss.input_block}>
                              <Checkbox id="iron" />
                              <label htmlFor="iron">Clothing Iron</label>
                            </div>
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.inputblock_wrapper}>
                            <div className={scss.input_block}>
                              <Checkbox id="ports" />
                              <label htmlFor="ports">Data Ports</label>
                            </div>
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.inputblock_wrapper}>
                            <div className={scss.input_block}>
                              <Checkbox id="cleaning" />
                              <label htmlFor="cleaning">Dry Cleaning</label>
                            </div>
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.inputblock_wrapper}>
                            <div className={scss.input_block}>
                              <Checkbox id="room-service" />
                              <label htmlFor="room-service">Room Service</label>
                            </div>
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.inputblock_wrapper}>
                            <div className={scss.input_block}>
                              <Checkbox id="voicemail" />
                              <label htmlFor="voicemail">Voicemail</label>
                            </div>
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.inputblock_wrapper}>
                            <div className={scss.input_block}>
                              <Checkbox id="dryer" />
                              <label htmlFor="dryer">Hair Dryer</label>
                            </div>
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.inputblock_wrapper}>
                            <div className={scss.input_block}>
                              <Checkbox id="mr" />
                              <label htmlFor="mr">Meeting Rooms</label>
                            </div>
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.inputblock_wrapper}>
                            <div className={scss.input_block}>
                              <Checkbox id="op" />
                              <label htmlFor="op">Outdoor Pools</label>
                            </div>
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.inputblock_wrapper}>
                            <div className={scss.input_block}>
                              <Checkbox id="pg" />
                              <label htmlFor="pg">Parking Garage</label>
                            </div>
                          </div>
                          {/* error message place here  */}
                        </div>
                      </div>
                    </div>
                    <div className={scss.btn_wrapper}>
                      <button onClick={handlePrev} className={scss.prev_btn}>Prev</button>
                      <button onClick={handleNext} className={scss.next_btn}>Next</button>
                    </div>
                  </TabsContent>

                  {/* Food Tab */}
                  <TabsContent value="food" className={scss.custom_tabcontent}>
                    <div className={scss.form_details}>
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                        <div className={clsx(scss.form_block, 'col-span-2 sm:col-span-2 lg:col-span-2')}>
                          <FieldGroup className="mx-auto w-56">
                            <Field orientation="horizontal">
                              <Checkbox id="in-house-restaurant" name="in-house-restaurant" />
                              <FieldLabel htmlFor="in-house-restaurant">
                                In-house Restaurant Available
                              </FieldLabel>
                            </Field>
                          </FieldGroup>
                        </div>
                        <div className={clsx(scss.form_block, 'col-span-2 sm:col-span-2 lg:col-span-2')}>
                          <FieldGroup className="mx-auto w-56">
                            <Field orientation="horizontal">
                              <Checkbox id="room-service" name="room-service" />
                              <FieldLabel htmlFor="room-service">
                                Room Service Available
                              </FieldLabel>
                            </Field>
                          </FieldGroup>
                        </div>
                        <div className={clsx(scss.form_block, 'col-span-2 sm:col-span-2 lg:col-span-2')}>
                          <FieldSet className="w-full max-w-xs">
                            <FieldLegend variant="label">Food Type</FieldLegend>
                            <RadioGroup defaultValue="VEG">
                              <Field orientation="horizontal">
                                <RadioGroupItem value="VEG" id="food-type-veg" />
                                <FieldLabel htmlFor="food-type-veg" className="font-normal">
                                  Veg
                                </FieldLabel>
                              </Field>
                              <Field orientation="horizontal">
                                <RadioGroupItem value="NON-VEG" id="food-type-non-veg" />
                                <FieldLabel htmlFor="food-type-non-veg" className="font-normal">
                                  Non-Veg
                                </FieldLabel>
                              </Field>
                              <Field orientation="horizontal">
                                <RadioGroupItem value="BOTH" id="food-type-both" />
                                <FieldLabel htmlFor="food-type-both" className="font-normal">
                                  Both
                                </FieldLabel>
                              </Field>
                            </RadioGroup>
                          </FieldSet>
                        </div>
                      </div>
                    </div>
                    <div className={scss.btn_wrapper}>
                      <button onClick={handlePrev} className={scss.prev_btn}>Prev</button>
                      <button onClick={handleNext} className={scss.next_btn}>Next</button>
                    </div>
                  </TabsContent>

                  {/* Registration Details Tab */}
                  <TabsContent value="registration-details" className={scss.custom_tabcontent}>
                    <div className={scss.form_details}>
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Registration no.</label>
                            <Input type="text" placeholder="Enter Registration no." />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Upload Registration certificate</label>
                            <Input type="file" placeholder="" accept='.pdf' />
                            <span className='text-sm text-muted-foreground'>File should be in PDF format and should not be greater than 2MB.</span>
                          </div>
                          {/* error message place here  */}
                        </div>
                      </div>
                    </div>
                    <div className={scss.btn_wrapper}>
                      <button onClick={handlePrev} className={scss.prev_btn}>Prev</button>
                      <button onClick={handleNext} className={scss.next_btn}>Next</button>
                    </div>
                  </TabsContent>

                  {/* Banking Details Tab */}
                  <TabsContent value="banking-details" className={scss.custom_tabcontent}>
                    <div className={scss.form_details}>
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Account Holder Name</label>
                            <Input type="text" placeholder="Enter Account Holder Name" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Bank Name</label>
                            <Input type="text" placeholder="Enter Bank Name" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Account Number</label>
                            <Input type="password" placeholder="Enter Account Number" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Confirm Account Number</label>
                            <Input type="text" placeholder="Confirm Account Number" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">IFSC Code</label>
                            <Input type="text" placeholder="Enter IFSC Code" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Branch Name</label>
                            <Input type="text" placeholder="Enter Branch Name" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Cancelled Cheque Upload</label>
                            <Input type="file" placeholder="Enter Cancelled Cheque Upload" accept='.pdf' />
                            <span className='text-sm text-muted-foreground'>File should be in PDF format and should not be greater than 2MB.</span>
                          </div>
                          {/* error message place here  */}
                        </div>
                      </div>
                    </div>
                    <div className={scss.btn_wrapper}>
                      <button onClick={handlePrev} className={scss.prev_btn}>Prev</button>
                      <button onClick={handleNext} className={scss.next_btn}>Next</button>
                    </div>
                  </TabsContent>

                  {/* Declaration Tab */}
                  <TabsContent value="declaration" className={scss.custom_tabcontent}>
                    <div className={scss.form_details}>
                      <div className={scss.conset_details}>
                        <Checkbox id="conset" />
                        <label htmlFor="conset">I hereby declare that the information provided above is true and correct. I authorize the service provider to list my property on JKTourism and contact me regarding onboarding and support.</label>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Owner's Name</label>
                            <Input type="text" placeholder="Name" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Date</label>
                            <Input type="date" placeholder="" />
                          </div>
                          {/* error message place here  */}
                        </div>

                      </div>
                    </div>
                    <div className={scss.btn_wrapper}>
                      <button onClick={handlePrev} className={scss.prev_btn}>Prev</button>
                      <button className={scss.submit_btn}>Submit</button>
                    </div>
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

const ROOM_TYPES = [
  "Standard",
  "Deluxe",
  "Super Deluxe",
  "Suite",
  "Executive",
];

type RoomType = {
  roomType: string;
  roomCount: number;
  tariff: number;
};