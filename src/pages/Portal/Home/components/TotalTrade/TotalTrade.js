import BookingIllustration from 'assets/illustration_booking';
import { WidgetSummaryDesignOne } from 'components/WidgetSummary';
import { useActiveAccountStats } from 'hooks/account';

const TotalTrade = () => {
  const { total_trades } = useActiveAccountStats();

  return <WidgetSummaryDesignOne title="Total Trades" total={total_trades} icon={<BookingIllustration />} />;
};

TotalTrade.dimensions = {
  lg: { w: 4, h: 2, isResizable: true },
  md: { w: 4, h: 2, isResizable: true },
  sm: { w: 12, h: 2, isResizable: true },
  xs: { w: 12, h: 2, isResizable: true }
};

export default TotalTrade;
