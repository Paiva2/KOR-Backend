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
      deletedAt: dto.deleted_at!,
      updatedAt: dto.updated_at,
    };
  }
}
