import BookingIllustration from 'assets/illustration_booking';
import { WidgetSummaryDesignOne } from 'components/WidgetSummary';

const TotalTrade = () => {
  return <WidgetSummaryDesignOne title="Total Trades" total={9} icon={<BookingIllustration />} />;
};

TotalTrade.dimensions = {
  lg: { w: 4, h: 2, isResizable: true },
  md: { w: 4, h: 2, isResizable: true },
  sm: { w: 12, h: 2, isResizable: true },
  xs: { w: 12, h: 2, isResizable: true }
};

export default TotalTrade;
