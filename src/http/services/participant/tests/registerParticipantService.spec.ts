import { beforeEach, describe, it, expect } from "vitest";
import RegisterParticipantService from "../registerParticipantService";
import InMemoryParticipantsRepository from "../../../models/in-memory/inMemoryParticipantsRepository";
import { ParticipantType } from "../../../@types/enums";

const validRandomCpf = "292.776.365-80";
const validRandomPhone = "(99) 9 9999-9999";

const mockRequest = {
  document: validRandomCpf,
  email: "johndoe@email.com",
  name: "John Doe",
  phone: validRandomPhone,
  type: ParticipantType.LAWYER,
};

describe("Register participant service", () => {
  let participantRepository: InMemoryParticipantsRepository;

  let sut: RegisterParticipantService;

  beforeEach(() => {
    participantRepository = new InMemoryParticipantsRepository();

    sut = new RegisterParticipantService(participantRepository);
  });

  it("should register a new participant on database", async () => {
    const newParticipant = await sut.exec(mockRequest);

    expect(newParticipant).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "John Doe",
        email: "johndoe@email.com",
        phone: validRandomPhone,
        document: validRandomCpf,
        type: ParticipantType.LAWYER,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      })
    );
  });

  it("should throw an exception over empty document dto", async () => {
    await expect(() => {
      return sut.exec({
        ...mockRequest,
        document: "",
      });
    }).rejects.toThrowError("document can't be empty.");
  });

  it("should throw an exception over an invalid document dto", async () => {
    await expect(() => {
      return sut.exec({
        ...mockRequest,
        document: "292.776.365-80555",
      });
    }).rejects.toThrowError("Invalid document.");
  });

  it("should throw an exception over empty email dto", async () => {
    await expect(() => {
      return sut.exec({
        ...mockRequest,
        email: "",
      });
    }).rejects.toThrowError("email can't be empty.");
  });

  it("should throw an exception over empty email dto", async () => {
    await expect(() => {
      return sut.exec({
        ...mockRequest,
        email: "johndoe@johndoe@email.com",
      });
    }).rejects.toThrowError(
      "Invalid e-mail format. Valid format ex: example@email.com."
    );
  });

  it("should throw an exception over empty name dto", async () => {
    await expect(() => {
      return sut.exec({
        ...mockRequest,
        name: "",
      });
    }).rejects.toThrowError("name can't be empty.");
  });

  it("should throw an exception over empty phone dto", async () => {
    await expect(() => {
      return sut.exec({
        ...mockRequest,
        phone: "",
      });
    }).rejects.toThrowError("phone can't be empty.");
  });

  it("should throw an exception over an invalid phone dto format.", async () => {
    await expect(() => {
      return sut.exec({
        ...mockRequest,
        phone: "(99) 9 1234-567822222",
      });
    }).rejects.toThrowError(
      "Invalid phone format. Valid format ex: (99) 9 1234-5678"
    );

    await expect(() => {
      return sut.exec({
        ...mockRequest,
        phone: "(99)922146802",
      });
    }).rejects.toThrowError(
      "Invalid phone format. Valid format ex: (99) 9 1234-5678"
    );
  });

  it("should throw an exception over empty type dto", async () => {
    await expect(() => {
      return sut.exec({
        ...mockRequest,
        //@ts-ignore
        type: "",
      });
    }).rejects.toThrowError("type can't be empty.");
  });

  it("should throw an exception if an unique information already exists registered [E-mail]", async () => {
    await sut.exec(mockRequest);

    await expect(() => {
      return sut.exec({
        ...mockRequest,
        email: "johndoe@email.com",
      });
    }).rejects.toThrowError(
      "An participant with those informations already exists."
    );
  });

  it("should throw an exception if an unique information already exists registered [Phone]", async () => {
    await sut.exec(mockRequest);

    await expect(() => {
      return sut.exec({
        ...mockRequest,
        phone: validRandomPhone,
      });
    }).rejects.toThrowError(
      "An participant with those informations already exists."
    );
  });

  it("should throw an exception if an unique information already exists registered [Phone]", async () => {
    await sut.exec(mockRequest);

    await expect(() => {
      return sut.exec({
        ...mockRequest,
        document: validRandomCpf,
      });
    }).rejects.toThrowError(
      "An participant with those informations already exists."
    );
  });
});
