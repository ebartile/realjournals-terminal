import CheckOutIllustration from 'assets/illustration_checkout';
import { WidgetSummaryDesignTwo } from 'components/WidgetSummary';
import { useActiveAccount } from 'hooks/account';

const AccountMargin = () => {
  const account = useActiveAccount();
  return (
    <WidgetSummaryDesignTwo
      title="Margin"
      total={account.currency_symbol + ' ' + account.margin}
      icon={'ant-design:chart-filled'}
    />
  );
};

AccountMargin.dimensions = {
  lg: { w: 4, h: 2, isResizable: true },
  md: { w: 4, h: 2, isResizable: true },
  sm: { w: 12, h: 2, isResizable: true },
  xs: { w: 12, h: 2, isResizable: true }
};

export default AccountMargin;
