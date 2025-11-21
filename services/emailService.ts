import { Booking } from "../types";
import { ADMIN_EMAILS } from "../constants";

export const sendBookingEmail = async (booking: Booking): Promise<boolean> => {
  // In a client-side only app, we cannot send real emails securely without a backend.
  // We simulate the API call here.
  
  const emailBody = `
    NEW RIDE BOOKING ALERT - JAMHURI TRANSFERS
    ------------------------------------------
    Booking ID: ${booking.id}
    Type: ${booking.type}
    Status: ${booking.status}
    
    CLIENT DETAILS:
    Name: ${booking.userName}
    Phone: ${booking.userPhone}
    
    TRIP DETAILS:
    Pickup: ${booking.pickup.address}
    Dropoff: ${booking.dropoff.address}
    Scheduled Time: ${booking.scheduledTime || 'ASAP'}
    
    ESTIMATES:
    Distance: ${booking.estimate.distanceKm} km
    Duration: ${booking.estimate.durationMin} mins
    Estimated Fare: KES ${booking.estimate.fare}
    
    Notes: ${booking.notes || 'None'}
  `;

  console.group("📧 SIMULATING EMAIL SENDING...");
  console.log(`To: ${ADMIN_EMAILS.join(', ')}`);
  console.log("Subject: New Booking Alert - Jamhuri Transfers");
  console.log(emailBody);
  console.groupEnd();

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1500); // Simulate network delay
  });
};