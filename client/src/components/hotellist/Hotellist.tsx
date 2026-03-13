import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import scss from './hotellist.module.scss';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import {
  ArrowDown, Calendar as CalendarIcon, ChevronDown, ChevronUp,
  MapPin, Minus, Plus, Star, Building2, Loader2
} from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import clsx from 'clsx';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import axiosInstance from '@/axios/axios';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Hotel {
  id: string;
  displayName: string;
  legalName: string;
  city: string;
  district: string;
  state: string;
  landmark: string | null;
  description: string | null;
  starRating: number | null;
  hotelType: string | null;
  minTariff: number | null;
  roomTypeName: string | null;
  coverPhotoUrl: string | null;
}

interface HotelPage {
  content: Hotel[];
  totalElements: number;
  totalPages: number;
  number: number;
}

// Only Jammu and Kashmir as requested
const DISTRICTS = ["Jammu", "Kashmir"];

// ── Component ──────────────────────────────────────────────────────────────────

function Hotellist() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  const [childrenCount, setChildrenCount] = useState(0);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
  const [isChildOpen, setIsChildOpen] = useState(false);
  const [roomsCount, setRoomsCount] = useState(1);
  const [adultsCount, setAdultsCount] = useState(1);

  // ── Search filter state (what user selected in UI) ────────────────────────
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedStarRating, setSelectedStarRating] = useState<string>('all');
  const [selectedRoomType, setSelectedRoomType] = useState<string>('all');

  // ── Applied filter state (what was last searched) ─────────────────────────
  const [appliedDistrict, setAppliedDistrict] = useState<string>('all');
  const [appliedStarRating, setAppliedStarRating] = useState<string>('all');
  const [appliedRoomType, setAppliedRoomType] = useState<string>('all');

  // ── Hotel list state ──────────────────────────────────────────────────────
  const [hotelList, setHotelList] = useState<Hotel[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>('Popularity');

  // ── Sidebar filter state ──────────────────────────────────────────────────
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
  const [expandedLists, setExpandedLists] = useState<Record<string, boolean>>({
    suggested: false,
    facility: false,
  });

  const swiperRef = useRef<any>(null);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const handleIncrement = () => {
    setChildrenCount(p => p + 1);
    setChildrenAges(p => [...p, 0]);
  };
  const handleDecrement = () => {
    if (childrenCount > 0) {
      setChildrenCount(p => p - 1);
      setChildrenAges(p => p.slice(0, -1));
    }
  };
  const handleAgeChange = (index: number, value: number) => {
    const ages = [...childrenAges];
    ages[index] = value;
    setChildrenAges(ages);
  };
  const toggleFilter = (id: number) =>
    setSelectedFilters(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const toggleList = (name: string) =>
    setExpandedLists(p => ({ ...p, [name]: !p[name] }));

  // ── API call ──────────────────────────────────────────────────────────────
 const fetchHotelList = useCallback(async (page = 0) => {
  setLoading(true);
  setError(null);
  try {
    const payload: Record<string, any> = { page, size: 10 };

    if (appliedDistrict !== 'all') payload.district = appliedDistrict;
    if (appliedStarRating !== 'all') payload.starRating = Number(appliedStarRating);
    if (appliedRoomType !== 'all') payload.roomType = appliedRoomType;

    const response = await axiosInstance.post('/api/v1/hotels/hotellist', payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    const data: HotelPage = response.data;
    setHotelList(data.content);
    setTotalElements(data.totalElements);
    setTotalPages(data.totalPages);
    setCurrentPage(data.number);
  } catch (err: any) {
    setError('Failed to load hotels. Please try again.');
    console.error(err);
  } finally {
    setLoading(false);
  }
}, [appliedDistrict, appliedStarRating, appliedRoomType]);

  // Load filters from URL params when page loads
  useEffect(() => {
  const params = new URLSearchParams(location.search);

  const city = params.get('city') || 'all';
  const roomType = params.get('roomType') || 'all';
  const starRating = params.get('starRating') || 'all';
  const rooms = parseInt(params.get('rooms') || '1');
  const adults = parseInt(params.get('adults') || '1');
  const children = parseInt(params.get('children') || '0');

  setSelectedDistrict(city);
  setSelectedRoomType(roomType);
  setSelectedStarRating(starRating);
  setRoomsCount(rooms);
  setAdultsCount(adults);
  setChildrenCount(children);

  setAppliedDistrict(city);
  setAppliedRoomType(roomType);
  setAppliedStarRating(starRating);

  if (params.has('checkIn') && params.has('checkOut')) {
    const checkIn = params.get('checkIn');
    const checkOut = params.get('checkOut');

    if (checkIn && checkOut) {
      const from = new Date(checkIn);
      const to = new Date(checkOut);
      setDateRange({ from, to });
    }
  }

  if (params.has('childrenAges')) {
    const ages = (params.get('childrenAges') || '')
      .split(',')
      .map(age => parseInt(age))
      .filter(age => !isNaN(age));
    setChildrenAges(ages);
  }

  fetchHotelListWithFilters(0, city, starRating, roomType);
}, [location.search]);

  // Direct fetch with explicit filters — avoids stale state timing issues
  const fetchHotelListWithFilters = async (page = 0, district: string, starRating: string, roomType: string) => {
    setLoading(true);
    setError(null);
    try {
      const payload: Record<string, any> = { page, size: 10 };
      if (district !== 'all')   payload.district   = district;
      if (starRating !== 'all') payload.starRating = Number(starRating);
      if (roomType !== 'all')   payload.roomType   = roomType;

      const response = await axiosInstance.post('/api/v1/hotels/hotellist', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data: HotelPage = response.data;
      setHotelList(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
    } catch (err: any) {
      setError('Failed to load hotels. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 

  const handleSearch = () => {
    setAppliedDistrict(selectedDistrict);
    setAppliedStarRating(selectedStarRating);
    setAppliedRoomType(selectedRoomType);
    setCurrentPage(0);
    fetchHotelListWithFilters(0, selectedDistrict, selectedStarRating, selectedRoomType);
  };

  // ── Auto-trigger search when star rating changes ────────────────────────────
  const handleStarRatingChange = (value: string) => {
    setSelectedStarRating(value);
    setAppliedDistrict(selectedDistrict);
    setAppliedStarRating(value);
    setAppliedRoomType(selectedRoomType);
    setCurrentPage(0);
    fetchHotelListWithFilters(0, selectedDistrict, value, selectedRoomType);
  };

  // ── Star icons helper ─────────────────────────────────────────────────────
  const renderStars = (count: number | null) => {
    if (!count) return null;
    return (
      <span className="flex gap-0.5">
        {Array.from({ length: count }, (_, i) => (
          <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
        ))}
      </span>
    );
  };

  // ── Photo URL helper ──────────────────────────────────────────────────────
  const getPhotoUrl = (url: string | null) => {
    if (!url) return `${import.meta.env.VITE_BASE}assets/images/hotel-booking/gallery-1.jpeg`;
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_APP_API_BASE_URL}${url}`;
  };

  // ── Sort hotels based on selected sort option ─────────────────────────────
  const getSortedHotels = (hotels: Hotel[]) => {
    const sorted = [...hotels];
    if (selectedSort === 'Price (Low to High)') {
      sorted.sort((a, b) => (a.minTariff ?? 0) - (b.minTariff ?? 0));
    } else if (selectedSort === 'Price (High to Low)') {
      sorted.sort((a, b) => (b.minTariff ?? 0) - (a.minTariff ?? 0));
    } else if (selectedSort === 'User Rating (Highest)') {
      sorted.sort((a, b) => (b.starRating ?? 0) - (a.starRating ?? 0));
    } else if (selectedSort === 'Lowest Price & Best Rated') {
      sorted.sort((a, b) => {
        const scoreA = (a.minTariff ?? 0) - (a.starRating ?? 0) * 1000;
        const scoreB = (b.minTariff ?? 0) - (b.starRating ?? 0) * 1000;
        return scoreA - scoreB;
      });
    }
    return sorted;
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <div className={scss.common_page}>

        {/* ── Top search bar ─────────────────────────────────────────────── */}
        <section className={scss.filter_top}>
          <div className="container mx-auto">
            <div className={scss.filter_wrapper}>
              <div className={scss.custom_form}>
                <div className={scss.form_block}>
                  <div className={scss.filter_group}>

                    {/* District — Jammu / Kashmir only */}
                    <div className={scss.input_block}>
                      <Select
                        value={selectedDistrict}
                        onValueChange={setSelectedDistrict}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="City/Location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="all">All</SelectItem>
                            {DISTRICTS.map(d => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Room Type */}
                    <div className={scss.input_block}>
                      <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Room Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="all">All Room Types</SelectItem>
                            <SelectItem value="Standard Room">Standard Room</SelectItem>
                            <SelectItem value="Deluxe Room">Deluxe Room</SelectItem>
                            <SelectItem value="Super Deluxe Room">Super Deluxe Room</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date range */}
                    <div className={scss.input_block}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant="outline"
                            className={cn("w-[300px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                              dateRange.to
                                ? <>{format(dateRange.from, "LLL dd, y")} – {format(dateRange.to, "LLL dd, y")}</>
                                : format(dateRange.from, "LLL dd, y")
                            ) : <span>Pick a date range</span>}
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

                    {/* Rooms (UI only) */}
                    <div className={scss.input_block}>
                      <Select value={roomsCount.toString()} onValueChange={(val) => setRoomsCount(parseInt(val))}>
                        <SelectTrigger><SelectValue placeholder="Rooms" /></SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                              <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Adults (UI only) */}
                    <div className={scss.input_block}>
                      <Select value={adultsCount.toString()} onValueChange={(val) => setAdultsCount(parseInt(val))}>
                        <SelectTrigger><SelectValue placeholder="Adults" /></SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                              <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Children */}
                    <div className={scss.input_block}>
                      <Popover open={isChildOpen} onOpenChange={setIsChildOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                            onClick={() => setIsChildOpen(!isChildOpen)}
                          >
                            Children (below 17): {childrenCount}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className={clsx(scss.age_body, "w-80 p-4")}>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">Children</h4>
                                <p className="text-sm text-muted-foreground">Ages 0–17</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" onClick={handleDecrement} disabled={childrenCount === 0}>
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center">{childrenCount}</span>
                                <Button variant="outline" size="icon" onClick={handleIncrement}>
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {childrenAges.map((age, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <span>Child {i + 1}</span>
                                <Select value={age.toString()} onValueChange={v => handleAgeChange(i, parseInt(v))}>
                                  <SelectTrigger className="w-[100px]"><SelectValue placeholder="Age" /></SelectTrigger>
                                  <SelectContent>
                                    {Array.from({ length: 18 }, (_, n) => (
                                      <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Search button */}
                    <div className={scss.input_block}>
                      <button className={scss.search_btn} onClick={handleSearch}>
                        <span>Search</span>
                        <div className={scss.search_icon}><ArrowDown /></div>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Main content ───────────────────────────────────────────────── */}
        <section className={scss.hotel_list}>
          <div className={scss.list_wrapper}>
            <div style={{ display: 'flex', width: '100%', gap: '1rem' }}>

              {/* ── Left sidebar ─────────────────────────────────────────── */}
              <div className={scss.list_filter}>

                {/* Suggested */}
                <div className={scss.facility_list}>
                  <h3 className={scss.list_title}>Suggested For You</h3>
                  <ul>
                    {[
                      { id: 1, label: 'Breakfast included' },
                      { id: 2, label: 'All-inclusive' },
                      { id: 3, label: 'Free Cancellation' },
                    ].map(f => (
                      <li key={f.id}>
                        <Checkbox
                          id={`sug-${f.id}`}
                          checked={selectedFilters.includes(f.id)}
                          onCheckedChange={() => toggleFilter(f.id)}
                        />
                        <label htmlFor={`sug-${f.id}`}>{f.label}</label>
                      </li>
                    ))}
                    {expandedLists.suggested && (
                      <>
                        {[
                          { id: 4, label: 'Pool included' },
                          { id: 5, label: 'Free Wifi' },
                        ].map(f => (
                          <li key={f.id}>
                            <Checkbox
                              id={`sug-${f.id}`}
                              checked={selectedFilters.includes(f.id)}
                              onCheckedChange={() => toggleFilter(f.id)}
                            />
                            <label htmlFor={`sug-${f.id}`}>{f.label}</label>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                  <button onClick={() => toggleList('suggested')} className="flex items-center text-sm text-blue-600 hover:underline">
                    {expandedLists.suggested
                      ? <><ChevronUp className="mr-1 h-3 w-3" /> Show less</>
                      : <><ChevronDown className="mr-1 h-3 w-3" /> Show more</>}
                  </button>
                </div>

                {/* Room Facilities */}
                <div className={scss.facility_list}>
                  <h3 className={scss.list_title}>Room Facilities</h3>
                  <ul>
                    {[
                      { id: 10, label: 'Baby Bed' },
                      { id: 11, label: 'Bathtub' },
                    ].map(f => (
                      <li key={f.id}>
                        <Checkbox
                          id={`fac-${f.id}`}
                          checked={selectedFilters.includes(f.id)}
                          onCheckedChange={() => toggleFilter(f.id)}
                        />
                        <label htmlFor={`fac-${f.id}`}>{f.label}</label>
                      </li>
                    ))}
                    {expandedLists.facility && (
                      <>
                        {[
                          { id: 12, label: 'Swimming Pool' },
                          { id: 13, label: 'Internet access' },
                          { id: 14, label: 'Heating' },
                        ].map(f => (
                          <li key={f.id}>
                            <Checkbox
                              id={`fac-${f.id}`}
                              checked={selectedFilters.includes(f.id)}
                              onCheckedChange={() => toggleFilter(f.id)}
                            />
                            <label htmlFor={`fac-${f.id}`}>{f.label}</label>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                  <button onClick={() => toggleList('facility')} className="flex items-center text-sm text-blue-600 hover:underline">
                    {expandedLists.facility
                      ? <><ChevronUp className="mr-1 h-3 w-3" /> Show less</>
                      : <><ChevronDown className="mr-1 h-3 w-3" /> Show more</>}
                  </button>
                </div>

                {/* Bed Type */}
                <div className={scss.facility_list}>
                  <h3 className={scss.list_title}>Bed Type</h3>
                  <RadioGroup defaultValue="any-bed">
                    <ul>
                      {[
                        { value: 'two-single', label: 'Two Single Beds' },
                        { value: 'king',       label: 'King Beds' },
                        { value: 'baby-cots',  label: 'Baby Cots' },
                        { value: 'double',     label: 'Double Bed' },
                        { value: 'single',     label: 'Single Bed' },
                      ].map(b => (
                        <li key={b.value}>
                          <RadioGroupItem value={b.value} id={b.value} />
                          <label htmlFor={b.value}>{b.label}</label>
                        </li>
                      ))}
                    </ul>
                  </RadioGroup>
                </div>

                {/* Star rating — wired to API with auto-search */}
                <div className={scss.facility_list}>
                  <h3 className={scss.list_title}>Accommodation Classification</h3>
                  <RadioGroup
                    value={selectedStarRating}
                    onValueChange={handleStarRatingChange}
                  >
                    <ul>
                      <li>
                        <RadioGroupItem value="all" id="star-all" />
                        <label htmlFor="star-all">All</label>
                      </li>
                      {[5, 4, 3, 2, 1].map(s => (
                        <li key={s}>
                          <RadioGroupItem value={String(s)} id={`star-${s}`} />
                          <label htmlFor={`star-${s}`}>{s} Stars</label>
                        </li>
                      ))}
                    </ul>
                  </RadioGroup>
                </div>

              </div>

              {/* ── Right results panel ───────────────────────────────────── */}
              <div className={scss.result_block}>

                {/* Sort slider */}
                <div className={clsx(scss.filter_slider, 'relative')}>
                  <button
                    onClick={() => swiperRef.current?.swiper.slidePrev()}
                    className={clsx(scss.prev_btn, 'swiper-button-prev rounded-full bg-white p-2 shadow-md')}
                  >
                    <FaChevronLeft />
                  </button>
                  <div className={scss.filter_slider_wrapper}>
                    <Swiper
                      ref={swiperRef}
                      slidesPerView={3}
                      spaceBetween={20}
                      freeMode
                      modules={[FreeMode, Navigation]}
                      navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
                      className="mySwiper"
                    >
                      {['Popularity', 'Price (Low to High)', 'User Rating (Highest)', 'Lowest Price & Best Rated', 'Price (High to Low)'].map(label => (
                        <SwiperSlide key={label}>
                          <div
                            className={scss.filter_btn}
                            onClick={() => setSelectedSort(label)}
                            style={{ cursor: 'pointer' }}
                          >
                            <input
                              type="radio"
                              id={label}
                              name="sort-filter"
                              checked={selectedSort === label}
                              onChange={() => setSelectedSort(label)}
                            />
                            <label htmlFor={label} style={{ cursor: 'pointer' }}>{label}</label>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  <button
                    onClick={() => swiperRef.current?.swiper.slideNext()}
                    className={clsx(scss.next_btn, 'swiper-button-next rounded-full bg-white p-2 shadow-md')}
                  >
                    <FaChevronRight />
                  </button>
                </div>

                {/* Result count heading */}
                <h4 className={scss.result_head}>
                  {appliedDistrict !== 'all' ? `${appliedDistrict} : ` : ''}
                  {totalElements} Result{totalElements !== 1 ? 's' : ''} found
                </h4>

                {/* Show Selected Filters as Chips */}
                {(selectedDistrict !== 'all' || selectedRoomType !== 'all') && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                    {selectedDistrict !== 'all' && (
                      <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">
                        📍 {selectedDistrict}
                      </span>
                    )}
                    {selectedRoomType !== 'all' && (
                      <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">
                        🛏️ {selectedRoomType}
                      </span>
                    )}
                    {selectedStarRating !== 'all' && (
                      <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">
                        ⭐ {selectedStarRating} Stars
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSelectedDistrict('all');
                        setSelectedRoomType('all');
                        setSelectedStarRating('all');
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 cursor-pointer ml-auto"
                    >
                      ✕ Clear Filters
                    </button>
                  </div>
                )}

                {/* Loading */}
                {loading && (
                  <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
                    <Loader2 className="animate-spin" size={24} />
                    <span>Loading hotels...</span>
                  </div>
                )}

                {/* Error */}
                {!loading && error && (
                  <div className="py-10 text-center text-red-500">{error}</div>
                )}

                {/* Empty */}
                {!loading && !error && hotelList.length === 0 && (
                  <div className="py-16 text-center text-muted-foreground">
                    <Building2 size={48} className="mx-auto mb-3 opacity-30" />
                    <p>No approved hotels found for your search.</p>
                    <p className="text-sm mt-1">Try selecting a different district or star rating.</p>
                  </div>
                )}

                {/* Hotel cards */}
                {!loading && !error && hotelList.length > 0 && (
                  <div className={scss.hotel_card_wrapper}>
                    {getSortedHotels(hotelList).map(hotel => (
                      <div
                        key={hotel.id}
                        className={scss.hotel_card}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          const checkIn = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : '';
                          const checkOut = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : '';
                          const queryParams = new URLSearchParams({
                            checkIn,
                            checkOut,
                            children: childrenCount.toString(),
                            rooms: roomsCount.toString(),
                            adults: adultsCount.toString(),
                            city: selectedDistrict,
                            roomType: selectedRoomType,
                            starRating: selectedStarRating,
                          }).toString();
                          navigate(`/hotel-detail/${hotel.id}?${queryParams}`);
                        }}
                      >

                        {/* Photo */}
                        <div className={scss.gallery} style={{ minWidth: '280px', maxWidth: '280px' }}>
                          <div className={scss.main_slider} style={{ height: '200px', width: '280px' }}>
                            <img
                              src={getPhotoUrl(hotel.coverPhotoUrl)}
                              alt={hotel.displayName || hotel.legalName}
                              style={{ height: '200px', width: '280px', objectFit: 'cover', borderRadius: '6px' }}
                              onError={e => {
                                (e.target as HTMLImageElement).src =
                                  `${import.meta.env.VITE_BASE}assets/images/hotel-booking/gallery-1.jpeg`;
                              }}
                            />
                          </div>
                        </div>

                        {/* Card content */}
                        <div className={scss.card_content}>
                          <div className={scss.card_head}>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className={scss.hotel_name}>
                                {hotel.displayName || hotel.legalName}
                              </h4>
                              {renderStars(hotel.starRating)}
                            </div>
                            <ul className={scss.facility_list}>
                              <li>
                                <MapPin />
                                <span>
                                  {[hotel.city, hotel.district, hotel.state].filter(Boolean).join(', ')}
                                  {hotel.landmark ? ` — ${hotel.landmark}` : ''}
                                </span>
                              </li>
                              {hotel.hotelType && (
                                <li><Building2 /><span>{hotel.hotelType}</span></li>
                              )}
                              {hotel.description && (
                                <li>
                                  <span className="text-muted-foreground text-sm line-clamp-2">
                                    {hotel.description}
                                  </span>
                                </li>
                              )}
                            </ul>
                          </div>

                          <div className={scss.card_footer}>
                            <div className={scss.detail_block}>
                              <p className="text-muted">
                                {hotel.hotelType
                                  ? `${hotel.hotelType} · ${hotel.district}, ${hotel.state}`
                                  : `${hotel.district}, ${hotel.state}`}
                              </p>
                              <p>{hotel.roomTypeName || 'Standard rooms'}</p>
                              <div className={scss.review_detail}>
                                <h5>Very Good ,</h5>
                                <span>Reviews</span>
                              </div>
                            </div>
                            <div className={scss.price_block}>
                              {hotel.minTariff != null ? (
                                <>
                                  <h5>₹{hotel.minTariff.toLocaleString('en-IN')}/-</h5>
                                  <p>Includes taxes and charges</p>
                                </>
                              ) : (
                                <p className="text-muted-foreground text-sm">Price on request</p>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && !loading && (
                  <div className="flex items-center justify-center gap-3 mt-6 pb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 0}
                      onClick={() => fetchHotelList(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages - 1}
                      onClick={() => fetchHotelList(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

export default Hotellist;