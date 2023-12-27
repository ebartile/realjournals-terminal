import CheckInIllustration from 'assets/illustration_checkin';
import { WidgetSummaryDesignOne } from 'components/WidgetSummary';

const Winners = () => {
  return <WidgetSummaryDesignOne title="Winners" total={3} icon={<CheckInIllustration />} />;
};

Winners.dimensions = {
  lg: { w: 4, h: 2, isResizable: true },
  md: { w: 4, h: 2, isResizable: true },
  sm: { w: 12, h: 2, isResizable: true },
  xs: { w: 12, h: 2, isResizable: true }
};

export default Winners;
