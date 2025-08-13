"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, Smartphone, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { stkPushQuery } from "@/actions/stkPushQuery"
import { getTransactionStatus } from "@/lib/payments/mpesaStatus"
import axios from "axios"

interface MpesaPaymentDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (receiptNumber: string) => void
  checkoutRequestId: string
  phoneNumber: string
  amount: number
}

export function MpesaPaymentDialog({
  isOpen,
  onClose,
  onSuccess,
  checkoutRequestId,
  phoneNumber,
  amount,
}: MpesaPaymentDialogProps) {
  const [status, setStatus] = useState<"checking" | "pending" | "completed" | "failed" | "cancelled">("checking")
  const [error, setError] = useState<string>("")
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [receiptNumber, setReceiptNumber] = useState<string>("")
  const statusRef = useRef<"checking" | "pending" | "completed" | "failed" | "cancelled">("checking");

  useEffect(() => {
    statusRef.current = status; // Sync ref with latest status
  }, [status]);

  useEffect(() => {
    if (!isOpen || !checkoutRequestId) return
    
    let interval: NodeJS.Timeout
    let timeInterval: NodeJS.Timeout
    let isRequestInFlight = false;

    const checkStatus = async () => {
      if (isRequestInFlight) return; // Don't make another request if the previous hasn't completed
      isRequestInFlight = true;
      try {
        const { data, error } = await stkPushQuery(checkoutRequestId);
        // console.log(data)

  
        if (error) {
          if (error.response?.errorCode === "500.001.1001") {
            console.log("Still processing — waiting for user to confirm M-Pesa.");
            return; // skip this cycle
          }

          console.log("Processing: ", error.response?.errorCode == "500.001.1001");
          setError(error?.response?.errorMessage || "Failed to check payment status");
          setStatus("failed");
          clearInterval(interval);
          clearInterval(timeInterval);
          updateTransaction("failed", error?.response?.data?.errorMessage || "Failed to check payment status","","")
          return;
        }
        if (data) {
          const trans_status = getTransactionStatus(data.ResultCode)
          setStatus(trans_status)

          if (data.ResultCode === "0" && trans_status === "completed") {
            clearInterval(interval)
            clearInterval(timeInterval)
            const db_response = await getTransaction(checkoutRequestId)
            
            if(db_response){
              setReceiptNumber(db_response.mpesaReceiptNumber || data.mpesaReceiptNumber!)
              // Wait a moment to show success message before calling onSuccess
              setTimeout(() => {
                onSuccess(db_response.mpesaReceiptNumber || data.mpesaReceiptNumber!)
              }, 1000)
            }
          } else if (trans_status === "failed" || trans_status === "cancelled") {
            setError(data.ResultDesc || "Payment failed")
            clearInterval(interval)
            clearInterval(timeInterval)
            updateTransaction(trans_status, data.ResultDesc || "Payment failed", data.ResultCode, data.mpesaReceiptNumber)
          }
        }
      } catch (err) {
        console.error("Status check error:", err)
        setError("Network error. Please check your connection.")
        setStatus("failed")
        clearInterval(interval)
        clearInterval(timeInterval)
        updateTransaction("failed", "Network error. Please check your connection.","","")
      } finally {
        isRequestInFlight = false; // release lock
      }
    }

    // Start checking status immediately
    checkStatus()

    if(statusRef.current === "checking" || statusRef.current === "pending"){
      // Check status every 5 seconds
      interval = setInterval(checkStatus, 5000)
  
      // Update time elapsed every second
      timeInterval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
  
      // Stop checking after 2 minutes
      setTimeout(() => {
        if (statusRef.current === "checking" || statusRef.current === "pending") {
          setError("Payment timeout. Please try again.")
          setStatus("failed")
          clearInterval(interval)
          clearInterval(timeInterval)
          updateTransaction("failed", "Payment timeout. Please try again.","","")
        }
      }, 120000)
    }

    return () => {
      clearInterval(interval)
      clearInterval(timeInterval)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, checkoutRequestId, onSuccess])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatPhoneNumber = (phone: string) => {
    // Format 254712345678 to +254 712 345 678
    if (phone.startsWith("254")) {
      return `+254 ${phone.slice(3, 6)} ${phone.slice(6, 9)} ${phone.slice(9)}`
    }
    return phone
  }

  const handleClose = () => {
    if (status === "completed") return // Don't allow closing on success
    onClose()
  }

  const handleRetry = () => {
    onClose()
  }

  const updateTransaction = async (status: string, resultDesc: string, resultCode: string, mpesaReceiptNumber: string)=> {
    try {
      const response = await axios.put(
        `/api/mpesa/${checkoutRequestId}`,
        {
          status,
          resultCode,
          resultDesc,
          mpesaReceiptNumber,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error)
      return null;
    }
  }

  const getTransaction = async (checkoutRequestId: string)=> {
    try {
      const response = await axios.get(
        `/api/mpesa/${checkoutRequestId}`
      );
      return response.data;
    } catch (error) {
      console.error(error)
      return null;
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-green-600" />
            M-Pesa Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">KES {amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{formatPhoneNumber(phoneNumber)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{formatTime(timeElapsed)}</span>
            </div>
          </div>

          {/* Status Display */}
          <div className="text-center space-y-4">
            {status === "checking" && (
              <>
                <div className="flex justify-center">
                  <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Initiating Payment...</h3>
                  <p className="text-sm text-gray-600 mt-1">Please wait while we process your request</p>
                </div>
              </>
            )}

            {status === "pending" && (
              <>
                <div className="flex justify-center">
                  <div className="relative">
                    <Smartphone className="w-12 h-12 text-green-600" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 rounded-full animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Check Your Phone</h3>
                  <p className="text-sm text-gray-600 mt-1">Enter your M-Pesa PIN to complete the payment</p>
                </div>
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    You will receive an M-Pesa prompt on {formatPhoneNumber(phoneNumber)}. Enter your PIN to complete
                    the payment.
                  </AlertDescription>
                </Alert>
              </>
            )}

            {status === "completed" && (
              <>
                <div className="flex justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-green-900">Payment Successful!</h3>
                  <p className="text-sm text-gray-600 mt-1">Receipt: {receiptNumber}</p>
                </div>
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Your payment has been processed successfully. You will receive an SMS confirmation shortly.
                  </AlertDescription>
                </Alert>
              </>
            )}

            {(status === "failed" || status === "cancelled") && (
              <>
                <div className="flex justify-center">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium text-red-900">Payment Failed</h3>
                  <p className="text-sm text-gray-600 mt-1">{error || "The payment could not be completed"}</p>
                </div>
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error || "Payment was not completed. Please try again."}
                  </AlertDescription>
                </Alert>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {status === "completed" ? (
              <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                <CheckCircle className="w-4 h-4 mr-2" />
                Payment Completed
              </Button>
            ) : status === "failed" || status === "cancelled" ? (
              <>
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleRetry} className="flex-1 btn-primary">
                  Try Again
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleClose} className="w-full">
                Cancel Payment
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
