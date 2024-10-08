const jwt = require("jsonwebtoken");
import { cookies } from "next/headers";

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

type ServerType = {
  token?: { access: string; refresh: string };
  userId: string;
  username: string;
};

const isAccessTokenVerified = (accessToken: string): Response => {
  if (!accessToken) return { status: 401, message: Message.auth };

  try {
    const key = process.env.NEXT_PUBLIC_ACCESS_KEY;
    // jwt.verify(accessToken, key);
    // const key = "chamchi_secret_key";
    jwt.verify(accessToken, key, { algorithms: [process.env.ALGORITHM] });
    return { status: 200, message: Message.suc };
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return {
        status: 401,
        message: Message.exp,
      };
    } else {
      return {
        status: 403,
        message: Message.invalid,
      };
    }
  }
};

const isRefreshTokenVerified = (refreshToken: string): Response => {
  if (!refreshToken) return { status: 401, message: Message.auth };

  try {
    jwt.verify(refreshToken, process.env.NEXT_PUBLIC_REFRESH_KEY, {
      algorithms: [process.env.ALGORITHM],
    });
    return {
      status: 200,
      message: Message.suc,
    };
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return {
        status: 401,
        message: Message.exp,
      };
    } else {
      return {
        status: 403,
        message: Message.invalid,
      };
    }
  }
};

const checkRefreshTokenOnAuthServer = async ({
  token,
  userId,
  username,
}: ServerType): Promise<Response> => {
  const form = {
    user_id: userId,
    userid: username,
    access_token: token?.access,
    refresh_token: token?.refresh,
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_SERVER}/sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-chamchiapi-key": process.env.NEXT_PUBLIC_SECRET_APY_KEY || "",
        },
        body: JSON.stringify(form),
      }
    );
    const { status = "", valid = false, result = "" } = await response.json();

    if (valid && status === "refresh" && result) {
      cookies().set("next-auth.access-token", result, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: parseInt(
          process.env.NEXT_PUBLIC_REFRESH_EXPIRE_C || "3600",
          10
        ),
        path: "/",
      });
      return { status: 200, message: Message.suc };
    } else if (status === "empty") {
      return { status: 401, message: Message.auth };
    } else if (status === "expired")
      return { status: 401, message: Message.exp };
    else return { status: 403, message: Message.invalid };
  } catch (e) {
    console.log(e);
  }
  return { status: 401, message: Message.exp };
};

const refreshExpiredAccessToken = (
  user: string,
  refreshToken: string
): Response => {
  const JWT_ACCESS = process.env.NEXT_PUBLIC_ACCESS_KEY;

  if (!refreshToken) return { status: 401, message: Message.auth };

  try {
    jwt.verify(refreshToken, process.env.NEXT_PUBLIC_REFRESH_KEY, {
      algorithms: [process.env.ALGORITHM],
    });
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return {
        status: 401,
        message: Message.exp,
      };
    } else {
      return {
        status: 403,
        message: Message.invalid,
      };
    }
  }

  const newAccessToken = jwt.sign({ user }, JWT_ACCESS, {
    expiresIn: process.env.NEXT_PUBLIC_ACCESS_EXPIRE,
    algorithm: process.env.ALGORITHM,
  });

  cookies().set("next-auth.access-token", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: parseInt(process.env.NEXT_PUBLIC_REFRESH_EXPIRE_C || "3600", 10),
    path: "/",
  });

  // 토큰 집어넣기 필요

  return { status: 200, message: Message.suc };
};

export {
  isAccessTokenVerified,
  refreshExpiredAccessToken,
  isRefreshTokenVerified,
  checkRefreshTokenOnAuthServer,
};

// const jwt = require("jsonwebtoken");

// const isAccessTokenVerified = (accessToken: string) => {
//   if (!accessToken)
//     return { isValid: false, status: 403, message: "AccessToken is Empty" };

//   try {
//     jwt.verify(accessToken, process.env.NEXT_PUBLIC_ACCESS_KEY);
//     return { isValid: true, status: 200, message: "Success" };
//   } catch (err: any) {
//     if (err.name === "TokenExpiredError") {
//       return {
//         isValid: false,
//         status: 401,
//         message: "Token is Expired",
//       };
//     } else {
//       return {
//         isValid: false,
//         status: 403,
//         message: "AccessToken is not Verified",
//       };
//     }
//   }
// };

// const isRefreshTokenVerified = (refreshToken: string) => {
//   if (!refreshToken) {
//     return { isValid: false, status: 403, message: "RefreshToken is Empty" };
//   }

//   try {
//     jwt.verify(refreshToken, process.env.NEXT_PUBLIC_REFRESH_KEY);
//     return {
//       isValid: true,
//       status: 200,
//       message: "Success",
//     };
//   } catch (err: any) {
//     if (err.name === "TokenExpiredError") {
//       return {
//         isValid: false,
//         status: 401,
//         message: "Token is Expired",
//       };
//     } else {
//       return {
//         isValid: false,
//         status: 403,
//         message: "RefreshToken is not Verified",
//       };
//     }
//   }
// };

// const refreshExpiredAccessToken = (user: string, refreshToken: string) => {
//   const JWT_ACCESS = process.env.NEXT_PUBLIC_ACCESS_KEY;

//   if (!refreshToken) {
//     return { isValid: false, token: "", message: "RefreshToken is Empty" };
//   }

//   try {
//     jwt.verify(refreshToken, process.env.NEXT_PUBLIC_REFRESH_KEY);
//   } catch (err: any) {
//     if (err.name === "TokenExpiredError") {
//       return {
//         isValid: false,
//         token: "",
//         status: 401,
//         message: "Token is Expired",
//       };
//     } else {
//       return {
//         isValid: false,
//         token: "",
//         status: 403,
//         message: "RefreshToken is not Verified",
//       };
//     }
//   }

//   const newAccessToken = jwt.sign({ user }, JWT_ACCESS, {
//     expiresIn: process.env.NEXT_PUBLIC_ACCESS_EXPIRE,
//   });

//   return { isValid: true, token: newAccessToken };
// };

// export {
//   isAccessTokenVerified,
//   refreshExpiredAccessToken,
//   isRefreshTokenVerified,
// };
