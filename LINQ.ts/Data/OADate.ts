namespace OADate {

    const defaultOffset = new Date().getTimezoneOffset()

    // code below extracted from https://github.com/markitondemand/moment-msdate
    const MINUTE_MILLISECONDS = 60 * 1000
    const DAY_MILLISECONDS = 86400000
    const MS_DAY_OFFSET = 25569

    const oaDateToTicks = function (oaDate: number) {
        var ticks = (oaDate - MS_DAY_OFFSET) * DAY_MILLISECONDS
        if (oaDate < 0) {
            const frac = (oaDate - Math.trunc(oaDate)) * DAY_MILLISECONDS
            if (frac !== 0) {
                ticks -= frac * 2
            }
        }
        return ticks
    }

    const ticksToOADate = function (ticks: number) {
        var oad = ticks / DAY_MILLISECONDS + MS_DAY_OFFSET
        if (oad < 0) {
            const frac = oad - Math.trunc(oad)
            if (frac !== 0) {
                oad = Math.ceil(oad) - frac - 2
            }
        }
        return oad
    }

    export function DateToOADate(value, offset = defaultOffset) {
        return ticksToOADate(value.valueOf() - offset * MINUTE_MILLISECONDS)
    }

    export function OADateToDate(value: number, offset = defaultOffset) {
        const ticks = oaDateToTicks(value)
        return new Date(ticks + offset * MINUTE_MILLISECONDS)
    }

    export class TDateTime extends Date {
        constructor(...args) {
            if (args.length === 1 && typeof args[0] === 'number') {
                super(OADate.OADateToDate(args[0]))
            } else {
                super(...args)
            }
        }

        toJSON() {
            return this.prepareOADate(DateToOADate(this))
        }

        prepareOADate(value: number) {
            return value
        }
    }

    export class TDate extends TDateTime {
        prepareOADate(value: number) {
            return Math.trunc(value)
        }
    }

    export class TTime extends TDateTime {
        prepareOADate(value: number) {
            return Math.abs(value % 1)
        }
    }
}