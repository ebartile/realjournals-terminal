import CheckOutIllustration from 'assets/illustration_checkout';
import { WidgetSummaryDesignTwo } from 'components/WidgetSummary';
import { useActiveAccount } from 'hooks/account';

const AccountFreeMargin = () => {
  const account = useActiveAccount();
  return (
    <WidgetSummaryDesignTwo
      title="Free Margin"
      total={account.currency_symbol + ' ' + account.margin_free}
      icon={'ant-design:chart-filled'}
    />
  );
};

AccountFreeMargin.dimensions = {
  lg: { w: 4, h: 2, isResizable: true },
  md: { w: 4, h: 2, isResizable: true },
  sm: { w: 12, h: 2, isResizable: true },
  xs: { w: 12, h: 2, isResizable: true }
};

export default AccountFreeMargin;
