import { beforeEach, describe, it, expect } from "vitest";
import InMemoryClientRepository from "../../../models/in-memory/inMemoryClientRepository";
import RegisterClientService from "../registerClientService";

const randomCnpj = "33.483.364/0001-29"; // generated with https://www.4devs.com.br/gerador_de_cnpj

describe("Register client service", () => {
  let clientRepository: InMemoryClientRepository;

  let sut: RegisterClientService;

  beforeEach(async () => {
    clientRepository = new InMemoryClientRepository();

    sut = new RegisterClientService(clientRepository);
  });

  it("should register a new client", async () => {
    const register = await sut.exec({
      name: "John Doe",
      cnpj: randomCnpj,
    });

    expect(register).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        fullName: "John Doe",
        cnpj: "33.483.364/0001-29",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      })
    );
  });

  it("should throw an exception over empty dto name", async () => {
    await expect(async () => {
      return sut.exec({
        name: "",
        cnpj: randomCnpj,
      });
    }).rejects.toThrowError("Name can't be empty.");
  });

  it("should throw an exception over empty dto cnpj", async () => {
    await expect(async () => {
      return sut.exec({
        name: "John Doe",
        cnpj: "",
      });
    }).rejects.toThrow("Cnpj can't be empty.");
  });

  it("should throw an exception over empty dto cnpj", async () => {
    await expect(async () => {
      return sut.exec({
        name: "John Doe",
        cnpj: "33.483.364/0001-292222",
      });
    }).rejects.toThrow(
      "Invalid cnpj format. Valid format ex: XX.XXX.XXX/XXXX-XX."
    );
  });
});
