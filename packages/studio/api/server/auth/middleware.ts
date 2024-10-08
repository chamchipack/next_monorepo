import { NextRequest, NextResponse } from "next/server";
import {
  isAccessTokenVerified,
  isRefreshTokenVerified,
  refreshExpiredAccessToken,
  checkRefreshTokenOnAuthServer,
} from "./validation";

type ResponseData = {
  message?: string;
  accessToken?: string;
};

// const JWT_SECRET = process.env.JWT_SECRET;
// 401 :  empty, unauthorized, expired
// 403 : invalid
// 402 : refresh
// { status: 401, message: "failed" }

type Response = {
  status: 401 | 402 | 403 | 404 | 200;
  message: "unauthorized" | "expired" | "invalid" | "refresh" | "success";
};

enum Message {
  auth = "unauthorized",
  exp = "expired",
  invalid = "invalid",
  ref = "refresh",
  suc = "success",
}

const exception = [401, 403];

async function checkKeepAlive(): Promise<boolean> {
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
    console.log(e);
    return false;
  }
}

export async function authMiddleware(
  token = { access: "", refresh: "" },
  user: string,
  username: string
): Promise<boolean | NextResponse> {
  const accessToken = token.access;
  const refreshToken = token.refresh;

  const { status, message }: Response = isAccessTokenVerified(accessToken);
  // 토큰 정상
  if (message === Message.suc) return true;

  const keepalive = await checkKeepAlive();
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@");
  console.log(keepalive);
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@");

  if (!keepalive) {
    // 토큰 비정상시
    const { status: refreshsts, message: refreshmsg }: Response =
      isRefreshTokenVerified(refreshToken);

    // 리프레시토큰 비정상시
    if (exception.includes(refreshsts))
      return NextResponse.json({ status: refreshsts, message: refreshmsg });

    if (status === 401) {
      const { status: bad, message: valid } = refreshExpiredAccessToken(
        user,
        refreshToken
      );

      if (valid === Message.suc) return true;
      else return NextResponse.json({ message: valid, status: bad });
    } else {
      return NextResponse.json({ message, status });
    }
  } else {
    const { status: refreshsts, message: refreshmsg }: Response =
      await checkRefreshTokenOnAuthServer({ token, userId: user, username });

    console.log("@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log(refreshsts, refreshmsg);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@");

    // 리프레시토큰 비정상시
    if (exception.includes(refreshsts))
      return NextResponse.json({ status: refreshsts, message: refreshmsg });

    // 리프레시토큰 정상시
    return true;
  }

  // if (status === 401) {
  //   const { status: bad, message: valid } = refreshExpiredAccessToken(
  //     user,
  //     refreshToken
  //   );

  //   if (valid === Message.suc) return true;
  //   else return NextResponse.json({ message: valid, status: bad });
  // } else {
  //   return NextResponse.json({ message, status });
  // }

  // const { isValid, status, message } = isAccessTokenVerified(accessToken);

  // if (isValid) return true;

  // const { status: refreshSts, message: refMsg } =
  //   isRefreshTokenVerified(refreshToken);

  // if ([401, 403].includes(refreshSts))
  //   return NextResponse.json({ message: refMsg }, { status: 401 });

  // if (status === 401) {
  //   const { isValid: _validate, token } = refreshExpiredAccessToken(
  //     user,
  //     refreshToken
  //   );
  //   if (_validate && token) {
  //     return NextResponse.json({ accessToken: token }, { status: 402 });
  //   } else {
  //     return NextResponse.json({ message }, { status: status });
  //   }
  // } else {
  //   return NextResponse.json({ message }, { status: status });
  // }
}
