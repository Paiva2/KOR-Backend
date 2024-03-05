export interface IClientSave {
  name: string;
  cnpj: string;
}

export interface IClient {
  id: string;
  fullName: string;
  cnpj: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface IClientModel {
  id: string;
  full_name: string;
  cnpj: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
