"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";

const pricingPlans = [
  {
    name: "Starter",
    price: "$9",
    description: "Perfect for trying out Buildfy",
    features: [
      "100 generations per month",
      "Basic components export", 
      "Community support",
      "Basic analytics"
    ]
  },
  {
    name: "Pro",
    price: "$29",
    description: "For professional developers",
    features: [
      "Unlimited generations",
      "Priority support",
      "Advanced components",
      "Custom styling options",
      "API access"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large teams and organizations",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated support",
      "Team collaboration",
      "Advanced security"
    ]
  }
];

export default function PricingPage() {
  const [particles, setParticles] = useState<Array<{x: number, y: number}>>([]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setParticles(Array.from({ length: 20 }).map(() => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight
        })));
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,rgba(56,189,248,0.2),transparent)]" />
        <div className="absolute inset-0 bg-[length:50px_50px] bg-grid-gray-200/50 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.1), transparent)",
              "radial-gradient(circle at 0% 100%, rgba(99,102,241,0.1), transparent)",
              "radial-gradient(circle at 100% 0%, rgba(236,72,153,0.1), transparent)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-sky-500/20 rounded-full"
            animate={{
              x: [particle.x, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
              y: [particle.y, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="py-8 sm:py-12 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent"
            >
              Simple, transparent pricing
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-sm sm:text-base"
            >
              Choose the perfect plan for your needs
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-lg border-2 ${
                  plan.popular ? 'border-sky-500' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <span className="bg-sky-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 inline-block">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-3 sm:mb-4">
                  <span className="text-3xl sm:text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-gray-600 text-sm sm:text-base">/month</span>}
                </div>
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">{plan.description}</p>
                <Button 
                  className={`w-full mb-4 sm:mb-6 text-sm sm:text-base ${
                    plan.popular ? 'bg-sky-500 hover:bg-sky-600' : ''
                  }`}
                >
                  Get Started
                </Button>
                <ul className="space-y-2 sm:space-y-3">
                  {plan.features.map((feature, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + i * 0.1 }}
                      className="flex items-center gap-2 text-gray-600 text-sm sm:text-base"
                    >
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-sky-500 flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
