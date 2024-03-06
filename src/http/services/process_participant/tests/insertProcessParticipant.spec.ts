import { randomUUID } from "node:crypto";
import { ParticipantType, ProcessType } from "../../../@types/enums";
import { beforeEach, describe, expect, it } from "vitest";
import { IProcess } from "../../../@types/process";
import type { IClient } from "../../../@types/client";
import type { IParticipant } from "../../../@types/participant";
import InMemoryClientRepository from "../../../models/in-memory/inMemoryClientRepository";
import RegisterClientService from "../../client/registerClientService";
import InMemoryProcessRepository from "../../../models/in-memory/inMemoryProcessRepository";
import CreateNewProcessService from "../../process/createNewProcessService";
import RegisterParticipantService from "../../participant/registerParticipantService";
import InMemoryParticipantsRepository from "../../../models/in-memory/inMemoryParticipantsRepository";
import InsertProcessParticipantService from "../insertProcessParticipantService";
import InMemoryParticipantProcessRepository from "../../../models/in-memory/inMemoryParticipantProcessRepository";

const randomCnpj = "33.483.364/0001-29"; // generated with https://www.4devs.com.br/gerador_de_cnpj
const validRandomCpf = "292.776.365-80";
const validRandomPhone = "(99) 9 9999-9999";

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

describe("Create new process participant", () => {
  let client: IClient;
  let participant: IParticipant;
  let process: IProcess;

  let clientRepository: InMemoryClientRepository;
  let processRepository: InMemoryProcessRepository;
  let participantRepository: InMemoryParticipantsRepository;
  let participantProcessRepository: InMemoryParticipantProcessRepository;

  let registerClientService: RegisterClientService;
  let createNewProcessService: CreateNewProcessService;
  let registerParticipantService: RegisterParticipantService;

  let sut: InsertProcessParticipantService;

  beforeEach(async () => {
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

    registerParticipantService = new RegisterParticipantService(
      participantRepository
    );

    sut = new InsertProcessParticipantService(
      processRepository,
      participantRepository,
      participantProcessRepository
    );

    client = await registerClientService.exec({
      name: "John Doe",
      cnpj: randomCnpj,
    });

    participant = await registerParticipantService.exec({
      document: validRandomCpf,
      phone: validRandomPhone,
      email: "johndoe@email.com",
      name: "Participant",
      type: ParticipantType.LAWYER,
    });

    process = await createNewProcessService.exec(client.id, mockProcess);
  });

  it("should create a new process participant", async () => {
    const insertNewProcessParticipant = await sut.exec({
      participantId: participant.id,
      processId: process.id,
    });

    expect(insertNewProcessParticipant).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        processId: process.id,
        participantId: participant.id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      })
    );
  });

  it("should throw exception over empty participant id dto", async () => {
    await expect(() => {
      return sut.exec({
        participantId: "",
        processId: process.id,
      });
    }).rejects.toThrowError("Invalid participant id.");
  });

  it("should throw exception over empty process id dto", async () => {
    await expect(() => {
      return sut.exec({
        participantId: participant.id,
        processId: "",
      });
    }).rejects.toThrowError("Invalid process id.");
  });

  it("should throw exception if process doesn't exists", async () => {
    await expect(() => {
      return sut.exec({
        participantId: participant.id,
        processId: randomUUID(),
      });
    }).rejects.toThrowError("Process not found.");
  });

  it("should throw exception if process has been deactivated", async () => {
    const getProcess = processRepository.process.find(
      (p) => p.id === process.id
    )!;

    getProcess.deletedAt = new Date();

    await expect(() => {
      return sut.exec({
        participantId: participant.id,
        processId: process.id,
      });
    }).rejects.toThrowError("Process deactivated.");
  });

  it("should throw exception if participant does't exists", async () => {
    await expect(() => {
      return sut.exec({
        participantId: randomUUID(),
        processId: process.id,
      });
    }).rejects.toThrowError("Participant not found.");
  });

  it("should throw exception if participant has been deactivated", async () => {
    const getParticipant = participantRepository.participants.find(
      (p) => p.id === participant.id
    )!;

    getParticipant.deletedAt = new Date();

    await expect(() => {
      return sut.exec({
        participantId: participant.id,
        processId: process.id,
      });
    }).rejects.toThrowError("Participant deactivated.");
  });

  it("should throw exception if provided participant is already alocated on provided process", async () => {
    await sut.exec({
      participantId: participant.id,
      processId: process.id,
    });

    await expect(() => {
      return sut.exec({
        participantId: participant.id,
        processId: process.id,
      });
    }).rejects.toThrowError(
      "This participant is already alocated on provided process."
    );
  });
});
