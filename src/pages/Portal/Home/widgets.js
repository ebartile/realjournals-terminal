import NetProfitLoss from './components/NetProfitLoss';
// import TradeWinPercentage from './components/TradeWinPercentage';
// import DayWinPercentage from './components/DayWinPercentage';
// import ProfitFactor from './components/ProfitFactor';
// import DailyNetCumulativeProfitLoss from './components/DailyNetCumulativeProfitLoss';

import CurrentBalance from './components/CurrentBalance';
import InviteFriends from './components/InviteFriends';
import TotalTrade from './components/TotalTrade';
import Winners from './components/Winners';
import Lossers from './components/Lossers';
import Welcome from './components/Welcome';
import TradeAllocation from './components/TradeAllocation';
import AccountMargin from './components/AccountMargin';
import AccountLeverage from './components/AccountLeverage';
import AccountFreeMargin from './components/AccountFreeMargin';
import AccountProfit from './components/AccountProfit';

export default [
  {
    name: 'welcome',
    dimensions: Welcome.dimensions,
    component: Welcome
  },
  {
    name: 'total_trades',
    dimensions: TotalTrade.dimensions,
    component: TotalTrade
  },
  {
    name: 'winners',
    dimensions: Winners.dimensions,
    component: Winners
  },
  {
    name: 'lossers',
    dimensions: Lossers.dimensions,
    component: Lossers
  },
  {
    name: 'net_profit_loss',
    dimensions: NetProfitLoss.dimensions,
    component: NetProfitLoss
  },
  {
    name: 'account_balance',
    dimensions: CurrentBalance.dimensions,
    component: CurrentBalance
  },
  {
    name: 'invite_member_card',
    dimensions: InviteFriends.dimensions,
    component: InviteFriends
  },
  {
    name: 'trade_allocation',
    dimensions: TradeAllocation.dimensions,
    component: TradeAllocation
  },
  {
    name: 'account_margin',
    dimensions: AccountMargin.dimensions,
    component: AccountMargin
  },
  {
    name: 'account_leverage',
    dimensions: AccountLeverage.dimensions,
    component: AccountLeverage
  },
  {
    name: 'account_free_margin',
    dimensions: AccountFreeMargin.dimensions,
    component: AccountFreeMargin
  },
  {
    name: 'account_profit',
    dimensions: AccountProfit.dimensions,
    component: AccountProfit
  }
  // {
  //   name: 'trade_win_percentage',
  //   dimensions: TradeWinPercentage.dimensions,
  //   component: TradeWinPercentage
  // },
  // {
  //   name: 'profit_factor',
  //   dimensions: ProfitFactor.dimensions,
  //   component: ProfitFactor
  // },
  // {
  //   name: 'day_win_percentage',
  //   dimensions: DayWinPercentage.dimensions,
  //   component: DayWinPercentage
  // },
  // {
  //   name: 'daily_net_cummulative_profit_loss',
  //   dimensions: DailyNetCumulativeProfitLoss.dimensions,
  //   component: DailyNetCumulativeProfitLoss
  // }
];
