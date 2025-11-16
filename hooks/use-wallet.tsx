'use client'

import { create } from 'zustand'
import { BrowserProvider, Contract, JsonRpcSigner } from 'ethers'

interface WalletState {
  address: string | null
  isConnected: boolean
  chainId: number | null
  provider: BrowserProvider | null
  signer: JsonRpcSigner | null
  isConnecting: boolean
  error: string | null
  connect: () => Promise<void>
  disconnect: () => void
  switchToArcTestnet: () => Promise<boolean>
  checkNetwork: () => Promise<boolean>
}

// Arc Testnet configuration
export const ARC_TESTNET_CONFIG = {
  chainId: 5042002,
  chainIdHex: '0x4CEF52',
  chainName: 'Arc Testnet',
  rpcUrl: 'https://rpc.testnet.arc.network',
  blockExplorer: 'https://testnet.arcscan.app',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18,
  },
}

export const useWallet = create<WalletState>((set, get) => ({
  address: null,
  isConnected: false,
  chainId: null,
  provider: null,
  signer: null,
  isConnecting: false,
  error: null,

  connect: async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      const errorMsg = 'Please install MetaMask or another Web3 wallet to continue'
      set({ error: errorMsg })
      alert(errorMsg)
      return
    }

    set({ isConnecting: true, error: null })

    try {
      console.log('[v0] Requesting wallet accounts...')
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })

      console.log('[v0] Accounts received:', accounts)

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please create or unlock an account in your wallet.')
      }

      const provider = new BrowserProvider(window.ethereum)
      const network = await provider.getNetwork()
      const signer = await provider.getSigner()

      console.log('[v0] Connected to network:', Number(network.chainId))

      set({
        address: accounts[0],
        isConnected: true,
        chainId: Number(network.chainId),
        provider,
        signer,
        isConnecting: false,
        error: null,
      })

      // Check if on Arc Testnet
      const isCorrectNetwork = await get().checkNetwork()
      if (!isCorrectNetwork) {
        console.log('[v0] Not on Arc Testnet, user can switch manually')
      }
    } catch (error: any) {
      console.error('[v0] Failed to connect wallet:', error)
      
      let errorMessage = 'Failed to connect wallet'
      
      if (error.code === 4001) {
        errorMessage = 'Connection rejected. Please approve the connection request in your wallet.'
      } else if (error.message?.includes('no account')) {
        errorMessage = 'No accounts found. Please create or unlock an account in your wallet extension.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      set({ 
        isConnecting: false,
        error: errorMessage 
      })
      
      alert(errorMessage)
    }
  },

  disconnect: () => {
    set({
      address: null,
      isConnected: false,
      chainId: null,
      provider: null,
      signer: null,
      error: null,
    })
  },

  switchToArcTestnet: async () => {
    if (!window.ethereum) return false

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARC_TESTNET_CONFIG.chainIdHex }],
      })

      // Update chain ID after switch
      const provider = new BrowserProvider(window.ethereum)
      const network = await provider.getNetwork()
      set({ chainId: Number(network.chainId), error: null })

      return true
    } catch (switchError: any) {
      // This handles both error code 4902 and unrecognized chain errors
      console.log('[v0] Chain switch failed, attempting to add chain:', switchError.message)
      
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: ARC_TESTNET_CONFIG.chainIdHex,
              chainName: ARC_TESTNET_CONFIG.chainName,
              rpcUrls: [ARC_TESTNET_CONFIG.rpcUrl],
              nativeCurrency: ARC_TESTNET_CONFIG.nativeCurrency,
              blockExplorerUrls: [ARC_TESTNET_CONFIG.blockExplorer],
            },
          ],
        })

        // Update chain ID after adding and switching
        const provider = new BrowserProvider(window.ethereum)
        const network = await provider.getNetwork()
        set({ chainId: Number(network.chainId), error: null })

        console.log('[v0] Successfully added and switched to Arc Testnet')
        return true
      } catch (addError: any) {
        console.error('[v0] Failed to add Arc Testnet:', addError)
        
        let errorMessage = 'Failed to add Arc Testnet to wallet'
        if (addError.code === 4001) {
          errorMessage = 'Request to add Arc Testnet was rejected. Please try again and approve the request.'
        }
        
        set({ error: errorMessage })
        alert(errorMessage)
        return false
      }
    }
  },

  checkNetwork: async () => {
    const { chainId } = get()
    return chainId === ARC_TESTNET_CONFIG.chainId
  },
}))

// Add types for window.ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}
