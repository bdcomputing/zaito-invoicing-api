/* eslint-disable prefer-const */
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { SequenceInterface } from 'src/database/interfaces/sequence.interface';
import { SequenceService } from 'src/database/services/sequence.service';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { addLeadingZeros } from 'src/shared/helpers';
import { PatientInterface } from '../interfaces/patient.interface';

@Injectable()
export class PatientsAutomationService {
  /**
   * Creates an instance of PatientsAutomationService.
   * @param {Model<PatientInterface>} patient
   * @param {SequenceService} sequenceService
   * @param {EventEmitter2} eventEmitter
   * @memberof PatientsAutomationService
   */
  constructor(
    @Inject(DatabaseModelEnums.PATIENT_MODEL)
    private patients: Model<PatientInterface>,
    private readonly sequenceService: SequenceService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Add UniqueId to the patient based on the current number
   *
   * @param {PatientInterface} patient
   * @return {*}
   * @memberof PatientsAutomationService
   */
  @OnEvent(SystemEventsEnum.PatientCreated, { async: true })
  @OnEvent(SystemEventsEnum.PatientUpdated, { async: true })
  async addUniqueIdNumberToPatient(patient: PatientInterface) {
    let updatedPatient: PatientInterface = patient;
    if (!patient.uniqueId) {
      const sequence: SequenceInterface =
        await this.sequenceService.getSequence();
      const uniqueId = +sequence.patients || 0 + 1;

      const filter = { _id: patient._id.toString() };

      const date: Date = new Date();
      const prefix = Math.floor(100000 + Math.random() * 900000);
      const serial = `CN${prefix}-${date.getDate()}${date.getSeconds()}${date.getMilliseconds()}-${uniqueId}`;

      // Prepare payload
      const payload: any = {
        uniqueId,
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
}
