/**
 * ContentView
 *
 * Glowny widok nawigacyjny aplikacji Watch.
 * Pokazuje liste sesji, aktywny timer lub ekran zakonczenia.
 */

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var timerManager: TimerManager
    @EnvironmentObject var sessionStore: SessionStore

    var body: some View {
        NavigationStack {
            Group {
                if timerManager.showCompletion {
                    CompletionView(
                        completedDuration: timerManager.completedDuration,
                        onDismiss: {
                            timerManager.dismissCompletion()
                        }
                    )
                } else if timerManager.isRunning || timerManager.isPaused {
                    TimerView()
                } else {
                    SessionListView()
                }
            }
        }
        .onAppear {
            // Request HealthKit authorization on first launch
            HealthKitManager.shared.requestAuthorization()
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(TimerManager())
        .environmentObject(SessionStore())
}
