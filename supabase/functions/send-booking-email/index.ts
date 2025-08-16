import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  booking_date: string;
  booking_time: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bookingData: BookingEmailRequest = await req.json();
    console.log("Received booking request:", bookingData);

    // Format the booking details for the emails
    const formattedDate = new Date(bookingData.booking_date).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedTime = bookingData.booking_time;

    // Send confirmation email to the client
    const clientEmailResponse = await resend.emails.send({
      from: "James Chattock <james@resend.dev>",
      to: [bookingData.email],
      subject: "Consultation Booking Confirmed",
      html: `
        <h1>Thank you for booking a consultation, ${bookingData.name}!</h1>
        <p>Your consultation has been scheduled for:</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Booking Details</h3>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p><strong>Duration:</strong> 30 minutes</p>
        </div>
        ${bookingData.company ? `<p><strong>Company:</strong> ${bookingData.company}</p>` : ''}
        ${bookingData.phone ? `<p><strong>Phone:</strong> ${bookingData.phone}</p>` : ''}
        ${bookingData.message ? `<p><strong>Message:</strong> ${bookingData.message}</p>` : ''}
        <p>I'll be in touch shortly with meeting details.</p>
        <p>Best regards,<br>James Chattock<br>Data Scientist & Web Developer</p>
      `,
    });

    console.log("Client email sent:", clientEmailResponse);

    // Send notification email to James
    const jamesEmailResponse = await resend.emails.send({
      from: "Booking System <bookings@resend.dev>",
      to: ["james.chattock@gmail.com"],
      subject: `New Consultation Booking - ${bookingData.name}`,
      html: `
        <h1>New Consultation Booking</h1>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Client Details</h3>
          <p><strong>Name:</strong> ${bookingData.name}</p>
          <p><strong>Email:</strong> ${bookingData.email}</p>
          ${bookingData.phone ? `<p><strong>Phone:</strong> ${bookingData.phone}</p>` : ''}
          ${bookingData.company ? `<p><strong>Company:</strong> ${bookingData.company}</p>` : ''}
        </div>
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Booking Details</h3>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p><strong>Duration:</strong> 30 minutes</p>
        </div>
        ${bookingData.message ? `
        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Client Message</h3>
          <p>${bookingData.message}</p>
        </div>
        ` : ''}
        <p>Please reach out to the client to confirm the meeting details.</p>
      `,
    });

    console.log("James email sent:", jamesEmailResponse);

    return new Response(JSON.stringify({ 
      success: true,
      clientEmail: clientEmailResponse,
      jamesEmail: jamesEmailResponse
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);