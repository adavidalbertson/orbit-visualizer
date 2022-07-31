import { EARTH_RADIUS } from "../constants"
import { degreesToRadians } from "./utils"

export class ApsisArguments {
    constructor(
        public apoapsis: number,
        public periapsis: number,
        public inclination: number,
        public ascendingNode: number,
        public argPeriapsis: number,
        public trueAnomaly: number
    ) { }
}

export class Orbit {
    private constructor(
        public eccentricity: number,
        public semimajorAxis: number,
        public apoapsis: number,
        public periapsis: number,
        public inclination: number,
        public ascendingNode: number,
        public argPeriapsis: number,
        public trueAnomaly: number
    ) { }

    static fromKepler(eccentricity: number, semimajorAxis: number, inclination: number, ascendingNode: number, argPeriapsis: number, trueAnomaly: number): Orbit {
        return new Orbit(
            eccentricity,
            semimajorAxis,
            (1 + eccentricity) * semimajorAxis,
            (1 - eccentricity) * semimajorAxis,
            degreesToRadians(inclination),
            degreesToRadians(ascendingNode),
            degreesToRadians(argPeriapsis),
            degreesToRadians(trueAnomaly)
        )
    }

    static fromApsides(apoapsis: number, periapsis: number, inclination: number, ascendingNode: number, argPeriapsis: number, trueAnomaly: number): Orbit {
        if (periapsis > apoapsis) {
            [apoapsis, periapsis] = [periapsis, apoapsis]
            argPeriapsis = argPeriapsis + 180
        }

        const adjustedApoapsis = EARTH_RADIUS + apoapsis
        const adjustedPeriapsis = EARTH_RADIUS + periapsis

        return new Orbit(
            (adjustedApoapsis - adjustedPeriapsis) / (adjustedApoapsis + adjustedPeriapsis),
            (adjustedApoapsis + adjustedPeriapsis) / 2,
            adjustedApoapsis,
            adjustedPeriapsis,
            degreesToRadians(inclination),
            degreesToRadians(ascendingNode),
            degreesToRadians(argPeriapsis),
            degreesToRadians(trueAnomaly)
        )
    }

    static fromApsisArguments(args: ApsisArguments) {
        return Orbit.fromApsides(
            args.apoapsis,
            args.periapsis,
            args.inclination,
            args.ascendingNode,
            args.argPeriapsis,
            args.trueAnomaly
        )
    }
}