import { useEffect, useRef, useState } from 'react'
import scss from './hotellist.module.scss';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { ArrowDown, Calendar as CalendarIcon, ChevronDown, ChevronRight, ChevronUp, Clock, Coffee, Leaf, MapPin, Minus, Plus, Search, User } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import clsx from 'clsx';
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt } from 'react-icons/fa';
import { Input } from '../ui/input';
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";


import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import axiosInstance, { axiosPrivate } from '@/axios/axios';
import { d } from '../utils/crypto';
// import required modules

function Hotellist() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  });

  const [childrenCount, setChildrenCount] = useState(0);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [hotelList, setHotelList] = useState<any[]>([]);

  const handleIncrement = () => {
    setChildrenCount((prev) => prev + 1);
    setChildrenAges((prev) => [...prev, 0]); // Default age is 0
  };

  const handleDecrement = () => {
    if (childrenCount > 0) {
      setChildrenCount((prev) => prev - 1);
      setChildrenAges((prev) => prev.slice(0, -1));
    }
  };

  const handleAgeChange = (index: number, value: number) => {
    const newAges = [...childrenAges];
    newAges[index] = value;
    setChildrenAges(newAges);
  };

  // State for selected filters and expanded view
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
  // State to track which list is expanded
  const [expandedLists, setExpandedLists] = useState<Record<string, boolean>>({
    suggested: false,
    facility: false,
    bedtype: false,
    accomodation: false,
    ratings: false,
    // Add more lists as needed
  });

  // Toggle filter selection
  const toggleFilter = (id: number) => {
    setSelectedFilters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle show more/less
  // Toggle the expanded state for a specific list
  const toggleList = (listName: string) => {
    setExpandedLists((prev) => ({
      ...prev,
      [listName]: !prev[listName],
    }));
  };

  async function fetchHotelList() {
    try {
      const response = await axiosInstance.post('/api/v1/hotels/hotellist');
      // const data = JSON.parse(await d(response?.data));
      // setHotelList(data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const mainSliderRef = useRef<Splide>(null);
  const thumbSliderRef = useRef<Splide>(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (mainSliderRef.current && thumbSliderRef.current) {
      // Sync the sliders
      mainSliderRef.current.sync(thumbSliderRef.current.splide);
    }
  }, []);

  useEffect(() => {
    fetchHotelList();
  }, [])


  return (
    <>
      <div className={scss.common_page}>
        <section className={scss.filter_top}>
          <div className="container mx-auto">
            <div className={scss.filter_wrapper}>
              <div className={scss.custom_form}>
                <div className={scss.form_block}>
                  <div className={scss.filter_group}>
                    <div className={scss.input_block}>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="City/Location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {/* <SelectLabel>City/Location</SelectLabel> */}
                            <SelectItem value="jammu">Jammu</SelectItem>
                            <SelectItem value="kashmir">Kashmir</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className={scss.input_block}>
                      <Select>
                        <SelectTrigger >
                          <SelectValue placeholder="Room Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {/* <SelectLabel>City/Location</SelectLabel> */}
                            <SelectItem value="jammu">Deluxe Room</SelectItem>
                            <SelectItem value="kashmir">Super Deluxe Room</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className={scss.input_block}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              "w-[300px] justify-start text-left font-normal",
                              !dateRange && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                              dateRange.to ? (
                                <>
                                  {format(dateRange.from, "LLL dd, y")} -{" "}
                                  {format(dateRange.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(dateRange.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className={scss.input_block}>
                      <Select>
                        <SelectTrigger >
                          <SelectValue placeholder="Rooms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {/* <SelectLabel>City/Location</SelectLabel> */}
                            <SelectItem value="jammu">1</SelectItem>
                            <SelectItem value="kashmir">2</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className={scss.input_block}>
                      <Select>
                        <SelectTrigger >
                          <SelectValue placeholder="Adults" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {/* <SelectLabel>City/Location</SelectLabel> */}
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className={scss.input_block}>
                      <div className="relative">
                        <Popover open={isOpen} onOpenChange={setIsOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between"
                              onClick={() => setIsOpen(!isOpen)}
                            >
                              Children (below 17): {childrenCount}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className={clsx(scss.age_body, "w-80 p-4")}>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">Children</h4>
                                  <p className="text-sm text-muted-foreground">Ages 0-17</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleDecrement}
                                    disabled={childrenCount === 0}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="w-8 text-center">{childrenCount}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleIncrement}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              {childrenAges.map((age, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span>Child {index + 1}</span>
                                  <Select
                                    value={age.toString()}
                                    onValueChange={(value) => handleAgeChange(index, parseInt(value))}
                                  >
                                    <SelectTrigger className="w-[100px]">
                                      <SelectValue placeholder="Age" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from({ length: 18 }, (_, i) => (
                                        <SelectItem key={i} value={i.toString()}>
                                          {i}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className={scss.input_block}>
                      <Link role="button" className={scss.search_btn} to={"/hotel-list"}><span>Search</span> <div className={scss.search_icon}><ArrowDown /></div></Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={scss.hotel_list}>
          <div className={scss.list_wrapper}>
            <div style={{ display: 'flex', width: '100%', gap: '1rem' }}>
              <div className={scss.list_filter}>
                <div className={scss.facility_list}>
                  <h3 className={scss.list_title}>Suggested For You</h3>
                  <ul>
                    <li>
                      <Checkbox
                        id="filter-1"
                        checked={selectedFilters.includes(1)}
                        onCheckedChange={() => toggleFilter(1)}
                      />
                      <label
                        htmlFor="filter-1"
                        className=""
                      >
                        Breakfast included
                      </label>
                    </li>
                    <li>
                      <Checkbox
                        id="filter-1"
                        checked={selectedFilters.includes(2)}
                        onCheckedChange={() => toggleFilter(2)}
                      />
                      <label
                        htmlFor="filter-1"
                        className=""
                      >
                        All-inclusive
                      </label>
                    </li>
                    <li>
                      <Checkbox
                        id="filter-1"
                        checked={selectedFilters.includes(3)}
                        onCheckedChange={() => toggleFilter(3)}
                      />
                      <label
                        htmlFor="filter-1"
                        className=""
                      >
                        Free Cancellation
                      </label>
                    </li>
                    {expandedLists.suggested && (
                      <>
                        <li>
                          <Checkbox
                            id="filter-1"
                            checked={selectedFilters.includes(4)}
                            onCheckedChange={() => toggleFilter(4)}
                          />
                          <label
                            htmlFor="filter-1"
                            className=""
                          >
                            Extra 1
                          </label>
                        </li>
                        <li>
                          <Checkbox
                            id="filter-1"
                            checked={selectedFilters.includes(5)}
                            onCheckedChange={() => toggleFilter(5)}
                          />
                          <label
                            htmlFor="filter-1"
                            className=""
                          >
                            Extra 2
                          </label>
                        </li>
                        <li>
                          <Checkbox
                            id="filter-1"
                            checked={selectedFilters.includes(6)}
                            onCheckedChange={() => toggleFilter(6)}
                          />
                          <label
                            htmlFor="filter-1"
                            className=""
                          >
                            Extra 3
                          </label>
                        </li>
                      </>
                    )}
                  </ul>
                  <button onClick={() => toggleList("suggested")} className="flex items-center text-sm text-blue-600 hover:underline" >
                    {expandedLists.suggested ? (
                      <>
                        <ChevronUp className="mr-1 h-3 w-3" /> Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-1 h-3 w-3" /> Show more
                      </>
                    )}
                  </button>
                </div>
                <div className={scss.facility_list}>
                  <h3 className={scss.list_title}>Room Facilities</h3>
                  <ul>
                    <li>
                      <Checkbox
                        id="filter-1"
                        checked={selectedFilters.includes(1)}
                        onCheckedChange={() => toggleFilter(1)}
                      />
                      <label
                        htmlFor="filter-1"
                        className=""
                      >
                        Baby Bed
                      </label>
                    </li>
                    <li>
                      <Checkbox
                        id="filter-1"
                        checked={selectedFilters.includes(2)}
                        onCheckedChange={() => toggleFilter(2)}
                      />
                      <label
                        htmlFor="filter-1"
                        className=""
                      >
                        Bathtub
                      </label>
                    </li>
                    {expandedLists.facility && (
                      <>
                        <li>
                          <Checkbox
                            id="filter-1"
                            checked={selectedFilters.includes(4)}
                            onCheckedChange={() => toggleFilter(4)}
                          />
                          <label
                            htmlFor="filter-1"
                            className=""
                          >
                            Swimming Pool
                          </label>
                        </li>
                        <li>
                          <Checkbox
                            id="filter-1"
                            checked={selectedFilters.includes(5)}
                            onCheckedChange={() => toggleFilter(5)}
                          />
                          <label
                            htmlFor="filter-1"
                            className=""
                          >
                            Internet access
                          </label>
                        </li>
                        <li>
                          <Checkbox
                            id="filter-1"
                            checked={selectedFilters.includes(6)}
                            onCheckedChange={() => toggleFilter(6)}
                          />
                          <label
                            htmlFor="filter-1"
                            className=""
                          >
                            Heating
                          </label>
                        </li>
                      </>
                    )}
                  </ul>
                  <button onClick={() => toggleList("facility")} className="flex items-center text-sm text-blue-600 hover:underline" >
                    {expandedLists.facility ? (
                      <>
                        <ChevronUp className="mr-1 h-3 w-3" /> Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-1 h-3 w-3" /> Show more
                      </>
                    )}
                  </button>
                </div>
                <div className={scss.facility_list}>
                  <h3 className={scss.list_title}>Bed Type</h3>
                  <RadioGroup >
                    <ul>
                      <li>
                        <RadioGroupItem value="two single" id="bed-two" />
                        <label
                          htmlFor="bed-two"
                          className=""
                        >
                          Two Single Beds
                        </label>
                      </li>
                      <li>
                        <RadioGroupItem value="kind beds" id="bed-king" />
                        <label
                          htmlFor="bed-king"
                          className=""
                        >
                          King Beds
                        </label>
                      </li>
                      <li>
                        <RadioGroupItem value="baby cots" id="babay-cots" />
                        <label
                          htmlFor="baby-cots"
                          className=""
                        >
                          Baby Cots
                        </label>
                      </li>
                      <li>
                        <RadioGroupItem value="double bed" id="double-bed" />
                        <label
                          htmlFor="double-bed"
                          className=""
                        >
                          Double Bed
                        </label>
                      </li>
                      <li>
                        <RadioGroupItem value="single bed" id="single-bed" />
                        <label
                          htmlFor="single-bed"
                          className=""
                        >
                          Single Bed
                        </label>
                      </li>
                      {expandedLists.bedtype && (
                        <>
                          <li>
                            <RadioGroupItem value="queen" id="queen" />
                            <label
                              htmlFor="queen"
                              className=""
                            >
                              Queen
                            </label>
                          </li>
                          <li>
                            <RadioGroupItem value="bannk bed" id="bunk-bed" />
                            <label
                              htmlFor="bunk-bed"
                              className=""
                            >
                              Bunk bed
                            </label>
                          </li>
                        </>
                      )}
                    </ul>
                  </RadioGroup>
                  <button onClick={() => toggleList("bedtype")} className="flex items-center text-sm text-blue-600 hover:underline" >
                    {expandedLists.bedtype ? (
                      <>
                        <ChevronUp className="mr-1 h-3 w-3" /> Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-1 h-3 w-3" /> Show more
                      </>
                    )}
                  </button>
                </div>
                <div className={scss.facility_list}>
                  <h3 className={scss.list_title}>Accommodation classification </h3>
                  <RadioGroup >
                    <ul>
                      <li>
                        <RadioGroupItem value="five star" id="five-star" />
                        <label
                          htmlFor="five-star"
                          className=""
                        >
                          5 Stars
                        </label>
                      </li>
                      <li>
                        <RadioGroupItem value="four star" id="four-star" />
                        <label
                          htmlFor="four-star"
                          className=""
                        >
                          4 Stars
                        </label>
                      </li>
                      <li>
                        <RadioGroupItem value="three star" id="three-star" />
                        <label
                          htmlFor="three-star"
                          className=""
                        >
                          3 Stars
                        </label>
                      </li>
                      {expandedLists.accomodation && (
                        <>
                          <li>
                            <RadioGroupItem value="two star" id="two-star" />
                            <label
                              htmlFor="two-star"
                              className=""
                            >
                              2 Stars
                            </label>
                          </li>
                          <li>
                            <RadioGroupItem value="one star" id="one-star" />
                            <label
                              htmlFor="one-star"
                              className=""
                            >
                              1 Star
                            </label>
                          </li>
                        </>
                      )}
                    </ul>
                  </RadioGroup>
                  <button onClick={() => toggleList("accomodation")} className="flex items-center text-sm text-blue-600 hover:underline" >
                    {expandedLists.accomodation ? (
                      <>
                        <ChevronUp className="mr-1 h-3 w-3" /> Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-1 h-3 w-3" /> Show more
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className={scss.result_block}>
                <div className={clsx(scss.filter_slider, "relative")}>
                  <button
                    onClick={() => swiperRef.current?.swiper.slidePrev()}
                    className={clsx(scss.prev_btn, "swiper-button-prev rounded-full bg-white p-2 shadow-md")}
                  >
                    <FaChevronLeft />
                  </button>
                  <div className={scss.filter_slider_wrapper}>
                    <Swiper
                      slidesPerView={3}
                      spaceBetween={20}
                      slidesPerGroup={1}
                      freeMode={true}
                      // navigation={true}
                      modules={[FreeMode, Navigation]}
                      navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                      }}
                      className="mySwiper"
                    >
                      <SwiperSlide>
                        <div className={scss.filter_btn}>
                          <input type="radio" id='popularity' name='filter' />
                          <label htmlFor="popularity">Popularity</label>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className={scss.filter_btn}>
                          <input type="radio" id='pricelth' name='filter' />
                          <label htmlFor="pricelth">Price (Low to High)</label>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className={scss.filter_btn}>
                          <input type="radio" id='rating' name='filter' />
                          <label htmlFor="rating">User Rating (Highest)</label>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className={scss.filter_btn}>
                          <input type="radio" id='lp' name='filter' />
                          <label htmlFor="lp">Lowest Price & Best Rated</label>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className={scss.filter_btn}>
                          <input type="radio" id='nearest' name='filter' />
                          <label htmlFor="nearest">Nearest to -</label>
                        </div>
                      </SwiperSlide>
                    </Swiper>
                  </div>
                  <button
                    onClick={() => swiperRef.current?.swiper.slideNext()}
                    className={clsx(scss.next_btn, "swiper-button-next rounded-full bg-white p-2 shadow-md")}
                  >
                    <FaChevronRight />
                  </button>
                </div>
                <h4 className={scss.result_head}>Srinagar : 18 Results found lore</h4>
                <div className={scss.hotel_card_wrapper}>
                  { }
                  <div className={scss.hotel_card}>
                    <div className={scss.gallery}>
                      <div className={scss.main_slider}>
                        <Splide
                          ref={mainSliderRef}
                          options={{
                            type: "loop",
                            perPage: 1,
                            arrows: false,
                            pagination: false,
                          }}
                          aria-label="Main Slider"
                        >
                          {/* Main Slides */}
                          <SplideSlide>
                            <img
                              src={`${import.meta.env.VITE_BASE}assets/images/hotel-booking/gallery-1.jpeg`}
                              alt="image"
                              className="w-full h-full object-cover"
                            />
                          </SplideSlide>
                          <SplideSlide>
                            <img
                              src={`${import.meta.env.VITE_BASE}assets/images/hotel-booking/gallery-1.1.png`}
                              alt="image"
                              className="w-full h-full object-cover"
                            />
                          </SplideSlide>
                          <SplideSlide>
                            <img
                              src={`${import.meta.env.VITE_BASE}assets/images/hotel-booking/gallery-1.2.png`}
                              alt="image"
                              className="w-full h-full object-cover"
                            />
                          </SplideSlide>
                          <SplideSlide>
                            <img
                              src={`${import.meta.env.VITE_BASE}assets/images/hotel-booking/gallery-1.3.png`}
                              alt="image"
                              className="w-full h-full object-cover"
                            />
                          </SplideSlide>
                        </Splide>
                      </div>
                      {/* Thumbnail Slider */}
                      <div className={scss.thumb_slider}>
                        <Splide
                          ref={thumbSliderRef}
                          options={{
                            direction: "ttb",
                            height: "300px",
                            rewind: true,
                            gap: "1rem",
                            pagination: false,
                            fixedWidth: 100,
                            fixedHeight: 70,
                            isNavigation: true,
                            updateOnMove: true,
                            cover: true,
                            focus: "center",
                            wheels: false,
                          }}
                          aria-label="Thumbnail Navigation"
                        >
                          {/* Thumbnail Slides */}
                          <SplideSlide>
                            <img
                              src={`${import.meta.env.VITE_BASE}assets/images/hotel-booking/gallery-1.jpeg`}
                              alt="Thumbnail 2"
                              className="w-full h-full object-cover"
                            />
                          </SplideSlide>
                          <SplideSlide>
                            <img
                              src={`${import.meta.env.VITE_BASE}assets/images/hotel-booking/gallery-1.1.png`}
                              alt="Thumbnail 2"
                              className="w-full h-full object-cover"
                            />
                          </SplideSlide>
                          <SplideSlide>
                            <img
                              src={`${import.meta.env.VITE_BASE}assets/images/hotel-booking/gallery-1.2.png`}
                              alt="Thumbnail 3"
                              className="w-full h-full object-cover"
                            />
                          </SplideSlide>
                          <SplideSlide>
                            <img
                              src={`${import.meta.env.VITE_BASE}assets/images/hotel-booking/gallery-1.3.png`}
                              alt="Thumbnail 4"
                              className="w-full h-full object-cover"
                            />
                          </SplideSlide>
                        </Splide>
                      </div>
                    </div>
                    <div className={scss.card_content}>
                      <div className={scss.card_head}>
                        <h4 className={scss.hotel_name}>Hotel Name</h4>
                        <ul className={scss.facility_list}>
                          <li><MapPin /><span>Located In Srinagar, 500m Distance to pathan</span></li>
                          <li><Coffee /> <span>Breakfast Included</span></li>
                          <li><User /><span>1 Adult, 2 Children </span></li>
                          <li><Clock /><span>4 Nights </span></li>
                        </ul>
                      </div>
                      <div className={scss.card_footer}>
                        <div className={scss.detail_block}>
                          <p className='text-muted'>Experience Unique Opportunity </p>
                          <p>Standard rooms </p>
                          <div className={scss.review_detail}><h5>Very Good ,</h5><span>2.259 Reviews</span></div>
                        </div>
                        <div className={scss.price_block}>
                          <h5>6800/-</h5>
                          <p>Includes taxes and charges</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Hotellist