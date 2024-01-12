import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
import { useSnackbar } from 'notistack5';
import { useState, useRef, useEffect } from 'react';
// material
import { useTheme } from '@material-ui/core/styles';
import { Card, Container, DialogTitle, useMediaQuery } from '@material-ui/core';
import { getEvents, openModal, closeModal, selectEvent, selectRange } from 'store/slices/calendar';
// hooks
import useSettings from 'hooks/useSettings';
// components
import { DialogAnimate } from 'components/animate';
import { CalendarTrades, CalendarStyle, CalendarToolbar } from './components';
import { useDispatch, useSelector } from 'react-redux';
import { useActiveAccount } from 'hooks/account';

// ----------------------------------------------------------------------

const selectedEventSelector = (state) => {
  const { events, selectedEventId } = state.calendar;
  if (selectedEventId) {
    return events.find((_event) => _event.id === selectedEventId);
  }
  return null;
};

const Calendar = () => {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const calendarRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(isMobile ? 'listWeek' : 'dayGridMonth');
  const selectedEvent = useSelector(selectedEventSelector);
  const { events, isOpenModal, selectedRange } = useSelector((state) => state.calendar);
  const startDate = selectedRange ? new Date(selectedRange.start) : new Date();
  const endDate = selectedRange ? new Date(selectedRange.end) : new Date();
  const account = useActiveAccount();

  useEffect(() => {
    dispatch(getEvents(account.id));
  }, [dispatch]);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isMobile ? 'listWeek' : 'dayGridMonth';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isMobile]);

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleSelectRange = (arg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }
    dispatch(selectRange(arg.start, arg.end));
  };

  const handleSelectEvent = (arg) => {
    dispatch(selectEvent(arg.event.id));
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      <Card>
        <CalendarStyle>
          <CalendarToolbar
            date={date}
            view={view}
            onNextDate={handleClickDateNext}
            onPrevDate={handleClickDatePrev}
            onToday={handleClickToday}
            onChangeView={handleChangeView}
          />
          <FullCalendar
            weekends
            editable
            droppable
            selectable
            events={events}
            ref={calendarRef}
            rerenderDelay={10}
            initialDate={date}
            initialView={view}
            dayMaxEventRows={3}
            eventDisplay="block"
            headerToolbar={false}
            allDayMaintainDuration
            eventResizableFromStart
            select={handleSelectRange}
            eventClick={handleSelectEvent}
            height={isMobile ? 'auto' : 720}
            plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
          />
        </CalendarStyle>
      </Card>

      <DialogAnimate open={isOpenModal} onClose={handleCloseModal} maxWidth={'lg'}>
        <DialogTitle>{`From ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`}</DialogTitle>

        <CalendarTrades event={selectedEvent} range={selectedRange} onCancel={handleCloseModal} />
      </DialogAnimate>
    </Container>
  );
};

Calendar.dimensions = {
  lg: { w: 3, h: 2, isResizable: true },
  md: { w: 4, h: 2, isResizable: true },
  sm: { w: 12, h: 2, isResizable: true },
  xs: { w: 12, h: 2, isResizable: true }
};

export default Calendar;
