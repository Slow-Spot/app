/**
 * ConnectivityManager
 *
 * Zarzadza komunikacja z iPhone przez WatchConnectivity.
 * Synchronizuje dane sesji miedzy Watch a telefonem.
 */

import Foundation
import WatchConnectivity

final class ConnectivityManager: NSObject, ObservableObject {
    static let shared = ConnectivityManager()

    @Published var isReachable: Bool = false
    @Published var lastSyncDate: Date?

    private var session: WCSession?

    private override init() {
        super.init()

        if WCSession.isSupported() {
            session = WCSession.default
            session?.delegate = self
            session?.activate()
        }
    }

    // MARK: - Public Methods

    /// Wysyla zakonczenie sesji do iPhone
    func sendSessionCompleted(duration: Int, date: Date = Date()) {
        guard let session = session, session.isReachable else {
            // Zapisz lokalnie jesli iPhone niedostepny
            saveLocally(duration: duration, date: date)
            return
        }

        let message: [String: Any] = [
            "type": "session_completed",
            "duration": duration,
            "date": date.timeIntervalSince1970
        ]

        session.sendMessage(message, replyHandler: nil) { error in
            print("Failed to send session: \(error.localizedDescription)")
            // Fallback - zapisz lokalnie
            self.saveLocally(duration: duration, date: date)
        }
    }

    /// Wysyla rozpoczecie sesji do iPhone
    func sendSessionStarted(duration: Int) {
        guard let session = session, session.isReachable else { return }

        let message: [String: Any] = [
            "type": "session_started",
            "duration": duration,
            "date": Date().timeIntervalSince1970
        ]

        session.sendMessage(message, replyHandler: nil, errorHandler: nil)
    }

    /// Wysyla pauze sesji do iPhone
    func sendSessionPaused(remainingSeconds: Int) {
        guard let session = session, session.isReachable else { return }

        let message: [String: Any] = [
            "type": "session_paused",
            "remainingSeconds": remainingSeconds
        ]

        session.sendMessage(message, replyHandler: nil, errorHandler: nil)
    }

    /// Wysyla wznowienie sesji do iPhone
    func sendSessionResumed(remainingSeconds: Int) {
        guard let session = session, session.isReachable else { return }

        let message: [String: Any] = [
            "type": "session_resumed",
            "remainingSeconds": remainingSeconds
        ]

        session.sendMessage(message, replyHandler: nil, errorHandler: nil)
    }

    // MARK: - Private Methods

    private func saveLocally(duration: Int, date: Date) {
        // Zapisz do UserDefaults dla pozniejszej synchronizacji
        var pendingSessions = UserDefaults.standard.array(forKey: "pendingSessions") as? [[String: Any]] ?? []

        pendingSessions.append([
            "duration": duration,
            "date": date.timeIntervalSince1970
        ])

        UserDefaults.standard.set(pendingSessions, forKey: "pendingSessions")
    }

    private func syncPendingSessions() {
        guard let session = session, session.isReachable else { return }

        let pendingSessions = UserDefaults.standard.array(forKey: "pendingSessions") as? [[String: Any]] ?? []

        guard !pendingSessions.isEmpty else { return }

        let message: [String: Any] = [
            "type": "sync_sessions",
            "sessions": pendingSessions
        ]

        session.sendMessage(message, replyHandler: { _ in
            // Wyczysc po udanej synchronizacji
            UserDefaults.standard.removeObject(forKey: "pendingSessions")
            DispatchQueue.main.async {
                self.lastSyncDate = Date()
            }
        }, errorHandler: nil)
    }
}

// MARK: - WCSessionDelegate

extension ConnectivityManager: WCSessionDelegate {
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        DispatchQueue.main.async {
            self.isReachable = session.isReachable
        }

        if activationState == .activated {
            syncPendingSessions()
        }
    }

    func sessionReachabilityDidChange(_ session: WCSession) {
        DispatchQueue.main.async {
            self.isReachable = session.isReachable
        }

        if session.isReachable {
            syncPendingSessions()
        }
    }

    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        // Obsluga wiadomosci z iPhone
        guard let type = message["type"] as? String else { return }

        switch type {
        case "sync_request":
            syncPendingSessions()
        case "settings_updated":
            // Mozna zaktualizowac ustawienia
            break
        default:
            break
        }
    }
}
