/**
 * HealthKitManager
 *
 * Integracja z Apple HealthKit dla zapisywania sesji mindfulness.
 * Zapisuje czas medytacji jako Mindful Minutes.
 */

import Foundation
import HealthKit

final class HealthKitManager: ObservableObject {
    static let shared = HealthKitManager()

    private let healthStore = HKHealthStore()
    @Published var isAuthorized: Bool = false

    // Typy danych do odczytu/zapisu
    private let mindfulType = HKObjectType.categoryType(forIdentifier: .mindfulSession)!

    private init() {
        checkAuthorization()
    }

    // MARK: - Authorization

    func requestAuthorization() {
        guard HKHealthStore.isHealthDataAvailable() else {
            print("HealthKit not available on this device")
            return
        }

        let typesToWrite: Set<HKSampleType> = [mindfulType]
        let typesToRead: Set<HKObjectType> = [mindfulType]

        healthStore.requestAuthorization(toShare: typesToWrite, read: typesToRead) { success, error in
            DispatchQueue.main.async {
                self.isAuthorized = success
            }

            if let error = error {
                print("HealthKit authorization failed: \(error.localizedDescription)")
            }
        }
    }

    private func checkAuthorization() {
        let status = healthStore.authorizationStatus(for: mindfulType)
        isAuthorized = status == .sharingAuthorized
    }

    // MARK: - Save Session

    /// Zapisuje sesje medytacji do HealthKit jako Mindful Session
    func saveMindfulSession(startDate: Date, endDate: Date, completion: ((Bool, Error?) -> Void)? = nil) {
        guard isAuthorized else {
            completion?(false, NSError(domain: "HealthKit", code: 1, userInfo: [NSLocalizedDescriptionKey: "Not authorized"]))
            return
        }

        let mindfulSample = HKCategorySample(
            type: mindfulType,
            value: HKCategoryValue.notApplicable.rawValue,
            start: startDate,
            end: endDate
        )

        healthStore.save(mindfulSample) { success, error in
            DispatchQueue.main.async {
                completion?(success, error)
            }

            if success {
                print("Mindful session saved to HealthKit: \(startDate) - \(endDate)")
            } else if let error = error {
                print("Failed to save mindful session: \(error.localizedDescription)")
            }
        }
    }

    /// Zapisuje sesje na podstawie czasu trwania
    func saveMindfulSession(duration: Int, endDate: Date = Date(), completion: ((Bool, Error?) -> Void)? = nil) {
        let startDate = endDate.addingTimeInterval(-Double(duration))
        saveMindfulSession(startDate: startDate, endDate: endDate, completion: completion)
    }

    // MARK: - Query Sessions

    /// Pobiera sesje mindfulness z ostatnich dni
    func fetchRecentSessions(days: Int = 7, completion: @escaping ([HKCategorySample]) -> Void) {
        let calendar = Calendar.current
        let now = Date()
        let startDate = calendar.date(byAdding: .day, value: -days, to: now)!

        let predicate = HKQuery.predicateForSamples(
            withStart: startDate,
            end: now,
            options: .strictStartDate
        )

        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)

        let query = HKSampleQuery(
            sampleType: mindfulType,
            predicate: predicate,
            limit: HKObjectQueryNoLimit,
            sortDescriptors: [sortDescriptor]
        ) { _, samples, error in
            DispatchQueue.main.async {
                if let samples = samples as? [HKCategorySample] {
                    completion(samples)
                } else {
                    completion([])
                }
            }
        }

        healthStore.execute(query)
    }

    /// Oblicza laczny czas medytacji z ostatnich dni
    func fetchTotalMindfulMinutes(days: Int = 7, completion: @escaping (Int) -> Void) {
        fetchRecentSessions(days: days) { samples in
            let totalSeconds = samples.reduce(0) { result, sample in
                result + Int(sample.endDate.timeIntervalSince(sample.startDate))
            }
            let totalMinutes = totalSeconds / 60
            completion(totalMinutes)
        }
    }
}
