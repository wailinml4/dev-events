/**
 * Centralized export for all Mongoose models.
 * Prevents circular dependencies and provides a single import point.
 */

export { Event } from './event.model';
export type { IEvent } from './event.model';
export { Booking } from './booking.model';
export type { IBooking } from './booking.model';
