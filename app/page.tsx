"use client"

import React, { useState } from "react"
import { Search, ExternalLink, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface TransactionResult {
  address: string
  count: number
  success: boolean
  error?: string
}

export default function IrysTransactionChecker() {
  const [address, setAddress] = useState("")
  const [result, setResult] = useState<TransactionResult | null>(null)
  const [loading, setLoading] = useState(false)

  const isValidEthereumAddress = (addr: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr)
  }

  const fetchTransactionCount = async (walletAddress: string): Promise<TransactionResult> => {
    try {
      const response = await fetch("https://testnet-rpc.irys.xyz/v1/execution-rpc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getTransactionCount",
          params: [walletAddress, "latest"],
          id: 1,
        }),
      })

      if (!response.ok) {
        throw new Error(`Network error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message || "RPC error occurred")
      }

      const count = Number.parseInt(data.result, 16)

      return {
        address: walletAddress,
        count,
        success: true,
      }
    } catch (error) {
      return {
        address: walletAddress,
        count: 0,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!address.trim()) {
      setResult({
        address: "",
        count: 0,
        success: false,
        error: "Please enter a wallet address",
      })
      return
    }

    if (!isValidEthereumAddress(address.trim())) {
      setResult({
        address: address.trim(),
        count: 0,
        success: false,
        error: "Invalid Ethereum address format",
      })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const transactionResult = await fetchTransactionCount(address.trim())
      setResult(transactionResult)
    } catch (error) {
      setResult({
        address: address.trim(),
        count: 0,
        success: false,
        error: "Failed to fetch transaction data",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setAddress("")
    setResult(null)
  }

  const openExplorer = () => {
    if (result?.address) {
      window.open(`https://testnet-explorer.irys.xyz/address/${result.address}`, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Irys Transaction Checker</h1>
          <p className="text-gray-600 text-lg">Check your transaction count on Irys Network Testnet</p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Transaction Count Checker</CardTitle>
            <CardDescription className="text-blue-100">
              Enter your EVM wallet address to view your Irys testnet transaction count
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Wallet Address
                </label>
                <div className="flex gap-2">
                  <Input
                    id="address"
                    type="text"
                    placeholder="0x..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="flex-1"
                    disabled={loading}
                  />
                  <Button type="submit" disabled={loading} className="px-6">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </form>

            {/* Results */}
            {result && (
              <div className="mt-6 space-y-4">
                {result.success ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <div className="space-y-2">
                        <div className="font-medium">Transaction Count Retrieved Successfully</div>
                        <div className="text-sm">
                          Address: <code className="bg-green-100 px-1 rounded text-xs">{result.address}</code>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Total Transactions:</span>
                          <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
                            {result.count.toLocaleString()}
                          </Badge>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <div className="font-medium">Error</div>
                      <div className="text-sm mt-1">{result.error}</div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {result.success && (
                    <Button onClick={openExplorer} variant="outline" className="flex items-center gap-2 bg-transparent">
                      <ExternalLink className="h-4 w-4" />
                      View in Explorer
                    </Button>
                  )}
                  <Button onClick={handleReset} variant="outline">
                    Check Another Address
                  </Button>
                </div>
              </div>
            )}

            {/* Info Section */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">About Irys Network</h3>
              <p className="text-blue-800 text-sm mb-3">
                Irys Network is a decentralized data storage network that provides permanent, immutable data storage
                solutions.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://testnet-explorer.irys.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <ExternalLink className="h-3 w-3" />
                  Testnet Explorer
                </a>
                <span className="text-blue-400">•</span>
                <a
                  href="https://testnet-rpc.irys.xyz/v1/execution-rpc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <ExternalLink className="h-3 w-3" />
                  RPC Endpoint
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attribution */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Created by{" "}
            <a
              href="https://x.com/spyrony420"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              Tanvir Hasan
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
