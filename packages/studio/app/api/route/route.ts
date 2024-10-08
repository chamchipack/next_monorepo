import { NextRequest, NextResponse } from "next/server";

import { authMiddleware } from "@/api/server/auth/middleware";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ResponseType, ResponseMessage, ResponseStatus } from "@/api/type/type";
import PocketbaseFinder from "@/api/server/db/convert";

type APIType = "search" | "create" | "update" | "delete" | "single";

type APIResponse<T> = {
  status: number;
  message?: string;
  data?: T;
};

type Collection =
  | "student"
  | "session"
  | "class"
  | "attendance"
  | "payment"
  | "instructor";

interface Protocol {
  type: APIType;
  target: Collection;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const cookies = req.cookies;
  const access = cookies.get("next-auth.access-token")?.value || "";
  const refresh = cookies.get("next-auth.refresh-token")?.value || "";

  if (!access || !refresh)
    return NextResponse.json<ResponseType<null>>({
      message: ResponseMessage.auth,
      status: 401,
    });

  const res = NextResponse.next();
  const token = { access, refresh };
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "";
  const username = session?.user?.username || "";

  if (!userId)
    return NextResponse.json<ResponseType<null>>({
      message: ResponseMessage.auth,
      status: 401,
    });

  const data = await req.json();

  const authResult = await authMiddleware(token, userId, username);
  if (authResult !== true) {
    return NextResponse.json<ResponseType<null>>({
      message: ResponseMessage.auth,
      status: 401,
    });
  }
  // const controller = controllerMap[type as keyof typeof controllerMap];

  const { type = "search", target }: Protocol = data;

  const finder = new PocketbaseFinder({ collection: target });
  const controller = (finder as any)[type];

  if (controller) {
    const result: ResponseType<any> | void = await controller(data);
    if (!result)
      return NextResponse.json<ResponseType<typeof result>>({
        status: 500,
        message: "error",
      });

    return NextResponse.json<ResponseType<typeof result>>({
      status: result.status,
      data: result.data ?? {},
      message: result.message,
    });
    // return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  } else {
    return NextResponse.json<APIResponse<null>>({
      message: `Method ${req.method} Not Allowed`,
      status: 405,
    });
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const cookies = req.cookies;
  const access = cookies.get("next-auth.access-token")?.value || "";
  const refresh = cookies.get("next-auth.refresh-token")?.value || "";

  if (!access || !refresh)
    return NextResponse.json<ResponseType<null>>({
      message: ResponseMessage.auth,
      status: 401,
    });

  const res = NextResponse.next();
  const token = { access, refresh };
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "";
  const username = session?.user?.username || "";

  if (!userId)
    return NextResponse.json<ResponseType<null>>({
      message: ResponseMessage.auth,
      status: 401,
    });

  const data = await req.json();

  const authResult = await authMiddleware(token, userId, username);
  if (authResult !== true) {
    return NextResponse.json<ResponseType<null>>({
      message: ResponseMessage.auth,
      status: 401,
    });
  }

  // const { type = "search" }: { type: APIType } = data;
  // const controller = controllerMap[type as keyof typeof controllerMap];

  const { type = "search", target }: Protocol = data;
  const finder = new PocketbaseFinder({ collection: target });
  const controller = (finder as any)[type];

  if (controller) {
    const result: ResponseType<any> | void = await controller(data);
    if (!result)
      return NextResponse.json<ResponseType<typeof result>>({
        status: 500,
        message: "error",
      });

    return NextResponse.json<ResponseType<typeof result>>({
      status: result.status,
      data: result.data ?? {},
      message: result.message,
    });
    // return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  } else {
    return NextResponse.json<APIResponse<null>>({
      message: `Method ${req.method} Not Allowed`,
      status: 405,
    });
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const cookies = req.cookies;
  const access = cookies.get("next-auth.access-token")?.value || "";
  const refresh = cookies.get("next-auth.refresh-token")?.value || "";

  if (!access || !refresh)
    return NextResponse.json<ResponseType<null>>({
      message: ResponseMessage.auth,
      status: 401,
    });

  const res = NextResponse.next();
  const token = { access, refresh };
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "";
  const username = session?.user?.username || "";

  if (!userId)
    return NextResponse.json<ResponseType<null>>({
      message: ResponseMessage.auth,
      status: 401,
    });

  const data = await req.json();

  const authResult = await authMiddleware(token, userId, username);
  if (authResult !== true) {
    return NextResponse.json<ResponseType<null>>({
      message: ResponseMessage.auth,
      status: 401,
    });
  }

  // const { type = "search" }: { type: APIType } = data;
  // const controller = controllerMap[type as keyof typeof controllerMap];

  const { type = "search", target }: Protocol = data;
  const finder = new PocketbaseFinder({ collection: target });
  const controller = (finder as any)[type];

  if (controller) {
    const result: ResponseType<any> | void = await controller(data);
    if (!result)
      return NextResponse.json<ResponseType<typeof result>>({
        status: 500,
        message: "error",
      });

    return NextResponse.json<ResponseType<typeof result>>({
      status: result.status,
      data: result.data ?? {},
      message: result.message,
    });
    // return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  } else {
    return NextResponse.json<APIResponse<null>>({
      message: `Method ${req.method} Not Allowed`,
      status: 405,
    });
  }
}
