import Foundation

// Both reminder types share the same iOS pending-notification limit. Keep their
// read/remove/add sequences on one queue, including foreground replenishment.
final class JakobReminderScheduleQueue {
    static let shared = JakobReminderScheduleQueue()
    private var jobs: [(@escaping () -> Void) -> Void] = []
    private var busy = false

    func enqueue(_ job: @escaping (@escaping () -> Void) -> Void) {
        jobs.append(job)
        runNext()
    }

    private func runNext() {
        guard !busy, !jobs.isEmpty else { return }
        busy = true
        let job = jobs.removeFirst()
        job { self.busy = false; self.runNext() }
    }
}
