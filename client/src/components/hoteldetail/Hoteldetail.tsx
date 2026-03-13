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

// ── Tab type ───────────────────────────────────────────────────────────────────
type DetailTab = 'overview' | 'facilities' | 'rooms' | 'location' | 'policies';

// ── Component ──────────────────────────────────────────────────────────────────
function Hoteldetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ── NEW: active tab state ──────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  // Get all params from URL
  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');
  const childrenParam = searchParams.get('children');
  const roomsParam = searchParams.get('rooms');
  const adultsParam = searchParams.get('adults');
  const city = searchParams.get('city') || '';
  const roomType = searchParams.get('roomType') || '';
  const starRating = searchParams.get('starRating') || '';

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

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosInstance.get(`/api/v1/hotels/${id}`)
      .then(res => setHotel(res.data))
      .catch(() => setError('Failed to load hotel details.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    Fancybox.bind("[data-fancybox='gallery']", {});
    return () => { Fancybox.unbind("[data-fancybox='gallery']"); };
  }, [hotel]);

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

  // ── Tab definitions ────────────────────────────────────────────────────────
  const tabs: { key: DetailTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'facilities', label: 'Facilities' },
    { key: 'rooms', label: 'Rooms' },
    { key: 'location', label: 'Location' },
    { key: 'policies', label: 'Policies' },
  ];

  // ── Back button style ──────────────────────────────────────────────────────
  const backBtnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'none', border: '1.5px solid #d1d5db', borderRadius: 8,
    padding: '7px 16px', fontSize: 14, fontWeight: 600, color: '#374151',
    cursor: 'pointer', marginBottom: 16,
  };

  return (
    <>
      <div className={scss.common_page}>

        {/* ── Filter Summary Display ─────────────────────────────────────── */}
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

        {/* ── Back Button ───────────────────────────────────────────────── */}
        <div className="container mx-auto" style={{ paddingTop: 16 }}>
          <button style={backBtnStyle} onClick={() => navigate(-1)}>← Back</button>
        </div>

        {/* ── Photo Gallery ──────────────────────────────────────────────── */}
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

        {/* ── Hotel Details ──────────────────────────────────────────────── */}
        <section className={scss.hotel_details}>
          <div className="container mx-auto">
            <div className={scss.hotel_container}>

              {/* ── TABS — now clickable ── */}
              <ul className={scss.list_head}>
                {tabs.map(tab => (
                  <li
                    key={tab.key}
                    className={activeTab === tab.key ? scss.active : ''}
                    onClick={() => setActiveTab(tab.key)}
                    style={{ cursor: 'pointer' }}
                  >
                    <p>{tab.label}</p>
                  </li>
                ))}
              </ul>

              <div className={scss.hotel_content}>

                {/* Hotel name + book now — always visible */}
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

                  {/* ── OVERVIEW TAB ── */}
                  {activeTab === 'overview' && (
                    <>
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

                      {(hotel.amenities?.length > 0 || hotel.parkingAvailable || hotel.liftAvailable || hotel.powerBackup || hotel.wheelchairAccessible) && (
                        <div className={scss.facility_block}>
                          <h3>Facilities</h3>
                          {hotel.amenities?.length > 0 && (
                            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                              {hotel.amenities.map((a, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                                  {a.icon && <span>{a.icon}</span>}
                                  <span>{a.name}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          <ul className="flex flex-wrap gap-3 mt-3">
                            {hotel.parkingAvailable && <li className="text-sm bg-gray-100 px-3 py-1 rounded-full">🚗 Parking</li>}
                            {hotel.liftAvailable && <li className="text-sm bg-gray-100 px-3 py-1 rounded-full">🛗 Lift</li>}
                            {hotel.powerBackup && <li className="text-sm bg-gray-100 px-3 py-1 rounded-full">⚡ Power Backup</li>}
                            {hotel.wheelchairAccessible && <li className="text-sm bg-gray-100 px-3 py-1 rounded-full">♿ Wheelchair Accessible</li>}
                          </ul>
                        </div>
                      )}

                      {hotel.roomTypes?.length > 0 && (
                        <div className={scss.facility_block}>
                          <h3>Room Types & Pricing</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                            {hotel.roomTypes.map((room, i) => (
                              <div key={i} className="border rounded-lg p-4 bg-white shadow-sm">
                                <h4 className="font-semibold text-gray-800">{room.roomTypeName}</h4>
                                {room.roomCount && <p className="text-sm text-gray-500 mt-1">{room.roomCount} rooms available</p>}
                                {room.tariff && (
                                  <p className="text-lg font-bold text-green-700 mt-2">
                                    ₹{room.tariff.toLocaleString('en-IN')}
                                    <span className="text-sm font-normal text-gray-500"> / night</span>
                                  </p>
                                )}
                                <button className="mt-3 w-full bg-blue-600 text-white text-sm py-2 rounded-md hover:bg-blue-700"
                                  onClick={() => handleBookNow(room.roomTypeName)}>
                                  Book Now
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className={scss.facility_block}>
                        <h3>Location</h3>
                        <p className="text-sm text-gray-600 mt-1 flex items-start gap-1">
                          <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                          {[hotel.addressLine1, hotel.city, hotel.district, hotel.state, hotel.pincode].filter(Boolean).join(', ')}
                        </p>
                        {hotel.latitude && hotel.longitude ? (
                          <div className="mt-3 rounded-lg overflow-hidden border">
                            <iframe title="Hotel Location" width="100%" height="300" style={{ border: 0 }} loading="lazy"
                              src={`https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}&output=embed`} />
                            <div className="p-2 bg-gray-50 text-center">
                              <a href={hotel.googleMapsUrl || `https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}`}
                                target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                                Open in Google Maps →
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 rounded-lg border p-4 bg-gray-50 text-center">
                            <a href={`https://www.google.com/maps/search/${encodeURIComponent([hotel.displayName, hotel.city, hotel.district, hotel.state].filter(Boolean).join(', '))}`}
                              target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                              Search on Google Maps →
                            </a>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* ── FACILITIES TAB ── */}
                  {activeTab === 'facilities' && (
                    <>
                      {hotel.amenities?.length > 0 && (
                        <div className={scss.facility_block}>
                          <h3>Amenities</h3>
                          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                            {hotel.amenities.map((a, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
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

                      {hotel.amenities?.length === 0 && !hotel.parkingAvailable && !hotel.liftAvailable && !hotel.powerBackup && !hotel.wheelchairAccessible && (
                        <div className={scss.facility_block}>
                          <p className="text-gray-500">No facilities information available.</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* ── ROOMS TAB ── */}
                  {activeTab === 'rooms' && (
                    <div className={scss.facility_block}>
                      <h3>Room Types & Pricing</h3>
                      {hotel.roomTypes?.length > 0 ? (
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
                      ) : (
                        <p className="text-gray-500 mt-2">No room types available.</p>
                      )}
                    </div>
                  )}

                  {/* ── LOCATION TAB ── */}
                  {activeTab === 'location' && (
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
                  )}

                  {/* ── POLICIES TAB ── */}
                  {activeTab === 'policies' && (
                    <div className={scss.facility_block}>
                      <h3>Hotel Policies</h3>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {(hotel.checkInTime || hotel.checkOutTime) && (
                          <div className="border rounded-lg p-4 bg-gray-50">
                            <h4 className="font-semibold text-gray-800 mb-2">🕐 Check-in / Check-out</h4>
                            {hotel.checkInTime && <p className="text-sm text-gray-600">Check-in: <strong>{hotel.checkInTime}</strong></p>}
                            {hotel.checkOutTime && <p className="text-sm text-gray-600 mt-1">Check-out: <strong>{hotel.checkOutTime}</strong></p>}
                          </div>
                        )}

                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="font-semibold text-gray-800 mb-2">💳 Payment Policy</h4>
                          <p className="text-sm text-gray-600">We accept online payment via Razorpay or pay directly at the hotel during check-in.</p>
                        </div>

                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="font-semibold text-gray-800 mb-2">❌ Cancellation Policy</h4>
                          <p className="text-sm text-gray-600">Free cancellation before 24 hours of check-in. Cancellations within 24 hours may not be eligible for a refund.</p>
                        </div>

                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="font-semibold text-gray-800 mb-2">🚭 House Rules</h4>
                          <ul className="text-sm text-gray-600 space-y-1 mt-1">
                            <li>• No smoking inside rooms</li>
                            <li>• Pets not allowed</li>
                            <li>• Visitors allowed in lobby only</li>
                            <li>• Valid ID required at check-in</li>
                          </ul>
                        </div>

                        {(hotel.parkingAvailable !== null || hotel.wheelchairAccessible !== null) && (
                          <div className="border rounded-lg p-4 bg-gray-50">
                            <h4 className="font-semibold text-gray-800 mb-2">♿ Accessibility</h4>
                            <p className="text-sm text-gray-600">
                              {hotel.wheelchairAccessible ? '✅ Wheelchair accessible' : '❌ Not wheelchair accessible'}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {hotel.parkingAvailable ? '✅ Parking available' : '❌ No parking'}
                            </p>
                          </div>
                        )}

                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="font-semibold text-gray-800 mb-2">👶 Child Policy</h4>
                          <p className="text-sm text-gray-600">Children of all ages are welcome. Children under 5 stay free when using existing bedding.</p>
                        </div>

                      </div>
                    </div>
                  )}

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