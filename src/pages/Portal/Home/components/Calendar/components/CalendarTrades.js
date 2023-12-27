import { merge } from 'lodash';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
// material
import { Grid } from '@material-ui/core';
// redux
import { updateEvent, deleteEvent } from 'redux/slices/calendar';
//
import { useDispatch } from 'react-redux';
import { WidgetSummaryDesignOne, WidgetSummaryDesignTwo } from 'components/WidgetSummary';
import CheckOutIllustration from 'assets/illustration_checkout';
import CheckInIllustration from 'assets/illustration_checkin';
import BookingIllustration from 'assets/illustration_booking';
import NetProfitLoss from '../../NetProfitLoss';

CalendarTrades.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func
};

export default function CalendarTrades({ event, range, onCancel }) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const isCreating = !event;

  const handleDelete = async () => {
    try {
      onCancel();
      dispatch(deleteEvent(event.id));
      enqueueSnackbar('Delete event success', { variant: 'success' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid container spacing={3} sx={{ mb: 7 }}>
      <Grid item xs={12} md={3}>
        <NetProfitLoss />
      </Grid>

      <Grid item xs={12} md={3}>
        <WidgetSummaryDesignOne title="Total Trades" total={9} icon={<BookingIllustration />} />
        <WidgetSummaryDesignTwo title="Weekly Sales" total={714000} icon={'ant-design:android-filled'} />
      </Grid>

      <Grid item xs={12} md={3}>
        <WidgetSummaryDesignOne title="Winners" total={3} icon={<CheckInIllustration />} />
        <WidgetSummaryDesignTwo title="New Users" total={1352831} color="info" icon={'ant-design:apple-filled'} />
      </Grid>

      <Grid item xs={12} md={3}>
        <WidgetSummaryDesignOne title="Lossers" total={6} icon={<CheckOutIllustration />} />
        <WidgetSummaryDesignTwo title="Bug Reports" total={234} color="error" icon={'ant-design:bug-filled'} />
      </Grid>
    </Grid>
  );
}
