
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async createAppointment(data: {
    name: string;
    email: string;
    appointmentDateTime: Date;
    notes?: string;
  }) {
    // Validate input
    if (!data.name || !data.email || !data.appointmentDateTime) {
      throw new BadRequestException(
        'Name, email, and appointment date/time are required',
      );
    }

    // Create appointment in database
    const appointment = await this.prisma.appointment.create({
      data,
    });

    try {
      // Load ENV variables using ConfigService
      const clientEmail = this.config.get<string>('GOOGLE_CLIENT_EMAIL');
      const privateKey = this.config.get<string>('GOOGLE_PRIVATE_KEY');
      const calendarId = this.config.get<string>('GOOGLE_CALENDAR_ID');

      if (!clientEmail || !privateKey || !calendarId) {
        throw new Error('Google environment variables are missing');
      }

      // Google Calendar auth
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: clientEmail,
          private_key: privateKey.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });

      const calendar = google.calendar({ version: 'v3', auth });

      // Insert event into Google Calendar
      const event = await calendar.events.insert({
        calendarId,
        requestBody: {
          summary: `Appointment: ${data.name}`,
          description: data.notes || '',
          start: { dateTime: data.appointmentDateTime.toISOString() },
          end: {
            dateTime: new Date(
              data.appointmentDateTime.getTime() + 60 * 60 * 1000,
            ).toISOString(),
          },
          attendees: [{ email: data.email }],
        },
      });

      // Save the event ID to the appointment record
      return this.prisma.appointment.update({
        where: { id: appointment.id },
        data: { googleEventId: event.data.id },
      });
    } catch (error) {
      console.error('Google Calendar Error:', error);

      // Cleanup: remove record if Google Calendar failed
      await this.prisma.appointment.delete({
        where: { id: appointment.id },
      });

      throw new BadRequestException(
        'Failed to create Google Calendar event. Please try again.',
      );
    }
  }

  // Fetch all appointments
  async findAll() {
    return this.prisma.appointment.findMany({
      orderBy: { appointmentDateTime: 'asc' },
    });
  }

  // Optional: find by ID
  async findById(id: string) {
    return this.prisma.appointment.findUnique({ where: { id } });
  }
}
