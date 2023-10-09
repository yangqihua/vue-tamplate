const isTest = false
export default {
  title: 'BTC Quant',
  userToken: 'userToken',
  fixedHeader: false,
  sidebarLogo: false,

  serverUrl: isTest ? 'http://localhost:7777/' : 'http://localhost:7777/',
  zeroAddress: '0x0000000000000000000000000000000000000000',
  factory: isTest ? '' : '',

  isTest: isTest,
  network: {
    chainId: isTest ? 5 : 1,
    hosts: isTest ? [
        'https://goerli.infura.io/v3/84842078b09946638c03157f834052'
        // 'https://www.ethercluster.com/goerli/',
      ] :
      [
        'https://eth.llamarpc.com/',
        'https://mainnet.infura.io/v3/84842078b09946638c03157f83405'
      ],
    scan: isTest ? 'https://goerli.etherscan.io/' : 'https://etherscan.io/'
  }
}
