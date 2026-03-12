import React, { useEffect, useState } from 'react'
import scss from './hotedetail.module.scss';
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { format, parse } from "date-fns";
import { ArrowDown, Calendar as CalendarIcon, Minus, Plus, MapPin, Phone, Mail, Globe, Loader2, Building2 } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import clsx from 'clsx';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { FaStar } from 'react-icons/fa';
import axiosInstance from '@/axios/axios';

// ── Types ──────────────────────────────────────────────────────────────────────
interface RoomTypeInfo {
  roomTypeName: string;
  roomCount: number;
  tariff: number;
}

interface AmenityInfo {
  name: string;
  icon: string;
  scope: string;
}

interface HotelDetail {
  hotelId: string;
  displayName: string;
  legalName: string;
  description: string | null;
  hotelType: string | null;
  starRating: number | null;
  establishedYear: number | null;
  publicEmail: string | null;
  publicPhone: string | null;
  websiteUrl: string | null;
  addressLine1: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  pincode: string | null;
  landmark: string | null;
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl: string | null;
  photos: string[];
  roomTypes: RoomTypeInfo[];
  amenities: AmenityInfo[];
  checkInTime: string | null;
  checkOutTime: string | null;
  parkingAvailable: boolean | null;
  liftAvailable: boolean | null;
  powerBackup: boolean | null;
  wheelchairAccessible: boolean | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const FALLBACK = `${import.meta.env.VITE_BASE}assets/images/hotel-booking/gallery-1.jpeg`;

const getPhotoUrl = (url: string | null | undefined) => {
  if (!url) return FALLBACK;
  if (url.startsWith('http')) return url;
  return `${import.meta.env.VITE_APP_API_BASE_URL}${url}`;
};

const renderStars = (count: number | null) => {
  if (!count) return null;
  return (
    <ul className={scss.hotel_ratings}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i}><FaStar /></li>
      ))}
    </ul>
  );
};

// ── Component ──────────────────────────────────────────────────────────────────
function Hoteldetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get all params from URL
  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');
  const childrenParam = searchParams.get('children');
  const roomsParam = searchParams.get('rooms');
  const adultsParam = searchParams.get('adults');
  const city = searchParams.get('city') || '';
  const roomType = searchParams.get('roomType') || '';
  const starRating = searchParams.get('starRating') || '';

  // Parse dates from params or use defaults
  const getInitialDates = () => {
    try {
      if (checkInParam && checkOutParam) {
        return {
          from: parse(checkInParam, 'yyyy-MM-dd', new Date()),
          to: parse(checkOutParam, 'yyyy-MM-dd', new Date()),
        };
      }
    } catch (e) {
      console.error('Error parsing dates:', e);
    }
    return {
      from: new Date(),
      to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };
  };

  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with URL params
  const initialChildrenCount = childrenParam ? parseInt(childrenParam) : 0;
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(getInitialDates());
  const [childrenCount, setChildrenCount] = React.useState(initialChildrenCount);
  const [childrenAges, setChildrenAges] = React.useState<number[]>(Array(initialChildrenCount).fill(0));
  const [isOpen, setIsOpen] = React.useState(false);

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
    const newAges = [...childrenAges];
    newAges[index] = value;
    setChildrenAges(newAges);
  };

  // ── Navigate to booking page ──────────────────────────────────────────────
  const handleBookNow = (selectedRoomType?: string) => {
    const params = new URLSearchParams();
    if (dateRange?.from) params.append('checkIn', format(dateRange.from, 'yyyy-MM-dd'));
    if (dateRange?.to) params.append('checkOut', format(dateRange.to, 'yyyy-MM-dd'));
    if (roomsParam) params.append('rooms', roomsParam);
    if (adultsParam) params.append('adults', adultsParam);
    params.append('children', childrenCount.toString());
    if (selectedRoomType) params.append('roomType', selectedRoomType);
    navigate(`/hotel-booking/${id}?${params.toString()}`);
  };

  // ── Fetch hotel detail ────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosInstance.get(`/api/v1/hotels/${id}`)
      .then(res => setHotel(res.data))
      .catch(() => setError('Failed to load hotel details.'))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Fancybox ──────────────────────────────────────────────────────────────
  useEffect(() => {
    Fancybox.bind("[data-fancybox='gallery']", {});
    return () => { Fancybox.unbind("[data-fancybox='gallery']"); };
  }, [hotel]);

  // ── Loading / Error states ────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen gap-3 text-muted-foreground">
      <Loader2 className="animate-spin" size={32} />
      <span>Loading hotel details...</span>
    </div>
  );

  if (error || !hotel) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-muted-foreground">
      <Building2 size={48} className="opacity-30" />
      <p>{error || 'Hotel not found.'}</p>
      <Link to="/hotel-list" className="text-blue-600 underline">← Back to Hotel List</Link>
    </div>
  );

  const photos = hotel.photos?.length > 0 ? hotel.photos : [FALLBACK];

  return (
    <>
      <div className={scss.common_page}>

        {/* ── Filter Summary Display ──────────────────────────────────────────*/}
        {(city || roomType || starRating) && (
          <div style={{ backgroundColor: '#f0f9ff', borderBottom: '1px solid #bfdbfe', padding: '12px 0' }}>
            <div className="container mx-auto px-4">
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#1f2937' }}>Active Filters:</span>
                {city && <span style={{ padding: '4px 12px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' }}>📍 {city}</span>}
                {roomType && <span style={{ padding: '4px 12px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' }}>🛏️ {roomType}</span>}
                {starRating && <span style={{ padding: '4px 12px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' }}>⭐ {starRating} Stars</span>}
              </div>
            </div>
          </div>
        )}

        {/* ── Top search bar ──────────────────────────────────────────────── */}
        <section className={scss.filter_top}>
          <div className="container mx-auto">
            <div className={scss.filter_wrapper}>
              <div className={scss.custom_form}>
                <div className={scss.form_block}>
                  <div className={scss.filter_group}>
                    <div className={scss.input_block}>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="City/Location" /></SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="jammu">Jammu</SelectItem>
                            <SelectItem value="kashmir">Kashmir</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className={scss.input_block}>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Room Type" /></SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="deluxe">Deluxe Room</SelectItem>
                            <SelectItem value="superdeluxe">Super Deluxe Room</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className={scss.input_block}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button id="date" variant="outline"
                            className={cn("w-[300px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                              dateRange.to
                                ? <>{format(dateRange.from, "LLL dd, y")} – {format(dateRange.to, "LLL dd, y")}</>
                                : format(dateRange.from, "LLL dd, y")
                            ) : <span>Pick a date range</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar initialFocus mode="range" defaultMonth={dateRange?.from}
                            selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className={scss.input_block}>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Rooms" /></SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className={scss.input_block}>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Adults" /></SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className={scss.input_block}>
                      <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between"
                            onClick={() => setIsOpen(!isOpen)}>
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
                    <div style={{ height: '20px' }}></div>
                    <div className={scss.input_block}>
                      <Link role="button" className={scss.search_btn} to="/hotel-list">
                        <span>Search</span>
                        <div className={scss.search_icon}><ArrowDown /></div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Photo Gallery ───────────────────────────────────────────────── */}
        <section className={scss.hotel_photos}>
          <div className="container mx-auto">
            <div className={scss.photo_wrapper}>
              <div className={scss.w_50}>
                <div className={scss.photo_block}>
                  <a data-fancybox="gallery" href={getPhotoUrl(photos[0])}>
                    <img src={getPhotoUrl(photos[0])} alt={hotel.displayName}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }} />
                  </a>
                </div>
              </div>
              <div className={scss.w_50}>
                <div className={scss.photo_block_wrapper}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={scss.photo_block}>
                      <a data-fancybox="gallery" href={getPhotoUrl(photos[i] || photos[0])}>
                        <img src={getPhotoUrl(photos[i] || photos[0])} alt={`Photo ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Hotel Details ───────────────────────────────────────────────── */}
        <section className={scss.hotel_details}>
          <div className="container mx-auto">
            <div className={scss.hotel_container}>

              <ul className={scss.list_head}>
                <li className={scss.active}><p>Overview</p></li>
                <li><p>Facilities</p></li>
                <li><p>Rooms</p></li>
                <li><p>Location</p></li>
                <li><p>Policies</p></li>
              </ul>

              <div className={scss.hotel_content}>

                {/* Hotel name + book now */}
                <div className={scss.hotel_head_content}>
                  <div className={scss.hotel_name}>
                    <h3>{hotel.displayName || hotel.legalName}</h3>
                    {renderStars(hotel.starRating)}
                    <div className={scss.map_link}>
                      <MapPin size={14} />
                      <p>
                        {[hotel.addressLine1, hotel.city, hotel.district, hotel.state, hotel.pincode]
                          .filter(Boolean).join(', ')}
                        {hotel.landmark ? ` — ${hotel.landmark}` : ''}
                      </p>
                      {hotel.googleMapsUrl && (
                        <a href={hotel.googleMapsUrl} target="_blank" rel="noreferrer">View on Map</a>
                      )}
                    </div>
                  </div>
                  {hotel?.roomTypes && hotel.roomTypes.length > 0 ? (
                    <button className={scss.book_btn} onClick={() => handleBookNow()}>
                      Book Now
                    </button>
                  ) : (
                    <button className={clsx(scss.book_btn, 'opacity-50 cursor-not-allowed')} disabled>
                      Sold Out
                    </button>
                  )}
                </div>

                <div className={scss.facilities}>
                  <div className={scss.facility_block}>
                    <h3>Overview</h3>
                    <p>{hotel.description || 'No description available.'}</p>
                    <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-600">
                      {hotel.hotelType && (
                        <span className="flex items-center gap-1">
                          <Building2 size={14} /> {hotel.hotelType}
                        </span>
                      )}
                      {hotel.establishedYear && <span>Est. {hotel.establishedYear}</span>}
                      {hotel.checkInTime && <span>Check-in: {hotel.checkInTime}</span>}
                      {hotel.checkOutTime && <span>Check-out: {hotel.checkOutTime}</span>}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm">
                      {hotel.publicPhone && (
                        <a href={`tel:${hotel.publicPhone}`} className="flex items-center gap-1 text-blue-600">
                          <Phone size={14} /> {hotel.publicPhone}
                        </a>
                      )}
                      {hotel.publicEmail && (
                        <a href={`mailto:${hotel.publicEmail}`} className="flex items-center gap-1 text-blue-600">
                          <Mail size={14} /> {hotel.publicEmail}
                        </a>
                      )}
                      {hotel.websiteUrl && (
                        <a href={hotel.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600">
                          <Globe size={14} /> Website
                        </a>
                      )}
                    </div>
                  </div>

                  {hotel.amenities?.length > 0 && (
                    <div className={scss.facility_block}>
                      <h3>Amenities</h3>
                      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                        {hotel.amenities.map((a, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            {a.icon && <span>{a.icon}</span>}
                            <span>{a.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(hotel.parkingAvailable || hotel.liftAvailable || hotel.powerBackup || hotel.wheelchairAccessible) && (
                    <div className={scss.facility_block}>
                      <h3>Property Features</h3>
                      <ul className="flex flex-wrap gap-3 mt-2">
                        {hotel.parkingAvailable && <li className="text-sm bg-gray-100 px-3 py-1 rounded-full">🚗 Parking</li>}
                        {hotel.liftAvailable && <li className="text-sm bg-gray-100 px-3 py-1 rounded-full">🛗 Lift</li>}
                        {hotel.powerBackup && <li className="text-sm bg-gray-100 px-3 py-1 rounded-full">⚡ Power Backup</li>}
                        {hotel.wheelchairAccessible && <li className="text-sm bg-gray-100 px-3 py-1 rounded-full">♿ Wheelchair Accessible</li>}
                      </ul>
                    </div>
                  )}

                  {/* Room Types — each card has its own Book Now */}
                  {hotel.roomTypes?.length > 0 && (
                    <div className={scss.facility_block}>
                      <h3>Room Types & Pricing</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                        {hotel.roomTypes.map((room, i) => (
                          <div key={i} className="border rounded-lg p-4 bg-white shadow-sm">
                            <h4 className="font-semibold text-gray-800">{room.roomTypeName}</h4>
                            {room.roomCount && (
                              <p className="text-sm text-gray-500 mt-1">{room.roomCount} rooms available</p>
                            )}
                            {room.tariff && (
                              <p className="text-lg font-bold text-green-700 mt-2">
                                ₹{room.tariff.toLocaleString('en-IN')}
                                <span className="text-sm font-normal text-gray-500"> / night</span>
                              </p>
                            )}
                            <button
                              className="mt-3 w-full bg-blue-600 text-white text-sm py-2 rounded-md hover:bg-blue-700"
                              onClick={() => handleBookNow(room.roomTypeName)}
                            >
                              Book Now
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Location map */}
                  <div className={scss.facility_block}>
                    <h3>Location</h3>
                    <p className="text-sm text-gray-600 mt-1 flex items-start gap-1">
                      <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                      {[hotel.addressLine1, hotel.city, hotel.district, hotel.state, hotel.pincode]
                        .filter(Boolean).join(', ')}
                    </p>
                    {hotel.latitude && hotel.longitude ? (
                      <div className="mt-3 rounded-lg overflow-hidden border">
                        <iframe
                          title="Hotel Location"
                          width="100%"
                          height="300"
                          style={{ border: 0 }}
                          loading="lazy"
                          src={`https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}&output=embed`}
                        />
                        <div className="p-2 bg-gray-50 text-center">
                          <a
                            href={hotel.googleMapsUrl || `https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}`}
                            target="_blank" rel="noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Open in Google Maps →
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 rounded-lg border p-4 bg-gray-50 text-center">
                        <a
                          href={`https://www.google.com/maps/search/${encodeURIComponent(
                            [hotel.displayName, hotel.city, hotel.district, hotel.state].filter(Boolean).join(', ')
                          )}`}
                          target="_blank" rel="noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Search on Google Maps →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Hoteldetail;