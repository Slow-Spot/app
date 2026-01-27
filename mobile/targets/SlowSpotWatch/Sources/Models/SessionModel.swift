/**
 * SessionModel
 *
 * Modele danych dla sesji medytacji.
 */

import Foundation

// MARK: - Meditation Session

struct MeditationSession: Identifiable {
    let id: UUID
    let title: String
    let duration: Int  // w sekundach
    let icon: String

    init(id: UUID = UUID(), title: String, duration: Int, icon: String = "leaf.fill") {
        self.id = id
        self.title = title
        self.duration = duration
        self.icon = icon
    }

    var formattedDuration: String {
        let minutes = duration / 60
        if minutes < 60 {
            return "\(minutes) min"
        } else {
            let hours = minutes / 60
            let remainingMinutes = minutes % 60
            if remainingMinutes == 0 {
                return "\(hours) hr"
            } else {
                return "\(hours) hr \(remainingMinutes) min"
            }
        }
    }
}

// MARK: - Session Store

class SessionStore: ObservableObject {
    @Published var quickSessions: [MeditationSession] = []

    init() {
        loadDefaultSessions()
    }

    private func loadDefaultSessions() {
        quickSessions = [
            MeditationSession(title: "Quick Calm", duration: 3 * 60, icon: "leaf.fill"),
            MeditationSession(title: "Morning Start", duration: 5 * 60, icon: "sun.max.fill"),
            MeditationSession(title: "Focus Session", duration: 10 * 60, icon: "brain.head.profile"),
            MeditationSession(title: "Deep Relax", duration: 15 * 60, icon: "moon.stars.fill"),
            MeditationSession(title: "Extended", duration: 20 * 60, icon: "sparkles"),
            MeditationSession(title: "Full Session", duration: 30 * 60, icon: "figure.mind.and.body"),
        ]
    }
}
