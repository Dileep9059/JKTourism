import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import axiosInstance from "@/axios/axios"
import DocumentTitle from "../DocumentTitle"
import {
  Hotel, MapPin, User, Settings, CheckCircle, Clock, XCircle, AlertCircle,
  ChevronRight, Loader2, Building2, Phone, Mail, CreditCard, FileText, Save,
  BookOpen, RefreshCw, Search, ChevronDown, ChevronUp, IndianRupee
} from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────────────
interface HotelStatus {
  status: string | null
  isApproved: boolean
  hotelId: string | null
}

interface OwnerDetails {
  name: string
  email: string
  mobile: string
  idProofType: string
}

interface BasicInfo {
  legalName: string
  displayName: string
  starRating: number
  establishedYear: number
  websiteUrl: string
  publicEmail: string
  publicPhone: string
  hotelType: string
}

interface LocationDetails {
  addressLine1: string
  addressLine2: string
  city: string
  district: string
  state: string
  pincode: string
  latitude: string
  longitude: string
  nearestLandmark: string
  googleMapsLink: string
}

interface Booking {
  id: number
  bookingRef: string
  guestFirstName: string
  guestLastName: string
  guestEmail: string
  guestPhone: string
  roomType: string
  rooms: number
  adults: number
  children: number
  checkIn: string
  checkOut: string
  nights: number
  basePrice: number
  taxAmount: number
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  bookingStatus: string
  refundStatus: string
  cancellationReason: string | null
  cancelledAt: string | null
  createdAt: string
}

type ActiveTab = 'overview' | 'owner' | 'basic' | 'location' | 'bookings'

// ── Status Badge ───────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string | null }) => {
  if (!status) return null
  const config: Record<string, { icon: any; color: string; bg: string; label: string }> = {
    APPROVED: { icon: CheckCircle, color: '#16a34a', bg: '#dcfce7', label: 'Approved' },
    PENDING_REVIEW: { icon: Clock, color: '#d97706', bg: '#fef3c7', label: 'Pending Review' },
    DRAFT: { icon: AlertCircle, color: '#2563eb', bg: '#dbeafe', label: 'Draft' },
    REJECTED: { icon: XCircle, color: '#dc2626', bg: '#fee2e2', label: 'Rejected' },
    CONFIRMED: { icon: CheckCircle, color: '#16a34a', bg: '#dcfce7', label: 'Confirmed' },
    CANCELLED: { icon: XCircle, color: '#dc2626', bg: '#fee2e2', label: 'Cancelled' },
    PENDING: { icon: Clock, color: '#d97706', bg: '#fef3c7', label: 'Pending' },
    PAID: { icon: CheckCircle, color: '#16a34a', bg: '#dcfce7', label: 'Paid' },
    REFUNDED: { icon: CheckCircle, color: '#7c3aed', bg: '#ede9fe', label: 'Refunded' },
    REQUESTED: { icon: Clock, color: '#d97706', bg: '#fef3c7', label: 'Refund Requested' },
    NONE: { icon: CheckCircle, color: '#6b7280', bg: '#f3f4f6', label: 'No Refund' },
  }
  const c = config[status] || config['DRAFT']
  const Icon = c.icon
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: c.bg, color: c.color, padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
      <Icon size={12} /> {c.label}
    </span>
  )
}

// ── Field Component ────────────────────────────────────────────────────────────
const FormField = ({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
      {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    {children}
  </div>
)

// ── Main Component ─────────────────────────────────────────────────────────────
const HotelDashboard = () => {
  const [hotelStatus, setHotelStatus] = useState<HotelStatus | null>(null)
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Owner Details state
  const [owner, setOwner] = useState<OwnerDetails>({ name: '', email: '', mobile: '', idProofType: '' })
  const [idProofFile, setIdProofFile] = useState<File | null>(null)
  const [ownerLoading, setOwnerLoading] = useState(false)

  // Basic Info state
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    legalName: '', displayName: '', starRating: 0, establishedYear: 0,
    websiteUrl: '', publicEmail: '', publicPhone: '', hotelType: ''
  })
  const [basicLoading, setBasicLoading] = useState(false)

  // Location state
  const [location, setLocation] = useState<LocationDetails>({
    addressLine1: '', addressLine2: '', city: '', district: '',
    state: '', pincode: '', latitude: '', longitude: '', nearestLandmark: '', googleMapsLink: ''
  })
  const [locationLoading, setLocationLoading] = useState(false)

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [bookingSearch, setBookingSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [refundFilter, setRefundFilter] = useState('ALL')
  const [expandedBooking, setExpandedBooking] = useState<number | null>(null)
  const [refundActionId, setRefundActionId] = useState<number | null>(null)

  // ── Fetch hotel status ───────────────────────────────────────────────────
  useEffect(() => {
    axiosInstance.get('/api/hotels/get-hotel')
      .then(res => setHotelStatus(res.data))
      .catch(() => toast.error('Failed to load hotel info'))
      .finally(() => setLoading(false))
  }, [])

  // ── Fetch section data when tab changes ──────────────────────────────────
  useEffect(() => {
    if (!hotelStatus?.hotelId) return
    const id = hotelStatus.hotelId

    if (activeTab === 'owner') {
      setOwnerLoading(true)
      axiosInstance.get(`/api/hotels/${id}/owner-details`)
        .then(res => setOwner(res.data))
        .catch(() => {})
        .finally(() => setOwnerLoading(false))
    }
    if (activeTab === 'basic') {
      setBasicLoading(true)
      axiosInstance.get('/api/hotels/basic-info')
        .then(res => setBasicInfo(res.data))
        .catch(() => {})
        .finally(() => setBasicLoading(false))
    }
    if (activeTab === 'location') {
      setLocationLoading(true)
      axiosInstance.get(`/api/hotels/${id}/location`)
        .then(res => setLocation(res.data))
        .catch(() => {})
        .finally(() => setLocationLoading(false))
    }
    if (activeTab === 'bookings') {
      fetchBookings()
    }
  }, [activeTab, hotelStatus?.hotelId])

  // ── Fetch Bookings ───────────────────────────────────────────────────────
  const fetchBookings = async () => {
    if (!hotelStatus?.hotelId) return
    setBookingsLoading(true)
    axiosInstance.get(`/api/v1/bookings/hotel/${hotelStatus.hotelId}`)
      .then(res => setBookings(res.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setBookingsLoading(false))
  }

  // ── Approve Refund ───────────────────────────────────────────────────────
  const approveRefund = async (id: number) => {
    try {
      setRefundActionId(id)
      await axiosInstance.patch(`/api/v1/bookings/${id}/refund/approve`)
      toast.success('Refund approved — email sent to guest')
      fetchBookings()
    } catch {
      toast.error('Failed to approve refund')
    } finally {
      setRefundActionId(null)
    }
  }

  // ── Reject Refund ────────────────────────────────────────────────────────
  const rejectRefund = async (id: number) => {
    try {
      setRefundActionId(id)
      await axiosInstance.patch(`/api/v1/bookings/${id}/refund/reject`)
      toast.success('Refund rejected — email sent to guest')
      fetchBookings()
    } catch {
      toast.error('Failed to reject refund')
    } finally {
      setRefundActionId(null)
    }
  }

  // ── Cancel Booking ───────────────────────────────────────────────────────
  const cancelBooking = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    try {
      await axiosInstance.patch(`/api/v1/bookings/${id}/cancel`, { reason: 'Cancelled by hotel admin' })
      toast.success('Booking cancelled')
      fetchBookings()
    } catch {
      toast.error('Failed to cancel booking')
    }
  }

  // ── Save Owner Details ───────────────────────────────────────────────────
  const saveOwnerDetails = async () => {
    if (!hotelStatus?.hotelId) return
    if (!owner.name || !owner.email || !owner.mobile || !owner.idProofType) {
      toast.error('Please fill all required fields'); return
    }
    if (!idProofFile) { toast.error('Please upload ID proof document'); return }
    try {
      setSaving(true)
      const formData = new FormData()
      formData.append('data', JSON.stringify(owner))
      formData.append('file', idProofFile)
      await axiosInstance.post(`/api/hotels/${hotelStatus.hotelId}/owner-details`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Owner details saved successfully')
    } catch { toast.error('Failed to save owner details') }
    finally { setSaving(false) }
  }

  // ── Save Basic Info ──────────────────────────────────────────────────────
  const saveBasicInfo = async () => {
    try {
      setSaving(true)
      await axiosInstance.post('/api/hotels/basic-info', { ...basicInfo, yearOfEstablishment: basicInfo.establishedYear })
      toast.success('Basic info saved successfully')
      const res = await axiosInstance.get('/api/hotels/get-hotel')
      setHotelStatus(res.data)
    } catch { toast.error('Failed to save basic info') }
    finally { setSaving(false) }
  }

  // ── Save Location ────────────────────────────────────────────────────────
  const saveLocation = async () => {
    if (!hotelStatus?.hotelId) return
    try {
      setSaving(true)
      await axiosInstance.post(`/api/hotels/${hotelStatus.hotelId}/location`, location)
      toast.success('Location saved successfully')
    } catch { toast.error('Failed to save location') }
    finally { setSaving(false) }
  }

  // ── Booking Stats ────────────────────────────────────────────────────────
  const totalBookings = bookings.length
  const confirmedBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED').length
  const cancelledBookings = bookings.filter(b => b.bookingStatus === 'CANCELLED').length
  const pendingRefunds = bookings.filter(b => b.refundStatus === 'REQUESTED').length
  const totalRevenue = bookings.filter(b => b.paymentStatus === 'PAID').reduce((sum, b) => sum + b.totalAmount, 0)

  // ── Filtered Bookings ────────────────────────────────────────────────────
  const filteredBookings = bookings.filter(b => {
    const matchSearch = bookingSearch === '' ||
      b.bookingRef.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.guestEmail.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      `${b.guestFirstName} ${b.guestLastName}`.toLowerCase().includes(bookingSearch.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || b.bookingStatus === statusFilter
    const matchRefund = refundFilter === 'ALL' || b.refundStatus === refundFilter
    return matchSearch && matchStatus && matchRefund
  })

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12, color: '#6b7280' }}>
      <Loader2 size={28} className="animate-spin" /><span>Loading dashboard...</span>
    </div>
  )

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Settings },
    { key: 'bookings', label: 'Bookings', icon: BookOpen },
    { key: 'basic', label: 'Basic Info', icon: Building2 },
    { key: 'owner', label: 'Owner Details', icon: User },
    { key: 'location', label: 'Location', icon: MapPin },
  ]

  return (
    <>
      <DocumentTitle title="Hotel Dashboard" />
      <div style={{ minHeight: '100vh', background: '#f8f9fb', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Header */}
        <div style={{ background: '#1a1a2e', padding: '20px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 10 }}>
                <Hotel size={22} color="#fff" />
              </div>
              <div>
                <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>Hotel Dashboard</h1>
                <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>Manage your hotel information</p>
              </div>
            </div>
            {hotelStatus?.status && <StatusBadge status={hotelStatus.status} />}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 4, overflowX: 'auto' }}>
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.key
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key as ActiveTab)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: isActive ? '#1a1a2e' : '#6b7280', whiteSpace: 'nowrap', borderBottom: isActive ? '2px solid #1a1a2e' : '2px solid transparent' }}>
                  <Icon size={16} />
                  {tab.label}
                  {tab.key === 'bookings' && pendingRefunds > 0 && (
                    <span style={{ background: '#f59e0b', color: '#fff', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 999, marginLeft: 2 }}>{pendingRefunds}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '32px auto', padding: '0 24px' }}>

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Settings size={18} /> Hotel Status
                </h2>
                {hotelStatus?.hotelId ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    {[
                      { label: 'Hotel ID', value: hotelStatus.hotelId, small: true },
                      { label: 'Status', value: <StatusBadge status={hotelStatus.status} /> },
                      { label: 'Approval', value: <span style={{ fontSize: 14, fontWeight: 600, color: hotelStatus.isApproved ? '#16a34a' : '#d97706' }}>{hotelStatus.isApproved ? '✅ Approved' : '⏳ Pending'}</span> },
                    ].map((item, i) => (
                      <div key={i} style={{ background: '#f8f9fb', borderRadius: 12, padding: '16px 20px' }}>
                        <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
                        {typeof item.value === 'string'
                          ? <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', margin: 0, wordBreak: 'break-all' }}>{item.value}</p>
                          : item.value}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: '#6b7280' }}>
                    <Hotel size={48} style={{ opacity: 0.2, margin: '0 auto 12px' }} />
                    <p style={{ margin: '0 0 16px' }}>No hotel registered yet.</p>
                    <button onClick={() => setActiveTab('basic')}
                      style={{ background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      Start Registration <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
              {hotelStatus?.hotelId && (
                <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', margin: '0 0 20px' }}>Quick Actions</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                    {[
                      { label: 'View Bookings', icon: BookOpen, tab: 'bookings' },
                      { label: 'Edit Basic Info', icon: Building2, tab: 'basic' },
                      { label: 'Edit Owner Details', icon: User, tab: 'owner' },
                      { label: 'Edit Location', icon: MapPin, tab: 'location' },
                    ].map(item => {
                      const Icon = item.icon
                      return (
                        <button key={item.tab} onClick={() => setActiveTab(item.tab as ActiveTab)}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8f9fb', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '14px 18px', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>
                          <Icon size={16} color="#6b7280" /> {item.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── BOOKINGS TAB ── */}
          {activeTab === 'bookings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Pending refund alert */}
              {pendingRefunds > 0 && (
                <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AlertCircle size={18} color="#d97706" />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#92400e' }}>
                      ⚠️ {pendingRefunds} refund request{pendingRefunds > 1 ? 's' : ''} waiting for your action
                    </span>
                  </div>
                  <button onClick={() => setRefundFilter('REQUESTED')}
                    style={{ background: '#d97706', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    View Refund Requests
                  </button>
                </div>
              )}

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
                {[
                  { label: 'Total Bookings', value: totalBookings, color: '#1a1a2e', bg: '#f8f9fb' },
                  { label: 'Confirmed', value: confirmedBookings, color: '#16a34a', bg: '#dcfce7' },
                  { label: 'Cancelled', value: cancelledBookings, color: '#dc2626', bg: '#fee2e2' },
                  { label: 'Pending Refunds', value: pendingRefunds, color: '#d97706', bg: pendingRefunds > 0 ? '#fef3c7' : '#f8f9fb' },
                  { label: 'Revenue (Paid)', value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: '#7c3aed', bg: '#ede9fe' },
                ].map((stat, i) => (
                  <div key={i} style={{ background: stat.bg, borderRadius: 12, padding: '16px 20px', border: '1px solid #f0f0f0' }}>
                    <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</p>
                    <p style={{ fontSize: 22, fontWeight: 800, color: stat.color, margin: 0 }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: '1 1 200px' }}>
                  <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input value={bookingSearch} onChange={e => setBookingSearch(e.target.value)}
                    placeholder="Search by name, email or booking ID..."
                    style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  style={{ height: 40, padding: '0 12px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, background: '#fff', cursor: 'pointer' }}>
                  <option value="ALL">All Status</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <select value={refundFilter} onChange={e => setRefundFilter(e.target.value)}
                  style={{ height: 40, padding: '0 12px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, background: '#fff', cursor: 'pointer' }}>
                  <option value="ALL">All Refunds</option>
                  <option value="REQUESTED">Refund Requested</option>
                  <option value="APPROVED">Refund Approved</option>
                  <option value="REJECTED">Refund Rejected</option>
                  <option value="NONE">No Refund</option>
                </select>
                <button onClick={fetchBookings} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8f9fb', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '9px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#374151' }}>
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>

              {/* Bookings List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {bookingsLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                    <Loader2 size={28} className="animate-spin" color="#6b7280" />
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div style={{ background: '#fff', borderRadius: 16, padding: '60px 24px', textAlign: 'center', color: '#6b7280', border: '1px solid #f0f0f0' }}>
                    <BookOpen size={40} style={{ opacity: 0.2, margin: '0 auto 12px' }} />
                    <p>No bookings found.</p>
                  </div>
                ) : filteredBookings.map(booking => {
                  const isExpanded = expandedBooking === booking.id
                  const isRefundPending = booking.refundStatus === 'REQUESTED'
                  return (
                    <div key={booking.id} style={{ background: '#fff', borderRadius: 14, border: `1.5px solid ${isRefundPending ? '#f59e0b' : '#f0f0f0'}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>

                      {/* Booking Card Header */}
                      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, cursor: 'pointer', background: isRefundPending ? '#fffbeb' : '#fff' }}
                        onClick={() => setExpandedBooking(isExpanded ? null : booking.id)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                          <div>
                            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>
                              {booking.guestFirstName} {booking.guestLastName}
                            </p>
                            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280' }}>{booking.guestEmail}</p>
                          </div>
                          <span style={{ background: '#1a1a2e', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, letterSpacing: 1 }}>
                            {booking.bookingRef}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          <StatusBadge status={booking.bookingStatus} />
                          <StatusBadge status={booking.paymentStatus} />
                          {booking.refundStatus !== 'NONE' && <StatusBadge status={booking.refundStatus} />}
                          <span style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e' }}>₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
                          {isExpanded ? <ChevronUp size={18} color="#6b7280" /> : <ChevronDown size={18} color="#6b7280" />}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div style={{ borderTop: '1px solid #f0f0f0', padding: '20px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
                            {[
                              { label: 'Room Type', value: booking.roomType },
                              { label: 'Rooms', value: booking.rooms },
                              { label: 'Guests', value: `${booking.adults} Adults${booking.children > 0 ? `, ${booking.children} Children` : ''}` },
                              { label: 'Check-in', value: booking.checkIn },
                              { label: 'Check-out', value: booking.checkOut },
                              { label: 'Nights', value: booking.nights },
                              { label: 'Payment Method', value: booking.paymentMethod === 'razorpay' ? '💳 Razorpay' : '🏨 Pay at Hotel' },
                              { label: 'Phone', value: booking.guestPhone },
                              { label: 'Base Price', value: `₹${booking.basePrice?.toLocaleString('en-IN')}` },
                              { label: 'Tax (GST)', value: `₹${booking.taxAmount?.toLocaleString('en-IN')}` },
                              { label: 'Total', value: `₹${booking.totalAmount?.toLocaleString('en-IN')}` },
                              { label: 'Booked On', value: booking.createdAt?.split('T')[0] },
                            ].map((item, i) => (
                              <div key={i} style={{ background: '#f8f9fb', borderRadius: 8, padding: '10px 14px' }}>
                                <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', margin: 0 }}>{item.value ?? '-'}</p>
                              </div>
                            ))}
                          </div>

                          {/* Cancellation info */}
                          {booking.cancellationReason && (
                            <div style={{ background: '#fee2e2', borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
                              <p style={{ fontSize: 12, color: '#991b1b', margin: 0 }}>
                                <strong>Cancellation Reason:</strong> {booking.cancellationReason}
                                {booking.cancelledAt && ` — ${booking.cancelledAt.split('T')[0]}`}
                              </p>
                            </div>
                          )}

                          {/* Refund action box */}
                          {isRefundPending && (
                            <div style={{ background: '#fef3c7', border: '1.5px solid #f59e0b', borderRadius: 10, padding: '16px 18px', marginBottom: 14 }}>
                              <p style={{ fontSize: 14, fontWeight: 700, color: '#92400e', margin: '0 0 4px' }}>
                                💰 Refund Request — ₹{booking.totalAmount?.toLocaleString('en-IN')}
                              </p>
                              <p style={{ fontSize: 13, color: '#78350f', margin: '0 0 14px' }}>
                                Guest <strong>{booking.guestEmail}</strong> has requested a refund for this booking.
                              </p>
                              <div style={{ display: 'flex', gap: 10 }}>
                                <button onClick={() => approveRefund(booking.id)} disabled={refundActionId === booking.id}
                                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                                  {refundActionId === booking.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                  Approve Refund
                                </button>
                                <button onClick={() => rejectRefund(booking.id)} disabled={refundActionId === booking.id}
                                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                                  {refundActionId === booking.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                                  Reject Refund
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Cancel booking button */}
                          {booking.bookingStatus === 'CONFIRMED' && (
                            <button onClick={() => cancelBooking(booking.id)}
                              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', color: '#dc2626', border: '1.5px solid #dc2626', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                              <XCircle size={14} /> Cancel Booking
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── BASIC INFO TAB ── */}
          {activeTab === 'basic' && (
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Building2 size={18} /> Basic Information
              </h2>
              {basicLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}><Loader2 size={24} className="animate-spin" color="#6b7280" /></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    <FormField label="Legal Name" required>
                      <Input value={basicInfo.legalName} onChange={e => setBasicInfo(p => ({ ...p, legalName: e.target.value }))} placeholder="Registered legal name" />
                    </FormField>
                    <FormField label="Display Name" required>
                      <Input value={basicInfo.displayName} onChange={e => setBasicInfo(p => ({ ...p, displayName: e.target.value }))} placeholder="Name shown to guests" />
                    </FormField>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    <FormField label="Hotel Type" required>
                      <select value={basicInfo.hotelType} onChange={e => setBasicInfo(p => ({ ...p, hotelType: e.target.value }))}
                        style={{ height: 40, width: '100%', borderRadius: 8, border: '1px solid #e5e7eb', padding: '0 12px', fontSize: 14, background: '#fff' }}>
                        <option value="">Select type</option>
                        <option value="HOTEL">Hotel</option>
                        <option value="RESORT">Resort</option>
                        <option value="GUEST_HOUSE">Guest House</option>
                        <option value="LODGE">Lodge</option>
                        <option value="BOUTIQUE">Boutique</option>
                      </select>
                    </FormField>
                    <FormField label="Star Rating">
                      <select value={basicInfo.starRating} onChange={e => setBasicInfo(p => ({ ...p, starRating: parseInt(e.target.value) }))}
                        style={{ height: 40, width: '100%', borderRadius: 8, border: '1px solid #e5e7eb', padding: '0 12px', fontSize: 14, background: '#fff' }}>
                        <option value="0">No Rating</option>
                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Star</option>)}
                      </select>
                    </FormField>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    <FormField label="Public Email">
                      <Input type="email" value={basicInfo.publicEmail} onChange={e => setBasicInfo(p => ({ ...p, publicEmail: e.target.value }))} placeholder="hotel@example.com" />
                    </FormField>
                    <FormField label="Public Phone">
                      <Input type="tel" value={basicInfo.publicPhone} onChange={e => setBasicInfo(p => ({ ...p, publicPhone: e.target.value }))} placeholder="9876543210" maxLength={10} />
                    </FormField>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    <FormField label="Website URL">
                      <Input value={basicInfo.websiteUrl} onChange={e => setBasicInfo(p => ({ ...p, websiteUrl: e.target.value }))} placeholder="https://yourhotel.com" />
                    </FormField>
                    <FormField label="Year of Establishment">
                      <Input type="number" value={basicInfo.establishedYear || ''} onChange={e => setBasicInfo(p => ({ ...p, establishedYear: parseInt(e.target.value) }))} placeholder="2010" />
                    </FormField>
                  </div>
                  <div style={{ paddingTop: 8 }}>
                    <Button onClick={saveBasicInfo} disabled={saving} className="flex items-center gap-2">
                      {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      {saving ? 'Saving...' : 'Save Basic Info'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── OWNER DETAILS TAB ── */}
          {activeTab === 'owner' && (
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={18} /> Owner Details
              </h2>
              {!hotelStatus?.hotelId ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#6b7280' }}>
                  <AlertCircle size={40} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
                  <p>Please complete Basic Info first to add owner details.</p>
                  <button onClick={() => setActiveTab('basic')}
                    style={{ marginTop: 12, background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    Go to Basic Info
                  </button>
                </div>
              ) : ownerLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}><Loader2 size={24} className="animate-spin" color="#6b7280" /></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    <FormField label="Full Name" required>
                      <div style={{ position: 'relative' }}>
                        <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <Input style={{ paddingLeft: 36 }} value={owner.name} onChange={e => setOwner(p => ({ ...p, name: e.target.value }))} placeholder="Owner full name" />
                      </div>
                    </FormField>
                    <FormField label="Email Address" required>
                      <div style={{ position: 'relative' }}>
                        <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <Input style={{ paddingLeft: 36 }} type="email" value={owner.email} onChange={e => setOwner(p => ({ ...p, email: e.target.value }))} placeholder="owner@example.com" />
                      </div>
                    </FormField>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    <FormField label="Mobile Number" required>
                      <div style={{ position: 'relative' }}>
                        <Phone size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <Input style={{ paddingLeft: 36 }} type="tel" maxLength={10} value={owner.mobile} onChange={e => setOwner(p => ({ ...p, mobile: e.target.value.replace(/\D/, '') }))} placeholder="10-digit mobile" />
                      </div>
                    </FormField>
                    <FormField label="ID Proof Type" required>
                      <div style={{ position: 'relative' }}>
                        <CreditCard size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <select value={owner.idProofType} onChange={e => setOwner(p => ({ ...p, idProofType: e.target.value }))}
                          style={{ height: 40, width: '100%', borderRadius: 8, border: '1px solid #e5e7eb', paddingLeft: 36, paddingRight: 12, fontSize: 14, background: '#fff' }}>
                          <option value="">Select ID proof</option>
                          <option value="AADHAAR">Aadhaar Card</option>
                          <option value="PAN">PAN Card</option>
                          <option value="PASSPORT">Passport</option>
                          <option value="VOTER_ID">Voter ID</option>
                          <option value="DRIVING_LICENSE">Driving License</option>
                        </select>
                      </div>
                    </FormField>
                  </div>
                  <FormField label="Upload ID Proof Document" required>
                    <div style={{ border: '2px dashed #e5e7eb', borderRadius: 12, padding: '20px 24px', background: '#fafafa', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                      <FileText size={28} color="#9ca3af" />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: '#374151' }}>
                          {idProofFile ? idProofFile.name : 'No file chosen'}
                        </p>
                        <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>PDF, JPG, PNG up to 5MB</p>
                      </div>
                      <label style={{ background: '#1a1a2e', color: '#fff', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                        Browse File
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
                          onChange={e => setIdProofFile(e.target.files?.[0] || null)} />
                      </label>
                    </div>
                  </FormField>
                  <div style={{ paddingTop: 8 }}>
                    <Button onClick={saveOwnerDetails} disabled={saving} className="flex items-center gap-2">
                      {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      {saving ? 'Saving...' : 'Save Owner Details'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── LOCATION TAB ── */}
          {activeTab === 'location' && (
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={18} /> Location Details
              </h2>
              {!hotelStatus?.hotelId ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#6b7280' }}>
                  <AlertCircle size={40} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
                  <p>Please complete Basic Info first.</p>
                </div>
              ) : locationLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}><Loader2 size={24} className="animate-spin" color="#6b7280" /></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    <FormField label="Address Line 1" required>
                      <Input value={location.addressLine1} onChange={e => setLocation(p => ({ ...p, addressLine1: e.target.value }))} placeholder="Street / Building" />
                    </FormField>
                    <FormField label="Address Line 2">
                      <Input value={location.addressLine2} onChange={e => setLocation(p => ({ ...p, addressLine2: e.target.value }))} placeholder="Area / Locality" />
                    </FormField>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                    <FormField label="City" required><Input value={location.city} onChange={e => setLocation(p => ({ ...p, city: e.target.value }))} placeholder="City" /></FormField>
                    <FormField label="District" required><Input value={location.district} onChange={e => setLocation(p => ({ ...p, district: e.target.value }))} placeholder="District" /></FormField>
                    <FormField label="State" required><Input value={location.state} onChange={e => setLocation(p => ({ ...p, state: e.target.value }))} placeholder="State" /></FormField>
                    <FormField label="Pincode" required><Input value={location.pincode} onChange={e => setLocation(p => ({ ...p, pincode: e.target.value }))} placeholder="180001" maxLength={6} /></FormField>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    <FormField label="Latitude"><Input value={location.latitude} onChange={e => setLocation(p => ({ ...p, latitude: e.target.value }))} placeholder="34.0837" /></FormField>
                    <FormField label="Longitude"><Input value={location.longitude} onChange={e => setLocation(p => ({ ...p, longitude: e.target.value }))} placeholder="74.7973" /></FormField>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    <FormField label="Nearest Landmark"><Input value={location.nearestLandmark} onChange={e => setLocation(p => ({ ...p, nearestLandmark: e.target.value }))} placeholder="Near Dal Lake" /></FormField>
                    <FormField label="Google Maps Link"><Input value={location.googleMapsLink} onChange={e => setLocation(p => ({ ...p, googleMapsLink: e.target.value }))} placeholder="https://maps.google.com/..." /></FormField>
                  </div>
                  <div style={{ paddingTop: 8 }}>
                    <Button onClick={saveLocation} disabled={saving} className="flex items-center gap-2">
                      {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      {saving ? 'Saving...' : 'Save Location'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default HotelDashboard