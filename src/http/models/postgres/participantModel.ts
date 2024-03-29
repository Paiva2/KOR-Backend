import {
  IParticipantSave,
  IParticipant,
  IParticipantModel,
} from "../../@types/participant";
import pool from "../../lib/pg";
import ParticipantRepository from "../../repositories/participantRepository";

export default class ParticipantModel implements ParticipantRepository {
  public async save({
    name,
    email,
    phone,
    document,
    type,
  }: IParticipantSave): Promise<IParticipant> {
    const { rows } = await pool.query(
      `
    INSERT INTO tb_participants 
    (
      full_name,
      email,
      phone,
      document,
      type
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
      [name, email, phone, document, type]
    );

    return this.formatParticipantSchema(rows[0]);
  }

  public async findByUniques({
    phone,
    document,
    email,
  }: {
    phone: string;
    document: string;
    email: string;
  }): Promise<IParticipant | null> {
    const { rows } = await pool.query(
      `SELECT * FROM tb_participants WHERE phone = $1 OR document = $2 OR email = $3`,
      [phone, document, email]
    );

    if (!rows.length) return null;

    return this.formatParticipantSchema(rows[0]);
  }

  public async findById(dto: string): Promise<IParticipant | null> {
    const { rows } = await pool.query(
      `SELECT * FROM tb_participants WHERE id = $1`,
      [dto]
    );

    if (!rows.length) return null;

    return this.formatParticipantSchema(rows[0]);
  }

  async listAllAvailable({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }): Promise<{ page: number; perPage: number; participants: IParticipant[] }> {
    const { rows } = await pool.query(
      `
      SELECT * FROM tb_participants WHERE deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT $2 OFFSET ($1 - 1) * $2
      ;    
    `,
      [page, perPage]
    );

    return {
      page,
      perPage,
      participants: rows.map((participant) =>
        this.formatParticipantSchema(participant)
      ),
    };
  }

  private formatParticipantSchema(dto: IParticipantModel): IParticipant {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      document: dto.document,
      phone: dto.phone,
      type: dto.type,
      createdAt: dto.created_at,
      deletedAt: dto.deleted_at,
      updatedAt: dto.updated_at,
    };
  }
}
