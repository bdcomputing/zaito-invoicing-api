/* eslint-disable prefer-const */
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { Sequence } from 'src/database/interfaces/sequence.interface';
import { SequenceService } from 'src/database/services/sequence.service';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { addLeadingZeros } from 'src/shared/helpers';
import { Patient } from '../interfaces/patient.interface';

@Injectable()
export class PatientsAutomationService {
  /**
   * Creates an instance of PatientsAutomationService.
   * @param {Model<Patient>} patient
   * @param {SequenceService} sequenceService
   * @param {EventEmitter2} eventEmitter
   * @memberof PatientsAutomationService
   */
  constructor(
    @Inject(DatabaseModelEnums.PATIENT_MODEL)
    private patients: Model<Patient>,
    private readonly sequenceService: SequenceService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Add UniqueId to the patient based on the current number
   *
   * @param {Patient} patient
   * @return {*}
   * @memberof PatientsAutomationService
   */
  @OnEvent(SystemEventsEnum.PatientCreated, { async: true })
  @OnEvent(SystemEventsEnum.PatientUpdated, { async: true })
  async addUniqueIdNumberToPatient(patient: Patient) {
    let updatedPatient: Patient = patient;
    if (!patient.uniqueId) {
      const sequence: Sequence = await this.sequenceService.getSequence();
      const uniqueId = +sequence.patients || 0 + 1;

      const filter = { _id: patient._id.toString() };

      const date: Date = new Date();
      const prefix = Math.floor(100000 + Math.random() * 900000);
      const serial = `CN${prefix}-${date.getDate()}${date.getSeconds()}${date.getMilliseconds()}-${uniqueId}`;

      const age: number = this.calculatePatientAge(patient.dateOfBirth);

      // Prepare payload
      const payload: any = {
        uniqueId,
        age,
        accountNumber: addLeadingZeros(uniqueId, 10),
        serial,
      };

      // Emit the emit to update sequence
      this.eventEmitter.emit(SystemEventsEnum.UpdateSequence, {
        id: sequence._id,
        payload: { patients: uniqueId },
      });

      const update = await this.patients.findOneAndUpdate(filter, payload, {
        returnOriginal: false,
      });

      updatedPatient = { ...update };
    }

    return updatedPatient;
  }

  calculatePatientAge(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}
