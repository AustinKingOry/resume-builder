import { MpesaCallbackResponse } from "../types"

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

export async function recordMpesaSTKPush(request: MpesaSTKPushRequest): Promise<MpesaTransaction> {
  try {
    // Store transaction in database
    const result = await sql`
      INSERT INTO mpesa_transactions (
        id, order_id, phone_number, amount, checkout_request_id, status, payment_transaction_id
      ) VALUES (
        ${`mpesa_${Date.now()}`}, ${request.orderId}, ${request.phoneNumber}, 
        ${request.amount}, ${request.checkoutRequestId}, ${"pending"}, ${request.paymentTransactionId}
      ) RETURNING *
    `

    const row = result[0];
    return {
      id: row.id,
      orderId: row.order_id,
      phoneNumber: row.phone_number,
      amount: row.amount,
      checkoutRequestId: row.checkoutRequestId,
      status: row.status,
      paymentTransactionId: row.payment_transaction_id,
      transactionDate: row.transaction_date ? new Date(row.transaction_date) : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  } catch (error) {
    console.error("M-Pesa STK Push error:", error);
    throw error;
  }
}

interface updatesProps {
  status: "pending" | "completed" | "failed" | "cancelled"
  resultCode: string
  resultDesc: string
  mpesaReceiptNumber?: string
}

// Update M-Pesa STK Push status
export async function updateMpesaSTKStatus(checkoutRequestId: string, updates: updatesProps): Promise<MpesaTransaction> {
  try {
    const status = updates.status
    const resultCode = updates.resultCode
    const resultDesc = updates.resultDesc
    const mpesaReceiptNumber = updates.mpesaReceiptNumber

    // Update transaction status in database
    const result = await sql`
        UPDATE mpesa_transactions 
        SET 
          status = ${status},
          result_code = ${resultCode},
          result_desc = ${resultDesc},
          mpesa_receipt_number = ${mpesaReceiptNumber || null},
          transaction_date = ${status === "completed" ? new Date() : null},
          updated_at = NOW()
        WHERE checkout_request_id = ${checkoutRequestId} RETURNING *
      `
    const transaction = result[0];

    return {
      id: transaction.id,
      orderId: transaction.order_id,
      phoneNumber: transaction.phone_number,
      amount: transaction.amount,
      checkoutRequestId: transaction.checkoutRequestId,
      status: transaction.status,
      paymentTransactionId: transaction.payment_transaction_id,
      transactionDate: transaction.transaction_date ? new Date(transaction.transaction_date) : undefined,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at,
    }
  } catch (error) {
    console.error("M-Pesa status update error:", error)
    throw {
      success: false,
      status: "failed",
      error: "Failed to update payment status. Please try again.",
    }
  }
}

// Update M-Pesa callback response
export async function updateMpesaCallback(checkoutRequestId: string, updates: MpesaCallbackResponse): Promise<MpesaTransaction> {
  try {
    const status = updates.status
    const resultCode = updates.resultCode
    const resultDesc = updates.resultDesc
    const mpesaReceiptNumber = updates.mpesaReceiptNumber

    // Update transaction in database
    const result = await sql`
        UPDATE mpesa_transactions 
        SET 
          status = ${status},
          result_code = ${resultCode},
          result_desc = ${resultDesc},
          mpesa_receipt_number = ${mpesaReceiptNumber || null},
          transaction_date = ${status === "completed" ? new Date() : null},
          updated_at = NOW()
        WHERE checkout_request_id = ${checkoutRequestId} RETURNING *
      `
    const transaction = result[0];

    return {
      id: transaction.id,
      orderId: transaction.order_id,
      phoneNumber: transaction.phone_number,
      amount: transaction.amount,
      checkoutRequestId: transaction.checkoutRequestId,
      status: transaction.status,
      paymentTransactionId: transaction.payment_transaction_id,
      transactionDate: transaction.transaction_date ? new Date(transaction.transaction_date) : undefined,
      mpesaReceiptNumber: transaction.mpesa_receipt_number,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at,
    }
  } catch (error) {
    console.error("M-Pesa status update error:", error)
    throw {
      success: false,
      status: "failed",
      error: "Failed to update payment status. Please try again.",
    }
  }
}

// Get M-Pesa transaction by order ID
export async function getMpesaTransactionByOrderId(orderId: string): Promise<MpesaTransaction | null> {
  try {
    const result = await sql`
      SELECT * FROM mpesa_transactions 
      WHERE order_id = ${orderId}
      ORDER BY created_at DESC 
      LIMIT 1
    `

    if (result.length === 0) return null

    const row = result[0]
    return {
      id: row.id,
      orderId: row.order_id,
      phoneNumber: row.phone_number,
      amount: Number.parseFloat(row.amount),
      checkoutRequestId: row.checkout_request_id,
      status: row.status,
      mpesaReceiptNumber: row.mpesa_receipt_number,
      paymentTransactionId: row.payment_transaction_id,
      transactionDate: row.transaction_date ? new Date(row.transaction_date) : undefined,
      resultCode: row.result_code,
      resultDesc: row.result_desc,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  } catch (error) {
    console.error("Error fetching M-Pesa transaction:", error)
    return null
  }
}


export async function getMpesaTransactions(filters?: {
  status?: string
  userId?: string
  limit?: number
  offset?: number
}): Promise<MpesaTransaction[]> {
  let query = `
    SELECT * FROM mpesa_transactions
    WHERE 1=1
  `

  const conditions = []

  if (filters?.status) {
    conditions.push(`status = '${filters.status}'`)
  }

  if (filters?.userId) {
    conditions.push(`user_id = '${filters.userId}'`)
  }

  if (conditions.length > 0) {
    query += ` AND ${conditions.join(" AND ")}`
  }

  query += ` ORDER BY created_at DESC`

  if (filters?.limit) {
    query += ` LIMIT ${filters.limit}`
  }

  if (filters?.offset) {
    query += ` OFFSET ${filters.offset}`
  }

  const result = await sql`${sql.unsafe(query)}`;

  return result.map((row) => ({
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
  }))
}

// Get M-Pesa transaction by checkoutRequestId
export async function getTransactionByCheckoutRqId(checkoutRequestId: string): Promise<MpesaTransaction | null> {
  try {
    const result = await sql`
      SELECT * FROM mpesa_transactions 
      WHERE checkout_request_id = ${checkoutRequestId}
      ORDER BY created_at DESC 
      LIMIT 1
    `

    if (result.length === 0) return null

    const row = result[0]
    return {
      id: row.id,
      orderId: row.order_id,
      phoneNumber: row.phone_number,
      amount: Number.parseFloat(row.amount),
      checkoutRequestId: row.checkout_request_id,
      status: row.status,
      mpesaReceiptNumber: row.mpesa_receipt_number,
      paymentTransactionId: row.payment_transaction_id,
      transactionDate: row.transaction_date ? new Date(row.transaction_date) : undefined,
      resultCode: row.result_code,
      resultDesc: row.result_desc,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  } catch (error) {
    console.error("Error fetching M-Pesa transaction:", error)
    return null
  }
}
