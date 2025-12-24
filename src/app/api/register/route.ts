import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";
import { IRegister, registerUser } from "@/services/api/auth";

export async function POST(request: NextRequest) {
  try {
    const body: IRegister = await request.json();
    // Log the request body for debugging
    // Make request to your backend login endpoint
    // const res = await api.post("/auth/register", body);
    const res = await registerUser(body);

    // Example: set HTTP-only cookie with token
    const token = res.tokens.access.token;
    const accessToken = res.tokens.refresh.token;
    const response = NextResponse.json({
      user: { ...res.newUser },
      token,
      accessToken,
    });

    response.cookies.set("user-authenticated", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.response?.data?.message || "Registeration failed" },
      { status: 401 }
    );
  }
}
