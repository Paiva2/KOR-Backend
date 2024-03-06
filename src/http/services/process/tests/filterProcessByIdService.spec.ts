import { beforeEach, describe, it, expect, vi, afterEach } from "vitest";
import { ParticipantType, ProcessType } from "../../../@types/enums";
import type { IClient } from "../../../@types/client";
import type { IProcess } from "../../../@types/process";
import type { IParticipantProcess } from "../../../@types/participant_process";
import type { IParticipant } from "../../../@types/participant";
import InMemoryClientRepository from "../../../models/in-memory/inMemoryClientRepository";
import RegisterClientService from "../../client/registerClientService";
import CreateNewProcessService from "../createNewProcessService";
import InMemoryProcessRepository from "../../../models/in-memory/inMemoryProcessRepository";
import InMemoryParticipantProcessRepository from "../../../models/in-memory/inMemoryParticipantProcessRepository";
import InMemoryParticipantsRepository from "../../../models/in-memory/inMemoryParticipantsRepository";
import FilterProcessByIdService from "../filterProcessByIdService";
import InsertProcessParticipantService from "../../process_participant/insertProcessParticipantService";
import RegisterParticipantService from "../../participant/registerParticipantService";

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

describe("Filter process by id service", () => {
  let client: IClient;
  let process: IProcess;
  let participant: IParticipant;
  let participantProcess: IParticipantProcess;

  let clientRepository: InMemoryClientRepository;
  let processRepository: InMemoryProcessRepository;
  let participantProcessRepository: InMemoryParticipantProcessRepository;
  let participantRepository: InMemoryParticipantsRepository;

  let registerClientService: RegisterClientService;
  let createNewProcessService: CreateNewProcessService;
  let registerParticipantService: RegisterParticipantService;
  let insertProcessParticipantService: InsertProcessParticipantService;

  let sut: FilterProcessByIdService;

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

    insertProcessParticipantService = new InsertProcessParticipantService(
      processRepository,
      participantRepository,
      participantProcessRepository
    );

    sut = new FilterProcessByIdService(processRepository);

    client = await registerClientService.exec({
      name: "John Doe",
      cnpj: randomCnpj,
    });

    process = await createNewProcessService.exec(client.id, mockProcess);

    participant = await registerParticipantService.exec({
      document: validRandomCpf,
      email: "johndoe@email.com",
      name: "John Doe",
      phone: validRandomPhone,
      type: ParticipantType.LAWYER,
    });

    participantProcess = await insertProcessParticipantService.exec({
      participantId: participant.id,
      processId: process.id,
    });

    const mockDate = new Date(2030, 0, 25, 0, 0);
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should filter an process by its id", async () => {
    const filterProcess = await sut.exec(process.id);

    expect(filterProcess).toEqual(
      expect.objectContaining({
        id: process.id,
        number: process.number,
        causeValue: process.causeValue,
        type: process.type,
        quoteDate: process.quoteDate,
        audienceDate: process.audienceDate,
        forum: process.forum,
        city: process.city,
        state: process.state,
        clientId: client.id,
        createdAt: process.createdAt,
        updatedAt: process.updatedAt,
        deletedAt: process.deletedAt,
        participantProcess: [
          expect.objectContaining({
            id: participantProcess.id,
            processId: process.id,
            participantId: participant.id,
            createdAt: participantProcess.createdAt,
            updatedAt: participantProcess.updatedAt,
            deletedAt: participantProcess.deletedAt,
            participant: expect.objectContaining({
              id: participant.id,
              name: participant.name,
              email: participant.email,
              phone: participant.phone,
              document: participant.document,
              type: participant.type,
              createdAt: participant.createdAt,
              updatedAt: participant.updatedAt,
              deletedAt: participant.deletedAt,
            }),
          }),
        ],
      })
    );
  });

  it("should throw an exception over empty processId dto", async () => {
    await expect(() => {
      return sut.exec("");
    }).rejects.toThrowError("processId can't be empty.");
  });
});
