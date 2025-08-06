"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Shield, CheckCircle, CreditCard, Zap, Crown } from "lucide-react"

export default function PaymentsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedPlan, setSelectedPlan] = useState(searchParams.get("plan") || "hustler")
  const [paymentMethod, setPaymentMethod] = useState("mpesa")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const plans = {
    hustler: {
      name: "Hustler Plan",
      price: 500,
      icon: Zap,
      color: "emerald",
      features: ["50 CV roasts per day", "Priority processing", "Kenya job insights", "Export features"],
    },
    pro: {
      name: "Professional Plan",
      price: 1200,
      icon: Crown,
      color: "purple",
      features: ["200 CV roasts per day", "Instant processing", "Industry-specific feedback", "Custom templates"],
    },
  }

  const currentPlan = plans[selectedPlan as keyof typeof plans]

  const paymentMethods = [
    {
      id: "mpesa",
      name: "M-PESA",
      description: "Pay with your M-PESA mobile money",
      icon: "📱",
      popular: true,
    },
    {
      id: "airtel",
      name: "Airtel Money",
      description: "Pay with Airtel Money",
      icon: "📲",
      popular: false,
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Visa, Mastercard accepted",
      icon: "💳",
      popular: false,
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Pay with your PayPal account",
      icon: "🌐",
      popular: false,
    },
  ]

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setPaymentSuccess(true)
      setIsProcessing(false)

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        router.push(`/payments/success?plan=${selectedPlan}`)
      }, 2000)
    }, 3000)
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4 dark:from-emerald-950 dark:to-blue-950">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-emerald-900">
              <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-gray-100">Payment Successful! 🎉</h2>
            <p className="text-gray-600 mb-4 dark:text-gray-400">Welcome to the {currentPlan.name}! Your account has been upgraded.</p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">Redirecting you back to the dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4 dark:from-emerald-950 dark:to-blue-950">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Complete Your Upgrade</h1>
            <p className="text-gray-600 dark:text-gray-400">Secure payment powered by Kenyan payment providers</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Selected Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-gray-950">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 bg-${currentPlan.color}-100 rounded-full flex items-center justify-center dark:bg-${currentPlan.color}-900`}
                    >
                      <currentPlan.icon className={`w-5 h-5 text-${currentPlan.color}-600 dark:text-${currentPlan.color}-400`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{currentPlan.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Monthly subscription</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">KSh {currentPlan.price}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">/month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-3">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <label
                          htmlFor={method.id}
                          className="flex-1 flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-950"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{method.icon}</span>
                            <div>
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                            </div>
                          </div>
                          {method.popular && <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Most Popular</Badge>}
                        </label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(paymentMethod === "mpesa" || paymentMethod === "airtel") && (
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="0712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-600 mt-1 dark:text-gray-400">You'll receive a payment prompt on your phone</p>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" className="mt-1" />
                      </div>
                    </div>
                  </div>
                )}

                <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-800">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-emerald-800 dark:text-emerald-200">
                    Your payment is secured with 256-bit SSL encryption. We never store your payment details.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>{currentPlan.name}</span>
                  <span>KSh {currentPlan.price}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Tax (16% VAT)</span>
                  <span>KSh {Math.round(currentPlan.price * 0.16)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>KSh {currentPlan.price + Math.round(currentPlan.price * 0.16)}</span>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || (paymentMethod !== "card" && !phoneNumber)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 dark:bg-emerald-400 dark:hover:bg-emerald-300"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 dark:border-black" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay KSh {currentPlan.price + Math.round(currentPlan.price * 0.16)}
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-600 text-center dark:text-gray-400">
                  By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>

            {/* Plan Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">What You Get</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="border-blue-200 bg-blue-50/30 dark:bg-blue-950/30 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium text-blue-800 mb-2 dark:text-blue-200">🔒 Secure & Trusted</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">30-day money-back guarantee • Cancel anytime • 24/7 support</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}