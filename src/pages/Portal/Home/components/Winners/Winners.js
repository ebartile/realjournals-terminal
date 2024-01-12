import CheckInIllustration from 'assets/illustration_checkin';
import { WidgetSummaryDesignOne } from 'components/WidgetSummary';
import { useActiveAccountStats } from 'hooks/account';

const Winners = () => {
  const { total_winning_trades } = useActiveAccountStats();

  return <WidgetSummaryDesignOne title="Winners" total={total_winning_trades} icon={<CheckInIllustration />} />;
};

Winners.dimensions = {
  lg: { w: 4, h: 2, isResizable: true },
  md: { w: 4, h: 2, isResizable: true },
  sm: { w: 12, h: 2, isResizable: true },
  xs: { w: 12, h: 2, isResizable: true }
};

export default Winners;
