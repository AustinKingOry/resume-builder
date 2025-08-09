"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Zap, Crown, Rocket, X, Star } from "lucide-react"
import { siteSettings } from "@/lib/constants"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentUsage: number
  onUpgrade: (plan: "hustler" | "pro") => void
}

export function UpgradeModal({ isOpen, onClose, currentUsage, onUpgrade }: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"hustler" | "pro">("hustler")

  const plans = [
    {
      id: "hustler" as const,
      name: "Hustler Plan",
      price: "KSh 50",
      period: "/month",
      icon: Zap,
      color: "emerald",
      popular: true,
      features: [
        "50 CV roasts per day",
        "Priority AI processing",
        "Advanced Kenya job market insights",
        "Export to PDF & Word",
        "Email support",
        "LinkedIn optimization tips",
      ],
      description: "Perfect for active job seekers",
    },
    {
      id: "pro" as const,
      name: "Professional Plan",
      price: "KSh 200",
      period: "/month",
      icon: Crown,
      color: "purple",
      popular: false,
      features: [
        "200 CV roasts per day",
        "Instant AI processing",
        "Industry-specific feedback",
        "Custom CV templates",
        "Priority support",
        "Interview preparation tips",
        "Salary negotiation guidance",
        "Career coaching insights",
      ],
      description: "For serious career advancement",
    },
  ]

  const handleUpgrade = () => {
    onUpgrade(selectedPlan)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2 dark:text-gray-100">Upgrade Your Plan 🚀</DialogTitle>
              <p className="text-gray-600 dark:text-gray-400">
                You've used {currentUsage}/{siteSettings.paymentPlans.freePlan.limit} free roasts today. Upgrade to continue getting that career boost! 💪
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Why Upgrade Section */}
          <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 dark:border-emerald-800">
            <CardContent className="p-6">
              <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2 dark:text-emerald-200">
                <Star className="w-5 h-5" />
                Why Kenyan Job Seekers Love Our Premium Plans
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-emerald-700 dark:text-emerald-300">3x higher interview rates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-700 dark:text-blue-300">Kenya-specific job insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-purple-700 dark:text-purple-300">Faster career progression</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon
              const isSelected = selectedPlan === plan.id

              return (
                <Card
                  key={plan.id}
                  className={`relative cursor-pointer transition-all duration-200 ${
                    isSelected ? `border-2 border-${plan.color}-500 shadow-lg` : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                  } ${plan.popular ? "ring-2 ring-emerald-200 dark:ring-emerald-800" : ""}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white dark:bg-emerald-400 dark:text-black">
                      Most Popular 🔥
                    </Badge>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 bg-${plan.color}-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-${plan.color}-900`}
                    >
                      <Icon className={`w-8 h-8 text-${plan.color}-600 dark:text-${plan.color}-400`} />
                    </div>
                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                    <p className="text-gray-600 text-sm dark:text-gray-400">{plan.description}</p>
                    <div className="flex items-baseline justify-center gap-1 mt-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{plan.price}</span>
                      <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Payment Methods */}
          <Card className="border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-950/30">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2 dark:text-blue-200">
                <span>💳</span>
                Kenyan Payment Methods Supported
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold dark:text-green-400">M-PESA</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold dark:text-blue-400">Airtel Money</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600 font-bold dark:text-purple-400">Visa/Mastercard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-600 font-bold dark:text-orange-400">PayPal</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleUpgrade}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg font-semibold dark:bg-emerald-400 dark:hover:bg-emerald-300 dark:text-black"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Upgrade to {plans.find((p) => p.id === selectedPlan)?.name} -{" "}
              {plans.find((p) => p.id === selectedPlan)?.price}
            </Button>
            <Button onClick={onClose} variant="outline" className="sm:w-auto px-8 py-3 bg-transparent">
              Maybe Later
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 mb-2 dark:text-gray-400">
              🔒 Secure payments • 💯 30-day money-back guarantee • 🇰🇪 Made in Kenya
            </p>
            <p className="text-xs text-emerald-600 font-medium dark:text-emerald-400">
              Join 10,000+ Kenyan professionals who've upgraded their careers with Kazikit!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}