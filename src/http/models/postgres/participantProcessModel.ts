import { IParticipant, IParticipantModel } from "../../@types/participant";
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

  async findAllProcessParticipants(dto: {
    processId: string;
    page: number;
    perPage: number;
  }): Promise<{
    page: number;
    perPage: number;
    participantsProcess: IParticipantProcess[];
  }> {
    const { rows } = await pool.query(
      `
      SELECT 
        pp.*,
        pt.id as participant_id,
        pt.full_name as participant_full_name,
        pt.email as participant_email,        
        pt.phone as participant_phone,
        pt."document" as participant_document,
        pt."type" as participant_type,
        pt.created_at as participant_created_at,
        pt.updated_at as participant_updated_at,
        pt.deleted_at as participant_deleted_at
        FROM tb_process_participants pp
      INNER JOIN tb_participants pt ON pp.participant_id = pt.id
      WHERE pp.process_id = $1
      ORDER BY created_at DESC
      LIMIT $3 OFFSET ($2 - 1) * $3
    `,
      [dto.processId, +dto.page, +dto.perPage]
    );

    return {
      page: dto.page,
      perPage: dto.perPage,
      participantsProcess: rows.map((pp) => {
        return this.formatParticipantProcessSchemaWithParticipant(pp);
      }),
    };
  }

  private formatParticipantProcessSchemaWithParticipant(
    dto: IParticipantProcessModel
  ): IParticipantProcess {
    return {
      id: dto.id,
      participantId: dto.participant_id,
      processId: dto.process_id,
      createdAt: dto.created_at,
      deletedAt: dto.deleted_at,
      updatedAt: dto.updated_at,
      participant: {
        id: dto.participant_id,
        document: dto.participant_document,
        email: dto.participant_email,
        name: dto.participant_full_name,
        phone: dto.participant_phone,
        type: dto.participant_type,
        createdAt: dto.participant_created_at,
        updatedAt: dto.participant_updated_at,
        deletedAt: dto.participant_deleted_at,
      },
    };
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
