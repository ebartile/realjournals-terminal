import CheckOutIllustration from 'assets/illustration_checkout';
import { WidgetSummaryDesignOne } from 'components/WidgetSummary';

const Lossers = () => {
  return <WidgetSummaryDesignOne title="Lossers" total={6} icon={<CheckOutIllustration />} />;
};

Lossers.dimensions = {
  lg: { w: 4, h: 2, isResizable: true },
  md: { w: 4, h: 2, isResizable: true },
  sm: { w: 12, h: 2, isResizable: true },
  xs: { w: 12, h: 2, isResizable: true }
};

export default Lossers;
