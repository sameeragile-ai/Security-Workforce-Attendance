import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  BrandId,
  UserRole,
  UserProfile,
  SecuritySite,
  AttendanceEvent,
  IncidentReport,
  UrgentAlert,
  BroadcastAnnouncement,
  ShiftRequest,
  PayslipRecord,
  TrainingModule,
  PushNotificationBanner,
} from '../types';
import {
  INITIAL_GUARD_USER,
  INITIAL_SUPERVISOR_USER,
  INITIAL_SITES,
  INITIAL_INCIDENTS,
  INITIAL_BROADCASTS,
  INITIAL_URGENT_ALERT,
  INITIAL_REQUESTS,
  INITIAL_PAYSLIPS,
  INITIAL_TRAINING,
} from '../data/seed';
import { isInsideGeofence } from '../lib/geo';
import { computeEventHash } from '../lib/crypto';
import { Language } from '../i18n';

interface AppState {
  // Brand & Settings
  brand: BrandId;
  role: UserRole;
  language: Language;
  useEasternNumerals: boolean;
  theme: 'dark' | 'light';
  isAppKilledSimulated: boolean;

  // Active User Profile
  currentUser: UserProfile;

  // Sites & Navigation
  sites: SecuritySite[];
  selectedSiteId: string;

  // GPS & Telemetry
  guardLocation: {
    lat: number;
    lng: number;
    accuracyMeters: number;
  };
  isMockLocationDetected: boolean;

  // Attendance State
  isOnPost: boolean;
  shiftSeconds: number; // counting up: e.g. 20537s = 05:42:17
  attendanceEvents: AttendanceEvent[];
  syncQueue: AttendanceEvent[];
  isOffline: boolean;
  isSyncing: boolean;

  // Anti-Fraud Verification
  isSelfieRequired: boolean;
  selfieSecondsLeft: number;

  // Modules
  incidents: IncidentReport[];
  broadcasts: BroadcastAnnouncement[];
  urgentAlert: UrgentAlert;
  requests: ShiftRequest[];
  payslips: PayslipRecord[];
  training: TrainingModule[];
  notifications: PushNotificationBanner[];

  // Actions
  setBrand: (brand: BrandId) => void;
  setRole: (role: UserRole) => void;
  setLanguage: (lang: Language) => void;
  setUseEasternNumerals: (enabled: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setSelectedSiteId: (siteId: string) => void;
  setAppKilledSimulated: (killed: boolean) => void;

  // Movement & Geofence
  walkInsideSite: () => void;
  walkOutsideSite: () => void;
  teleportMockLocation: () => void;
  setCustomLocation: (lat: number, lng: number) => void;

  // Attendance
  checkIn: (source?: 'geofence' | 'manual' | 'selfie') => Promise<void>;
  checkOut: () => Promise<void>;
  incrementShiftTimer: () => void;

  // Offline Sync
  toggleOffline: () => void;
  syncAllPending: () => Promise<void>;

  // Anti-Fraud
  triggerRandomSelfieCheck: () => void;
  completeSelfieVerification: () => Promise<void>;

  // Urgent & Messaging
  triggerSOS: (reason?: string) => void;
  acknowledgeUrgentLevel: (level: number) => void;
  resetSOS: () => void;
  acknowledgeBroadcast: (id: string) => void;

  // Incidents
  addIncident: (report: Omit<IncidentReport, 'id' | 'timestamp' | 'synced'>) => Promise<void>;

  // Supervisor Actions
  dispatchGuardToSite: (guardId: string, siteId: string) => void;
  approveRequest: (requestId: string) => void;

  // Push Notifications
  pushNotification: (banner: Omit<PushNotificationBanner, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;

  // Reset
  resetDemoData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      brand: 'aman',
      role: 'guard',
      language: 'en',
      useEasternNumerals: false,
      theme: 'dark',
      isAppKilledSimulated: false,

      currentUser: INITIAL_GUARD_USER,
      sites: INITIAL_SITES,
      selectedSiteId: 'site_citystars',

      // Default guard location is inside City Stars Mall Gate 3 (42m away from center)
      guardLocation: {
        lat: 30.0736,
        lng: 31.3470,
        accuracyMeters: 4,
      },
      isMockLocationDetected: false,

      isOnPost: true,
      shiftSeconds: 20537, // ~ 05:42:17 on post
      attendanceEvents: [
        {
          id: 'att_01',
          type: 'check_in',
          timestamp: new Date(Date.now() - 5.7 * 3600 * 1000).toISOString(),
          deviceTimestamp: new Date(Date.now() - 5.7 * 3600 * 1000).toISOString(),
          serverTimestamp: new Date(Date.now() - 5.7 * 3600 * 1000).toISOString(),
          siteId: 'site_citystars',
          siteName: 'City Stars Mall — Gate 3',
          siteNameAr: 'سيتي ستارز مول — بوابة ٣',
          lat: 30.0736,
          lng: 31.3470,
          accuracyMeters: 4,
          source: 'geofence',
          signatureHash: '0x8F4A19B2...D4E8',
          synced: true,
        },
      ],
      syncQueue: [],
      isOffline: false,
      isSyncing: false,

      isSelfieRequired: false,
      selfieSecondsLeft: 300,

      incidents: INITIAL_INCIDENTS,
      broadcasts: INITIAL_BROADCASTS,
      urgentAlert: INITIAL_URGENT_ALERT,
      requests: INITIAL_REQUESTS,
      payslips: INITIAL_PAYSLIPS,
      training: INITIAL_TRAINING,
      notifications: [],

      setBrand: (brand) => {
        const currentRole = get().role;
        set({
          brand,
          currentUser: currentRole === 'supervisor' ? { ...INITIAL_SUPERVISOR_USER, brand } : { ...INITIAL_GUARD_USER, brand },
        });
        document.documentElement.setAttribute('data-brand', brand);
      },

      setRole: (role) => {
        set({
          role,
          currentUser: role === 'supervisor' ? INITIAL_SUPERVISOR_USER : INITIAL_GUARD_USER,
        });
      },

      setLanguage: (language) => {
        set({ language });
        document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', language);
      },

      setUseEasternNumerals: (useEasternNumerals) => set({ useEasternNumerals }),

      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setSelectedSiteId: (selectedSiteId) => set({ selectedSiteId }),

      setAppKilledSimulated: (isAppKilledSimulated) => set({ isAppKilledSimulated }),

      walkInsideSite: () => {
        const site = get().sites.find((s) => s.id === get().selectedSiteId) || get().sites[0];
        // Move to 42m inside perimeter
        const newLocation = {
          lat: site.lat + 0.00028,
          lng: site.lng + 0.00025,
          accuracyMeters: 3,
        };
        set({
          guardLocation: newLocation,
          isMockLocationDetected: false,
        });

        get().pushNotification({
          title: 'Geofence Verified',
          body: `Inside perimeter of ${site.name} (42 m from center). Auto-attendance active.`,
          type: 'success',
        });
      },

      walkOutsideSite: () => {
        const site = get().sites.find((s) => s.id === get().selectedSiteId) || get().sites[0];
        // Move 1.3km away
        const newLocation = {
          lat: site.lat + 0.012,
          lng: site.lng + 0.009,
          accuracyMeters: 8,
        };
        set({
          guardLocation: newLocation,
          isMockLocationDetected: false,
        });

        get().pushNotification({
          title: 'Left Site Perimeter',
          body: `Departed ${site.name}. 1.3 km away. Auto check-out grace period running.`,
          type: 'warning',
        });
      },

      teleportMockLocation: () => {
        // Mock GPS location spoofing simulation
        set({
          guardLocation: {
            lat: 30.0100,
            lng: 31.2100,
            accuracyMeters: 1, // unrealistically low accuracy indicates spoofing
          },
          isMockLocationDetected: true,
        });

        get().pushNotification({
          title: 'SECURITY BREACH DETECTED',
          body: 'Mock location / GPS spoofing intercepted! Event flagged in operations log.',
          type: 'urgent',
        });
      },

      setCustomLocation: (lat, lng) => {
        set({
          guardLocation: {
            lat,
            lng,
            accuracyMeters: 5,
          },
        });
      },

      checkIn: async (source = 'manual') => {
        const state = get();
        const site = state.sites.find((s) => s.id === state.selectedSiteId) || state.sites[0];
        const now = new Date().toISOString();

        // Compute Web Crypto SHA-256 hash
        const signatureHash = await computeEventHash(
          {
            type: 'check_in',
            guardId: state.currentUser.id,
            siteId: site.id,
            timestamp: now,
            lat: state.guardLocation.lat,
            lng: state.guardLocation.lng,
          },
          state.currentUser.registeredDevice.fingerprint
        );

        const newEvent: AttendanceEvent = {
          id: `att_${Date.now()}`,
          type: 'check_in',
          timestamp: now,
          deviceTimestamp: now,
          serverTimestamp: state.isOffline ? undefined : now,
          siteId: site.id,
          siteName: site.name,
          siteNameAr: site.nameAr,
          lat: state.guardLocation.lat,
          lng: state.guardLocation.lng,
          accuracyMeters: state.guardLocation.accuracyMeters,
          source,
          signatureHash,
          synced: !state.isOffline,
          fraudFlag: state.isMockLocationDetected ? 'Mock Location Spoof' : undefined,
        };

        if (state.isOffline) {
          set((s) => ({
            isOnPost: true,
            shiftSeconds: 0,
            attendanceEvents: [newEvent, ...s.attendanceEvents],
            syncQueue: [newEvent, ...s.syncQueue],
          }));
          get().pushNotification({
            title: 'Checked In (Offline)',
            body: `Record signed with device key & queued locally at ${site.name}`,
            type: 'warning',
            linkPath: '/sync-queue',
          });
        } else {
          set((s) => ({
            isOnPost: true,
            shiftSeconds: 0,
            attendanceEvents: [newEvent, ...s.attendanceEvents],
          }));
          get().pushNotification({
            title: 'Checked In Successfully',
            body: `On post at ${site.name}. Cryptographic signature verified.`,
            type: 'success',
          });
        }
      },

      checkOut: async () => {
        const state = get();
        const site = state.sites.find((s) => s.id === state.selectedSiteId) || state.sites[0];
        const now = new Date().toISOString();

        const signatureHash = await computeEventHash(
          {
            type: 'check_out',
            guardId: state.currentUser.id,
            siteId: site.id,
            timestamp: now,
          },
          state.currentUser.registeredDevice.fingerprint
        );

        const newEvent: AttendanceEvent = {
          id: `att_${Date.now()}`,
          type: 'check_out',
          timestamp: now,
          deviceTimestamp: now,
          serverTimestamp: state.isOffline ? undefined : now,
          siteId: site.id,
          siteName: site.name,
          siteNameAr: site.nameAr,
          lat: state.guardLocation.lat,
          lng: state.guardLocation.lng,
          accuracyMeters: state.guardLocation.accuracyMeters,
          source: 'manual',
          signatureHash,
          synced: !state.isOffline,
        };

        if (state.isOffline) {
          set((s) => ({
            isOnPost: false,
            attendanceEvents: [newEvent, ...s.attendanceEvents],
            syncQueue: [newEvent, ...s.syncQueue],
          }));
          get().pushNotification({
            title: 'Checked Out (Offline)',
            body: `Signed check-out stored locally for sync.`,
            type: 'info',
            linkPath: '/sync-queue',
          });
        } else {
          set((s) => ({
            isOnPost: false,
            attendanceEvents: [newEvent, ...s.attendanceEvents],
          }));
          get().pushNotification({
            title: 'Checked Out',
            body: `Shift completed at ${site.name}. Total time logged.`,
            type: 'info',
          });
        }
      },

      incrementShiftTimer: () => {
        if (get().isOnPost) {
          set((s) => ({ shiftSeconds: s.shiftSeconds + 1 }));
        }
      },

      toggleOffline: () => {
        const nextOffline = !get().isOffline;
        set({ isOffline: nextOffline });

        if (!nextOffline && get().syncQueue.length > 0) {
          // Reconnected: trigger auto-sync
          get().syncAllPending();
        } else if (nextOffline) {
          get().pushNotification({
            title: 'Offline Mode Active',
            body: 'Local storage activated. All check-ins and reports are signed on device.',
            type: 'warning',
          });
        }
      },

      syncAllPending: async () => {
        set({ isSyncing: true });
        const queue = [...get().syncQueue];

        // Simulate network synchronization step-by-step
        for (let i = 0; i < queue.length; i++) {
          await new Promise((r) => setTimeout(r, 450));
          const syncedItem = queue[i];
          set((s) => ({
            syncQueue: s.syncQueue.filter((item) => item.id !== syncedItem.id),
            attendanceEvents: s.attendanceEvents.map((evt) =>
              evt.id === syncedItem.id
                ? { ...evt, synced: true, serverTimestamp: new Date().toISOString() }
                : evt
            ),
          }));
        }

        set({ isSyncing: false });
        get().pushNotification({
          title: 'Offline Sync Complete',
          body: `${queue.length} pending records verified & uploaded to operations center.`,
          type: 'success',
        });
      },

      triggerRandomSelfieCheck: () => {
        set({
          isSelfieRequired: true,
          selfieSecondsLeft: 300,
        });
        get().pushNotification({
          title: 'Biometric Face Check Required',
          body: 'Random security verification required within 5 minutes. Tap to verify.',
          type: 'warning',
          linkPath: '/checkin',
        });
      },

      completeSelfieVerification: async () => {
        const state = get();
        const site = state.sites.find((s) => s.id === state.selectedSiteId) || state.sites[0];
        const now = new Date().toISOString();

        const signatureHash = await computeEventHash(
          {
            type: 'random_selfie',
            guardId: state.currentUser.id,
            timestamp: now,
            biometricScore: 0.97,
          },
          state.currentUser.registeredDevice.fingerprint
        );

        const newEvent: AttendanceEvent = {
          id: `att_selfie_${Date.now()}`,
          type: 'random_selfie',
          timestamp: now,
          deviceTimestamp: now,
          serverTimestamp: state.isOffline ? undefined : now,
          siteId: site.id,
          siteName: site.name,
          siteNameAr: site.nameAr,
          lat: state.guardLocation.lat,
          lng: state.guardLocation.lng,
          accuracyMeters: state.guardLocation.accuracyMeters,
          source: 'selfie',
          signatureHash,
          synced: !state.isOffline,
        };

        set((s) => ({
          isSelfieRequired: false,
          attendanceEvents: [newEvent, ...s.attendanceEvents],
        }));

        get().pushNotification({
          title: 'Biometric Check Passed',
          body: 'Face match verified (97% confidence). On-post status confirmed.',
          type: 'success',
        });
      },

      triggerSOS: (reason = 'Emergency assistance requested on post') => {
        const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        set((s) => ({
          urgentAlert: {
            ...s.urgentAlert,
            active: true,
            timestamp: now,
            reason,
            levels: s.urgentAlert.levels.map((lvl) => ({
              ...lvl,
              status: lvl.level === 1 ? 'pending' : 'pending',
            })),
          },
        }));

        get().pushNotification({
          title: 'URGENT SOS TRANSMITTED',
          body: 'Escalation chain activated! Level 1 (Site Supervisor) alerted.',
          type: 'urgent',
          linkPath: '/messages',
        });
      },

      acknowledgeUrgentLevel: (level) => {
        set((s) => ({
          urgentAlert: {
            ...s.urgentAlert,
            levels: s.urgentAlert.levels.map((lvl) =>
              lvl.level === level
                ? {
                    ...lvl,
                    status: 'acknowledged',
                    acknowledgedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  }
                : lvl
            ),
          },
        }));

        get().pushNotification({
          title: 'SOS Alert Acknowledged',
          body: `Level ${level} has taken ownership of the situation.`,
          type: 'success',
        });
      },

      resetSOS: () => {
        set((s) => ({
          urgentAlert: { ...s.urgentAlert, active: false },
        }));
      },

      acknowledgeBroadcast: (id) => {
        set((s) => ({
          broadcasts: s.broadcasts.map((b) =>
            b.id === id ? { ...b, acknowledged: true, ackCount: b.ackCount + 1 } : b
          ),
        }));
      },

      addIncident: async (report) => {
        const state = get();
        const now = new Date().toISOString();
        const newIncident: IncidentReport = {
          ...report,
          id: `inc_${Date.now()}`,
          timestamp: now,
          synced: !state.isOffline,
        };

        set((s) => ({
          incidents: [newIncident, ...s.incidents],
        }));

        get().pushNotification({
          title: state.isOffline ? 'Incident Logged (Offline)' : 'Incident Report Filed',
          body: `${report.title} logged for ${report.siteName}`,
          type: 'info',
          linkPath: '/incidents',
        });
      },

      dispatchGuardToSite: (guardId, siteId) => {
        set((s) => ({
          sites: s.sites.map((site) =>
            site.id === siteId
              ? {
                  ...site,
                  onDutyGuards: site.onDutyGuards + 1,
                  status: site.onDutyGuards + 1 >= site.requiredGuards ? 'optimal' : 'warning',
                }
              : site
          ),
        }));

        get().pushNotification({
          title: 'Standby Guard Dispatched',
          body: `Deployment order sent to radio unit. Status: En Route (ETA 12m).`,
          type: 'success',
        });
      },

      approveRequest: (requestId) => {
        set((s) => ({
          requests: s.requests.map((r) =>
            r.id === requestId
              ? { ...r, status: 'finance_approved', currentApprover: 'Approved by Supervisor' }
              : r
          ),
        }));

        get().pushNotification({
          title: 'Request Approved',
          body: 'Personnel request verified and signed off.',
          type: 'success',
        });
      },

      pushNotification: (banner) => {
        const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const newBanner: PushNotificationBanner = {
          ...banner,
          id,
          timestamp: 'Just now',
        };

        set((s) => ({
          notifications: [newBanner, ...s.notifications.slice(0, 2)], // keep max 3
        }));

        // Auto remove after 5 seconds
        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
      },

      removeNotification: (id) => {
        set((s) => ({
          notifications: s.notifications.filter((n) => n.id !== id),
        }));
      },

      resetDemoData: () => {
        set({
          brand: 'aman',
          role: 'guard',
          language: 'en',
          currentUser: INITIAL_GUARD_USER,
          sites: INITIAL_SITES,
          selectedSiteId: 'site_citystars',
          guardLocation: {
            lat: 30.0736,
            lng: 31.3470,
            accuracyMeters: 4,
          },
          isMockLocationDetected: false,
          isOnPost: true,
          shiftSeconds: 20537,
          isOffline: false,
          syncQueue: [],
          incidents: INITIAL_INCIDENTS,
          broadcasts: INITIAL_BROADCASTS,
          urgentAlert: INITIAL_URGENT_ALERT,
          requests: INITIAL_REQUESTS,
          notifications: [],
        });
        document.documentElement.setAttribute('data-brand', 'aman');
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
      },
    }),
    {
      name: 'wardiya-app-storage-v1',
    }
  )
);
