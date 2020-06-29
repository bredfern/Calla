﻿import { clamp, project } from "../math.js";
import { Destination } from "./Destination.js";
import { BasePosition } from "./BasePosition.js";

/** Base class providing functionality for spatializers. */
export class BaseSpatializer extends EventTarget {

    /**
     * Creates a spatializer that keeps track of the relative position
     * of an audio element to the listener destination.
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {BasePosition} position
     */
    constructor(userID, destination, audio, position) {
        super();

        this.id = userID;
        this.destination = destination;
        this.audio = audio;
        this.position = position;
        this.volume = 1;
        this.pan = 0;
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        this.audio.pause();

        this.position = null;
        this.audio = null;
        this.destination = null;
        this.id = null;
    }

    /**
     * Run the position interpolation
     */
    update() {
        this.position.update(this.destination.audioContext.currentTime);

        const lx = this.destination.position.x,
            ly = this.destination.position.y,
            distX = this.position.x - lx,
            distY = this.position.y - ly,
            dist = Math.sqrt(distX * distX + distY * distY);

        this.volume = 1 - clamp(project(dist, this.destination.minDistance, this.destination.maxDistance), 0, 1);
        this.pan = dist > 0
            ? distX / dist
            : 0;
    }

    /**
     * Set the target position
     * @param {Point} evt
     */
    setTarget(evt) {
        this.position.setTarget(evt, this.destination.audioContext.currentTime, this.destination.transitionTime);
    }
}