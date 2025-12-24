import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Log the request body for debugging
    // // console.log("RESQUEST", body);
    // Make request to your backend login endpoint
    const res = await api.post("/auth/login", body);

    // // console.log("RESPONSE", res.data);

    // Example: set HTTP-only cookie with token
    const token = res.data.tokens.access.token;
    const accessToken = res.data.tokens.refresh.token;
    const response = NextResponse.json({
      user: { ...res.data.user },
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
      { error: error?.response?.data?.message || "Login failed" },
      { status: 401 }
    );
  }
}
