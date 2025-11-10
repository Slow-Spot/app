# Architecture Diagrams

**Visual representation of system architecture using Mermaid diagrams**

---

## 1. System Context Diagram (C4 Level 1)

```mermaid
graph TB
    subgraph "External Users"
        MU[Mobile User<br/>iOS/Android]
        WU[Web Visitor<br/>Browser]
    end

    subgraph "Meditation Application System"
        MA[Mobile Application<br/>Expo/React Native]
        LP[Landing Page<br/>Next.js]
    end

    subgraph "Supporting Systems"
        CDN[Content Delivery<br/>Cloudflare CDN]
        API[Backend API<br/>.NET Core]
        STORE[(Data Storage<br/>PostgreSQL + Redis)]
    end

    subgraph "External Services"
        AS[App Store<br/>Distribution]
        GP[Google Play<br/>Distribution]
        AN[Analytics<br/>PostHog]
        ER[Error Tracking<br/>Sentry]
    end

    MU -->|Uses| MA
    WU -->|Visits| LP
    MA -->|Streams Audio| CDN
    MA -->|API Calls| API
    LP -->|Promotes| MA
    API -->|Reads/Writes| STORE
    MA -->|Download from| AS
    MA -->|Download from| GP
    MA -->|Sends Events| AN
    MA -->|Reports Errors| ER
    API -->|Reports Errors| ER

    style MA fill:#4CAF50
    style API fill:#2196F3
    style CDN fill:#FF9800
```

---

## 2. Container Diagram (C4 Level 2)

```mermaid
graph TB
    subgraph "User Devices"
        iOS[iOS Device]
        Android[Android Device]
        Browser[Web Browser]
    end

    subgraph "Mobile App Container"
        UI[UI Layer<br/>React Native]
        Audio[Audio Engine<br/>Expo AV]
        LocalDB[Local Storage<br/>SQLite]
        Sync[Sync Service]
    end

    subgraph "Web Container"
        NextJS[Next.js App<br/>SSG + Edge]
    end

    subgraph "Edge Layer"
        CFWorkers[Cloudflare Workers<br/>Quote Cache]
        R2[R2 Storage<br/>Audio Files]
    end

    subgraph "Backend Container"
        DOTNET[.NET Web API<br/>Minimal APIs]
        QuoteSvc[Quote Service]
        SessionSvc[Session Service]
    end

    subgraph "Data Layer"
        PG[(PostgreSQL<br/>Primary DB)]
        RD[(Redis<br/>Cache)]
    end

    iOS --> UI
    Android --> UI
    Browser --> NextJS
    UI --> Audio
    UI --> LocalDB
    UI --> Sync
    Audio --> R2
    Sync --> CFWorkers
    CFWorkers --> DOTNET
    DOTNET --> QuoteSvc
    DOTNET --> SessionSvc
    QuoteSvc --> PG
    SessionSvc --> PG
    QuoteSvc --> RD
    SessionSvc --> RD

    style UI fill:#4CAF50
    style DOTNET fill:#2196F3
    style PG fill:#336791
    style RD fill:#DC382D
```

---

## 3. Data Flow Diagram - Meditation Session

```mermaid
sequenceDiagram
    actor User
    participant App as Mobile App
    participant Cache as Local Cache
    participant CDN as Cloudflare CDN
    participant API as Backend API
    participant DB as Database

    User->>App: Tap "Start Meditation"
    App->>Cache: Check session cached?

    alt Session Cached
        Cache-->>App: Return session metadata
        App->>Cache: Load audio files
        Cache-->>App: Audio data
        App->>User: Start playback (300ms)
    else Not Cached
        App->>API: GET /sessions/{id}
        API->>DB: Query session
        DB-->>API: Session data
        API-->>App: Session metadata
        App->>CDN: Stream audio
        CDN-->>App: Audio chunks
        App->>User: Start playback (1s)
        App->>Cache: Save for offline
    end

    App->>User: Play voice layer
    App->>User: Play ambient layer

    User->>App: Session ends

    App->>Cache: Mark session complete
    App->>API: POST /analytics (background)
    API->>DB: Log anonymous analytics

    App->>API: GET /quotes/random
    API->>DB: Fetch random quote
    DB-->>API: Quote data
    API-->>App: Quote
    App->>User: Display quote
```

---

## 4. Deployment Architecture

```mermaid
graph TB
    subgraph "Developer Workflow"
        Dev[Developer]
        Git[GitHub Repository]
    end

    subgraph "CI/CD Pipeline"
        GHA[GitHub Actions]
        Test[Automated Tests]
        Build[Build Process]
    end

    subgraph "Staging Environment"
        StageAPI[Railway Staging]
        StageDB[(Staging DB)]
        TestFlight[TestFlight Beta]
    end

    subgraph "Production Environment"
        ProdAPI[Railway Production]
        ProdDB[(Production DB)]
        VercelProd[Vercel Production]
        AppStore[App Store]
        PlayStore[Google Play]
    end

    subgraph "Edge Network"
        CF[Cloudflare CDN<br/>310+ locations]
    end

    subgraph "Monitoring"
        Sentry[Sentry<br/>Error Tracking]
        PostHog[PostHog<br/>Analytics]
        Uptime[BetterUptime<br/>Monitoring]
    end

    Dev -->|git push| Git
    Git -->|webhook| GHA
    GHA --> Test
    Test --> Build
    Build -->|develop branch| StageAPI
    Build -->|main branch| ProdAPI
    Build -->|tag v*| AppStore
    Build -->|tag v*| PlayStore

    ProdAPI --> ProdDB
    ProdAPI --> CF
    VercelProd --> CF

    ProdAPI --> Sentry
    ProdAPI --> Uptime
    AppStore --> PostHog
    PlayStore --> PostHog

    style ProdAPI fill:#4CAF50
    style ProdDB fill:#336791
    style CF fill:#FF9800
```

---

## 5. Audio Architecture - 3 Layer System

```mermaid
graph LR
    subgraph "Audio Sources"
        Voice[Voice Guidance<br/>zen_001_en.mp3<br/>128kbps mono]
        Ambient[Ambient Sound<br/>forest_rain.mp3<br/>96kbps stereo]
        Chime[Chime<br/>tibetan_bell.mp3<br/>192kbps stereo]
    end

    subgraph "CDN Storage"
        R2Voice[R2: /voice/en/]
        R2Ambient[R2: /ambient/]
        R2Chime[R2: /chimes/]
    end

    subgraph "Mobile Audio Engine"
        Mixer[Audio Mixer<br/>Expo AV]
        Track1[Track 1: Voice 100%]
        Track2[Track 2: Ambient 30%]
        Track3[Track 3: Chime]
    end

    subgraph "Output"
        Speaker[Device Speaker<br/>or Headphones]
    end

    Voice --> R2Voice
    Ambient --> R2Ambient
    Chime --> R2Chime

    R2Voice --> Track1
    R2Ambient --> Track2
    R2Chime --> Track3

    Track1 --> Mixer
    Track2 --> Mixer
    Track3 --> Mixer

    Mixer --> Speaker

    style Mixer fill:#4CAF50
    style R2Voice fill:#FF9800
    style R2Ambient fill:#FF9800
    style R2Chime fill:#FF9800
```

---

## 6. Offline-First Sync Strategy

```mermaid
graph TB
    subgraph "Mobile App"
        AppStart[App Starts]
        CheckSync{Last Sync<br/>> 24h?}
        LocalData[Load Local Data]
        SyncService[Sync Service]
    end

    subgraph "Sync Process"
        FetchManifest[Fetch Manifest<br/>from API]
        CompareData{Data Changed?}
        DownloadNew[Download New<br/>Quotes/Sessions]
        UpdateCache[Update Local Cache]
        DeleteOld[Delete Removed<br/>Content]
    end

    subgraph "API"
        SyncEndpoint[GET /sync/manifest<br/>?lastSync=timestamp]
        API[Backend API]
    end

    subgraph "Local Storage"
        SQLite[(SQLite DB)]
        Files[Audio Files]
    end

    AppStart --> CheckSync
    CheckSync -->|No| LocalData
    CheckSync -->|Yes| SyncService

    SyncService --> FetchManifest
    FetchManifest --> SyncEndpoint
    SyncEndpoint --> API
    API --> CompareData

    CompareData -->|Yes| DownloadNew
    CompareData -->|No| LocalData

    DownloadNew --> UpdateCache
    UpdateCache --> DeleteOld
    DeleteOld --> LocalData

    LocalData --> SQLite
    LocalData --> Files

    UpdateCache --> SQLite
    DownloadNew --> Files

    style SyncService fill:#4CAF50
    style SQLite fill:#003B57
```

---

## 7. Database Schema (Entity Relationship)

```mermaid
erDiagram
    QUOTES ||--o{ QUOTE_TRANSLATIONS : has
    MEDITATION_SESSIONS ||--o{ SESSION_TRANSLATIONS : has
    QUOTES ||--o{ QUOTE_USAGE_LOG : logged
    MEDITATION_SESSIONS ||--o{ ANONYMOUS_SESSIONS : tracked

    QUOTES {
        uuid id PK
        string culture
        string author
        timestamp created_at
        timestamp updated_at
    }

    QUOTE_TRANSLATIONS {
        uuid id PK
        uuid quote_id FK
        string language
        text text
    }

    MEDITATION_SESSIONS {
        string id PK
        string culture
        int duration_seconds
        int difficulty_level
        string ambient_sound_url
        timestamp created_at
    }

    SESSION_TRANSLATIONS {
        uuid id PK
        string session_id FK
        string language
        string title
        text description
        string voice_audio_url
    }

    ANONYMOUS_SESSIONS {
        uuid id PK
        string device_id_hash
        string session_id FK
        string language
        int duration_completed
        boolean completed
        timestamp timestamp
    }

    QUOTE_USAGE_LOG {
        uuid id PK
        string device_id_hash
        uuid quote_id FK
        timestamp shown_at
    }
```

---

## 8. Security Architecture

```mermaid
graph TB
    subgraph "Client Side"
        User[User]
        App[Mobile App]
        DeviceID[Device ID]
    end

    subgraph "Edge Security"
        CF[Cloudflare]
        WAF[Web Application<br/>Firewall]
        DDoS[DDoS Protection]
    end

    subgraph "API Security"
        RateLimit[Rate Limiter<br/>100 req/min]
        Validation[Input Validation<br/>FluentValidation]
        Sanitization[Output Sanitization]
    end

    subgraph "Data Security"
        Hash[SHA256 Hashing]
        Encryption[TLS 1.3]
        DBEncrypt[DB Encryption<br/>AES-256]
    end

    subgraph "Monitoring"
        Sentry[Sentry<br/>Security Events]
        Logs[Structured Logs<br/>No PII]
    end

    User --> App
    App --> DeviceID
    DeviceID --> Hash
    Hash --> Encryption

    Encryption --> CF
    CF --> WAF
    CF --> DDoS

    WAF --> RateLimit
    RateLimit --> Validation
    Validation --> Sanitization

    Sanitization --> DBEncrypt

    RateLimit -.->|Violations| Sentry
    Validation -.->|Failures| Logs

    style Hash fill:#FF5722
    style Encryption fill:#FF5722
    style DBEncrypt fill:#FF5722
    style WAF fill:#F44336
```

---

## 9. Cost Breakdown by Component (10k users)

```mermaid
pie title Monthly Cost Distribution ($103 total)
    "Railway (Backend + DB)" : 45
    "Vercel (Web)" : 20
    "Sentry (Monitoring)" : 26
    "Cloudflare R2 (CDN)" : 7
    "Cloudflare Workers" : 5
```

---

## 10. User Journey - First Meditation Session

```mermaid
journey
    title First-Time User Experience
    section Discovery
      Visit Landing Page: 5: User
      Read About App: 4: User
      Click Download: 5: User
    section Installation
      Download from Store: 3: User
      Install App: 3: User
      Open App: 5: User
    section Onboarding
      Select Language: 5: User
      Skip Tutorial (optional): 4: User
      View Session List: 5: User
    section First Session
      Choose Zen Session: 5: User
      Tap Start: 5: User
      Listen to Guidance: 5: User
      Complete Session: 5: User
      Read Quote: 5: User
    section Retention
      View Progress: 4: User
      Save Favorite: 4: User
      Share with Friend: 3: User
```

---

## 11. Scaling Strategy

```mermaid
graph LR
    subgraph "Stage 1: MVP (1k users)"
        R1[1 Railway Instance<br/>512 MB RAM]
        DB1[(PostgreSQL 1 GB)]
        CDN1[Cloudflare Free]
    end

    subgraph "Stage 2: Growth (10k users)"
        R2[2-3 Railway Instances<br/>1 GB RAM each]
        DB2[(PostgreSQL 5 GB)]
        Redis2[(Redis 256 MB)]
        CDN2[Cloudflare Paid]
    end

    subgraph "Stage 3: Scale (100k users)"
        R3[5-10 Railway Instances<br/>2 GB RAM each]
        DB3[(PostgreSQL 50 GB<br/>+ Read Replicas)]
        Redis3[(Redis 1 GB Cluster)]
        CDN3[Cloudflare Pro<br/>Multi-Region)]
    end

    subgraph "Stage 4: Enterprise (1M users)"
        K8s[Kubernetes Cluster<br/>Auto-scaling]
        DBCluster[(PostgreSQL Cluster<br/>500 GB)]
        RedisCluster[(Redis Sentinel)]
        MultiCDN[Multi-CDN Strategy]
    end

    R1 -->|Scale Up| R2
    R2 -->|Scale Up| R3
    R3 -->|Migrate| K8s

    DB1 -->|Scale| DB2
    DB2 -->|Scale| DB3
    DB3 -->|Scale| DBCluster

    CDN1 -->|Upgrade| CDN2
    CDN2 -->|Upgrade| CDN3
    CDN3 -->|Upgrade| MultiCDN

    style R1 fill:#4CAF50
    style R2 fill:#8BC34A
    style R3 fill:#CDDC39
    style K8s fill:#FFC107
```

---

## 12. Incident Response Flow

```mermaid
flowchart TD
    Start[Incident Detected] --> Classify{Severity?}

    Classify -->|P0 Critical| Page[Page On-Call<br/>< 15 min]
    Classify -->|P1 High| Alert[Alert Team<br/>< 1 hour]
    Classify -->|P2 Medium| Ticket[Create Ticket<br/>< 4 hours]

    Page --> Acknowledge[Acknowledge Incident]
    Alert --> Acknowledge

    Acknowledge --> Assess[Assess Impact]
    Assess --> Contain[Contain Threat]
    Contain --> Mitigate[Mitigate Issue]

    Mitigate --> Verify{Resolved?}

    Verify -->|No| Escalate[Escalate]
    Escalate --> Contain

    Verify -->|Yes| Monitor[Monitor for 2h]

    Monitor --> PostMortem[Post-Mortem<br/>within 48h]

    PostMortem --> Document[Document Lessons]
    Document --> Update[Update Runbooks]
    Update --> End[Close Incident]

    Ticket --> Investigate[Investigate]
    Investigate --> Fix[Fix & Deploy]
    Fix --> End

    style Page fill:#F44336
    style Alert fill:#FF9800
    style Ticket fill:#FFC107
```

---

## 13. Mobile App State Machine

```mermaid
stateDiagram-v2
    [*] --> AppLaunching
    AppLaunching --> LanguageSelection : First Launch
    AppLaunching --> HomeScreen : Returning User

    LanguageSelection --> HomeScreen

    HomeScreen --> SessionList
    HomeScreen --> Progress
    HomeScreen --> Settings

    SessionList --> SessionDetail
    SessionDetail --> MeditationActive : Start

    MeditationActive --> MeditationPaused : Pause
    MeditationPaused --> MeditationActive : Resume
    MeditationActive --> SessionComplete : Finish

    SessionComplete --> QuoteDisplay
    QuoteDisplay --> HomeScreen : Continue

    Progress --> HomeScreen
    Settings --> HomeScreen

    HomeScreen --> [*] : Close App
```

---

## Notes on Diagrams

All diagrams are rendered using Mermaid.js and can be:
- Viewed in GitHub/GitLab (native support)
- Exported to PNG/SVG using mermaid-cli
- Embedded in documentation
- Used in presentations

To export diagrams:
```bash
# Install mermaid-cli
npm install -g @mermaid-js/mermaid-cli

# Export diagram
mmdc -i diagrams.md -o architecture-diagrams.pdf
```

---

**Last Updated:** 2025-11-08
**Maintained By:** Architecture Team
