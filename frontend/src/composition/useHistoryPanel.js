import { reactive, watchEffect } from '.'
import {
  walletIsLogin,
  compatibleGlobalWalletConf,
} from './walletsResponsiveData'
import openApiAx from '../common/openApiAx'
import util from '../util/util'
import chainConfig from '../config'
// import { getTransactionsHistoryApi } from '../core/routes/transactions'

export const historyPanelState = reactive({
  isLoading: false,
  transactionListInfo: {
    current: 1,
    size: 30,
    total: 0,
    pages: 1,
  },
  transactionList: null,
  historyInfo: null,
  isShowHistory: false,
})

watchEffect(() => {
  !walletIsLogin.value && (historyPanelState.transactionList = [])
  const walletAddress =
    compatibleGlobalWalletConf.value.walletPayload.walletAddress
  if (walletIsLogin.value && walletAddress && walletAddress !== '0x') {
    // getTraddingHistory(true)
  }
})

export function getTraddingHistory(isRefresh = false) {
  if (walletIsLogin.value) {
    if (isRefresh) historyPanelState.transactionList = []
    getTransactionsHistory({ current: 1 })
  }
}
export function setHistoryInfo(info = {}, isShowHistory = true) {
  historyPanelState.isShowHistory = isShowHistory
  // historyPanelState.historyInfo = info
  let token = findTokenDetail(info);
  historyPanelState.historyInfo = {
    fromChainID: info.fromChain,
    fromTimeStamp: util.formatDate(new Date(info.startDate * 1000)),
    fromTxHash: info.fromTxn,
    makerAddress: info.maker,
    state: 0,
    toChainID: info.toChain,
    toTimeStamp: info.endDate,
    toTxHash: info.toTxn,
    tokenName: token.symbol,
    userAddress: info.sender,
    userAmount: Number((info.fromAmount / 10 ** token.decimals).toFixed(8)),
  }
}

const findTokenDetail = (row) => {
  for (let i = 0; i < chainConfig.chainConfig.length; i++) {    
    let chainOne = chainConfig.chainConfig[i]
    if (chainOne.internalId == row.fromChain) {
      if (row.token == chainOne.nativeCurrency.address) {
        return chainOne.nativeCurrency
      }
      
      for (let j = 0; j < chainOne.tokens.length; j++) {
        let tokenOne = chainOne.tokens[j]
        if (tokenOne.address.toLowerCase() == row.token.toLowerCase()) {
          return tokenOne
        }
      }
    }
  }
}

export async function getTransactionsHistory(params = {}) {
  historyPanelState.isLoading = true
  const walletAddress =
    compatibleGlobalWalletConf.value.walletPayload.walletAddress
  if (!walletAddress) {
    historyPanelState.isLoading = false
    return
  }
  const cache = util.getCache(`history_${walletAddress}_${params.current || 1}`)
  try {
    let res
    if (cache) {
      res = cache
    } else {
      res = await openApiAx.get(
        `/transactions/history/${walletAddress}?page=${params.current || 1}`
      )
      util.setCache(
        `history_${walletAddress}_${params.current || 1}`,
        res,
        10000
      )
    }
    const { status, data, page, total } = res
    historyPanelState.transactionList = data.map((row) => {
      let token = findTokenDetail(row)
      let decimal = token.decimals
      const fromDate = new Date(row.startDate * 1000)
      const toDate = new Date(row.endDate)
      row.fromTimeStampShow = util.formatDate(fromDate)
      row.toTimeStampShow = util.formatDate(toDate)
      row.fromTimeStampShowShort = util.formatDate(fromDate, true)
      row.toTimeStampShowShort = util.formatDate(toDate, true)
      row.fromAmountValue = Number((row.fromAmount / 10 ** decimal).toFixed(8))
      row.fromToken = token.symbol
      return row
    })
    historyPanelState.transactionListInfo.current = Number(page || 1)
    historyPanelState.transactionListInfo.total = total
    historyPanelState.isLoading = false
  } catch (error) {
    console.error(error)
  } finally {
    historyPanelState.isLoading = false
  }
}
