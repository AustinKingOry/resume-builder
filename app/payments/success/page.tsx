"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Zap, Crown, ArrowRight, Download, Star } from "lucide-react"
import { usageTracker } from "@/lib/usage-tracker"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") || "hustler"

  useEffect(() => {
    // Upgrade the user's plan in the usage tracker
    if (plan === "hustler" || plan === "pro") {
      usageTracker.upgradePlan(plan)
    }
  }, [plan])

  const planDetails = {
    hustler: {
      name: "Hustler Plan",
      icon: Zap,
      color: "emerald",
      limit: 50,
    },
    pro: {
      name: "Professional Plan",
      icon: Crown,
      color: "purple",
      limit: 200,
    },
  }

  const currentPlan = planDetails[plan as keyof typeof planDetails]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Success Card */}
        <Card className="text-center border-emerald-200 bg-gradient-to-br from-emerald-50 to-blue-50">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Premium! 🎉</h1>

            <p className="text-lg text-gray-600 mb-6">
              Your {currentPlan.name} is now active. Time to supercharge your career journey!
            </p>

            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge className={`bg-${currentPlan.color}-100 text-${currentPlan.color}-700 px-4 py-2`}>
                <currentPlan.icon className="w-4 h-4 mr-2" />
                {currentPlan.name}
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                {currentPlan.limit} roasts/day
              </Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-white/60 rounded-lg">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="font-semibold text-sm">Instant Access</h3>
                <p className="text-xs text-gray-600">Start roasting CVs immediately</p>
              </div>
              <div className="p-4 bg-white/60 rounded-lg">
                <div className="text-2xl mb-2">💼</div>
                <h3 className="font-semibold text-sm">Career Boost</h3>
                <p className="text-xs text-gray-600">Land interviews 3x faster</p>
              </div>
              <div className="p-4 bg-white/60 rounded-lg">
                <div className="text-2xl mb-2">🇰🇪</div>
                <h3 className="font-semibold text-sm">Kenya-Focused</h3>
                <p className="text-xs text-gray-600">Local job market insights</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
              >
                <Zap className="w-4 h-4 mr-2" />
                Start Roasting CVs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button onClick={() => router.push("/dashboard")} variant="outline" className="px-8 py-3">
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              What's Next?
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-emerald-600">
                  1
                </div>
                <span className="text-sm">Upload your CV and get instant premium feedback</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-emerald-600">
                  2
                </div>
                <span className="text-sm">Export your improved CV in multiple formats</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-emerald-600">
                  3
                </div>
                <span className="text-sm">Apply to jobs with confidence and land interviews</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receipt */}
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Receipt</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span>{currentPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing:</span>
                <span>Monthly</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next billing:</span>
                <span>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment method:</span>
                <span>M-PESA</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-4 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact our support team at{" "}
            <a href="mailto:support@kazikit.co.ke" className="text-emerald-600 hover:underline">
              support@kazikit.co.ke
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}