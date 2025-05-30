import * as lib_abort from "./lib_abort.js"

export default {}

export class Duration {
  hrtime_start?: bigint
  hrtime_stop?: bigint

  start(): void {
    this.hrtime_start = process.hrtime.bigint()
  }

  stop(): void {
    this.hrtime_stop = process.hrtime.bigint()
  }

  nanoseconds(): number {
    if (this.hrtime_start === undefined || this.hrtime_stop === undefined) {
      lib_abort.abort_with_error("Duration uninitialized")
    }

    return Number(this.hrtime_stop - this.hrtime_start)
  }

  seconds_complete(): number {
    return this.nanoseconds() / 1_000_000_000
  }

  milliseconds_complete(): number {
    return this.nanoseconds() / 1_000_000
  }

  seconds_rounded(): number {
    return Math.round(this.seconds_complete())
  }

  milliseconds_rounded(): number {
    return Math.round(this.milliseconds_complete())
  }
}
