import pb from "@/api/server/db/pocketbase";
const jwt = require("jsonwebtoken");

export interface User {
  id: string;
  isAdmin?: boolean;
  isSuperAccount?: boolean;
  name: string;
  menuAccess: string;
  username: string;
  accessToken: string;
  refreshToken: string;
}

export type Input = {
  username: string;
  password: string;
  csrfToken: string;
};

const admin = process.env.NEXT_PUBLIC_SUPER_ACCOUNT;
const adminpw = process.env.NEXT_PUBLIC_SUPER_ACC_PW;

const JWT_ACCESS = process.env.NEXT_PUBLIC_ACCESS_KEY;
const JWT_REFRESH = process.env.NEXT_PUBLIC_REFRESH_KEY;

class AuthService {
  private async checkKeepAlive(): Promise<boolean> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVER}/keep-alive`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-chamchiapi-key": process.env.NEXT_PUBLIC_SECRET_APY_KEY || "",
          },
        }
      );
      const result = await response.json();
      return result.alive;
    } catch (e) {
      return false;
    }
  }

  private async authenticateWithExternalServer(
    userId: string,
    pw: string
  ): Promise<User | null> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVER}/users/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-chamchiapi-key": process.env.NEXT_PUBLIC_SECRET_APY_KEY || "",
          },
          body: JSON.stringify({ userid: userId, password: pw }),
        }
      );

      const data = await response.json();
      return {
        id: data.id,
        isAdmin: true,
        name: data.name,
        menuAccess: data.menuAccess,
        isSuperAccount: false,
        username: userId,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      };
    } catch (e) {
      console.error("Error authenticating with external server:", e);
      return null;
    }
  }

  // 로컬 서버에서 사용자 인증을 처리하는 함수
  private async authenticateWithLocalServer(
    userId: string,
    pw: string
  ): Promise<User | null> {
    try {
      const { record }: { record: any } = await pb
        .collection("instructor")
        .authWithPassword(userId, pw);

      const { id, isAdmin, name, menuAccess, username } = record;

      const token = await this.createToken(id);
      return {
        id,
        isAdmin,
        name,
        menuAccess,
        isSuperAccount: false,
        username,
        ...token,
      };
    } catch (e) {
      console.error("Error authenticating with local server:", e);
      return null;
    }
  }
  private async findUser(userId: string, pw: string): Promise<User | null> {
    const keepalive = await this.checkKeepAlive();
    console.log(keepalive);
    if (keepalive) return await this.authenticateWithExternalServer(userId, pw);
    else return await this.authenticateWithLocalServer(userId, pw);
    // return await this.authenticateWithLocalServer(userId, pw);
  }

  private async createToken(userId: string) {
    const accessToken = jwt.sign({ userId }, JWT_ACCESS, {
      expiresIn: process.env.NEXT_PUBLIC_ACCESS_EXPIRE,
      algorithm: process.env.ALGORITHM,
    });
    const refreshToken = jwt.sign({ userId }, JWT_REFRESH, {
      expiresIn: process.env.NEXT_PUBLIC_REFRESH_EXPIRE,
      algorithm: process.env.ALGORITHM,
    });
    return { accessToken, refreshToken };
  }

  private async findAdmin(id: string) {
    const token = await this.createToken(id);
    const superUser: User = {
      id: "superaccount",
      name: "시스템관리자",
      username: "시스템관리자",
      menuAccess: id,
      isAdmin: true,
      isSuperAccount: true,
      ...token,
    };
    return superUser;
  }

  // 인증을 위한 메서드
  async authorize(credentials: Input): Promise<User | null> {
    const { username, password, csrfToken } = credentials;

    if (!username || !password || !csrfToken) return null;

    if (username === admin && password === adminpw)
      return this.findAdmin(username);

    return this.findUser(username, password);
  }

  async signout(id: string, username: string) {
    if (!id || !username) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVER}/users/signout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-chamchiapi-key": process.env.NEXT_PUBLIC_SECRET_APY_KEY || "",
          },
          body: JSON.stringify({ userid: username }),
        }
      );
    } catch (e) {
      console.log(e);
    }
  }
}

export default AuthService;
