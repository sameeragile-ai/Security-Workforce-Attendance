export type BrandId = 'aman' | 'nile';
export type UserRole = 'guard' | 'supervisor' | 'group_mgmt';

export interface UserProfile {
  id: string;
  name: string;
  nameAr: string;
  employeeId: string;
  nationalIdMasked: string;
  phone: string;
  avatarUrl: string;
  role: UserRole;
  brand: BrandId;
  clearanceLevel: string;
  registeredDevice: {
    model: string;
    bound: boolean;
    fingerprint: string;
  };
  assignedSiteId: string;
  assignedShift: {
    title: string;
    titleAr: string;
    startTime: string; // "19:00"
    endTime: string;   // "07:00"
    type: 'night' | 'day';
  };
}

export interface SecuritySite {
  id: string;
  name: string;
  nameAr: string;
  city: string;
  cityAr: string;
  address: string;
  addressAr: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  brand: BrandId;
  requiredGuards: number;
  onDutyGuards: number;
  photoUrl: string;
  gatesCount: number;
  supervisorName: string;
  status: 'optimal' | 'warning' | 'critical';
}

export interface AttendanceEvent {
  id: string;
  type: 'check_in' | 'check_out' | 'random_selfie' | 'breach_flag';
  timestamp: string; // ISO
  deviceTimestamp: string;
  serverTimestamp?: string;
  siteId: string;
  siteName: string;
  siteNameAr: string;
  lat: number;
  lng: number;
  accuracyMeters: number;
  source: 'geofence' | 'manual' | 'selfie';
  signatureHash: string;
  synced: boolean;
  fraudFlag?: string;
}

export interface IncidentReport {
  id: string;
  title: string;
  titleAr: string;
  type: 'intrusion' | 'fire' | 'medical' | 'damage' | 'suspicious' | 'other';
  description: string;
  siteId: string;
  siteName: string;
  timestamp: string;
  lat: number;
  lng: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  photoUrl?: string;
  audioDurationSeconds?: number;
  status: 'pending' | 'reviewing' | 'resolved';
  reportedByName: string;
  synced: boolean;
}

export interface EscalationLevel {
  level: 1 | 2 | 3;
  role: string;
  roleAr: string;
  name: string;
  avatarUrl: string;
  countdownSeconds: number;
  status: 'pending' | 'acknowledged' | 'escalated';
  acknowledgedAt?: string;
}

export interface UrgentAlert {
  id: string;
  guardId: string;
  guardName: string;
  siteName: string;
  lat: number;
  lng: number;
  timestamp: string;
  reason: string;
  active: boolean;
  levels: EscalationLevel[];
}

export interface MessageItem {
  id: string;
  senderName: string;
  senderAvatar: string;
  isSelf: boolean;
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface BroadcastAnnouncement {
  id: string;
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  author: string;
  timestamp: string;
  acknowledged: boolean;
  ackCount: number;
  totalRecipients: number;
  priority: 'normal' | 'high' | 'urgent';
}

export interface ShiftRequest {
  id: string;
  type: 'leave' | 'advance' | 'raise';
  details: string;
  amountOrDays: string;
  dateSubmitted: string;
  status: 'supervisor_review' | 'hr_review' | 'finance_approved' | 'rejected';
  currentApprover: string;
  currentApproverAr: string;
}

export interface PayslipRecord {
  id: string;
  monthYear: string;
  monthYearAr: string;
  basicSalaryEGP: number;
  overtimeHours: number;
  overtimePayEGP: number;
  allowanceEGP: number;
  deductionsEGP: number;
  netPayEGP: number;
  paymentStatus: 'paid' | 'processing';
  paymentDate: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  durationMinutes: number;
  completed: boolean;
  scorePercent?: number;
  thumbnailUrl: string;
}

export interface PushNotificationBanner {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  timestamp: string;
  linkPath?: string;
}
