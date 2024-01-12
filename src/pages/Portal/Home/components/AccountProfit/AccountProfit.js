import CheckOutIllustration from 'assets/illustration_checkout';
import { WidgetSummaryDesignTwo } from 'components/WidgetSummary';
import { useActiveAccount } from 'hooks/account';

const AccountProfit = () => {
  const account = useActiveAccount();
  return (
    <WidgetSummaryDesignTwo
      title="Profit"
      total={account.currency_symbol + ' ' + account.profit}
      icon={'ant-design:chart-filled'}
    />
  );
};

AccountProfit.dimensions = {
  lg: { w: 4, h: 2, isResizable: true },
  md: { w: 4, h: 2, isResizable: true },
  sm: { w: 12, h: 2, isResizable: true },
  xs: { w: 12, h: 2, isResizable: true }
};

export default AccountProfit;
