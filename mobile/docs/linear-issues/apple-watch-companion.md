# Linear Issue: Apple Watch Companion App

## Title
Apple Watch Companion App - Sync notifications with main app

## Description
Create an Apple Watch companion app that syncs with the main Slow Spot app to provide haptic feedback and audio cues during meditation sessions.

## User Story
As a user meditating with my iPhone nearby, I want my Apple Watch to vibrate or play sounds when the main app triggers notifications, so I can stay immersed in my practice without looking at my phone.

## Acceptance Criteria
- [ ] Apple Watch app receives notifications when main app triggers sounds/vibrations
- [ ] Haptic feedback on Apple Watch synced with main app events
- [ ] Option to enable/disable watch notifications
- [ ] Support for breathing exercise timing on watch
- [ ] Minimal battery impact on both devices

## Technical Considerations
- Use WatchConnectivity framework for iOS-watchOS communication
- Implement WCSession for real-time data transfer
- Handle background states for both apps
- Consider using complications for quick session start
- Support watchOS 9.0+ for broader device compatibility

## Priority
Medium

## Labels
- feature
- ios
- apple-watch

## Estimate
Large (requires new target, UI design, testing)
