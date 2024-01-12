import CheckOutIllustration from 'assets/illustration_checkout';
import { WidgetSummaryDesignOne } from 'components/WidgetSummary';
import { useActiveAccountStats } from 'hooks/account';

const Lossers = () => {
  const { total_lossing_trades } = useActiveAccountStats();
  return <WidgetSummaryDesignOne title="Lossers" total={total_lossing_trades} icon={<CheckOutIllustration />} />;
};

Lossers.dimensions = {
  lg: { w: 4, h: 2, isResizable: true },
  md: { w: 4, h: 2, isResizable: true },
  sm: { w: 12, h: 2, isResizable: true },
  xs: { w: 12, h: 2, isResizable: true }
};

export default Lossers;
