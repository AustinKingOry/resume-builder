import { createClient } from "@supabase/supabase-js"
import { MpesaCallbackResponse } from "../types"

function getSupabaseClientWithToken(token: string) {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

export interface MpesaSTKPushRequest {
  phoneNumber: string
  amount: number
  orderId: string
  checkoutRequestId: string
  description?: string
  paymentTransactionId: string
}

export interface MpesaSTKPushResponse {
  success: boolean
  checkoutRequestId?: string
  responseCode?: string
  responseDescription?: string
  customerMessage?: string
  error?: string
}

export interface MpesaSTKQueryResponse {
  success: boolean
  status: "pending" | "completed" | "failed" | "cancelled"
  resultCode?: string
  resultDesc?: string
  mpesaReceiptNumber?: string
  transactionDate?: string
  phoneNumber?: string
  amount?: number
  error?: string
}

export interface MpesaTransaction {
  id: string
  orderId: string
  phoneNumber: string
  amount: number
  checkoutRequestId: string
  status: "pending" | "completed" | "failed" | "cancelled"
  mpesaReceiptNumber?: string
  transactionDate?: Date
  resultCode?: string
  resultDesc?: string
  paymentTransactionId?: string
  createdAt: Date
  updatedAt: Date
}

interface updatesProps {
  status: "pending" | "completed" | "failed" | "cancelled"
  resultCode: string
  resultDesc: string
  mpesaReceiptNumber?: string
}


/**
 * Maps a DB row to the MpesaTransaction type
 */
function mapMpesaRow(row: any): MpesaTransaction {
  return {
    id: row.id,
    orderId: row.order_id,
    phoneNumber: row.phone_number,
    amount: Number.parseFloat(row.amount),
    checkoutRequestId: row.checkout_request_id,
    status: row.status,
    paymentTransactionId: row.payment_transaction_id,
    mpesaReceiptNumber: row.mpesa_receipt_number,
    transactionDate: row.transaction_date ? new Date(row.transaction_date) : undefined,
    resultCode: row.result_code,
    resultDesc: row.result_desc,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

export async function recordMpesaSTKPush(
  token: string,
  request: MpesaSTKPushRequest
): Promise<MpesaTransaction> {
  try {
    const newId = `mpesa_${Date.now()}`
    const payload = {
      id: newId,
      order_id: request.orderId,
      phone_number: request.phoneNumber,
      amount: request.amount,
      checkout_request_id: request.checkoutRequestId,
      status: "pending",
      payment_transaction_id: request.paymentTransactionId,
    }
    const supabase = getSupabaseClientWithToken(token)

    const { data, error } = await supabase
      .from("mpesa_transactions")
      .insert(payload)
      .select()
      .single()

    if (error) throw error

    return mapMpesaRow(data)
  } catch (error) {
    console.error("M-Pesa STK Push error:", error)
    throw error
  }
}

/**
 * Update M-Pesa STK status
 */
export async function updateMpesaSTKStatus(
  token: string,
  checkoutRequestId: string,
  updates: updatesProps
): Promise<MpesaTransaction> {
  try {
    const { status, resultCode, resultDesc, mpesaReceiptNumber } = updates

    const payload: any = {
      status,
      result_code: resultCode,
      result_desc: resultDesc,
      mpesa_receipt_number: mpesaReceiptNumber || null,
      updated_at: new Date().toISOString(),
      transaction_date: status === "completed" ? new Date().toISOString() : null,
    }
    const supabase = getSupabaseClientWithToken(token)

    const { data, error } = await supabase
      .from("mpesa_transactions")
      .update(payload)
      .eq("checkout_request_id", checkoutRequestId)
      .select()
      .single()

    if (error) throw error

    return mapMpesaRow(data)
  } catch (error) {
    console.error("M-Pesa status update error:", error)
    throw { success: false, status: "failed", error: "Failed to update payment status. Please try again." }
  }
}

/**
 * Update M-Pesa callback response
 */
export async function updateMpesaCallback(
  token: string,
  checkoutRequestId: string,
  updates: MpesaCallbackResponse
): Promise<MpesaTransaction> {
  try {
    const { status, resultCode, resultDesc, mpesaReceiptNumber } = updates

    const payload: any = {
      status,
      result_code: resultCode,
      result_desc: resultDesc,
      mpesa_receipt_number: mpesaReceiptNumber || null,
      updated_at: new Date().toISOString(),
      transaction_date: status === "completed" ? new Date().toISOString() : null,
    }
    const supabase = getSupabaseClientWithToken(token)

    const { data, error } = await supabase
      .from("mpesa_transactions")
      .update(payload)
      .eq("checkout_request_id", checkoutRequestId)
      .select()
      .single()

    if (error) throw error

    return mapMpesaRow(data)
  } catch (error) {
    console.error("M-Pesa callback update error:", error)
    throw { success: false, status: "failed", error: "Failed to update payment status. Please try again." }
  }
}

/**
 * Get latest M-Pesa transaction by order ID
 */
export async function getMpesaTransactionByOrderId(
  token: string,
  orderId: string
): Promise<MpesaTransaction | null> {
  try {
    const supabase = getSupabaseClientWithToken(token)
    const { data, error } = await supabase
      .from("mpesa_transactions")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return data ? mapMpesaRow(data) : null
  } catch (error) {
    console.error("Error fetching M-Pesa transaction:", error)
    return null
  }
}

/**
 * Get M-Pesa transactions with optional filters
 */
export async function getMpesaTransactions(
  token: string,
  filters?: {
  status?: string
  userId?: string
  limit?: number
  offset?: number
}): Promise<MpesaTransaction[]> {
  try {
    const supabase = getSupabaseClientWithToken(token)
    let query = supabase
      .from("mpesa_transactions")
      .select("*")
      .order("created_at", { ascending: false })

    if (filters?.status) query = query.eq("status", filters.status)
    if (filters?.userId) query = query.eq("user_id", filters.userId)
    if (filters?.limit) query = query.limit(filters.limit)
    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.limit ? filters.offset + filters.limit - 1 : filters.offset
      )
    }

    const { data, error } = await query
    if (error) throw error

    return (data || []).map(mapMpesaRow)
  } catch (error) {
    console.error("Error fetching M-Pesa transactions:", error)
    return []
  }
}

/**
 * Get latest M-Pesa transaction by checkout request ID
 */
export async function getTransactionByCheckoutRqId(
  token: string,
  checkoutRequestId: string
): Promise<MpesaTransaction | null> {
  try {
    const supabase = getSupabaseClientWithToken(token)
    const { data, error } = await supabase
      .from("mpesa_transactions")
      .select("*")
      .eq("checkout_request_id", checkoutRequestId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return data ? mapMpesaRow(data) : null
  } catch (error) {
    console.error("Error fetching M-Pesa transaction:", error)
    return null
  }
}
