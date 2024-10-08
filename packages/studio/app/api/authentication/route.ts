// app/api/authentication/authentication.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // NextAuth 설정 경로

export async function GET() {
  console.log("gGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
  try {
    // 서버 세션 가져오기
    const session = await getServerSession(authOptions);
    console.log(session);

    if (session) {
      // 세션이 유효하면 인증된 것으로 처리
      return NextResponse.json({ isAuthenticated: true, session });
    } else {
      // 세션이 없으면 비인증 상태로 처리
      return NextResponse.json({ isAuthenticated: false });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
