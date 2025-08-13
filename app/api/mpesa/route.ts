import { type NextRequest, NextResponse } from "next/server"
import { getMpesaTransactionByOrderId, getMpesaTransactions, recordMpesaSTKPush } from "@/lib/payments/mpesa"
import type { MpesaSTKPushRequest, MpesaTransaction } from "@/lib/payments/mpesa"
// import { createPaymentTransaction } from "@/lib/payments/payments"

interface ExtendedMpesaTransaction extends MpesaTransaction {
  paymentMethod: "credit-card" | "mpesa" | "pay-on-delivery" | "ncba"
  success: boolean
  error: string
  transactionId: string
}

export async function POST(request: NextRequest) {
  try {
    const body: MpesaSTKPushRequest = await request.json()

    // Validate required fields
    if (!body.phoneNumber || !body.amount || !body.orderId || !body.checkoutRequestId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: phoneNumber, amount, orderId",
        },
        { status: 400 },
      )
    }

    // Validate amount
    if (body.amount < 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Amount must be greater than 0",
        },
        { status: 400 },
      )
    }
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const updatedBody = {
      ...body, 
      paymentTransactionId: transactionId
    }


    const result = await recordMpesaSTKPush(updatedBody)

    // const payment_body: ExtendedMpesaTransaction = {
    //   ...result,
    //   paymentMethod: "mpesa",
    //   success: true,
    //   error: "",
    //   transactionId
    // }

    // const payment_result = await createPaymentTransaction(payment_body)

    // if(!payment_result){
    //   console.error("Failed to create payment transaction")
    // }

    if (result) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error("M-Pesa STK Push API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      userId: searchParams.get("userId") || undefined,
      status: searchParams.get("status") || undefined,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined,
      offset: searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : undefined,
    }

    const orderId = searchParams.get("orderId") ? searchParams.get("orderId") : undefined
    let result;
    if(orderId){
      result = await getMpesaTransactionByOrderId(orderId)
    } else {
      result = await getMpesaTransactions(filters)

    }
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching mpesa transactions:", error)
    return NextResponse.json({ error: "Failed to fetch mpesa transactions" }, { status: 500 })
  }
}