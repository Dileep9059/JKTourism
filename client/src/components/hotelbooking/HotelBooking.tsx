import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useParams, Link } from 'react-router-dom';
import { format, parse, differenceInDays } from 'date-fns';
import { Calendar as CalendarIcon, Minus, Plus, User, Mail, Phone, CreditCard, Banknote, ChevronRight, ArrowLeft, Check, Loader2, Hotel } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import axiosInstance from '@/axios/axios';

// ── Types ──────────────────────────────────────────────────────────────────────
interface RoomTypeInfo {
  roomTypeName: string;
  roomCount: number;
  tariff: number;
}

interface HotelDetail {
  hotelId: string;
  displayName: string;
  legalName: string;
  starRating: number | null;
  addressLine1: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  photos: string[];
  roomTypes: RoomTypeInfo[];
  checkInTime: string | null;
  checkOutTime: string | null;
}

interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

type PaymentMethod = 'razorpay' | 'pay_at_hotel';
type Step = 'details' | 'payment' | 'confirmation';

// ── Helpers ────────────────────────────────────────────────────────────────────
const FALLBACK = `${import.meta.env.VITE_BASE}assets/images/hotel-booking/gallery-1.jpeg`;
const getPhotoUrl = (url: string | null | undefined) => {
  if (!url) return FALLBACK;
  if (url.startsWith('http')) return url;
  return `${import.meta.env.VITE_APP_API_BASE_URL}${url}`;
};
const TAX_RATE = 0.12;
const generateBookingId = () => 'JK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();

// ── Main Component ─────────────────────────────────────────────────────────────
function HotelBooking() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL params
  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');
  const roomsParam = parseInt(searchParams.get('rooms') || '1');
  const adultsParam = parseInt(searchParams.get('adults') || '1');
  const childrenParam = parseInt(searchParams.get('children') || '0');
  const selectedRoomTypeParam = searchParams.get('roomType') || '';

  // Hotel data
  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking state
  const [step, setStep] = useState<Step>('details');
  const [bookingId] = useState(generateBookingId());

  const getInitialDates = (): DateRange => {
    try {
      if (checkInParam && checkOutParam) {
        return {
          from: parse(checkInParam, 'yyyy-MM-dd', new Date()),
          to: parse(checkOutParam, 'yyyy-MM-dd', new Date()),
        };
      }
    } catch (_) {}
    return {
      from: new Date(),
      to: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };
  };

  const [dateRange, setDateRange] = useState<DateRange | undefined>(getInitialDates());
  const [rooms, setRooms] = useState(roomsParam);
  const [adults, setAdults] = useState(adultsParam);
  const [children, setChildren] = useState(childrenParam);
  const [selectedRoomType, setSelectedRoomType] = useState(selectedRoomTypeParam);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [errors, setErrors] = useState<Partial<GuestInfo>>({});

  const [guest, setGuest] = useState<GuestInfo>({
    firstName: '', lastName: '', email: '', phone: '',
  });

  // Fetch hotel
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosInstance.get(`/api/v1/hotels/${id}`)
      .then(res => {
        setHotel(res.data);
        if (!selectedRoomType && res.data.roomTypes?.length > 0) {
          setSelectedRoomType(res.data.roomTypes[0].roomTypeName);
        }
      })
      .catch(() => setError('Failed to load hotel details.'))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Pricing calculations ──────────────────────────────────────────────────
  const nights = dateRange?.from && dateRange?.to
    ? Math.max(1, differenceInDays(dateRange.to, dateRange.from))
    : 1;

  const selectedRoom = hotel?.roomTypes?.find(r => r.roomTypeName === selectedRoomType)
    || hotel?.roomTypes?.[0];

  const basePrice = (selectedRoom?.tariff || 0) * rooms * nights;
  const taxAmount = Math.round(basePrice * TAX_RATE);
  const totalAmount = basePrice + taxAmount;

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Partial<GuestInfo> = {};
    if (!guest.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!guest.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!guest.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) newErrors.email = 'Invalid email';
    if (!guest.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(guest.phone)) newErrors.phone = 'Enter valid 10-digit mobile number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Razorpay dummy handler ────────────────────────────────────────────────
  const handleRazorpayPayment = () => {
    setProcessingPayment(true);
    // Simulate Razorpay popup & payment
    setTimeout(() => {
      setProcessingPayment(false);
      setStep('confirmation');
    }, 2500);
  };

  const handlePayAtHotel = () => {
    setProcessingPayment(true);
    setTimeout(() => {
      setProcessingPayment(false);
      setStep('confirmation');
    }, 1200);
  };

  const handleProceedToPayment = () => {
    if (!validate()) return;
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmPayment = () => {
    if (paymentMethod === 'razorpay') handleRazorpayPayment();
    else handlePayAtHotel();
  };

  // ── Loading / Error ───────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen gap-3 text-gray-500">
      <Loader2 className="animate-spin" size={32} />
      <span>Loading booking details...</span>
    </div>
  );
  if (error || !hotel) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-gray-500">
      <Hotel size={48} className="opacity-30" />
      <p>{error || 'Hotel not found.'}</p>
      <Link to="/hotel-list" className="text-blue-600 underline">← Back to Hotel List</Link>
    </div>
  );

  const hotelPhoto = getPhotoUrl(hotel.photos?.[0]);

  // ── Confirmation Page ─────────────────────────────────────────────────────
  if (step === 'confirmation') {
    return (
      <div style={styles.page}>
        <div style={styles.confirmWrapper}>
          {/* Success Icon */}
          <div style={styles.successCircle}>
            <Check size={40} color="#fff" strokeWidth={3} />
          </div>
          <h1 style={styles.confirmTitle}>Booking Confirmed!</h1>
          <p style={styles.confirmSubtitle}>
            Your booking has been successfully placed. A confirmation has been sent to <strong>{guest.email}</strong>
          </p>

          {/* Booking ID */}
          <div style={styles.bookingIdBox}>
            <span style={styles.bookingIdLabel}>Booking ID</span>
            <span style={styles.bookingIdValue}>{bookingId}</span>
          </div>

          {/* Summary Card */}
          <div style={styles.confirmCard}>
            <div style={styles.confirmHotelRow}>
              <img src={hotelPhoto} alt={hotel.displayName} style={styles.confirmHotelImg} onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }} />
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1a1a2e' }}>{hotel.displayName}</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#666' }}>{hotel.city}, {hotel.district}</p>
              </div>
            </div>

            <div style={styles.confirmGrid}>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>Guest</span>
                <span style={styles.confirmValue}>{guest.firstName} {guest.lastName}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>Room Type</span>
                <span style={styles.confirmValue}>{selectedRoom?.roomTypeName}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>Check-in</span>
                <span style={styles.confirmValue}>{dateRange?.from ? format(dateRange.from, 'dd MMM yyyy') : '-'}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>Check-out</span>
                <span style={styles.confirmValue}>{dateRange?.to ? format(dateRange.to, 'dd MMM yyyy') : '-'}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>Nights</span>
                <span style={styles.confirmValue}>{nights}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>Rooms</span>
                <span style={styles.confirmValue}>{rooms}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>Guests</span>
                <span style={styles.confirmValue}>{adults} Adults{children > 0 ? `, ${children} Children` : ''}</span>
              </div>
              <div style={styles.confirmItem}>
                <span style={styles.confirmLabel}>Payment</span>
                <span style={{ ...styles.confirmValue, color: '#16a34a', fontWeight: 700 }}>
                  {paymentMethod === 'razorpay' ? '✅ Paid Online' : '🏨 Pay at Hotel'}
                </span>
              </div>
            </div>

            <div style={styles.confirmTotal}>
              <span>Total Amount</span>
              <span style={{ fontWeight: 800, fontSize: 22, color: '#1a1a2e' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button style={styles.confirmPrimaryBtn} onClick={() => navigate('/')}>Go to Home</button>
            <button style={styles.confirmSecondaryBtn} onClick={() => navigate('/hotel-list')}>Browse More Hotels</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Booking Form ──────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <button style={styles.backBtn} onClick={() => step === 'payment' ? setStep('details') : navigate(-1)}>
            <ArrowLeft size={18} /> Back
          </button>
          <h1 style={styles.headerTitle}>Complete Your Booking</h1>
        </div>
      </div>

      {/* Stepper */}
      <div style={styles.stepperWrap}>
        <div style={styles.stepper}>
          {(['details', 'payment'] as Step[]).map((s, idx) => (
            <React.Fragment key={s}>
              <div style={styles.stepItem}>
                <div style={{
                  ...styles.stepCircle,
                  background: step === s ? '#1a1a2e' : step === 'confirmation' || (s === 'details' && step === 'payment') ? '#16a34a' : '#e5e7eb',
                  color: step === s || step === 'confirmation' || (s === 'details' && step === 'payment') ? '#fff' : '#9ca3af',
                }}>
                  {(step === 'confirmation' || (s === 'details' && step === 'payment')) ? <Check size={14} /> : idx + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: step === s ? '#1a1a2e' : '#9ca3af', textTransform: 'capitalize' }}>{s}</span>
              </div>
              {idx < 1 && <div style={{ flex: 1, height: 2, background: step === 'payment' || step === 'confirmation' ? '#16a34a' : '#e5e7eb', margin: '0 8px', marginBottom: 18 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={styles.layout}>
        {/* LEFT: Form */}
        <div style={styles.formCol}>

          {step === 'details' && (
            <>
              {/* Stay Dates */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>📅 Stay Dates</h2>
                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>Check-in / Check-out</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !dateRange && 'text-muted-foreground')} style={styles.dateBtn}>
                          <CalendarIcon size={16} style={{ marginRight: 8, opacity: 0.6 }} />
                          {dateRange?.from ? (
                            dateRange.to
                              ? <>{format(dateRange.from, 'dd MMM yyyy')} – {format(dateRange.to, 'dd MMM yyyy')}</>
                              : format(dateRange.from, 'dd MMM yyyy')
                          ) : 'Pick dates'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start" style={{ zIndex: 9999 }}>
                        <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} disabled={{ before: new Date() }} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Guests & Room */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>🛏️ Room & Guests</h2>
                <div style={styles.row}>
                  {/* Room Type */}
                  <div style={styles.field}>
                    <label style={styles.label}>Room Type</label>
                    <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                      <SelectTrigger style={styles.selectTrigger}>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {hotel.roomTypes.map((r, i) => (
                            <SelectItem key={i} value={r.roomTypeName}>
                              {r.roomTypeName} — ₹{r.tariff?.toLocaleString('en-IN')}/night
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rooms */}
                  <div style={styles.field}>
                    <label style={styles.label}>Rooms</label>
                    <div style={styles.counter}>
                      <button style={styles.counterBtn} onClick={() => setRooms(Math.max(1, rooms - 1))}><Minus size={14} /></button>
                      <span style={styles.counterVal}>{rooms}</span>
                      <button style={styles.counterBtn} onClick={() => setRooms(Math.min(10, rooms + 1))}><Plus size={14} /></button>
                    </div>
                  </div>
                </div>

                <div style={styles.row}>
                  {/* Adults */}
                  <div style={styles.field}>
                    <label style={styles.label}>Adults</label>
                    <div style={styles.counter}>
                      <button style={styles.counterBtn} onClick={() => setAdults(Math.max(1, adults - 1))}><Minus size={14} /></button>
                      <span style={styles.counterVal}>{adults}</span>
                      <button style={styles.counterBtn} onClick={() => setAdults(Math.min(10, adults + 1))}><Plus size={14} /></button>
                    </div>
                  </div>

                  {/* Children */}
                  <div style={styles.field}>
                    <label style={styles.label}>Children (below 17)</label>
                    <div style={styles.counter}>
                      <button style={styles.counterBtn} onClick={() => setChildren(Math.max(0, children - 1))}><Minus size={14} /></button>
                      <span style={styles.counterVal}>{children}</span>
                      <button style={styles.counterBtn} onClick={() => setChildren(children + 1)}><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Details */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>👤 Guest Details</h2>
                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>First Name *</label>
                    <div style={styles.inputWrap}>
                      <User size={16} style={styles.inputIcon} />
                      <input style={{ ...styles.input, borderColor: errors.firstName ? '#ef4444' : '#e5e7eb' }}
                        placeholder="First name"
                        value={guest.firstName}
                        onChange={e => { setGuest(g => ({ ...g, firstName: e.target.value })); setErrors(er => ({ ...er, firstName: undefined })); }}
                      />
                    </div>
                    {errors.firstName && <span style={styles.errorText}>{errors.firstName}</span>}
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Last Name *</label>
                    <div style={styles.inputWrap}>
                      <User size={16} style={styles.inputIcon} />
                      <input style={{ ...styles.input, borderColor: errors.lastName ? '#ef4444' : '#e5e7eb' }}
                        placeholder="Last name"
                        value={guest.lastName}
                        onChange={e => { setGuest(g => ({ ...g, lastName: e.target.value })); setErrors(er => ({ ...er, lastName: undefined })); }}
                      />
                    </div>
                    {errors.lastName && <span style={styles.errorText}>{errors.lastName}</span>}
                  </div>
                </div>
                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>Email Address *</label>
                    <div style={styles.inputWrap}>
                      <Mail size={16} style={styles.inputIcon} />
                      <input style={{ ...styles.input, borderColor: errors.email ? '#ef4444' : '#e5e7eb' }}
                        placeholder="you@email.com" type="email"
                        value={guest.email}
                        onChange={e => { setGuest(g => ({ ...g, email: e.target.value })); setErrors(er => ({ ...er, email: undefined })); }}
                      />
                    </div>
                    {errors.email && <span style={styles.errorText}>{errors.email}</span>}
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Mobile Number *</label>
                    <div style={styles.inputWrap}>
                      <Phone size={16} style={styles.inputIcon} />
                      <input style={{ ...styles.input, borderColor: errors.phone ? '#ef4444' : '#e5e7eb' }}
                        placeholder="10-digit mobile" type="tel" maxLength={10}
                        value={guest.phone}
                        onChange={e => { setGuest(g => ({ ...g, phone: e.target.value.replace(/\D/, '') })); setErrors(er => ({ ...er, phone: undefined })); }}
                      />
                    </div>
                    {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
                  </div>
                </div>
              </div>

              <button style={styles.proceedBtn} onClick={handleProceedToPayment}>
                Proceed to Payment <ChevronRight size={18} />
              </button>
            </>
          )}

          {step === 'payment' && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>💳 Payment Method</h2>
              <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>Choose how you'd like to pay</p>

              {/* Razorpay Option */}
              <div style={{ ...styles.payOption, borderColor: paymentMethod === 'razorpay' ? '#1a1a2e' : '#e5e7eb', background: paymentMethod === 'razorpay' ? '#f0f4ff' : '#fff' }}
                onClick={() => setPaymentMethod('razorpay')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ ...styles.payRadio, borderColor: paymentMethod === 'razorpay' ? '#1a1a2e' : '#d1d5db' }}>
                    {paymentMethod === 'razorpay' && <div style={styles.payRadioDot} />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CreditCard size={18} color="#1a1a2e" />
                      <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>Pay Online via Razorpay</span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#666' }}>Credit/Debit Card, UPI, Net Banking, Wallets</p>
                  </div>
                </div>
                <div style={styles.razorpayBadge}>Razorpay</div>
              </div>

              {/* Pay at Hotel */}
              <div style={{ ...styles.payOption, borderColor: paymentMethod === 'pay_at_hotel' ? '#1a1a2e' : '#e5e7eb', background: paymentMethod === 'pay_at_hotel' ? '#f0f4ff' : '#fff' }}
                onClick={() => setPaymentMethod('pay_at_hotel')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ ...styles.payRadio, borderColor: paymentMethod === 'pay_at_hotel' ? '#1a1a2e' : '#d1d5db' }}>
                    {paymentMethod === 'pay_at_hotel' && <div style={styles.payRadioDot} />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Banknote size={18} color="#1a1a2e" />
                      <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>Pay at Hotel</span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#666' }}>Pay cash or card when you check in</p>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div style={styles.noteBox}>
                {paymentMethod === 'razorpay'
                  ? '🔒 Your payment is secured by Razorpay. 256-bit SSL encryption.'
                  : '🏨 No payment required now. Pay directly at the hotel during check-in.'}
              </div>

              <button style={styles.proceedBtn} onClick={handleConfirmPayment} disabled={processingPayment}>
                {processingPayment ? (
                  <><Loader2 size={18} className="animate-spin" style={{ marginRight: 8 }} /> Processing...</>
                ) : (
                  <>{paymentMethod === 'razorpay' ? `Pay ₹${totalAmount.toLocaleString('en-IN')}` : 'Confirm Booking'} <ChevronRight size={18} /></>
                )}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Booking Summary */}
        <div style={styles.summaryCol}>
          <div style={styles.summaryCard}>
            {/* Hotel info */}
            <img src={hotelPhoto} alt={hotel.displayName} style={styles.summaryImg} onError={e => { (e.target as HTMLImageElement).src = FALLBACK; }} />
            <div style={styles.summaryHotelInfo}>
              <h3 style={styles.summaryHotelName}>{hotel.displayName}</h3>
              <p style={styles.summaryHotelLoc}>{hotel.city}, {hotel.district}, {hotel.state}</p>
              {hotel.checkInTime && (
                <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                  Check-in: {hotel.checkInTime} · Check-out: {hotel.checkOutTime}
                </p>
              )}
            </div>

            <div style={styles.divider} />

            {/* Dates */}
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Check-in</span>
              <span style={styles.summaryValue}>{dateRange?.from ? format(dateRange.from, 'dd MMM yyyy') : '-'}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Check-out</span>
              <span style={styles.summaryValue}>{dateRange?.to ? format(dateRange.to, 'dd MMM yyyy') : '-'}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Duration</span>
              <span style={styles.summaryValue}>{nights} night{nights > 1 ? 's' : ''}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Room</span>
              <span style={styles.summaryValue}>{selectedRoom?.roomTypeName || '-'}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Rooms × Nights</span>
              <span style={styles.summaryValue}>{rooms} × {nights}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Guests</span>
              <span style={styles.summaryValue}>{adults} Adult{adults > 1 ? 's' : ''}{children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}</span>
            </div>

            <div style={styles.divider} />

            {/* Pricing */}
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Base Price</span>
              <span style={styles.summaryValue}>₹{basePrice.toLocaleString('en-IN')}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Tax (12% GST)</span>
              <span style={styles.summaryValue}>₹{taxAmount.toLocaleString('en-IN')}</span>
            </div>

            <div style={styles.summaryTotal}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: 20, color: '#1a1a2e' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <p style={{ fontSize: 11, color: '#aaa', marginTop: 8, textAlign: 'center' }}>
              Includes all taxes & fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f8f9fb', fontFamily: "'DM Sans', sans-serif" },
  header: { background: '#1a1a2e', padding: '16px 0' },
  headerInner: { maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 },
  backBtn: { display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  stepperWrap: { background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 0' },
  stepper: { maxWidth: 400, margin: '0 auto', display: 'flex', alignItems: 'center', padding: '0 24px' },
  stepItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  stepCircle: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 },
  layout: { maxWidth: 1100, margin: '32px auto', padding: '0 24px', display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' },
  formCol: { flex: '1 1 560px', display: 'flex', flexDirection: 'column', gap: 20 },
  summaryCol: { flex: '0 0 320px' },
  card: { background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' },
  cardTitle: { fontSize: 17, fontWeight: 700, color: '#1a1a2e', margin: '0 0 20px' },
  row: { display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 },
  field: { flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' },
  input: { width: '100%', padding: '11px 12px 11px 36px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', background: '#fafafa' },
  errorText: { fontSize: 12, color: '#ef4444', marginTop: 2 },
  dateBtn: { width: '100%', height: 44, border: '1.5px solid #e5e7eb', borderRadius: 10, background: '#fafafa', fontSize: 14 },
  selectTrigger: { height: 44, border: '1.5px solid #e5e7eb', borderRadius: 10, background: '#fafafa', fontSize: 14 },
  counter: { display: 'flex', alignItems: 'center', gap: 12, background: '#fafafa', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '8px 14px', width: 'fit-content' },
  counterBtn: { width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151' },
  counterVal: { fontSize: 15, fontWeight: 700, minWidth: 24, textAlign: 'center', color: '#1a1a2e' },
  proceedBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 12, padding: '15px 28px', fontSize: 16, fontWeight: 700, cursor: 'pointer', width: '100%', transition: 'opacity 0.2s' },
  payOption: { border: '2px solid', borderRadius: 12, padding: '18px 20px', marginBottom: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' },
  payRadio: { width: 20, height: 20, borderRadius: '50%', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  payRadioDot: { width: 10, height: 10, borderRadius: '50%', background: '#1a1a2e' },
  razorpayBadge: { background: '#072654', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, letterSpacing: '0.5px' },
  noteBox: { background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#0369a1', marginBottom: 20, lineHeight: 1.5 },
  summaryCard: { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0', position: 'sticky', top: 20 },
  summaryImg: { width: '100%', height: 160, objectFit: 'cover' },
  summaryHotelInfo: { padding: '16px 20px 0' },
  summaryHotelName: { fontSize: 16, fontWeight: 700, color: '#1a1a2e', margin: 0 },
  summaryHotelLoc: { fontSize: 13, color: '#666', margin: '4px 0 0' },
  divider: { height: 1, background: '#f0f0f0', margin: '16px 20px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', padding: '5px 20px' },
  summaryLabel: { fontSize: 13, color: '#6b7280' },
  summaryValue: { fontSize: 13, fontWeight: 600, color: '#1a1a2e' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: '#f8f9fb', margin: '12px 0 0', borderTop: '2px solid #e5e7eb' },
  // Confirmation
  confirmWrapper: { maxWidth: 640, margin: '60px auto', padding: '0 24px 60px', textAlign: 'center' },
  successCircle: { width: 80, height: 80, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' },
  confirmTitle: { fontSize: 32, fontWeight: 800, color: '#1a1a2e', margin: '0 0 12px' },
  confirmSubtitle: { fontSize: 15, color: '#6b7280', margin: '0 0 28px', lineHeight: 1.6 },
  bookingIdBox: { background: '#1a1a2e', borderRadius: 12, padding: '14px 24px', display: 'inline-flex', gap: 12, alignItems: 'center', marginBottom: 28 },
  bookingIdLabel: { fontSize: 12, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 },
  bookingIdValue: { fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: 2 },
  confirmCard: { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'left' },
  confirmHotelRow: { display: 'flex', gap: 14, padding: '20px', alignItems: 'center', borderBottom: '1px solid #f0f0f0' },
  confirmHotelImg: { width: 72, height: 72, borderRadius: 10, objectFit: 'cover', flexShrink: 0 },
  confirmGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', padding: '8px 0' },
  confirmItem: { display: 'flex', flexDirection: 'column', gap: 3, padding: '12px 20px', borderBottom: '1px solid #f9f9f9' },
  confirmLabel: { fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' },
  confirmValue: { fontSize: 14, fontWeight: 600, color: '#1a1a2e' },
  confirmTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: '#f8f9fb', borderTop: '2px solid #e5e7eb' },
  confirmPrimaryBtn: { background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  confirmSecondaryBtn: { background: '#fff', color: '#1a1a2e', border: '2px solid #1a1a2e', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' },
};

export default HotelBooking;