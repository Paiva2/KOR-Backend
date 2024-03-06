import { beforeEach, describe, it, expect, vi } from "vitest";
import { ProcessType } from "../../../@types/enums";
import type { IClient } from "../../../@types/client";
import type { IProcess } from "../../../@types/process";
import InMemoryClientRepository from "../../../models/in-memory/inMemoryClientRepository";
import RegisterClientService from "../../client/registerClientService";
import CreateNewProcessService from "../createNewProcessService";
import InMemoryProcessRepository from "../../../models/in-memory/inMemoryProcessRepository";
import InMemoryParticipantProcessRepository from "../../../models/in-memory/inMemoryParticipantProcessRepository";
import InMemoryParticipantsRepository from "../../../models/in-memory/inMemoryParticipantsRepository";
import DeleteProcessService from "../deleteProcessService";
import { randomUUID } from "crypto";

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

describe("Delete process", () => {
  let client: IClient;
  let process: IProcess;

  let clientRepository: InMemoryClientRepository;
  let processRepository: InMemoryProcessRepository;
  let participantProcessRepository: InMemoryParticipantProcessRepository;
  let participantRepository: InMemoryParticipantsRepository;

  let registerClientService: RegisterClientService;
  let createNewProcessService: CreateNewProcessService;

  let sut: DeleteProcessService;

  beforeEach(async () => {
    vi.useFakeTimers();

    const date = new Date(2030, 0, 20, 0, 0);
    vi.setSystemTime(date);

    clientRepository = new InMemoryClientRepository();
    participantRepository = new InMemoryParticipantsRepository();

    participantProcessRepository = new InMemoryParticipantProcessRepository(
      participantRepository
    );

    processRepository = new InMemoryProcessRepository(
      participantProcessRepository
    );

    registerClientService = new RegisterClientService(clientRepository);

    createNewProcessService = new CreateNewProcessService(
      clientRepository,
      processRepository
    );

    sut = new DeleteProcessService(clientRepository, processRepository);

    client = await registerClientService.exec({
      name: "John Doe",
      cnpj: randomCnpj,
    });

    process = await createNewProcessService.exec(client.id, mockProcess);
  });

  it("should delete an process", async () => {
    const deletedProcess = await sut.exec(client.id, process.id);

    expect(deletedProcess).toEqual(
      expect.objectContaining({
        id: process.id,
        number: "123456789",
        causeValue: "R$ 100,00",
        type: ProcessType.ADMINISTRATIVE,
        quoteDate: new Date(2030, 1, 10, 0, 0),
        audienceDate: new Date(2030, 1, 20, 0, 0),
        forum: "Forum X",
        city: "São Paulo",
        state: "SP",
        clientId: client.id,
        createdAt: new Date(2030, 0, 20, 0, 0),
        updatedAt: new Date(),
        deletedAt: new Date(),
      })
    );
  });

  it("should throw an exception over empty processId dto", async () => {
    await expect(() => {
      return sut.exec(client.id, "");
    }).rejects.toThrowError("processId can't be empty.");
  });

  it("should throw an exception over empty clientId dto", async () => {
    await expect(() => {
      return sut.exec("", process.id);
    }).rejects.toThrowError("clientId can't be empty.");
  });

  it("should throw an exception if client isn't found", async () => {
    await expect(() => {
      return sut.exec(randomUUID(), process.id);
    }).rejects.toThrowError("Client not found.");
  });

  it("should throw an exception if client has been deactivated", async () => {
    const getClient = clientRepository.clients.find((c) => c.id === client.id)!;

    getClient.deletedAt = new Date();

    await expect(() => {
      return sut.exec(client.id, process.id);
    }).rejects.toThrowError("Client has been deactivated.");
  });

  it("should throw an exception if process doesn't exists", async () => {
    await expect(() => {
      return sut.exec(client.id, randomUUID());
    }).rejects.toThrowError("Process not found.");
  });

  it("should throw an exception if process has been deactivated", async () => {
    const getClient = processRepository.process.find(
      (p) => p.id === process.id
    )!;

    getClient.deletedAt = new Date();

    await expect(() => {
      return sut.exec(client.id, process.id);
    }).rejects.toThrowError("Process is already deactivated/excluded.");
  });

  it("should throw an exception if client id provided isn't process owner", async () => {
    const alternativeClient = await registerClientService.exec({
      name: "John Doe 2",
      cnpj: "33.483.364/0001-30",
    });

    await expect(() => {
      return sut.exec(alternativeClient.id, process.id);
    }).rejects.toThrowError("Only process owner can disable a process.");
  });
});
