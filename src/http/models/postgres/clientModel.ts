import { IClientSave, IClient, IClientModel } from "../../@types/client";
import ClientRepository from "../../repositories/clientRepository";
import pool from "../../lib/pg";

export default class ClientModel implements ClientRepository {
  public async save(dto: IClientSave): Promise<IClient> {
    const { rows } = await pool.query(
      `
    INSERT INTO tb_clients (full_name, cnpj)
    VALUES ($1, $2)
    RETURNING *
    `,
      [dto.name, dto.cnpj]
    );

    return this.formatUserModel(rows[0]);
  }

  public async findByCnpj(dto: string): Promise<IClient | null> {
    const { rows } = await pool.query(
      "SELECT * FROM tb_clients WHERE cnpj = $1",
      [dto]
    );

    if (!rows.length) return null;

    return this.formatUserModel(rows[0]);
  }

  public async findById(dto: string): Promise<IClient | null> {
    const { rows } = await pool.query(
      "SELECT * FROM tb_clients WHERE id = $1",
      [dto]
    );

    if (!rows.length) return null;

    return this.formatUserModel(rows[0]);
  }

  private formatUserModel(dto: IClientModel): IClient {
    return {
      id: dto.id,
      fullName: dto.full_name,
      cnpj: dto.cnpj,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      deletedAt: dto.deleted_at,
    };
  }
}
