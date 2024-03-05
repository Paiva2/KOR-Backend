import jwt, { JwtPayload } from "jsonwebtoken";
import BadRequestException from "../../exceptions/badRequestException";
import ForbiddenException from "../../exceptions/forbiddenException";

export default class JwtService {
  private secret = process.env.JWT_SECRET ?? "development";
  private issuer = process.env.JWT_ISSUER ?? "development";

  public constructor() {}

  public sign(subject: string) {
    let token = null;

    try {
      token = jwt.sign(
        {
          data: subject,
        },
        this.secret,
        { expiresIn: "7d", issuer: this.issuer }
      );
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);

        throw new BadRequestException(e.message);
      }
    }

    return token;
  }

  public decode(token: string): string {
    let decodedToken = "";

    try {
      const parseToken = jwt.verify(token, this.secret, {
        issuer: this.issuer,
      }) as JwtPayload;

      decodedToken = parseToken.data!;
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
        throw new ForbiddenException(e.message);
      }
    }

    return decodedToken;
  }
}
