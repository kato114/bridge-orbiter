exports.chains = [
  {
    api: {
      url: "https://api-goerli.etherscan.io/api",
      key: "U6B1T739U9D1CCR54H783CQF5MYI2QHC3K",
    },
    chainId: "5",
    networkId: "5",
    internalId: "5",
    name: "Görli",
    contracts: ["0xD9D74a29307cc6Fc8BF424ee4217f1A587FBc8Dc"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
    },
    rpc: [
      "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      "https://eth-goerli.public.blastapi.io",
      "https://rpc.ankr.com/eth_goerli",
      "https://rpc.goerli.mudit.blog",
      "https://eth-goerli.g.alchemy.com/v2/demo",
    ],
    watch: ["rpc"],
    tokens: [
      {
        name: "USDT",
        symbol: "USDT",
        decimals: 6,
        address: "0x07c271C9af84F3A08ea233e3F23853504Eb27A66",
      },
      {
        name: "USDC",
        symbol: "USDC",
        decimals: 6,
        address: "0xBA4b1F004B0fA32807ED9E4dd90dD3F3Fa09eaa7",
      },
      {
        name: "DAI",
        symbol: "DAI",
        decimals: 6,
        address: "0x1Db7ad74EC813f0f4912eE343605DB633eAE2887",
      },
    ],
    infoURL: "https://goerli.etherscan.io",
  },
  {
    api: {
      url: "https://api-goerli.arbiscan.io/api",
      key: "KT3QFHCMKSWUGKI6IC931VW1BMZSW31519",
    },
    chainId: "421613",
    networkId: "421613",
    internalId: "22",
    name: "Arbitrum(G)",
    contracts: ["0x1AC6a2965Bd55376ec27338F45cfBa55d8Ba380a"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      address: "0x0000000000000000000000000000000000000000",
    },
    rpc: [
      "https://arbitrum-goerli.publicnode.com	",
      "https://arb-goerli.g.alchemy.com/v2/demo",
      "https://endpoints.omniatech.io/v1/arbitrum/goerli/public",
    ],
    watch: ["rpc"],
    tokens: [
      {
        name: "USDT",
        symbol: "USDT",
        decimals: 6,
        address: "0xDc3D17217906b93aBf1be6BA6fa05bD1d9215451",
      },
      {
        name: "USDC",
        symbol: "USDC",
        decimals: 18,
        address: "0xadf393f388BBd5EFbA07987dd734467F7c6e81f0",
      },
      {
        name: "DAI",
        symbol: "DAI",
        decimals: 6,
        address: "0x79369226fe743EC278C7169B83D2FEd7A0500642",
      },
    ],
    infoURL: "https://arbitrum.io",
  },
];
