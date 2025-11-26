"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const googleapis_1 = require("googleapis");
const config_1 = require("@nestjs/config");
let AppointmentsService = class AppointmentsService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    async createAppointment(data) {
        if (!data.name || !data.email || !data.appointmentDateTime) {
            throw new common_1.BadRequestException('Name, email and appointment date/time required');
        }
        const appointment = await this.prisma.appointment.create({ data });
        try {
            const calendarId = this.config.get('GOOGLE_CALENDAR_ID');
            const clientEmail = this.config.get('GOOGLE_CLIENT_EMAIL');
            const privateKey = this.config.get('GOOGLE_PRIVATE_KEY');
            if (!clientEmail || !privateKey || !calendarId)
                throw new Error('Google Calendar credentials missing');
            const auth = new googleapis_1.google.auth.GoogleAuth({
                credentials: {
                    client_email: clientEmail,
                    private_key: privateKey.replace(/\\n/g, '\n'),
                },
                scopes: ['https://www.googleapis.com/auth/calendar'],
            });
            const calendar = googleapis_1.google.calendar({ version: 'v3', auth });
            const event = await calendar.events.insert({
                calendarId,
                requestBody: {
                    summary: `Appointment: ${data.name}`,
                    description: data.notes || '',
                    start: { dateTime: data.appointmentDateTime.toISOString() },
                    end: {
                        dateTime: new Date(data.appointmentDateTime.getTime() + 60 * 60 * 1000).toISOString(),
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
        }
        catch (error) {
            console.error('Google Calendar error:', error);
            await this.prisma.appointment.delete({ where: { id: appointment.id } });
            throw new common_1.BadRequestException('Failed to create Google Calendar event. Please try again.');
        }
    }
    async findAll() {
        return this.prisma.appointment.findMany({
            orderBy: { appointmentDateTime: 'asc' },
        });
    }
    async findById(id) {
        return this.prisma.appointment.findUnique({ where: { id } });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map