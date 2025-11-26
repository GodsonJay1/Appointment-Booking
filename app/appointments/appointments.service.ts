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
    if (!data.name || !data.email || !data.appointmentDateTime) {
      throw new BadRequestException('Name, email and appointment date/time required');
    }

    const appointment = await this.prisma.appointment.create({ data });

    try {
      const calendarId = this.config.get<string>('GOOGLE_CALENDAR_ID');
      const clientEmail = this.config.get<string>('GOOGLE_CLIENT_EMAIL');
      const privateKey = this.config.get<string>('GOOGLE_PRIVATE_KEY');

      if (!clientEmail || !privateKey || !calendarId)
        throw new Error('Google Calendar credentials missing');

      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: clientEmail,
          private_key: privateKey.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });

      const calendar = google.calendar({ version: 'v3', auth });

      const event = await calendar.events.insert({
        calendarId,
        requestBody: {
          summary: `Appointment: ${data.name}`,
          description: data.notes || '',
          start: { dateTime: data.appointmentDateTime.toISOString() },
          end: {
            dateTime: new Date(
              data.appointmentDateTime.getTime() + 60 * 60 * 1000
            ).toISOString(),
          },

        },
      });

      const updated = await this.prisma.appointment.update({
        where: { id: appointment.id },
        data: { googleEventId: event.data.id },
      });

      return {
        message: 'Appointment booked successfully',
        appointment: updated,
      };
    } catch (error) {
      console.error('Google Calendar error:', error);

      await this.prisma.appointment.delete({ where: { id: appointment.id } });

      throw new BadRequestException(
        'Failed to create Google Calendar event. Please try again.'
      );
    }
  }

  async findAll() {
    return this.prisma.appointment.findMany({
      orderBy: { appointmentDateTime: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.appointment.findUnique({ where: { id } });
  }
}
