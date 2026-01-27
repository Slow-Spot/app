/**
 * HapticManager
 *
 * Centralne zarzadzanie haptic feedback dla Watch.
 * Zapewnia spojne wibracje podczas medytacji.
 */

import WatchKit

final class HapticManager {
    static let shared = HapticManager()

    private let device = WKInterfaceDevice.current()

    private init() {}

    // MARK: - Session Haptics

    /// Haptic na start sesji
    func sessionStart() {
        device.play(.start)
    }

    /// Haptic na pauze sesji
    func sessionPause() {
        device.play(.click)
    }

    /// Haptic na wznowienie sesji
    func sessionResume() {
        device.play(.click)
    }

    /// Haptic na koniec sesji
    func sessionComplete() {
        device.play(.success)
        // Dodatkowy haptic po chwili dla efektu celebracji
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            self.device.play(.success)
        }
    }

    /// Haptic na zatrzymanie sesji (przerwanie)
    func sessionStop() {
        device.play(.stop)
    }

    // MARK: - Breathing Haptics

    /// Haptic na wdech (w gore)
    func breatheInhale() {
        device.play(.directionUp)
    }

    /// Haptic na zatrzymanie oddechu
    func breatheHold() {
        device.play(.click)
    }

    /// Haptic na wydech (w dol)
    func breatheExhale() {
        device.play(.directionDown)
    }

    // MARK: - Timer Haptics

    /// Haptic co minute
    func minuteMark() {
        device.play(.click)
    }

    /// Haptic ostrzezenia (ostatnie 10 sekund)
    func warningAlert() {
        device.play(.notification)
    }

    // MARK: - UI Haptics

    /// Delikatny haptic na interakcje UI
    func tap() {
        device.play(.click)
    }

    /// Haptic na blad/niepowodzenie
    func error() {
        device.play(.failure)
    }

    /// Haptic na notyfikacje
    func notification() {
        device.play(.notification)
    }
}
