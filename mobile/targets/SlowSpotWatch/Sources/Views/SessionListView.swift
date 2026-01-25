/**
 * SessionListView
 *
 * Lista predefiniowanych sesji medytacji do szybkiego wyboru.
 * Obsluguje Digital Crown do nawigacji.
 */

import SwiftUI

struct SessionListView: View {
    @EnvironmentObject var timerManager: TimerManager
    @EnvironmentObject var sessionStore: SessionStore

    // Brand colors - zsynchronizowane z design system
    private let brandPurple = Color(hex: "8B5CF6")
    private let brandPurpleLight = Color(hex: "A78BFA")

    var body: some View {
        List {
            // Sekcja: Szybkie sesje
            Section {
                ForEach(sessionStore.quickSessions) { session in
                    SessionRowView(session: session) {
                        timerManager.startSession(duration: session.duration)
                    }
                }
            } header: {
                Text("Quick Sessions")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }

            // Sekcja: Breathing Exercises
            Section {
                NavigationLink(destination: BreathingGuideView()) {
                    HStack {
                        Image(systemName: "wind")
                            .foregroundColor(brandPurple)
                        Text("Breathing Guide")
                    }
                }
            } header: {
                Text("Mindfulness")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
        }
        .navigationTitle("Slow Spot")
        .listStyle(.carousel)
    }
}

// MARK: - Session Row

struct SessionRowView: View {
    let session: MeditationSession
    let onTap: () -> Void

    private let brandPurple = Color(hex: "8B5CF6")

    var body: some View {
        Button(action: onTap) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(session.title)
                        .font(.headline)
                        .foregroundColor(.primary)

                    Text(session.formattedDuration)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Spacer()

                Image(systemName: "play.circle.fill")
                    .font(.title2)
                    .foregroundColor(brandPurple)
            }
            .padding(.vertical, 4)
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    SessionListView()
        .environmentObject(TimerManager())
        .environmentObject(SessionStore())
}
