import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  // Create a new appointment
  @Post()
  async create(
    @Body() body: { name: string; email: string; appointmentDateTime: string; notes?: string },
  ) {
    return this.service.createAppointment({
      ...body,
      appointmentDateTime: new Date(body.appointmentDateTime),
    });
  }

  // Get all appointments
  @Get()
  async findAll() {
    return this.service.findAll();
  }

  // Optional: get one appointment by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }
}
