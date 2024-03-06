import { IParticipantProcessModel } from "../../@types/participant_process";
import {
  IProcessSave,
  IProcess,
  IProcessModel,
  IProcessUpdate,
  IProcessClientAndParticipantModel,
  IProcessClientAndParticipant,
} from "../../@types/process";
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

    return this.formatProcessSchemaSingle(rows[0]);
  }

  public async findByNumber(dto: string): Promise<IProcess | null> {
    const { rows } = await pool.query(
      "SELECT * FROM tb_process WHERE number = $1",
      [dto]
    );

    if (!rows.length) return null;

    return this.formatProcessSchemaComplete(rows[0]);
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

    return this.formatProcessSchemaComplete({
      ...process[0],
      participantProcess: processParticipants,
    });
  }

  async updateProcess(
    processId: string,
    dto: IProcessUpdate
  ): Promise<IProcess> {
    const modelFields = {
      cause_value: dto.causeValue,
      type: dto.type,
      quote_date: dto.quoteDate,
      audience_date: dto.audienceDate,
      forum: dto.forum,
      city: dto.city,
      state: dto.state,
    };

    const setStatement: string[] = [];

    const values: any[] = [];

    const fieldsToUpdate = Object.keys(modelFields).filter(
      (val) => modelFields[val as keyof typeof modelFields] !== undefined
    );

    fieldsToUpdate.forEach((field, idx) => {
      setStatement.push(`${field} = $${idx + 1}`);

      values.push(modelFields[field as keyof typeof modelFields]);
    });

    const { rows } = await pool.query(
      `
      UPDATE tb_process
      SET ${setStatement.join(", ")},
      updated_at = now()
      WHERE id = $${values.length + 1}
      RETURNING *;
    `,
      [...values, processId]
    );

    return this.formatProcessSchemaSingle(rows[0]);
  }

  async delete(dto: string): Promise<IProcess> {
    const { rows } = await pool.query(
      `
      UPDATE tb_process
      SET deleted_at = now(),
      updated_at = now()
      WHERE id = $1
      RETURNING *;
    `,
      [dto]
    );

    return this.formatProcessSchemaSingle(rows[0]);
  }

  private async filterAllByClientAndParticipant(
    clientId: string,
    participantId: string,
    page: number,
    perPage: number
  ): Promise<IProcessClientAndParticipantModel[]> {
    const { rows } = await pool.query(
      `
      SELECT 
      pcs.*,
      cc.id as client_id,
      cc.full_name as client_name,
      cc.cnpj as client_cnpj,
      cc.created_at as client_created_at,
      cc.updated_at as client_updated_at,
      cc.deleted_at as client_deleted_at,
      pt.id as participant_id,
      pt.full_name as participant_full_name,
      pt.email as participant_email,        
      pt.phone as participant_phone,
      pt."document" as participant_document,
      pt."type" as participant_type,
      pt.created_at as participant_created_at,
      pt.updated_at as participant_updated_at,
      pt.deleted_at as participant_deleted_at
    FROM tb_process pcs
    INNER JOIN tb_clients cc ON cc.id = pcs.client_id
    INNER JOIN tb_process_participants pp ON pp.process_id = pcs.id 
    INNER JOIN tb_participants pt ON pt.id = pp.participant_id
    WHERE pcs.client_id = $1 AND pp.participant_id = $2
    ORDER BY created_at DESC
    LIMIT $3 OFFSET ($4 - 1) * $3
`,
      [clientId, participantId, perPage, page]
    );

    return rows;
  }

  private async filterAllByParticipantId(
    participantId: string,
    page: number,
    perPage: number
  ) {
    const { rows } = await pool.query(
      `
      SELECT 
      pcs.*,
      cc.id as client_id,
      cc.full_name as client_name,
      cc.cnpj as client_cnpj,
      cc.created_at as client_created_at,
      cc.updated_at as client_updated_at,
      cc.deleted_at as client_deleted_at,
      pt.id as participant_id,
      pt.full_name as participant_full_name,
      pt.email as participant_email,        
      pt.phone as participant_phone,
      pt."document" as participant_document,
      pt."type" as participant_type,
      pt.created_at as participant_created_at,
      pt.updated_at as participant_updated_at,
      pt.deleted_at as participant_deleted_at
    FROM tb_process pcs
    INNER JOIN tb_clients cc ON cc.id = pcs.client_id
    INNER JOIN tb_process_participants pp ON pp.process_id = pcs.id 
    INNER JOIN tb_participants pt ON pt.id = pp.participant_id
    WHERE pp.participant_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET ($3 - 1) * $2
  `,
      [participantId, perPage, page]
    );

    return rows;
  }

  private async filterAllByClientId(
    clientId: string,
    page: number,
    perPage: number
  ) {
    const { rows } = await pool.query(
      `
      SELECT 
      pcs.*,
      cc.id as client_id,
      cc.full_name as client_name,
      cc.cnpj as client_cnpj,
      cc.created_at as client_created_at,
      cc.updated_at as client_updated_at,
      cc.deleted_at as client_deleted_at,
      pt.id as participant_id,
      pt.full_name as participant_full_name,
      pt.email as participant_email,        
      pt.phone as participant_phone,
      pt."document" as participant_document,
      pt."type" as participant_type,
      pt.created_at as participant_created_at,
      pt.updated_at as participant_updated_at,
      pt.deleted_at as participant_deleted_at
    FROM tb_process pcs
    INNER JOIN tb_clients cc ON cc.id = pcs.client_id
    INNER JOIN tb_process_participants pp ON pp.process_id = pcs.id 
    INNER JOIN tb_participants pt ON pt.id = pp.participant_id
    WHERE pcs.client_id = $1
    ORDER BY created_at DESC
    LIMIT $3 OFFSET ($3 - 1) * $2
  `,
      [clientId, perPage, page]
    );

    return rows;
  }

  private async filterAllProcess(page: number, perPage: number) {
    const { rows } = await pool.query(
      `
      SELECT 
      pcs.*,
      cc.id as client_id,
      cc.full_name as client_name,
      cc.cnpj as client_cnpj,
      cc.created_at as client_created_at,
      cc.updated_at as client_updated_at,
      cc.deleted_at as client_deleted_at,
      pt.id as participant_id,
      pt.full_name as participant_full_name,
      pt.email as participant_email,        
      pt.phone as participant_phone,
      pt."document" as participant_document,
      pt."type" as participant_type,
      pt.created_at as participant_created_at,
      pt.updated_at as participant_updated_at,
      pt.deleted_at as participant_deleted_at
    FROM tb_process pcs
    INNER JOIN tb_clients cc ON cc.id = pcs.client_id
    INNER JOIN tb_process_participants pp ON pp.process_id = pcs.id 
    INNER JOIN tb_participants pt ON pt.id = pp.participant_id
    ORDER BY created_at DESC
    LIMIT $1 OFFSET ($2 - 1) * $1
  `,
      [perPage, page]
    );

    return rows;
  }

  async listAll(query: {
    client?: string | undefined;
    participant?: string | undefined;
    page: string;
    perPage: string;
  }): Promise<{ page: number; perPage: number; list: IProcess[] }> {
    let list: IProcessClientAndParticipantModel[] = [];

    const page = +query.page;
    const perPage = +query.perPage;

    if (!query.client && !query.participant) {
      list = await this.filterAllProcess(page, perPage);
    }

    if (query.participant && query.client) {
      list = await this.filterAllByClientAndParticipant(
        query.client,
        query.participant,
        page,
        perPage
      );
    } else if (query.participant) {
      list = await this.filterAllByParticipantId(
        query.participant,
        page,
        perPage
      );
    } else if (query.client) {
      list = await this.filterAllByClientId(query.client, page, perPage);
    }

    return {
      page: page,
      perPage: perPage,
      list: list.map((process) => this.formatListAll(process)),
    };
  }

  private formatListAll(
    dto: IProcessClientAndParticipantModel
  ): IProcessClientAndParticipant {
    return {
      id: dto.id,
      audienceDate: dto.audience_date,
      causeValue: dto.cause_value,
      city: dto.city,
      forum: dto.forum,
      number: dto.number,
      quoteDate: dto.quote_date,
      state: dto.state,
      type: dto.type,
      clientId: dto.client_id,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      deletedAt: dto.deleted_at,
      client: {
        id: dto.client_id,
        cnpj: dto.client_cnpj,
        name: dto.client_name,
        createdAt: dto.client_created_at,
        updatedAt: dto.client_updated_at,
        deletedAt: dto.client_deleted_at,
      },
      participant: {
        id: dto.participant_id,
        document: dto.participant_document,
        email: dto.participant_email,
        name: dto.participant_full_name,
        phone: dto.participant_phone,
        type: dto.participant_type,
        createdAt: dto.participant_created_at,
        deletedAt: dto.participant_deleted_at,
        updatedAt: dto.participant_updated_at,
      },
    };
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

  private formatProcessSchemaComplete(dto: IProcessModel): IProcess {
    return {
      ...this.formatProcessSchemaSingle(dto),
      participantProcess: dto.participantProcess?.map((pp) => {
        return this.formatParticipantProcessSchema(pp);
      }),
    };
  }

  private formatProcessSchemaSingle(dto: IProcessModel): IProcess {
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
    };
  }
}
