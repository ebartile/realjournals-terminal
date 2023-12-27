import NetProfitLoss from './components/NetProfitLoss';
// import TradeWinPercentage from './components/TradeWinPercentage';
// import DayWinPercentage from './components/DayWinPercentage';
// import ProfitFactor from './components/ProfitFactor';
// import DailyNetCumulativeProfitLoss from './components/DailyNetCumulativeProfitLoss';

import CurrentBalance from './components/CurrentBalance';
import InviteFriends from './components/InviteFriends';
import Calendar from './components/Calendar';
import TotalTrade from './components/TotalTrade';
import Winners from './components/Winners';
import Lossers from './components/Lossers';

export default [
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
    name: 'calendar',
    dimensions: Calendar.dimensions,
    component: Calendar
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
