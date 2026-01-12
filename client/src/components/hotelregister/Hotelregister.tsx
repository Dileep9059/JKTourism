import React, { useState } from 'react';
import scss from './hotelregister.module.scss';
import clsx from 'clsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select" 
import { format } from "date-fns";
import { ArrowDown, Calendar as CalendarIcon, ChevronDown, Minus, Plus } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { GiFamilyHouse } from "react-icons/gi";

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
            <div className={clsx(scss.tab_container ,"container mx-auto")}>
            <div className={scss.destination_title}>
            <h2 className={clsx(scss.cattitle, "mt-5")}>List Your Hotel</h2>
          </div>
            <Tabs value={currentTab} onValueChange={setCurrentTab} className={scss.custom_tab}>
              <TabsList className={scss.custom_tablist}>
                <TabsTrigger value="basic-information">Property Basic Information</TabsTrigger>
                <TabsTrigger value="location-details">Location Details</TabsTrigger>
                <TabsTrigger value="owner-details">Owner / Contact Details</TabsTrigger>
                <TabsTrigger value="nodal-details">Nodal Contact Person Details</TabsTrigger>
                <TabsTrigger value="property-details">Property Details</TabsTrigger>
                <TabsTrigger value="amenity-details">Amenities & Facilities</TabsTrigger>
                <TabsTrigger value="food">Food & Beverage</TabsTrigger>
                <TabsTrigger value="registration-details">Registration Details with Directorate</TabsTrigger>
                <TabsTrigger value="banking-details">Banking Details (for Payments)</TabsTrigger>
                <TabsTrigger value="presnce">Online Presence</TabsTrigger>
                <TabsTrigger value="declaration">Declaration</TabsTrigger>
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
                              <Input type="text" placeholder="Enter Property Type" />
                          </div>
                          {/* error message place here  */}
                        </div> 
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                              <label htmlFor="">Star Rating (if applicable)</label>
                              <Input type="text" placeholder="Enter Star Rating (if applicable)" />
                          </div>
                          {/* error message place here  */}
                        </div> 
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                              <label htmlFor="">Upload Property Photos (Rooms, Washrooms, Reception, Exterior)</label>
                              <Input type="file"  />
                          </div>
                          {/* error message place here  */}
                        </div> 
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                              <label htmlFor="">Year of Establishment</label>
                              <Input type="date" placeholder="Select date" />
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
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                       <div className={scss.form_block}>
                          <div className={scss.input_block}>
                              <label htmlFor="address">Full Address</label> 
                              <Textarea
                                  placeholder="Enter Full Address"
                                  id="address"  
                                  className="min-h-[80px]"
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
                              <label htmlFor="">PIN / ZIP Code</label>
                              <Input type="text" placeholder="Enter PIN / ZIP Code" />
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
                              <Input type="text"  placeholder='Enter Nearest Landmark'/>
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
                              <Input type="text" placeholder="Enter Owner’s Full Name" />
                          </div>
                          {/* error message place here  */}
                        </div> 
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                              <label htmlFor="">Designation</label>
                              <Input type="text" placeholder="Enter Designation" />
                          </div>
                          {/* error message place here  */}
                        </div> 
                        <div className={clsx(scss.form_block,'col-span-2 sm:col-span-2 lg:col-span-2')}>
                          <div className={scss.inputblock_wrapper}> 
                            <div className={scss.input_block}>
                              <Checkbox id="owner" />
                              <label htmlFor="owner">Owner</label> 
                            </div>
                            <div className={scss.input_block}>
                              <Checkbox id="partner" />
                              <label htmlFor="partner">Partner</label> 
                            </div>
                            <div className={scss.input_block}>
                              <Checkbox id="manager" />
                              <label htmlFor="manager">Manager</label> 
                            </div>
                          
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
                              <Input type="text"  placeholder='Enter Alternate Contact Number'/>
                          </div>
                          {/* error message place here  */}
                        </div>   
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                              <label htmlFor="">Email Address</label>
                              <Input type="email"  placeholder='Enter Email Address'/>
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
                              <label htmlFor="">Name(Partner/Manager)</label>
                              <Input type="text" placeholder="Enter Name(Partner/Manager)" />
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
                              <Input type="text"  placeholder='Enter Alternate Contact Number'/>
                          </div>
                          {/* error message place here  */}
                        </div>   
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                              <label htmlFor="">Email Address</label>
                              <Input type="email"  placeholder='Enter Email Address'/>
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
                              <Input type="text"  placeholder='Enter Maximum Occupancy per Room'/>
                          </div>
                          {/* error message place here  */}
                        </div>   
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                              <label htmlFor="">Number of Floors</label>
                              <Input type="text"  placeholder='Enter Number of Floors'/>
                          </div>
                          {/* error message place here  */}
                        </div> 
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                              <label htmlFor="">Check-in Time</label>
                              <Input type="text"  placeholder='Select time'/>
                          </div>
                          {/* error message place here  */}
                        </div>    
                        <div className={scss.form_block}>
                          <div className={scss.input_block}>
                              <label htmlFor="">Check-out Time</label>
                              <Input type="text"  placeholder='Select time'/>
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
                        <div className={clsx(scss.form_block,'col-span-2 sm:col-span-3 lg:col-span-3')}>
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
                        <div className={clsx(scss.form_block,'col-span-2 sm:col-span-2 lg:col-span-2')}>
                          <RadioGroup >
                          <label htmlFor="">In-house Restaurant Available?</label>
                          <div className={scss.inputblock_wrapper}>
                              <div className={scss.input_block}>          
                                <RadioGroupItem value="two single" id="bed-two"/>
                                <label htmlFor="yes">Yes</label>
                              </div>
                              <div className={scss.input_block}>          
                                <RadioGroupItem value="two single" id="bed-two"/>
                                <label htmlFor="yes">Yes</label>
                              </div>
                          </div>
                        </RadioGroup>
                          {/* error message place here  */}
                        </div>
                        <div className={clsx(scss.form_block,'col-span-2 sm:col-span-2 lg:col-span-2')}>
                          <RadioGroup >
                          <label htmlFor="">Meal Plans Offered</label>
                          <div className={scss.inputblock_wrapper}>
                              <div className={scss.input_block}>          
                                <RadioGroupItem value="roomonly" id="roomonly"/>
                                <label htmlFor="roomonly">Room Only(no meals)</label>
                              </div> 
                              <div className={scss.input_block}>          
                                <RadioGroupItem value="Breakfast" id="breakfast"/>
                                <label htmlFor="breakfast">Breakfast</label>
                              </div> 
                              <div className={scss.input_block}>          
                                <RadioGroupItem value="Half Board" id="hb"/>
                                <label htmlFor="hb">Half Board(breakfast + one other meal, usually dinner)</label>
                              </div> 
                              <div className={scss.input_block}>          
                                <RadioGroupItem value="Full Board" id="fb"/>
                                <label htmlFor="fb">Full Board(breakfast, lunch, dinner)</label>
                              </div>
                              <div className={scss.input_block}>          
                                <RadioGroupItem value="All-Inclusive" id="ai"/>
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
                        <div className={clsx(scss.form_block,'col-span-2 sm:col-span-2 lg:col-span-2')}>
                          <RadioGroup >
                          <label htmlFor="">Currently Listed On</label>
                          <div className={scss.inputblock_wrapper}>
                              <div className={scss.input_block}>          
                                <RadioGroupItem value="MMT" id="mmt"/>
                                <label htmlFor="mmt">MakeMyTrip</label>
                              </div> 
                              <div className={scss.input_block}>          
                                <RadioGroupItem value="Agoda" id="agoda"/>
                                <label htmlFor="agoda">Agoda</label>
                              </div> 
                              <div className={scss.input_block}>          
                                <RadioGroupItem value="Booking" id="booking"/>
                                <label htmlFor="booking">Booking.com</label>
                              </div> 
                              <div className={scss.input_block}>          
                                <RadioGroupItem value="Goibibo" id="gb"/>
                                <label htmlFor="gb">Goibibo</label>
                              </div>
                              <div className={scss.input_block}>          
                                <RadioGroupItem value="OYO" id="oyo"/>
                                <label htmlFor="oyo">OYO</label>
                              </div> 
                              <div className={scss.input_block}>          
                                <RadioGroupItem value="None" id="none"/>
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