import { IParticipantProcessModel } from "../../@types/participant_process";
import { IProcessSave, IProcess, IProcessModel } from "../../@types/process";
import pool from "../../lib/pg";
import ProcessRepository from "../../repositories/processRepository";

export default class ProcessModel implements ProcessRepository {
  public async save(clientId: string, dto: IProcessSave): Promise<IProcess> {
    const { rows } = await pool.query(
      `
        INSERT INTO tb_process (
          number,
          cause_value,
          type,
          quote_date,
          audience_date,
          forum,
          city,
          state,
          client_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `,
      [
        dto.number,
        dto.causeValue,
        dto.type,
        dto.quoteDate,
        dto.audienceDate,
        dto.forum,
        dto.city,
        dto.state,
        clientId,
      ]
    );

    return this.formatProcessSchema(rows[0]);
  }

  public async findByNumber(dto: string): Promise<IProcess | null> {
    const { rows } = await pool.query(
      "SELECT * FROM tb_process WHERE number = $1",
      [dto]
    );

    if (!rows.length) return null;

    return this.formatProcessSchema(rows[0]);
  }

  public async findById(dto: string): Promise<IProcess | null> {
    const { rows: process } = await pool.query(
      "SELECT * FROM tb_process WHERE id = $1",
      [dto]
    );

    const { rows: processParticipants } = await pool.query(
      `
      SELECT pp.*,
        pt.id as participant_id,
        pt.full_name as participant_full_name,
        pt.email as participant_email,
        pt.phone as participant_phone,
        pt."document" as participant_document,
        pt."type" as participant_type,
        pt.created_at as participant_created_at,
        pt.updated_at as participant_updated_at,
        pt.deleted_at as participant_deleted_at
      FROM tb_process_participants pp INNER JOIN tb_participants pt
      ON pp.participant_id = pt.id
      WHERE pp.process_id = $1
    `,
      [dto]
    );

    if (!process.length) return null;

    return this.formatProcessSchema({
      ...process[0],
      participantProcess: processParticipants,
    });
  }

  private formatParticipantProcessSchema(pp: IParticipantProcessModel) {
    return {
      id: pp.id,
      processId: pp.process_id,
      participantId: pp.participant_id,
      createdAt: pp.created_at,
      updatedAt: pp.updated_at,
      deletedAt: pp.deleted_at,
      participant: {
        id: pp.participant_id,
        name: pp.participant_full_name,
        email: pp.participant_email,
        document: pp.participant_document,
        phone: pp.participant_phone,
        type: pp.participant_type,
        createdAt: pp.participant_created_at,
        updatedAt: pp.participant_updated_at,
        deletedAt: pp.participant_deleted_at,
      },
    };
  }

  private formatProcessSchema(dto: IProcessModel): IProcess {
    return {
      id: dto.id,
      audienceDate: dto.audience_date,
      causeValue: dto.cause_value,
      city: dto.city,
      clientId: dto.client_id,
      forum: dto.forum,
      number: dto.number,
      quoteDate: dto.quote_date,
      state: dto.state,
      type: dto.type,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      deletedAt: dto.deleted_at!,
      participantProcess: dto.participantProcess?.map((pp) => {
        return this.formatParticipantProcessSchema(pp);
      }),
    };
  }
}
