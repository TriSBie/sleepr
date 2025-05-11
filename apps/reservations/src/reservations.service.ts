import { PAYMENTS_SERVICE, UserDto } from "@app/common";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { ReservationsRepository } from "./reservations.repository";
import { map } from "rxjs";
import { Reservation } from "./models/reservations.entity";

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy, // as ClientProxy return a
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ) {
    // Call the payments service to create a charge
    return this.paymentsService
      .send("create_charge", {
        ...createReservationDto.charge,
        email,
      })
      .pipe(
        map((res) => {
          // Create a new reservation with the charge ID and user ID
          const reservation = new Reservation({
            ...createReservationDto,
            timestamp: new Date(),
            invoiceId: res.id,
            userId,
          });

          // Save the reservation to the database
          return this.reservationRepository.create(reservation);
        }),
      );
  }

  async findAll() {
    return this.reservationRepository.find({});
  }

  async findOne(id: number) {
    return this.reservationRepository.findOne({
      id,
    });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { id },
      updateReservationDto,
    );
  }

  async remove(id: number) {
    return this.reservationRepository.findOneAndDelete({ id });
  }
}
