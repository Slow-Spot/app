## [1.16.11](https://github.com/Slow-Spot/app/compare/v1.16.10...v1.16.11) (2026-02-02)

### Bug Fixes

* **mobile:** end-of-session gong not playing ([52e68d1](https://github.com/Slow-Spot/app/commit/52e68d1c4e950d72ec8fd84e3aeeaac04d41cc2d))

## [1.16.10](https://github.com/Slow-Spot/app/compare/v1.16.9...v1.16.10) (2026-01-30)

### Bug Fixes

* **mobile:** add Java 17 and Gradle memory settings to local-release script ([caef513](https://github.com/Slow-Spot/app/commit/caef51301abd73007cfdf0ffb0ea8078772ddd1c))

## [1.16.9](https://github.com/Slow-Spot/app/compare/v1.16.8...v1.16.9) (2026-01-29)

### Bug Fixes

* **mobile:** rename notification sound files to valid Android resource names ([a8c569f](https://github.com/Slow-Spot/app/commit/a8c569fd45d330ba0e926348bdcbff3f3ded75f1))

## [1.16.8](https://github.com/Slow-Spot/app/compare/v1.16.7...v1.16.8) (2026-01-29)

### Bug Fixes

* **release:** atomic EAS production pipeline with gate and submit-by-id ([eabf4b5](https://github.com/Slow-Spot/app/commit/eabf4b5f1a6f8b6b8be0de37dfe820538f682ccc))

## [1.16.7](https://github.com/Slow-Spot/app/compare/v1.16.6...v1.16.7) (2026-01-29)

### Bug Fixes

* **mobile:** add ascAppId to eas.json submit profile ([9550b36](https://github.com/Slow-Spot/app/commit/9550b361a19438cee3503ef73bdb2fb07358e58a))

## [1.16.6](https://github.com/Slow-Spot/app/compare/v1.16.5...v1.16.6) (2026-01-29)

### Bug Fixes

* **release:** add workflow_run trigger and fix ASC submit credentials ([8bae588](https://github.com/Slow-Spot/app/commit/8bae58893244063b460982c3427fcdaba9fc647a))

## [1.16.5](https://github.com/Slow-Spot/app/compare/v1.16.4...v1.16.5) (2026-01-28)

### Bug Fixes

* **web:** correct Google Play package ID from app.slowspot to com.slowspot.app ([97c5640](https://github.com/Slow-Spot/app/commit/97c56406b42218178c85485b9655e7279274b23b))

## [1.16.4](https://github.com/Slow-Spot/app/compare/v1.16.3...v1.16.4) (2026-01-28)

### Bug Fixes

* **web:** correct App Store link with proper Apple ID 6757082765 ([fd3e92c](https://github.com/Slow-Spot/app/commit/fd3e92c1cbbeb7cc11516e82e3f83802bc6ceb0c))

## [1.16.3](https://github.com/Slow-Spot/app/compare/v1.16.2...v1.16.3) (2026-01-28)

### Bug Fixes

* **mobile:** use imageSize instead of deprecated imageWidth/imageHeight in LiveActivityConfig ([c757846](https://github.com/Slow-Spot/app/commit/c757846c6988f44fa8006b59ae0ecb8fae0369dd))

## [1.16.2](https://github.com/Slow-Spot/app/compare/v1.16.1...v1.16.2) (2026-01-28)

### Bug Fixes

* Restrict CORS policy to specific allowed origins instead of allowing any origin ([565e763](https://github.com/Slow-Spot/app/commit/565e7634220b90419fb12a005a19429a35f323b9))
* Update Next.js from 15.5.6 to 15.5.10 to fix security vulnerabilities ([6c42755](https://github.com/Slow-Spot/app/commit/6c427555123452fe50610368bba21f51cac59a55))

## [1.16.1](https://github.com/Slow-Spot/app/compare/v1.16.0...v1.16.1) (2026-01-28)

### Bug Fixes

* **mobile:** prevent session termination on Live Activity tap during active meditation ([738e8d7](https://github.com/Slow-Spot/app/commit/738e8d7777887e2965b5fe411f9c5199689249d6))

## [1.16.0](https://github.com/Slow-Spot/app/compare/v1.15.0...v1.16.0) (2026-01-27)

### Features

* **mobile:** add background timer, widgets, Apple Watch app and UX improvements ([bd652c6](https://github.com/Slow-Spot/app/commit/bd652c684e578b8201dba64ce598cadd415064f1))
* **mobile:** add Live Activity i18n with pluralization ([747350b](https://github.com/Slow-Spot/app/commit/747350b9ffe66d7de7305c44e503805365bdf00a))
* **mobile:** add metadata validation script for Google Play ([af64309](https://github.com/Slow-Spot/app/commit/af643092dd0e7a8bb39574025ac3cacca52c187f))
* **mobile:** add notification system and code cleanup ([79b9b36](https://github.com/Slow-Spot/app/commit/79b9b36050056c17cbb85887d3b7d9ab482e8349))
* **mobile:** add Zen Mode and improve meditation haptics ([c13c868](https://github.com/Slow-Spot/app/commit/c13c868ccecb66a483d84318b6b87051bf4b41c6))
* **release:** enhance cleanup workflow for multi-branch strategy ([7d651c6](https://github.com/Slow-Spot/app/commit/7d651c6922c95c325ba64508d0a6f082b42242e6))

### Bug Fixes

* **mobile:** add countsDown: true to Live Activity progress bars ([3611a3a](https://github.com/Slow-Spot/app/commit/3611a3abc01543a14cc37559867bf11aea2ec076))
* **mobile:** add custom notification sound and sync build versions ([2f7d2f3](https://github.com/Slow-Spot/app/commit/2f7d2f3db2f547e61b8356a46648ed3468892bd7))
* **mobile:** add i18n translations for Live Activity ([ac06a72](https://github.com/Slow-Spot/app/commit/ac06a72bd648c6dd01fb918adb274c68c43882d8))
* **mobile:** add notification sound and configure local versioning ([202fce3](https://github.com/Slow-Spot/app/commit/202fce3a775e79f6271d331001fa06b2568a40fe))
* **mobile:** add prebuildCommand to EAS config for Live Activity entitlements ([ba51ea7](https://github.com/Slow-Spot/app/commit/ba51ea7c14b6a01cbbbe01a3b1f16bc5bac1e962))
* **mobile:** clean up iOS deployment target and remove duplicate proguard rule ([8b3480f](https://github.com/Slow-Spot/app/commit/8b3480f658af9303094ba0313fc981b61aa9cef7))
* **mobile:** complete truncated short descriptions for Google Play ([fca8841](https://github.com/Slow-Spot/app/commit/fca88413b5c4a5a04dcec9ac3e089545a61e8525))
* **mobile:** configure App Groups for Live Activity on lock screen ([8dccecc](https://github.com/Slow-Spot/app/commit/8dccecc37565cd8d8b436cc7f2103039d9c73016))
* **mobile:** fix Live Activity sync and logo alignment ([940e379](https://github.com/Slow-Spot/app/commit/940e379f1f2d8b52c6d127ffef83b77c1be61cc1))
* **mobile:** register withAppGroups plugin and add EAS pre-build hook ([0f02bff](https://github.com/Slow-Spot/app/commit/0f02bff08aaa5645f6b84b5bd47e48b6eaf320be))
* **mobile:** remove unused variable warning in TimerManager ([9e04e85](https://github.com/Slow-Spot/app/commit/9e04e856e950c177f9be4a9d5a9e9416aceb0357))
* **mobile:** resolve CFBundleVersion mismatch for Watch app ([2929171](https://github.com/Slow-Spot/app/commit/292917150dd502c6d708cb0f369e7adc3ae1fba7))
* **mobile:** resolve Live Activity configuration conflict ([b8dea6e](https://github.com/Slow-Spot/app/commit/b8dea6efd74816aff935e41ca1c1c021a352a44a))
* **mobile:** shorten shortDescription to comply with Google Play 80-char limit ([c0a2839](https://github.com/Slow-Spot/app/commit/c0a2839d43e02ffa7238c3d04824260e66929cf0))
* **mobile:** sync all target versions to EAS build number ([89a9fb9](https://github.com/Slow-Spot/app/commit/89a9fb9ce8dc692f2a47fe36b6bab13d969e7425))
* **mobile:** sync Live Activity with app state and add completion notification ([2b0f91c](https://github.com/Slow-Spot/app/commit/2b0f91c2942464fb7910f1d121dbec6c0f62a372))
* **mobile:** use custom App Group identifier for Live Activity ([9553988](https://github.com/Slow-Spot/app/commit/9553988062ee76049ebe1e30c3102cc8c7018b7e))
* **release:** update cleanup workflow for new branching strategy ([f63502d](https://github.com/Slow-Spot/app/commit/f63502d9b6eaae8fe3221732f016f706eba310c7))

## [1.14.0-beta.20](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.19...v1.14.0-beta.20) (2026-01-27)

### Bug Fixes

* **mobile:** add countsDown: true to Live Activity progress bars ([3611a3a](https://github.com/Slow-Spot/app/commit/3611a3abc01543a14cc37559867bf11aea2ec076))

## [1.14.0-beta.19](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.18...v1.14.0-beta.19) (2026-01-27)

### Bug Fixes

* **mobile:** fix Live Activity sync and logo alignment ([940e379](https://github.com/Slow-Spot/app/commit/940e379f1f2d8b52c6d127ffef83b77c1be61cc1))

## [1.14.0-beta.18](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.17...v1.14.0-beta.18) (2026-01-27)

### Bug Fixes

* **mobile:** add notification sound and configure local versioning ([202fce3](https://github.com/Slow-Spot/app/commit/202fce3a775e79f6271d331001fa06b2568a40fe))

## [1.14.0-beta.17](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.16...v1.14.0-beta.17) (2026-01-27)

### Features

* **mobile:** add Live Activity i18n with pluralization ([747350b](https://github.com/Slow-Spot/app/commit/747350b9ffe66d7de7305c44e503805365bdf00a))
* **mobile:** add Zen Mode and improve meditation haptics ([c13c868](https://github.com/Slow-Spot/app/commit/c13c868ccecb66a483d84318b6b87051bf4b41c6))

### Bug Fixes

* **mobile:** add custom notification sound and sync build versions ([2f7d2f3](https://github.com/Slow-Spot/app/commit/2f7d2f3db2f547e61b8356a46648ed3468892bd7))
* **mobile:** add i18n translations for Live Activity ([ac06a72](https://github.com/Slow-Spot/app/commit/ac06a72bd648c6dd01fb918adb274c68c43882d8))
* **mobile:** sync all target versions to EAS build number ([89a9fb9](https://github.com/Slow-Spot/app/commit/89a9fb9ce8dc692f2a47fe36b6bab13d969e7425))
* **mobile:** sync Live Activity with app state and add completion notification ([2b0f91c](https://github.com/Slow-Spot/app/commit/2b0f91c2942464fb7910f1d121dbec6c0f62a372))

## [1.14.0-beta.16](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.15...v1.14.0-beta.16) (2026-01-26)

### Bug Fixes

* **mobile:** resolve CFBundleVersion mismatch for Watch app ([2929171](https://github.com/Slow-Spot/app/commit/292917150dd502c6d708cb0f369e7adc3ae1fba7))

## [1.14.0-beta.15](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.14...v1.14.0-beta.15) (2026-01-26)

### Bug Fixes

* **mobile:** remove unused variable warning in TimerManager ([9e04e85](https://github.com/Slow-Spot/app/commit/9e04e856e950c177f9be4a9d5a9e9416aceb0357))

## [1.14.0-beta.14](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.13...v1.14.0-beta.14) (2026-01-26)

### Bug Fixes

* **mobile:** register withAppGroups plugin and add EAS pre-build hook ([0f02bff](https://github.com/Slow-Spot/app/commit/0f02bff08aaa5645f6b84b5bd47e48b6eaf320be))

## [1.14.0-beta.13](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.12...v1.14.0-beta.13) (2026-01-26)

### Bug Fixes

* **mobile:** add prebuildCommand to EAS config for Live Activity entitlements ([ba51ea7](https://github.com/Slow-Spot/app/commit/ba51ea7c14b6a01cbbbe01a3b1f16bc5bac1e962))

## [1.14.0-beta.12](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.11...v1.14.0-beta.12) (2026-01-25)

### Bug Fixes

* **mobile:** use custom App Group identifier for Live Activity ([9553988](https://github.com/Slow-Spot/app/commit/9553988062ee76049ebe1e30c3102cc8c7018b7e))

## [1.14.0-beta.11](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.10...v1.14.0-beta.11) (2026-01-25)

### Bug Fixes

* **mobile:** configure App Groups for Live Activity on lock screen ([8dccecc](https://github.com/Slow-Spot/app/commit/8dccecc37565cd8d8b436cc7f2103039d9c73016))

## [1.14.0-beta.10](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.9...v1.14.0-beta.10) (2026-01-25)

### Bug Fixes

* **mobile:** resolve Live Activity configuration conflict ([b8dea6e](https://github.com/Slow-Spot/app/commit/b8dea6efd74816aff935e41ca1c1c021a352a44a))

## [1.14.0-beta.9](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.8...v1.14.0-beta.9) (2026-01-25)

### Bug Fixes

* **mobile:** clean up iOS deployment target and remove duplicate proguard rule ([8b3480f](https://github.com/Slow-Spot/app/commit/8b3480f658af9303094ba0313fc981b61aa9cef7))

## [1.14.0-beta.8](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.7...v1.14.0-beta.8) (2026-01-25)

### Features

* **mobile:** add background timer, widgets, Apple Watch app and UX improvements ([bd652c6](https://github.com/Slow-Spot/app/commit/bd652c684e578b8201dba64ce598cadd415064f1))

## [1.14.0-beta.7](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.6...v1.14.0-beta.7) (2026-01-08)

### Features

* **mobile:** add metadata validation script for Google Play ([af64309](https://github.com/Slow-Spot/app/commit/af643092dd0e7a8bb39574025ac3cacca52c187f))

## [1.14.0-beta.6](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.5...v1.14.0-beta.6) (2026-01-08)

### Bug Fixes

* **mobile:** shorten shortDescription to comply with Google Play 80-char limit ([c0a2839](https://github.com/Slow-Spot/app/commit/c0a2839d43e02ffa7238c3d04824260e66929cf0))

## [1.14.0-beta.5](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.4...v1.14.0-beta.5) (2026-01-08)

### Bug Fixes

* **mobile:** complete truncated short descriptions for Google Play ([fca8841](https://github.com/Slow-Spot/app/commit/fca88413b5c4a5a04dcec9ac3e089545a61e8525))

## [1.14.0-beta.4](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.3...v1.14.0-beta.4) (2026-01-04)

### Features

* **release:** enhance cleanup workflow for multi-branch strategy ([7d651c6](https://github.com/Slow-Spot/app/commit/7d651c6922c95c325ba64508d0a6f082b42242e6))

## [1.14.0-beta.3](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.2...v1.14.0-beta.3) (2026-01-04)

### Bug Fixes

* **release:** update cleanup workflow for new branching strategy ([f63502d](https://github.com/Slow-Spot/app/commit/f63502d9b6eaae8fe3221732f016f706eba310c7))

## [1.14.0-beta.2](https://github.com/Slow-Spot/app/compare/v1.14.0-beta.1...v1.14.0-beta.2) (2026-01-04)

### Features

* **mobile:** add notification system and code cleanup ([79b9b36](https://github.com/Slow-Spot/app/commit/79b9b36050056c17cbb85887d3b7d9ab482e8349))

## [1.14.0-beta.1](https://github.com/Slow-Spot/app/compare/v1.13.1...v1.14.0-beta.1) (2026-01-04)

### Features

* **release:** implement professional multi-branch CI/CD strategy ([509099c](https://github.com/Slow-Spot/app/commit/509099cdaec4089aeb1746c6917751f2b362bcc9))

## [1.13.1](https://github.com/Slow-Spot/app/compare/v1.13.0...v1.13.1) (2025-12-31)

### Bug Fixes

* **mobile:** remove false '40+ meditations' claims from all locales ([0cd7331](https://github.com/Slow-Spot/app/commit/0cd7331f005a8d4e19b8b6c59315a72766ba099a))

## [1.13.0](https://github.com/Slow-Spot/app/compare/v1.12.3...v1.13.0) (2025-12-31)

### Features

* **mobile:** add pro release workflow with auto-submit ([a23784b](https://github.com/Slow-Spot/app/commit/a23784b196967faace8faa470a212912ce0fdbe6))

## [1.12.3](https://github.com/Slow-Spot/app/compare/v1.12.2...v1.12.3) (2025-12-31)

### Bug Fixes

* **mobile:** add missing translations for session card ([d3b5c2a](https://github.com/Slow-Spot/app/commit/d3b5c2ae30b157a9f3facf8713e0524ac7115200))

## [1.12.2](https://github.com/Slow-Spot/app/compare/v1.12.1...v1.12.2) (2025-12-31)

### Bug Fixes

* **mobile:** improve iPad session card layout ([485554f](https://github.com/Slow-Spot/app/commit/485554f44f256b924f771b4afbaae34db2103f2f))

## [1.12.1](https://github.com/Slow-Spot/app/compare/v1.12.0...v1.12.1) (2025-12-29)

### Bug Fixes

* **mobile:** improve iPad layout and fix screenshot naming ([3ee946f](https://github.com/Slow-Spot/app/commit/3ee946f9d89c686766b845f155381e20900a2900))

## [1.12.0](https://github.com/Slow-Spot/app/compare/v1.11.1...v1.12.0) (2025-12-29)

### Features

* **mobile:** add SkeletonLoader and ErrorBanner components ([b7494e0](https://github.com/Slow-Spot/app/commit/b7494e08f0a105ae1ce03292dc027b2aadbd9e17))
* **mobile:** add version number to splash screen ([f2dd0c6](https://github.com/Slow-Spot/app/commit/f2dd0c624be0dac99bc8f9131e4d59b5f0ba9405))
* **mobile:** improve App Store metadata and add iPad screenshots ([bafdcd0](https://github.com/Slow-Spot/app/commit/bafdcd089cc0da6c9144da22ef64db39eac2971a))
* **mobile:** improve App Store metadata and add iPad screenshots ([68a7609](https://github.com/Slow-Spot/app/commit/68a7609d4e760c72b5e5da0da7941492546cc1ee))
* **mobile:** integrate SkeletonLoader and ErrorBanner in MeditationScreen ([9328dae](https://github.com/Slow-Spot/app/commit/9328dae13629138d82dda3386a276996150ea8cb))
* **mobile:** integrate SkeletonLoader and ErrorBanner in ProfileScreen and SettingsScreen ([18da718](https://github.com/Slow-Spot/app/commit/18da718db2ba70785c1bc6ae060de756a04597d6))

### Bug Fixes

* **mobile:** replace stretched iPad screenshots with real screenshots ([90e5f48](https://github.com/Slow-Spot/app/commit/90e5f48ba8362d44c2b5a644406e629013006ba6))

## [1.11.1](https://github.com/Slow-Spot/app/compare/v1.11.0...v1.11.1) (2025-12-27)

### Bug Fixes

* **mobile:** configure App Store Connect API key for Fastlane ([5ff15e9](https://github.com/Slow-Spot/app/commit/5ff15e9a51be1a55d64dbb953f9496f22b02fb0c))

## [1.11.0](https://github.com/Slow-Spot/app/compare/v1.10.3...v1.11.0) (2025-12-27)

### Features

* **mobile:** add Fastlane deliver for iOS metadata sync ([e22b096](https://github.com/Slow-Spot/app/commit/e22b096faedef2a9482e93cc53377edf63fd3a2e))

## [1.10.3](https://github.com/Slow-Spot/app/compare/v1.10.2...v1.10.3) (2025-12-27)

### Bug Fixes

* **mobile:** update all locales with accurate content ([4f47b66](https://github.com/Slow-Spot/app/commit/4f47b66ab2ced2923528a8584ffe175ea468e8f9))

## [1.10.2](https://github.com/Slow-Spot/app/compare/v1.10.1...v1.10.2) (2025-12-27)

### Bug Fixes

* **mobile:** correct eas metadata:push command in workflow ([5419e1d](https://github.com/Slow-Spot/app/commit/5419e1d96e01b06aa58f69f2ecf603bb22c630be))

## [1.10.1](https://github.com/Slow-Spot/app/compare/v1.10.0...v1.10.1) (2025-12-27)

### Bug Fixes

* **mobile:** use 512x512 icon for Google Play ([9800002](https://github.com/Slow-Spot/app/commit/98000027223c948db8c2c4ac862cf3f2d713efa9))

## [1.10.0](https://github.com/Slow-Spot/app/compare/v1.9.10...v1.10.0) (2025-12-27)

### Features

* **mobile:** add complete store metadata with screenshots ([b70ff08](https://github.com/Slow-Spot/app/commit/b70ff08459f1092cbfd58e49feaf29921891172c))

## [1.9.10](https://github.com/Slow-Spot/app/compare/v1.9.9...v1.9.10) (2025-12-27)

### Bug Fixes

* **mobile:** use internal track with draft status for initial submission ([c7e37f5](https://github.com/Slow-Spot/app/commit/c7e37f5384e6c95c03eaad24ea0792ea4b09c150))

## [1.9.9](https://github.com/Slow-Spot/app/compare/v1.9.8...v1.9.9) (2025-12-27)

### Bug Fixes

* **mobile:** patch Fastlane bug [#21007](https://github.com/Slow-Spot/app/issues/21007) - changelog error without release ([77b1c54](https://github.com/Slow-Spot/app/commit/77b1c545559d0e62c9cb6f92f022983bb9fa143f))

## [1.9.8](https://github.com/Slow-Spot/app/compare/v1.9.7...v1.9.8) (2025-12-27)

### Bug Fixes

* **mobile:** remove track param from metadata-only uploads ([98f2ed9](https://github.com/Slow-Spot/app/commit/98f2ed9ad7c829c2a4919ae467364463b68358fd)), closes [#21007](https://github.com/Slow-Spot/app/issues/21007)

## [1.9.7](https://github.com/Slow-Spot/app/compare/v1.9.6...v1.9.7) (2025-12-27)

### Bug Fixes

* **mobile:** remove changelog generation - requires active release ([5df6d7c](https://github.com/Slow-Spot/app/commit/5df6d7cb049cc818cb3452f2d3e1db8afeeb6476))

## [1.9.6](https://github.com/Slow-Spot/app/compare/v1.9.5...v1.9.6) (2025-12-27)

### Bug Fixes

* **mobile:** patch Fastlane gem directly to fix bug [#21530](https://github.com/Slow-Spot/app/issues/21530) ([40273d7](https://github.com/Slow-Spot/app/commit/40273d7d730128f4772f1157475bb8dd46f00036))

## [1.9.5](https://github.com/Slow-Spot/app/compare/v1.9.4...v1.9.5) (2025-12-27)

### Bug Fixes

* **mobile:** require supply before monkey-patching ([3ad6df4](https://github.com/Slow-Spot/app/commit/3ad6df4cb0df796a75981b5118f089f82c29edc6))

## [1.9.4](https://github.com/Slow-Spot/app/compare/v1.9.3...v1.9.4) (2025-12-27)

### Bug Fixes

* **mobile:** add monkey-patch to fix Fastlane nil releases bug [#21530](https://github.com/Slow-Spot/app/issues/21530) ([c18c61d](https://github.com/Slow-Spot/app/commit/c18c61dfc35ebfec2ccf3daf4a425cb92ed91ac1)), closes [#21506](https://github.com/Slow-Spot/app/issues/21506)

## [1.9.3](https://github.com/Slow-Spot/app/compare/v1.9.2...v1.9.3) (2025-12-27)

### Bug Fixes

* **mobile:** split full_sync into images + text with error handling ([8bb756d](https://github.com/Slow-Spot/app/commit/8bb756d7afb6a718f27582dafad6ad4381f3d8de))

## [1.9.2](https://github.com/Slow-Spot/app/compare/v1.9.1...v1.9.2) (2025-12-27)

### Bug Fixes

* **mobile:** pin Fastlane to 2.224.0 - avoid nil releases bug ([664b23e](https://github.com/Slow-Spot/app/commit/664b23ec6864e9684f5670d2a99067036fdf86a6))

## [1.9.1](https://github.com/Slow-Spot/app/compare/v1.9.0...v1.9.1) (2025-12-27)

### Bug Fixes

* **mobile:** skip changelogs in Fastlane - requires active release ([c2e0f14](https://github.com/Slow-Spot/app/commit/c2e0f14ffe5d92f75e2fcfdd235903906901b5e7)), closes [#21530](https://github.com/Slow-Spot/app/issues/21530)

## [1.9.0](https://github.com/Slow-Spot/app/compare/v1.8.2...v1.9.0) (2025-12-27)

### Features

* **mobile:** full automation for store metadata sync ([d8b77e7](https://github.com/Slow-Spot/app/commit/d8b77e7294635a1b7ef47cb25430749b08da1cb2))

## [1.8.2](https://github.com/Slow-Spot/app/compare/v1.8.1...v1.8.2) (2025-12-26)

### Bug Fixes

* **release:** add credential files for store submission ([9949a19](https://github.com/Slow-Spot/app/commit/9949a19a1719bdd0bc39b793549c30e61a5288e3))

## [1.8.1](https://github.com/Slow-Spot/app/compare/v1.8.0...v1.8.1) (2025-12-26)

### Bug Fixes

* **ci:** add missing --json_key parameter for fastlane supply ([345ebe4](https://github.com/Slow-Spot/app/commit/345ebe46be64cebd239d5440824ce95c6ae1d38e))
* **ci:** add missing push trigger for Android metadata sync ([d037d32](https://github.com/Slow-Spot/app/commit/d037d32298c777c4d157d8e327f21fe4eb8d09d4))
* **ci:** add Node.js setup and package_name for Android metadata sync ([3421a0d](https://github.com/Slow-Spot/app/commit/3421a0d4b59ca6e5998e77f6448ffa82ed8f54e7))

## [1.8.0](https://github.com/Slow-Spot/app/compare/v1.7.0...v1.8.0) (2025-12-26)

### Features

* **mobile:** add automated store metadata sync for iOS and Android ([995ac8a](https://github.com/Slow-Spot/app/commit/995ac8a2502e956d18668fc170779e1b61277211))

## [1.7.0](https://github.com/Slow-Spot/app/compare/v1.6.0...v1.7.0) (2025-12-26)

### Features

* **mobile:** add App Store metadata and fix iOS submit config ([112ee57](https://github.com/Slow-Spot/app/commit/112ee5757f5fc29515fca8b584e5ca6fe697e0ca))

## [1.6.0](https://github.com/Slow-Spot/app/compare/v1.5.5...v1.6.0) (2025-12-23)

### Features

* **mobile:** enable R8/ProGuard for smaller APK and better crash reports ([351c940](https://github.com/Slow-Spot/app/commit/351c940432282fc102ad531728f4e14121fafdbe))

## [1.5.5](https://github.com/Slow-Spot/app/compare/v1.5.4...v1.5.5) (2025-12-21)

### Bug Fixes

* **mobile:** update API calls after refactoring ([3106f33](https://github.com/Slow-Spot/app/commit/3106f33affd6f73288fe16d97085aec30c8e5281))

## [1.5.4](https://github.com/Slow-Spot/app/compare/v1.5.3...v1.5.4) (2025-12-21)

### Code Refactoring

* **mobile:** rename mockData to data - no mocks, real data ([d95bd51](https://github.com/Slow-Spot/app/commit/d95bd51203816cd415d0be25b7200e45da07dfb6))

## [1.5.3](https://github.com/Slow-Spot/app/compare/v1.5.2...v1.5.3) (2025-12-21)

### Code Refactoring

* **mobile:** remove dead API code - app is 100% offline ([42ddb21](https://github.com/Slow-Spot/app/commit/42ddb21d0461298b9810cf4f49710522749c7f6f))

## [1.5.2](https://github.com/Slow-Spot/app/compare/v1.5.1...v1.5.2) (2025-12-21)

### Bug Fixes

* **mobile:** remove fake API URL - app is 100% offline ([0bea2d8](https://github.com/Slow-Spot/app/commit/0bea2d8f722a605d66dc3c294c26d249a2792259))

## [1.5.1](https://github.com/Slow-Spot/app/compare/v1.5.0...v1.5.1) (2025-12-21)

### Bug Fixes

* **mobile:** update all URLs from slowspot.app to slowspot.me ([454f81f](https://github.com/Slow-Spot/app/commit/454f81f8be5472d78bac023a17edc6a211c89f6d))

## [1.5.0](https://github.com/Slow-Spot/app/compare/v1.4.0...v1.5.0) (2025-12-21)

### Features

* **shared:** upgrade to turbo-pro CI/CD pipeline ([b70fe1b](https://github.com/Slow-Spot/app/commit/b70fe1b59bc90d0cb176b12624af9a0ae2c45e42))

## [1.4.0](https://github.com/Slow-Spot/app/compare/v1.3.3...v1.4.0) (2025-12-21)

### Features

* **mobile:** configure Apple App Store Connect API for auto-submit ([0f2a9c3](https://github.com/Slow-Spot/app/commit/0f2a9c3436b0c841b4768e3460161403adf439a4))

## [1.3.3](https://github.com/Slow-Spot/app/compare/v1.3.2...v1.3.3) (2025-12-21)

### Bug Fixes

* **mobile:** correct --auto-submit flag syntax in EAS build workflow ([b2b90f7](https://github.com/Slow-Spot/app/commit/b2b90f7860752a719e1278dafb0aab0ff731abcf))

## [1.3.2](https://github.com/Slow-Spot/app/compare/v1.3.1...v1.3.2) (2025-12-20)

### Bug Fixes

* resolve expo-doctor schema validation warnings ([b1eff09](https://github.com/Slow-Spot/app/commit/b1eff09ea4fe59e214a916523728889301204452))

## [1.3.1](https://github.com/Slow-Spot/app/compare/v1.3.0...v1.3.1) (2025-12-20)

### Bug Fixes

* **mobile:** add missing peer dependencies for app store compliance ([a3bfa8a](https://github.com/Slow-Spot/app/commit/a3bfa8a9e8d507f44bd83c46aadaa77d81fb3eb5))

## [1.3.0](https://github.com/Slow-Spot/app/compare/v1.2.1...v1.3.0) (2025-12-20)

### Features

* **web:** add GA4 analytics with GDPR-compliant cookie consent ([4a62c85](https://github.com/Slow-Spot/app/commit/4a62c85299cb76da28af43f42c5b25793530697f))

## [1.2.1](https://github.com/Slow-Spot/app/compare/v1.2.0...v1.2.1) (2025-12-20)

### Bug Fixes

* add Android feature graphic for Google Play Store ([c6f25c5](https://github.com/Slow-Spot/app/commit/c6f25c5aa6c43667fda761f4997ebec7d8728a38))

## [1.2.0](https://github.com/Slow-Spot/app/compare/v1.1.2...v1.2.0) (2025-12-20)

### Features

* add responsive design system for tablet and web ([5a2438f](https://github.com/Slow-Spot/app/commit/5a2438f1e5054b5571ee0d33565c8094a2664b47))

### Bug Fixes

* app store audit compliance improvements ([141de3a](https://github.com/Slow-Spot/app/commit/141de3a08cc27916ea106b98d45ce300830bff1c))
* upscale screenshots and unify contact email ([88aa01b](https://github.com/Slow-Spot/app/commit/88aa01b4b2d945c5bbb7f5ea857a0a9719d9148f))

## [1.1.2](https://github.com/Slow-Spot/app/compare/v1.1.1...v1.1.2) (2025-12-20)

### Bug Fixes

* app store compliance audit fixes ([8ab86e9](https://github.com/Slow-Spot/app/commit/8ab86e9417c99f8dc88e653b753592974a1d60ff))

## [1.1.1](https://github.com/Slow-Spot/app/compare/v1.1.0...v1.1.1) (2025-12-19)

### Bug Fixes

* restore and sync package-lock.json for CI/CD ([0378539](https://github.com/Slow-Spot/app/commit/0378539dff2ac95a948fcf015b35914590e2c4b5))

## [1.1.0](https://github.com/Slow-Spot/app/compare/v1.0.7...v1.1.0) (2025-12-19)

### Features

* redesign about section with credits, sync all translations ([ad2e5cb](https://github.com/Slow-Spot/app/commit/ad2e5cb28a570952ef755ea84193b8c16e48343a))

## [1.0.7](https://github.com/Slow-Spot/app/compare/v1.0.6...v1.0.7) (2025-12-10)

### Bug Fixes

* improve text contrast in light mode for better readability ([db14826](https://github.com/Slow-Spot/app/commit/db14826675f3cbec5481102ff050481bbb5b7ce0)), closes [#48484A](https://github.com/Slow-Spot/app/issues/48484A)

## [1.0.6](https://github.com/Slow-Spot/app/compare/v1.0.5...v1.0.6) (2025-12-10)

### Bug Fixes

* simplify breathing haptics and fix session start navigation ([6f1a8ba](https://github.com/Slow-Spot/app/commit/6f1a8ba25e41bf6ae12b554810e7f79cb5438447))

## [1.0.5](https://github.com/Slow-Spot/app/compare/v1.0.4...v1.0.5) (2025-12-06)

### Bug Fixes

* update all app icons and add missing web favicons ([988ccb8](https://github.com/Slow-Spot/app/commit/988ccb82502166861a0118dd8c1cafe00b7f3bd7))

## [1.0.4](https://github.com/Slow-Spot/app/compare/v1.0.3...v1.0.4) (2025-12-06)

### Bug Fixes

* update app icons to new lotus design with gradient ([7476b5d](https://github.com/Slow-Spot/app/commit/7476b5d016fdd0316ac94f18d9410eb7008ead4b))

## [1.0.3](https://github.com/Slow-Spot/app/compare/v1.0.2...v1.0.3) (2025-12-06)

### Bug Fixes

* restore correct LinearGradient named import from expo-linear-gradient ([8e8108e](https://github.com/Slow-Spot/app/commit/8e8108e126e9b8b19cd938f098a641f8f52ccf5d))

## [1.0.2](https://github.com/Slow-Spot/app/compare/v1.0.1...v1.0.2) (2025-12-06)

### Bug Fixes

* update Android config for Expo SDK 54 compatibility ([5f7cb4f](https://github.com/Slow-Spot/app/commit/5f7cb4f89a92227ac8eddf26692fddb19e22976a))

## [1.0.1](https://github.com/Slow-Spot/app/compare/v1.0.0...v1.0.1) (2025-12-06)

### Bug Fixes

* resolve LinearGradient import and TypeScript issues ([3511ba5](https://github.com/Slow-Spot/app/commit/3511ba5180cd40d92511093a9b407422cdd8bd09))

## 1.0.0 (2025-12-06)

### Features

* Add 40+ diverse meditation sessions for occasions and cultures ([d7c6eea](https://github.com/Slow-Spot/app/commit/d7c6eea7faa4baf33ab727fe173ac8708a3b1c63))
* Add active meditation state management and navigation confirmation in MeditationScreen ([4af74a3](https://github.com/Slow-Spot/app/commit/4af74a339141faed3eade58d73d7e61cfbcb50a9))
* Add authentic multilingual quotes system with original texts ([7769c4a](https://github.com/Slow-Spot/app/commit/7769c4a9f802b5243eb7ccbb83243baa0c6b7ab4))
* Add automated test deployment pipelines with GitHub Actions and EAS ([3a388ce](https://github.com/Slow-Spot/app/commit/3a388ce6c872ecc35b86020173da59a9060db1a9))
* Add beautiful meditation app assets with lotus & zen circle design ([c0b6edf](https://github.com/Slow-Spot/app/commit/c0b6edf9f3df0643a65040af4cd7036d481371c6))
* add breathing pattern support to MeditationScreen ([793e0a0](https://github.com/Slow-Spot/app/commit/793e0a0884a05ceb8dcc1860567abc4f5aa6b577))
* Add complete CI/CD pipeline with GitHub Actions and Analytics ([c84b1a5](https://github.com/Slow-Spot/app/commit/c84b1a5d43edd2965b669be26b18686d040b7584))
* Add comprehensive build and deploy documentation with Expo Go support ([2171697](https://github.com/Slow-Spot/app/commit/2171697914bee6293b72f100a122cf0e398d5dda))
* Add comprehensive custom session management system ([167904b](https://github.com/Slow-Spot/app/commit/167904ba8230ad3cf91c7b3849d43e7dbaabdb03))
* Add comprehensive i18n translations for PreSessionInstructions ([7941183](https://github.com/Slow-Spot/app/commit/7941183c7f447289726b1fbb85cae69c5b2d2673))
* add dark mode gradients and themes, enhance card styles, and implement ConfirmationModal component ([f09667f](https://github.com/Slow-Spot/app/commit/f09667f1423b6ffcaffda5de9a63ec6cae1bb2ed))
* Add iOS builds and automatic cleanup for old builds ([fe2f527](https://github.com/Slow-Spot/app/commit/fe2f527834282ef9942cd2913a7e5b57472a4031))
* Add live QR codes for instant app testing ([435c6ad](https://github.com/Slow-Spot/app/commit/435c6ad188a78576799912c4390bfc95186e527e))
* Add massive meditation quotes database (70 quotes) ([355f323](https://github.com/Slow-Spot/app/commit/355f323c92df3f9a53eaa2be6ab24b891f907631))
* add meditation intro guide, intention screen, and web decorative orbs ([9283d35](https://github.com/Slow-Spot/app/commit/9283d35afa83491d3ac52a50b1742ac18253aa41))
* Add multilingual session support, smart filters, and user preferences ([4f1b544](https://github.com/Slow-Spot/app/commit/4f1b544cc7df7b2e344377e1d4c12d87173530d2))
* add PersonalizationContext and PersonalizationScreen for user customization options ([a6a98ad](https://github.com/Slow-Spot/app/commit/a6a98ad5b7e70a9738c4186975c45196fc59e91e))
* Add pre-session instructions for meditation sessions and enhance localization ([54a1a3b](https://github.com/Slow-Spot/app/commit/54a1a3bd552e4ea46cbd97417575a02c5e4d1201))
* Add profile screen, calendar integration, and complete translations ([1808a10](https://github.com/Slow-Spot/app/commit/1808a100e306d6c42e71aab114fc7971dc67d84b))
* add quick start mode utilities for meditation sessions ([9f42ac9](https://github.com/Slow-Spot/app/commit/9f42ac9a929eb3af4f1bf91f33e529f0de8eed78))
* **ci:** add semantic-release, web auto-deploy, and conventional commits ([21e82f3](https://github.com/Slow-Spot/app/commit/21e82f3d3ae4c47cc99a561173d8fd4335f667ef))
* Configure expo-updates and fix EAS build warnings ([d79b49d](https://github.com/Slow-Spot/app/commit/d79b49de094b7fb449fbe8a74ad2f9fc6bea963a))
* Enable automatic Expo Go updates on main branch ([afac2e6](https://github.com/Slow-Spot/app/commit/afac2e6b89e54df871f77aee517ef4b5971e37b7))
* Enhance accessibility and performance across the app ([903e05e](https://github.com/Slow-Spot/app/commit/903e05ec757ab2edff62b527eaf93bbf1dc1021a))
* enhance HomeScreen button styles and layout, improve shadows and add decorative elements ([729ef99](https://github.com/Slow-Spot/app/commit/729ef9914091eba0f1f7eb9322569ecdd54961ec))
* enhance HomeScreen title styling with dual text elements and improved layout ([1fbc841](https://github.com/Slow-Spot/app/commit/1fbc841e011442cf8fdef686d92a74be0ca5a4b7))
* Enhance MeditationTimer breathing animation and update localization for custom session features ([501723e](https://github.com/Slow-Spot/app/commit/501723ebbb6f3f27d010c4ed3b74925f658431d5))
* Enhance PreSessionInstructions with icon mapping and improve MeditationTimer styles ([496030e](https://github.com/Slow-Spot/app/commit/496030ec1b659ec36934a7f31568663fab6cb684))
* Enhance QuoteCard styling and shadow effects for better depth ([21869de](https://github.com/Slow-Spot/app/commit/21869de1532a06e377701fc1f069bbd2e374f67c))
* Enhance theme management and user preferences; add audio controls and breathing guidance to MeditationTimer ([7b6899a](https://github.com/Slow-Spot/app/commit/7b6899a9a2e876c6f8623a412eee1c8a9e912b93))
* Enhance user profile management and onboarding experience ([8ff7f19](https://github.com/Slow-Spot/app/commit/8ff7f190fc4955969169c3cd6f3a713d90e8eda8))
* expand ambient sounds to 8 options with 2x4 grid layout ([488b289](https://github.com/Slow-Spot/app/commit/488b289f39d1aa808384a8c1c7c8643060634d9b))
* Expand quotes database to 150+ meditation quotes ([d213563](https://github.com/Slow-Spot/app/commit/d21356330aa0079092c691abb6c89a0129d7c7c7))
* **i18n:** add complete i18n system for landing page and update Chinese translations ([545833e](https://github.com/Slow-Spot/app/commit/545833edfb2c7e0b93471e452b732599f512d178))
* **i18n:** complete translation coverage for all languages ([f1e2a85](https://github.com/Slow-Spot/app/commit/f1e2a856035093d938ebbccd6a87bc1988409ad2))
* Implement session editing functionality in MeditationScreen and enhance MeditationTimer with adjustable chimes ([2cc6de6](https://github.com/Slow-Spot/app/commit/2cc6de66d0837dee908613ff3f21ff8c1e2db848))
* Implement well-being questionnaire and custom session management ([ad2ef07](https://github.com/Slow-Spot/app/commit/ad2ef079069d0576e850846f1031f178f8c67e78))
* improve design consistency and timer visibility ([de75422](https://github.com/Slow-Spot/app/commit/de754225f1885e9ae110f7fb649f66859cccaf23))
* Improve UX/UI with animations, haptics, and screen wake lock ([efde887](https://github.com/Slow-Spot/app/commit/efde88739f8a69bb314b5eab335e9e8718880fec))
* **mobile:** add compliance docs and achievements enhancements ([38d080b](https://github.com/Slow-Spot/app/commit/38d080ba5c1b3886186229efeff6debfc0ce78ee))
* **mobile:** add comprehensive system settings detection and integration ([9471d71](https://github.com/Slow-Spot/app/commit/9471d716bc61873861e54070ead4bf242ce7a069))
* **mobile:** add enhanced haptic feedback for breathing phases ([98ac1f2](https://github.com/Slow-Spot/app/commit/98ac1f265ee20e9d126128ce90b9f424cb93138d))
* **mobile:** add hide countdown option for distraction-free meditation ([4bdd1ee](https://github.com/Slow-Spot/app/commit/4bdd1ee8fb9bd3b86425c130ec9d7bcbeb9590bc))
* **mobile:** add legal links section for App Store/Google Play compliance ([c2f0e09](https://github.com/Slow-Spot/app/commit/c2f0e09162230bab5962a623f2962f003d9cef35))
* **mobile:** add missing translations for all languages ([31cf274](https://github.com/Slow-Spot/app/commit/31cf27458d2cf2b0b73048adc1c1732ffe7085d0))
* **mobile:** enhance default session with evidence-based mindfulness settings ([858d33d](https://github.com/Slow-Spot/app/commit/858d33de436792d2ca9cc38e4a48fb92cf9cffa2))
* Refactor MeditationScreen to include flow states and new screens ([85840af](https://github.com/Slow-Spot/app/commit/85840af9e3b849bdfdefb14e3dc20d6e75ad3f45))
* Refactor PreSessionInstructions component to use React Native's View and TouchableOpacity ([8544df7](https://github.com/Slow-Spot/app/commit/8544df7a3278a547d9a6121586388804170f00b9))
* **release:** add i18n version sync to release process ([2739448](https://github.com/Slow-Spot/app/commit/2739448543abb7c032838a2f1dc043a949c95fa3))
* update button colors to mint accents and enhance typography in HomeScreen and SettingsScreen ([d534b98](https://github.com/Slow-Spot/app/commit/d534b98cb77f2958be31ac31a24111ef5e2e0c35))
* Update Polish localization and enhance HomeScreen layout with new quote teaser and quick start button ([67c87bf](https://github.com/Slow-Spot/app/commit/67c87bff99a0190f7e80d4690d119992c6c7d10e))
* Update PreSessionInstructions and MeditationScreen gradients, enhance BreathingPrepStep logic, and improve AnimatedBreathingCircle phases ([20f1409](https://github.com/Slow-Spot/app/commit/20f1409c2519b7ea6e4761b2c254a631a6cac9b1))
* update sitemap.xml for multilingual support and add new SVG assets ([aad6c99](https://github.com/Slow-Spot/app/commit/aad6c9923e6d78af437c7906314cd67d04c5cc75))
* **web:** add FTP deployment script and npm deploy commands ([97a6cdf](https://github.com/Slow-Spot/app/commit/97a6cdfa5319b98fc0544f39b527b4d1a6628630))
* **web:** add legal pages for App Store/Play Store compliance ([4df3f2b](https://github.com/Slow-Spot/app/commit/4df3f2ba8f2715724b637720adfeadfd1a3088c4))
* **web:** add meditation favicon, comprehensive SEO, and sitemap ([3efde01](https://github.com/Slow-Spot/app/commit/3efde016f7fd38fe2864b970e2358ba7827ae851))
* **web:** add modern visual enhancements and fix cookie banner theming ([1006069](https://github.com/Slow-Spot/app/commit/10060699c5327aeb4c25e836df2ec7535928837e))
* **web:** add next-intl i18n support with 7 languages and UI improvements ([cc5b61e](https://github.com/Slow-Spot/app/commit/cc5b61e37af53f30d4c11f1d714dcdb6839dcb8e))
* **web:** add Tailwind CSS, redesign features section, and add language switcher to subpages ([c2e6fb4](https://github.com/Slow-Spot/app/commit/c2e6fb47a7f03b249354b183474dee68f846d20d))
* **web:** auto-detect browser language on root page ([e6bad5d](https://github.com/Slow-Spot/app/commit/e6bad5d0dcd47dc3c26725d393d90f68e3c5f496))
* **web:** enhance decorative orbs visibility for light theme ([01a655e](https://github.com/Slow-Spot/app/commit/01a655e294df3bdc0800671af5bfc9d4877905c3))
* **web:** enhance light mode visual design with vibrant purple accents ([179ba92](https://github.com/Slow-Spot/app/commit/179ba9229d213b79676f5a35781659e5404f2bfe)), closes [#7C3AED](https://github.com/Slow-Spot/app/issues/7C3AED) [#C084FC](https://github.com/Slow-Spot/app/issues/C084FC)
* Week 1 Foundation Upgrade - Install latest dependencies ([377af75](https://github.com/Slow-Spot/app/commit/377af757fa911ea5254af61303f84c4eb820fa55))

### Bug Fixes

* add ambient sound files and fix Metro bundler require ([3a6af9b](https://github.com/Slow-Spot/app/commit/3a6af9b5b38beb67649db3daa25b1e43e2adfc5a))
* Add missing "system" translation key for theme settings ([d664497](https://github.com/Slow-Spot/app/commit/d6644978fb1013884e9e3e5ebea603c06bfb7a32))
* Add permissions to cleanup workflow and update Expo links ([18e23a3](https://github.com/Slow-Spot/app/commit/18e23a3301c218a57662e26cfbf2a79f5ed3e7af))
* Add react-native-worklets@0.6.2 dependency for Reanimated compatibility ([9e35fbb](https://github.com/Slow-Spot/app/commit/9e35fbbf008e8e43a68fbf89bdab420cb1a34bd9))
* Build only Android in preview (iOS requires Apple Developer account) ([fa26373](https://github.com/Slow-Spot/app/commit/fa26373fcf6dd56747ad4adf12de3a6937042694))
* **ci:** skip husky in CI and use consistent FTP_PASS secret name ([63807dd](https://github.com/Slow-Spot/app/commit/63807dd3d12de8b9c725dd8634a0624c16867804))
* Correct eas.json validation errors ([a1e59ea](https://github.com/Slow-Spot/app/commit/a1e59ea07739308bd36832d5c7d72850c8962c0b))
* correct pipeline order and version sync for all languages ([e12a31b](https://github.com/Slow-Spot/app/commit/e12a31bdafc0e64da30a4a2230c4e19292668b3f))
* Downgrade React to 19.1.0 for Expo SDK 54 compatibility ([692a7b1](https://github.com/Slow-Spot/app/commit/692a7b15cb2aef0db5821a100cc2774b17df9bba))
* Downgrade react-native-worklets to 0.5.1 for Expo SDK 54 compatibility ([b6f589e](https://github.com/Slow-Spot/app/commit/b6f589e58eed947091c744f0213d55a3d1d64e13))
* Enable meditation bell sound loading in timer ([9cbe024](https://github.com/Slow-Spot/app/commit/9cbe0247bf26d5a0aaa6d7a6a8a68a14320c7a1f))
* install missing peer dependency and improve i18n initialization ([713497d](https://github.com/Slow-Spot/app/commit/713497da852e341f34bdf95315a9111839a9b3f6))
* **mobile,web:** fix name saving in onboarding and remove duplicate CSS ([8960c16](https://github.com/Slow-Spot/app/commit/8960c167c123a352b2ce150675310c2bce2e6d91))
* **mobile:** auto-recreate default session when list is empty ([e14768f](https://github.com/Slow-Spot/app/commit/e14768fea8a938082e85589a20988d8dbd4b87a5))
* **mobile:** fix TypeScript build errors ([9b1a0fa](https://github.com/Slow-Spot/app/commit/9b1a0fadc542b1d3143b8fbe6a9b716b399acad3))
* **mobile:** restore default session after data clear ([2acf8fb](https://github.com/Slow-Spot/app/commit/2acf8fbf9a3dacbc4a2340652659493c96015e26))
* Refactor PreSessionInstructions to use dynamic i18n translations ([cbc666a](https://github.com/Slow-Spot/app/commit/cbc666a1ef0fa9ff197cae508e9442654efc767a))
* Remove iOS native build from preview (use Expo Go instead) ([80b3df4](https://github.com/Slow-Spot/app/commit/80b3df43e52b796aa64edbc4f4691498cc152722))
* Remove npm cache from workflows to avoid GitHub cache service errors ([a158555](https://github.com/Slow-Spot/app/commit/a158555420974a3b6b99a856e152e79415477bc2))
* Replace complex backend tests with simple passing tests ([29df66a](https://github.com/Slow-Spot/app/commit/29df66ac93db3b93101741b1ac250ef309d65735))
* replace tamagui import with native React Native components ([7ff829b](https://github.com/Slow-Spot/app/commit/7ff829baae09f5cf0934bf397e77df9ed4dccc6c))
* Resolve asset path issues in EAS build ([4cb9553](https://github.com/Slow-Spot/app/commit/4cb9553cd65a7d647c63b62d2559773abd7957f1))
* Update expo-updates to correct version for SDK 54 ([52c8df6](https://github.com/Slow-Spot/app/commit/52c8df62b5a6b43ea75cc886fdc4997ceda4f64b))
* Update expo-updates to correct version for SDK 54 ([898dd14](https://github.com/Slow-Spot/app/commit/898dd144848ce56cbcbc89e22517aac1c6d32363))
* URL encode QR code links for proper rendering ([feb5bdf](https://github.com/Slow-Spot/app/commit/feb5bdf7a49c790ff82bab8509f322f06799b1b5))
* **web:** add light mode styles for subpage footer and fix icon conflicts ([df75253](https://github.com/Slow-Spot/app/commit/df752536c7d4a9eeafb63dedcc956b678638b7d5))
* **web:** ensure white text on purple CTA/footer sections in light mode ([296cd7c](https://github.com/Slow-Spot/app/commit/296cd7c97e4f41180451cdb281f4370ab5d86a8d))
* **web:** fix blank page after build ([692b91c](https://github.com/Slow-Spot/app/commit/692b91c89970f134d2edf0a681e2e9fb5f8e7b6b))
* **web:** fix build issues causing white screen after build ([e8d8af7](https://github.com/Slow-Spot/app/commit/e8d8af75b2f0340c4c04632a2d07ef3f5bc53282))
* **web:** fix text contrast in footer and download sections for light mode ([266337a](https://github.com/Slow-Spot/app/commit/266337a9ba15838d872133f41add2a399963a265))
* **web:** replace Chinese quotes with standard guillemets in support-zh.json ([40b6c2e](https://github.com/Slow-Spot/app/commit/40b6c2e07cad6b201b6e38e54871c4e7a048ea79))
* **web:** update all contact emails and URLs to slowspot.me domain ([d422ef3](https://github.com/Slow-Spot/app/commit/d422ef3bfd824ab2669b797e4d4928589ee6fc9c))

### Code Refactoring

* clean up codebase with consistent naming conventions ([856bead](https://github.com/Slow-Spot/app/commit/856bead197271e2bd051576922d7e362a923d272))
* improve button styling and shadow consistency ([82e39bb](https://github.com/Slow-Spot/app/commit/82e39bb98575d086bd9d7f16fbcbd30a103179ae))
* Refactor audio services to include healing frequency metadata and enhance audio engine documentation; add comprehensive audio frequency guidelines. ([67af09c](https://github.com/Slow-Spot/app/commit/67af09ce0deebd0a569b69dbe72fead6685537f1))
* remove pseudoscientific 432Hz/528Hz ambient sound options ([87fb86d](https://github.com/Slow-Spot/app/commit/87fb86d50539f0f0a82538ece654fda1d0cc14dc))
* Replace all hardcoded values with theme tokens in QuoteCard and CelebrationScreen ([158b837](https://github.com/Slow-Spot/app/commit/158b83708e866df65ccd530510dd3f11d53dbdce))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-06

### Added

- Guided breathing exercises with 5 meditation levels
- 8 ambient soundscapes (rain, ocean, forest, fire, wind, and more)
- Haptic feedback synchronized with breathing phases
- Dark and light mode with system preference detection
- Full VoiceOver and TalkBack accessibility support
- Support for 7 languages: English, Polish, German, Spanish, French, Hindi, Chinese
- Personalized greetings based on time of day
- Session history and progress tracking
- 150+ motivational quotes from diverse traditions
- Offline-first architecture with local SQLite storage
- Privacy-first design with zero data collection

### Technical

- React Native with Expo SDK 52
- TypeScript for type safety
- Next.js 15 landing page with Tailwind CSS 4
- Automated CI/CD with GitHub Actions and EAS Build
- iOS Privacy Manifest for App Store compliance

### Compliance

- Apple App Store guidelines compliant
- Google Play Store policies compliant
- GDPR compliant (no personal data collection)
- No third-party tracking or analytics
- No required permissions (audio runs in background only when actively meditating)
