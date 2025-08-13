import { type NextRequest, NextResponse } from "next/server"
import { getTransactionByCheckoutRqId, updateMpesaSTKStatus } from "@/lib/payments/mpesa"
import { createServerClient } from "@/lib/supabase-server";
// import { syncMpesaTransactionStatus } from "@/lib/payments/payments";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: checkoutRequestId } = await params;

    if (!checkoutRequestId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing checkoutRequestId parameter",
        },
        { status: 400 },
      )
    }
    const body = await request.json()
    const supabaseAuth = await createServerClient();
    const {data: {user}, } = await supabaseAuth.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Please sign in to analyze your CV" }, { status: 401 })
    }

    const token = (await supabaseAuth.auth.getSession()).data.session?.access_token
    if (!token) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const result = await updateMpesaSTKStatus(token, checkoutRequestId, body)
    // const payment_result = await syncMpesaTransactionStatus(checkoutRequestId, result)

    // if(!payment_result){
    //   console.error("Failed to update payment status.")
    // }
    return NextResponse.json(result)
  } catch (error) {
    console.error("M-Pesa status update API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: checkoutRequestId } = await params;

    if (!checkoutRequestId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing checkoutRequestId parameter",
        },
        { status: 400 },
      )
    }
    const supabaseAuth = await createServerClient();
    const {data: {user}, } = await supabaseAuth.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Please sign in to analyze your CV" }, { status: 401 })
    }

    const token = (await supabaseAuth.auth.getSession()).data.session?.access_token
    if (!token) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const result = await getTransactionByCheckoutRqId(token, checkoutRequestId)
    return NextResponse.json(result)
  } catch (error) {
    console.error("M-Pesa transaction API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}