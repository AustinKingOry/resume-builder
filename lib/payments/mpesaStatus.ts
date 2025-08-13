// mpesaStatus.ts

/**
 * Enum of known M-Pesa STK Push ResultCodes
 * These are based on Safaricom's official documentation and common observed cases.
 */
export enum MpesaResultCode {
    SUCCESS = 0,
    USER_CANCELLED = 1032,
    INSUFFICIENT_FUNDS = 1,
    STK_REQUEST_TIMEOUT = 2001,
    REQUEST_CANCELLED_BY_SYSTEM = 1037,
    EXPIRED = 1025,
    STILL_PROCESSING = 500_001_1001,
    // Add more known codes as needed
  }
  
  /**
   * Type representing high-level transaction status.
   */
  export type TransactionStatus = "checking" | "pending" | "completed" | "failed" | "cancelled";
  
  /**
   * Maps a ResultCode from STK Push Query to a human-readable transaction status.
   *
   * @param resultCode - The ResultCode from the STK push query.
   * @returns TransactionStatus - One of "pending", "completed", "failed", "cancelled".
   */
  export function getTransactionStatus(resultCode: string | number): TransactionStatus {
    const code = typeof resultCode === "string" ? Number(resultCode) : resultCode;
  
    switch (code) {
      case MpesaResultCode.SUCCESS:
        return "completed";
      case MpesaResultCode.USER_CANCELLED:
        return "cancelled";
      case MpesaResultCode.STILL_PROCESSING:
        return "pending";
      case MpesaResultCode.INSUFFICIENT_FUNDS:
      case MpesaResultCode.STK_REQUEST_TIMEOUT:
      case MpesaResultCode.REQUEST_CANCELLED_BY_SYSTEM:
      case MpesaResultCode.EXPIRED:
      default:
        return "failed";
    }
  }
  