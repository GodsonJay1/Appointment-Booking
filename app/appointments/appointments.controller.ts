import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  @Post()
  async create(@Body() body: CreateAppointmentDto) {
    const appointment = await this.service.createAppointment({
      ...body,
      appointmentDateTime: new Date(body.appointmentDateTime),
    });

    return {
      message: 'Appointment created successfully',
      data: appointment,
    };
  }

  @Get()
  async findAll() {
    const appointments = await this.service.findAll();
    return { data: appointments };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const appointment = await this.service.findById(id);
    return { data: appointment };
  }
}
