/**
 * TimerManager
 *
 * Zarzadza stanem timera sesji medytacji.
 * Obsluguje start, pauze, wznowienie i zakonczenie.
 * Integruje sie z HealthKit i WatchConnectivity.
 */

import SwiftUI
import WatchKit
import Combine

class TimerManager: ObservableObject {
    @Published var remainingSeconds: Int = 0
    @Published var totalSeconds: Int = 0
    @Published var isRunning: Bool = false
    @Published var isPaused: Bool = false
    @Published var showCompletion: Bool = false
    @Published var completedDuration: Int = 0

    private var timer: Timer?
    private var sessionStartTime: Date?
    private var pausedTime: TimeInterval = 0

    // Managers
    private let haptic = HapticManager.shared
    private let connectivity = ConnectivityManager.shared
    private let healthKit = HealthKitManager.shared

    // MARK: - Computed Properties

    var progress: Double {
        guard totalSeconds > 0 else { return 0 }
        return Double(totalSeconds - remainingSeconds) / Double(totalSeconds)
    }

    var formattedTime: String {
        let minutes = remainingSeconds / 60
        let seconds = remainingSeconds % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }

    // MARK: - Session Control

    func startSession(duration: Int) {
        totalSeconds = duration
        remainingSeconds = duration
        isRunning = true
        isPaused = false
        showCompletion = false
        sessionStartTime = Date()
        pausedTime = 0

        startTimer()

        // Haptic feedback
        haptic.sessionStart()

        // Notify iPhone
        connectivity.sendSessionStarted(duration: duration)
    }

    func pauseSession() {
        guard isRunning, !isPaused else { return }

        isPaused = true
        stopTimer()

        // Calculate paused time
        if let start = sessionStartTime {
            pausedTime += Date().timeIntervalSince(start)
        }

        // Haptic feedback
        haptic.sessionPause()

        // Notify iPhone
        connectivity.sendSessionPaused(remainingSeconds: remainingSeconds)
    }

    func resumeSession() {
        guard isRunning, isPaused else { return }

        isPaused = false
        sessionStartTime = Date()
        startTimer()

        // Haptic feedback
        haptic.sessionResume()

        // Notify iPhone
        connectivity.sendSessionResumed(remainingSeconds: remainingSeconds)
    }

    func stopSession() {
        isRunning = false
        isPaused = false
        remainingSeconds = 0
        totalSeconds = 0
        stopTimer()

        // Haptic feedback
        haptic.sessionStop()
    }

    func extendSession(by seconds: Int) {
        totalSeconds += seconds
        remainingSeconds += seconds

        // Haptic feedback
        haptic.tap()
    }

    func dismissCompletion() {
        showCompletion = false
        completedDuration = 0
    }

    // MARK: - Timer Logic

    private func startTimer() {
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            self?.tick()
        }
    }

    private func stopTimer() {
        timer?.invalidate()
        timer = nil
    }

    private func tick() {
        guard isRunning, !isPaused else { return }

        if remainingSeconds > 0 {
            remainingSeconds -= 1

            // Haptic at each minute mark
            if remainingSeconds > 0 && remainingSeconds % 60 == 0 {
                haptic.minuteMark()
            }

            // Warning haptic at 10 seconds
            if remainingSeconds == 10 {
                haptic.warningAlert()
            }
        } else {
            completeSession()
        }
    }

    private func completeSession() {
        stopTimer()

        let completedSeconds = totalSeconds
        completedDuration = completedSeconds

        isRunning = false

        // Success haptic
        haptic.sessionComplete()

        // Save to HealthKit
        if let startTime = sessionStartTime {
            let actualDuration = completedSeconds - Int(pausedTime)
            healthKit.saveMindfulSession(duration: actualDuration) { success, error in
                if success {
                    print("Session saved to HealthKit")
                }
            }
        }

        // Notify iPhone
        connectivity.sendSessionCompleted(duration: completedSeconds)

        // Show completion screen
        showCompletion = true
    }
}
