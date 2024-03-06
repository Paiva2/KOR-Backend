import type {
  IParticipantProcess,
  IParticipantProcessModel,
  IParticipantProcessSave,
} from "../../@types/participant_process";
import pool from "../../lib/pg";
import ParticipantProcessRepository from "../../repositories/participantProcessRepository";

export default class ParticipantProcessModel
  implements ParticipantProcessRepository
{
  public async save(
    dto: IParticipantProcessSave
  ): Promise<IParticipantProcess> {
    const { rows } = await pool.query(
      `
      INSERT INTO tb_process_participants
      (process_id, participant_id)
      VALUES ($1, $2)
      RETURNING *
    `,
      [dto.processId, dto.participantId]
    );

    return this.formatParticipantProcessSchema(rows[0]);
  }

  public async findParticipant(dto: {
    participantId: string;
    processId: string;
  }): Promise<IParticipantProcess | null> {
    const { rows } = await pool.query(
      `
      SELECT * FROM tb_process_participants
      WHERE process_id = $1 AND participant_id = $2
    `,
      [dto.processId, dto.participantId]
    );

    if (!rows.length) return null;

    return this.formatParticipantProcessSchema(rows[0]);
  }

  private formatParticipantProcessSchema(
    dto: IParticipantProcessModel
  ): IParticipantProcess {
    return {
      id: dto.id,
      participantId: dto.participant_id,
      processId: dto.participant_id,
      createdAt: dto.created_at,
      deletedAt: dto.deleted_at,
      updatedAt: dto.updated_at,
    };
  }
}
