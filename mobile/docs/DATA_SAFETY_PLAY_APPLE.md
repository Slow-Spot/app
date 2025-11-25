# Data Safety / App Privacy Details (US/EU) — Slow Spot

Summary (use in Play Console “Data Safety” and App Store Connect “App Privacy Details”):

- Data collection: None. We do not collect or transmit any user data.
- Data sharing: None. No data is shared with third parties.
- Data processing: All app data stays on-device only (AsyncStorage). No cloud or backend.
- Tracking: None. No tracking, analytics, or ads SDKs. No device IDs or ad IDs used.
- Accounts/identifiers: No account required; no identifiers collected.
- Optional permissions: Calendar/Reminders only to schedule local reminders; event data remains on-device.

### Google Play Console – Data Safety form
- Collect or share data? **No**
- Is all data processed on device only? **Yes** (local AsyncStorage)
- Types collected/shared: **None**
- Security practices: Local-only; no network transfer. (If required, choose “Data not collected”.)

### App Store Connect – App Privacy (Data Types)
Select “Data Not Collected”. For each category, select “No data collected”: 
- Contact Info, Health & Fitness, Financial, Location, Sensitive Info, Contacts, User Content, Browsing, Usage Data, Diagnostics, Other Data: **None collected**
- Tracking: **No tracking**; we do not use data to track users across apps/sites.

### Permissions (for both stores)
- Calendar / Reminders: Optional; purpose: scheduling local meditation reminders; data stays on-device.
- Background audio: For meditation audio playback only.

### Notes for reviewers
- Offline-first; no backend endpoints called in production (mock data only).
- Export/Clear options in Settings give users control over local data.
