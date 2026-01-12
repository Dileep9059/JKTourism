import { useState } from 'react';
import scss from './hotelregister.module.scss';
import clsx from 'clsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from '../ui/calendar';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { ChevronDownIcon } from 'lucide-react';

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

  const [open, setOpen] = useState(false)
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
                  <TabsTrigger value="nodal-details" className='w-full'>Nodal Contact Person Details</TabsTrigger>
                  <TabsTrigger value="property-details" className='w-full'>Property Details</TabsTrigger>
                  <TabsTrigger value="amenity-details" className='w-full'>Amenities & Facilities</TabsTrigger>
                  <TabsTrigger value="food" className='w-full'>Food & Beverage</TabsTrigger>
                  <TabsTrigger value="registration-details" className='w-full'>Registration Details with Directorate</TabsTrigger>
                  <TabsTrigger value="banking-details" className='w-full'>Banking Details (for Payments)</TabsTrigger>
                  <TabsTrigger value="presnce" className='w-full'>Online Presence</TabsTrigger>
                  <TabsTrigger value="declaration" className='w-full'>Declaration</TabsTrigger>
                </TabsList>

                <div className={scss.tab_content_wrapper}>
                  {/* Basic Information Tab */}
                  <TabsContent value="basic-information" className={scss.custom_tabcontent}>
                    <div className={scss.form_details}>
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Hotel / Property Name</label>
                            <Input type="text" placeholder="Enter Hotel / Property Name" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Brand Name (if any)</label>
                            <Input type="text" placeholder="Enter Brand Name (if any)" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Property Type</label>
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Property Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="hotel">Hotel</SelectItem>
                                  <SelectItem value="resort">Resort</SelectItem>
                                  <SelectItem value="guest-house">Guest House</SelectItem>
                                  <SelectItem value="home-stay">Home Stay</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Star Rating (if applicable)</label>
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Star Rating" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="4">4</SelectItem>
                                  <SelectItem value="5">5</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>

                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <div className="flex flex-col gap-3">
                              <Label htmlFor="date" className="px-1">
                                Year of Establishment
                              </Label>
                              <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    id="date"
                                    className="w-48 justify-between font-normal"
                                  >
                                    {date ? date.toLocaleDateString() : "Select date"}
                                    <ChevronDownIcon />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                  {/* disable future dates */}
                                  <Calendar
                                    mode="single"
                                    selected={date}
                                    captionLayout="dropdown"
                                    disabled={(date) => date > new Date()}
                                    onSelect={(date) => {
                                      const today = new Date()
                                      if (date && date < today) {
                                        setDate(date)
                                        setOpen(false)
                                      }
                                    }}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          {/* error message place here  */}
                        </div>
                      </div>
                    </div>
                    <div className={scss.btn_wrapper}>
                      <button onClick={handleNext} className={scss.next_btn}>Next</button>
                    </div>
                  </TabsContent>

                  {/* Location Details Tab */}
                  <TabsContent value="location-details" className={scss.custom_tabcontent}>
                    <div className={scss.form_details}>
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="address">Address line 1</label>
                            <Input
                              placeholder="Enter Address line 1"
                              id="address"
                            />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="address">Address line 2</label>
                            <Input
                              placeholder="Enter Address line 2"
                              id="address"
                            />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">City</label>
                            <Input type="text" placeholder="Enter City" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">District</label>
                            <Input type="text" placeholder="Enter District" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">State</label>
                            <Input type="text" placeholder="Enter State" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Pincode</label>
                            <Input type="text" placeholder="Enter Pincode" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Latitude</label>
                            <Input type="text" placeholder="Enter Latitude" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Longitude</label>
                            <Input type="text" placeholder="Enter Longitude" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Google Maps Location Link</label>
                            <Input type="text" placeholder="Enter Google Maps Location Link" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Nearest Landmark</label>
                            <Input type="text" placeholder='Enter Nearest Landmark' />
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

                  {/* Nodal Details Tab */}
                  <TabsContent value="nodal-details" className={scss.custom_tabcontent}>
                    <div className={scss.form_details}>
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Manager Name</label>
                            <Input type="text" placeholder="Enter Manager Name" />
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
                            <label htmlFor="">Alternate Contact Number</label>
                            <Input type="text" placeholder='Enter Alternate Contact Number' />
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
                          <label htmlFor="">Preferred Communication Mode</label>
                          <div className={scss.inputblock_wrapper}>
                            <div className={scss.input_block}>
                              <Checkbox id="call" />
                              <label htmlFor="call">Call</label>
                            </div>
                            <div className={scss.input_block}>
                              <Checkbox id="whatsApp" />
                              <label htmlFor="whatsApp">WhatsApp</label>
                            </div>
                            <div className={scss.input_block}>
                              <Checkbox id="email" />
                              <label htmlFor="email">Email</label>
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

                  {/* Property Details Tab */}
                  <TabsContent value="property-details" className={scss.custom_tabcontent}>
                    <div className={scss.form_details}>
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Total Number of Rooms</label>
                            <Input type="text" placeholder="Enter Total Number of Rooms" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Room Categories (e.g., Standard, Deluxe, Suite)</label>
                            <Input type="text" placeholder="Enter Room Categories" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Maximum Occupancy per Room</label>
                            <Input type="text" placeholder='Enter Maximum Occupancy per Room' />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Number of Floors</label>
                            <Input type="text" placeholder='Enter Number of Floors' />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Check-in Time</label>
                            <Input type="text" placeholder='Select time' />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Check-out Time</label>
                            <Input type="text" placeholder='Select time' />
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
                        <div className={clsx(scss.form_block, 'col-span-2 sm:col-span-3 lg:col-span-3')}>
                          <div className={scss.input_block}>
                            <label htmlFor="highlite">Highlights</label>
                            <Textarea
                              placeholder="Enter Highlights"
                              id="highlite"
                              className="min-h-[100px]"
                            />
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
                          <RadioGroup >
                            <label htmlFor="">In-house Restaurant Available?</label>
                            <div className={scss.inputblock_wrapper}>
                              <div className={scss.input_block}>
                                <RadioGroupItem value="two single" id="bed-two" />
                                <label htmlFor="yes">Yes</label>
                              </div>
                              <div className={scss.input_block}>
                                <RadioGroupItem value="two single" id="bed-two" />
                                <label htmlFor="yes">Yes</label>
                              </div>
                            </div>
                          </RadioGroup>
                          {/* error message place here  */}
                        </div>
                        <div className={clsx(scss.form_block, 'col-span-2 sm:col-span-2 lg:col-span-2')}>
                          <RadioGroup >
                            <label htmlFor="">Meal Plans Offered</label>
                            <div className={scss.inputblock_wrapper}>
                              <div className={scss.input_block}>
                                <RadioGroupItem value="roomonly" id="roomonly" />
                                <label htmlFor="roomonly">Room Only(no meals)</label>
                              </div>
                              <div className={scss.input_block}>
                                <RadioGroupItem value="Breakfast" id="breakfast" />
                                <label htmlFor="breakfast">Breakfast</label>
                              </div>
                              <div className={scss.input_block}>
                                <RadioGroupItem value="Half Board" id="hb" />
                                <label htmlFor="hb">Half Board(breakfast + one other meal, usually dinner)</label>
                              </div>
                              <div className={scss.input_block}>
                                <RadioGroupItem value="Full Board" id="fb" />
                                <label htmlFor="fb">Full Board(breakfast, lunch, dinner)</label>
                              </div>
                              <div className={scss.input_block}>
                                <RadioGroupItem value="All-Inclusive" id="ai" />
                                <label htmlFor="ai">All-Inclusive (all meals, drinks, extras)</label>
                              </div>
                            </div>
                          </RadioGroup>
                          {/* error message place here  */}
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
                            <Input type="file" placeholder="" />
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
                            <Input type="text" placeholder="Enter Account Number" />
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
                            <Input type="text" placeholder="Enter Cancelled Cheque Upload" />
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

                  {/* Online Presence Tab */}
                  <TabsContent value="presnce" className={scss.custom_tabcontent}>
                    <div className={scss.form_details}>
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Hotel Website (if any)</label>
                            <Input type="text" placeholder="Enter Hotel Website (if any)" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Existing Channel Manager (if any)</label>
                            <Input type="text" placeholder="Enter Existing Channel Manager (if any)" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={clsx(scss.form_block, 'col-span-2 sm:col-span-2 lg:col-span-2')}>
                          <RadioGroup >
                            <label htmlFor="">Currently Listed On</label>
                            <div className={scss.inputblock_wrapper}>
                              <div className={scss.input_block}>
                                <RadioGroupItem value="MMT" id="mmt" />
                                <label htmlFor="mmt">MakeMyTrip</label>
                              </div>
                              <div className={scss.input_block}>
                                <RadioGroupItem value="Agoda" id="agoda" />
                                <label htmlFor="agoda">Agoda</label>
                              </div>
                              <div className={scss.input_block}>
                                <RadioGroupItem value="Booking" id="booking" />
                                <label htmlFor="booking">Booking.com</label>
                              </div>
                              <div className={scss.input_block}>
                                <RadioGroupItem value="Goibibo" id="gb" />
                                <label htmlFor="gb">Goibibo</label>
                              </div>
                              <div className={scss.input_block}>
                                <RadioGroupItem value="OYO" id="oyo" />
                                <label htmlFor="oyo">OYO</label>
                              </div>
                              <div className={scss.input_block}>
                                <RadioGroupItem value="None" id="none" />
                                <label htmlFor="none">None</label>
                              </div>
                            </div>
                          </RadioGroup>
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
                            <label htmlFor="">Owner’s Name</label>
                            <Input type="text" placeholder="Enter Owner’s Name" />
                          </div>
                          {/* error message place here  */}
                        </div>
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                            <label htmlFor="">Signature</label>
                            <Input type="file" placeholder="" />
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