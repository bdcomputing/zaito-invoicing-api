import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { SequenceInterface } from 'src/database/interfaces/sequence.interface';
import { CustomHttpResponse } from 'src/shared';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';

@Injectable()
export class SequenceService {
  /**
   * Constructor for SequenceService.
   *
   * @param sequence - Injected sequence model.
   */
  constructor(
    @Inject(DatabaseModelEnums.SEQUENCE_MODEL)
    private sequence: Model<SequenceInterface>,
  ) {
    //
  }

  /**
   * Finds a sequence by ID.
   *
   * @param id - The ID of the sequence to find.
   * @returns A promise resolving to the sequence with the given ID.
   */
  async findById(id: string): Promise<SequenceInterface> {
    return await this.sequence.findById(id);
  }

  /**
   * Handles the SyncSuperUserAccount event.
   * Checks if there are any existing sequences, and creates a new one if none exist.
   * The new sequence is created with an empty payload.
   * Returns a promise containing the created SequenceInterface.
   */
  @OnEvent(SystemEventsEnum.SyncSuperUserAccount, { async: true })
  async create(): Promise<SequenceInterface> {
    const sequences: SequenceInterface[] = await this.sequence.find().exec();
    if (sequences.length === 0) {
      const payload: any = {};
      return await this.sequence.create(payload);
    }
  }

  /**
   * Updates a sequence by ID with the provided payload.
   *
   * @param data - Object containing the ID and payload to update
   * @returns A promise resolving to the updated sequence or an error response
   */
  @OnEvent(SystemEventsEnum.UpdateSequence, { async: true })
  async update(data: { id: string; payload: any }): Promise<any> {
    try {
      const { id, payload } = data;
      const filter = { _id: id };

      const res = await this.sequence.findOneAndUpdate(filter, payload, {
        returnOriginal: false,
      });
      return new CustomHttpResponse(
        HttpStatusCodeEnum.CREATED,
        'Sequence updated successfully!',
        res,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }

  /**
   * Retrieves the first sequence from the database, or creates a new one if none exist.
   *
   * @returns Promise resolving to the first sequence document or an error
   */
  async getSequence() {
    try {
      const sequences: SequenceInterface[] = await this.sequence.find().exec();
      let sequence: SequenceInterface;
      if (!sequences.length) {
        sequence = await this.create();
      } else {
        sequence = sequences[0];
      }
      return sequence;
    } catch (error) {
      return error;
    }
  }
}
