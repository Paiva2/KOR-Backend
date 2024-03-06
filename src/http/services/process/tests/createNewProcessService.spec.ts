import { beforeEach, describe, it, expect, vi, afterEach } from "vitest";
import { randomUUID } from "node:crypto";
import { ProcessType } from "../../../@types/enums";
import type { IClient } from "../../../@types/client";
import InMemoryClientRepository from "../../../models/in-memory/inMemoryClientRepository";
import RegisterClientService from "../../client/registerClientService";
import CreateNewProcessService from "../createNewProcessService";
import InMemoryProcessRepository from "../../../models/in-memory/inMemoryProcessRepository";

const randomCnpj = "33.483.364/0001-29"; // generated with https://www.4devs.com.br/gerador_de_cnpj

const mockProcess = {
  audienceDate: new Date(2030, 1, 20, 0, 0),
  causeValue: "R$ 100,00",
  city: "São Paulo",
  state: "SP",
  forum: "Forum X",
  number: "123456789",
  quoteDate: new Date(2030, 1, 10, 0, 0),
  type: ProcessType.ADMINISTRATIVE,
};

describe("Create new process", () => {
  let client: IClient;

  let clientRepository: InMemoryClientRepository;
  let processRepository: InMemoryProcessRepository;

  let registerClientService: RegisterClientService;

  let sut: CreateNewProcessService;

  beforeEach(async () => {
    clientRepository = new InMemoryClientRepository();
    processRepository = new InMemoryProcessRepository();

    registerClientService = new RegisterClientService(clientRepository);

    sut = new CreateNewProcessService(clientRepository, processRepository);

    client = await registerClientService.exec({
      name: "John Doe",
      cnpj: randomCnpj,
    });

    const mockDate = new Date(2030, 0, 25, 0, 0);
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should create a new process", async () => {
    const newProcess = await sut.exec(client.id, mockProcess);

    expect(newProcess).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        number: "123456789",
        causeValue: "R$ 100,00",
        type: ProcessType.ADMINISTRATIVE,
        quoteDate: new Date(2030, 1, 10, 0, 0),
        audienceDate: new Date(2030, 1, 20, 0, 0),
        forum: "Forum X",
        city: "São Paulo",
        state: "SP",
        clientId: client.id,
        createdAt: new Date(2030, 0, 25, 0, 0),
        updatedAt: new Date(2030, 0, 25, 0, 0),
        deletedAt: null,
      })
    );
  });

  it("should throw an exception over empty audience date dto", async () => {
    await expect(() => {
      return sut.exec(client.id, {
        ...mockProcess,
        // @ts-ignore
        audienceDate: null,
      });
    }).rejects.toThrowError("Invalid audience date.");
  });

  it("should throw an exception over empty cause value dto", async () => {
    await expect(() => {
      return sut.exec(client.id, {
        ...mockProcess,
        // @ts-ignore
        causeValue: null,
      });
    }).rejects.toThrowError("Invalid cause value.");
  });

  it("should throw an exception over empty process city dto", async () => {
    await expect(() => {
      return sut.exec(client.id, {
        ...mockProcess,
        // @ts-ignore
        city: null,
      });
    }).rejects.toThrowError("Invalid process city.");
  });

  it("should throw an exception over empty client id dto", async () => {
    await expect(() => {
      return sut.exec("", mockProcess);
    }).rejects.toThrowError("Invalid process client id.");
  });

  it("should throw an exception over empty process forum dto", async () => {
    await expect(() => {
      return sut.exec(client.id, {
        ...mockProcess,
        // @ts-ignore
        forum: null,
      });
    }).rejects.toThrowError("Invalid process forum.");
  });

  it("should throw an exception over empty process number dto", async () => {
    await expect(() => {
      return sut.exec(client.id, {
        ...mockProcess,
        // @ts-ignore
        number: null,
      });
    }).rejects.toThrowError("Invalid process number.");
  });

  it("should throw an exception over empty process quote date dto", async () => {
    await expect(() => {
      return sut.exec(client.id, {
        ...mockProcess,
        // @ts-ignore
        quoteDate: null,
      });
    }).rejects.toThrowError("Invalid process quote date.");
  });

  it("should throw an exception over empty process state dto", async () => {
    await expect(() => {
      return sut.exec(client.id, {
        ...mockProcess,
        // @ts-ignore
        state: null,
      });
    }).rejects.toThrowError("Invalid process state.");
  });

  it("should throw an exception over empty process type dto", async () => {
    await expect(() => {
      return sut.exec(client.id, {
        ...mockProcess,
        // @ts-ignore
        type: null,
      });
    }).rejects.toThrowError("Invalid process type.");
  });

  it("should throw an exception over audience date beeing on the past", async () => {
    await expect(() => {
      return sut.exec(client.id, {
        ...mockProcess,
        audienceDate: new Date(2030, 0, 24, 0, 0),
      });
    }).rejects.toThrowError("Audience date can't be in the past.");
  });

  it("should throw an exception if client doesn't exists", async () => {
    await expect(() => {
      return sut.exec(randomUUID(), mockProcess);
    }).rejects.toThrowError("Client not found.");
  });

  it("should throw an exception if client has been 'deleted'", async () => {
    const inactiveClient = clientRepository.clients.find(
      (c) => client.id === c.id
    );

    inactiveClient!.deletedAt = new Date();

    await expect(() => {
      return sut.exec(client.id, mockProcess);
    }).rejects.toThrowError("Client has been deactivated.");
  });

  it("should throw an exception if an process with provided number already exists", async () => {
    await sut.exec(client.id, mockProcess);

    await expect(() => {
      return sut.exec(client.id, mockProcess);
    }).rejects.toThrowError("An process with this number already exists.");
  });
});
