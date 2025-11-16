// NFT Contract Configuration for Arc Testnet
export const NFT_CONTRACT_CONFIG = {
  address: '0xb1b4570aa453ea000864958e94166dd837069866', // Updated with deployed contract address on Arc Testnet
  abi: [
    // mintWish function
    'function mintWish(address to, string memory wishText, string memory dateKey) external returns (uint256)',
    // Get wishes by address
    'function getWishesByAddress(address owner) external view returns (tuple(uint256 tokenId, string wishText, string dateKey, uint256 timestamp)[])',
    // Check if minted today
    'function hasMintedToday(address user, string memory dateKey) external view returns (bool)',
    // Get token URI
    'function tokenURI(uint256 tokenId) external view returns (string)',
    // Events
    'event WishMinted(address indexed to, uint256 indexed tokenId, string wishText, string dateKey, uint256 timestamp)',
  ],
}

export function isContractDeployed(): boolean {
  return NFT_CONTRACT_CONFIG.address !== '0x0000000000000000000000000000000000000000'
}

export type Wish = {
  tokenId: number
  wishText: string
  dateKey: string
  timestamp: number
}
