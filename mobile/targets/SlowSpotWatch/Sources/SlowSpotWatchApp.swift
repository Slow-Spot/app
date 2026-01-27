/**
 * Slow Spot Watch App
 *
 * Standalone Apple Watch app dla medytacji.
 * Oferuje timer sesji, przewodnik oddychania i haptic feedback.
 */

import SwiftUI
import WatchKit

@main
struct SlowSpotWatchApp: App {
    @StateObject private var timerManager = TimerManager()
    @StateObject private var sessionStore = SessionStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(timerManager)
                .environmentObject(sessionStore)
        }
    }
}
