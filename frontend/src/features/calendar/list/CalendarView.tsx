import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Stack,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';
import { useSafeQuery } from '@/shared/lib/hooks';
import { calendarEventApi, CalendarEvent } from '@/entities/calendar-event';
import { queryKeys } from '@/shared/lib/react-query';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, startOfWeek, endOfWeek } from 'date-fns';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const CalendarView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const { data: events, isLoading, isError } = useSafeQuery({
    queryKey: queryKeys.calendarEvents.list({
      dateFrom: format(calendarStart, 'yyyy-MM-dd'),
      dateTo: format(calendarEnd, 'yyyy-MM-dd'),
    }),
    queryFn: () => calendarEventApi.getAll({
      dateFrom: format(calendarStart, 'yyyy-MM-dd'),
      dateTo: format(calendarEnd, 'yyyy-MM-dd'),
    }),
  });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    if (!events) return [];
    return events.filter(event => {
      const eventDate = new Date(event.eventDate);
      return isSameDay(eventDate, date);
    });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(addMonths(currentDate, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length > 0) {
      setSelectedEvent(dayEvents[0]);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  const handleAddEvent = () => {
    setSelectedDate(new Date());
    setSelectedEvent(null);
    setOpenDialog(true);
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2, sm: 0 }}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 1, sm: 2 } }}>
              <IconButton onClick={handlePreviousMonth} size={isMobile ? 'small' : 'medium'}>
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ minWidth: { xs: 150, sm: 'auto' }, textAlign: 'center' }}>
                {format(currentDate, 'LLLL yyyy')}
              </Typography>
              <IconButton onClick={handleNextMonth} size={isMobile ? 'small' : 'medium'}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
            {!isMobile && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddEvent}
              >
                Добавить событие
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* FAB для мобильных устройств */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="добавить событие"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
          onClick={handleAddEvent}
        >
          <AddIcon />
        </Fab>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Ошибка при загрузке событий
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card>
          <CardContent sx={{ p: { xs: 1, sm: 3 } }}>
            <Grid container spacing={{ xs: 0.5, sm: 1 }}>
              {WEEKDAYS.map((day) => (
                <Grid item xs key={day} sx={{ textAlign: 'center', fontWeight: 'bold', py: { xs: 0.5, sm: 1 } }}>
                  <Typography variant={isMobile ? 'caption' : 'body2'} color="text.secondary">
                    {day}
                  </Typography>
                </Grid>
              ))}
              {days.map((day) => {
                const dayEvents = getEventsForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isToday = isSameDay(day, new Date());
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const maxEvents = isMobile ? 1 : 3;

                return (
                  <Grid
                    item
                    xs
                    key={day.toISOString()}
                    sx={{
                      minHeight: { xs: 60, sm: 100 },
                      border: '1px solid',
                      borderColor: 'divider',
                      p: { xs: 0.5, sm: 1 },
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'action.selected' : isToday ? 'action.hover' : 'transparent',
                      opacity: isCurrentMonth ? 1 : 0.5,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                    onClick={() => handleDateClick(day)}
                  >
                    <Typography
                      variant={isMobile ? 'caption' : 'body2'}
                      sx={{
                        fontWeight: isToday ? 'bold' : 'normal',
                        color: isToday ? 'primary.main' : 'text.primary',
                        mb: { xs: 0.25, sm: 0.5 },
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                    >
                      {format(day, 'd')}
                    </Typography>
                    {!isMobile && (
                      <Stack spacing={0.5}>
                        {dayEvents.slice(0, maxEvents).map((event) => (
                          <Chip
                            key={event.id}
                            label={event.title}
                            size="small"
                            sx={{
                              fontSize: '0.7rem',
                              height: 20,
                              backgroundColor: event.color || 'primary.main',
                              color: 'white',
                              '& .MuiChip-label': {
                                px: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              },
                            }}
                            icon={event.isCompleted ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <RadioButtonUncheckedIcon sx={{ fontSize: 14 }} />}
                          />
                        ))}
                        {dayEvents.length > maxEvents && (
                          <Typography variant="caption" color="text.secondary">
                            +{dayEvents.length - maxEvents} еще
                          </Typography>
                        )}
                      </Stack>
                    )}
                    {isMobile && dayEvents.length > 0 && (
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: dayEvents[0].color || 'primary.main',
                          mt: 0.25,
                        }}
                      />
                    )}
                    {isMobile && dayEvents.length > 1 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          mt: 0.25,
                          fontSize: '0.65rem',
                        }}
                      >
                        +{dayEvents.length - 1}
                      </Typography>
                    )}
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          {selectedEvent ? 'Детали события' : 'Новое событие'}
        </DialogTitle>
        <DialogContent>
          {selectedEvent ? (
            <Stack spacing={2} sx={{ mt: { xs: 0.5, sm: 1 } }}>
              <TextField
                label="Название"
                value={selectedEvent.title}
                fullWidth
                disabled
                size={isMobile ? 'small' : 'medium'}
              />
              <TextField
                label="Описание"
                value={selectedEvent.description || ''}
                fullWidth
                multiline
                rows={isMobile ? 2 : 3}
                disabled
                size={isMobile ? 'small' : 'medium'}
              />
              <TextField
                label="Дата и время"
                value={format(new Date(selectedEvent.eventDate), 'dd.MM.yyyy HH:mm')}
                fullWidth
                disabled
                size={isMobile ? 'small' : 'medium'}
              />
              {selectedEvent.reminderAt && (
                <TextField
                  label="Напоминание"
                  value={format(new Date(selectedEvent.reminderAt), 'dd.MM.yyyy HH:mm')}
                  fullWidth
                  disabled
                  size={isMobile ? 'small' : 'medium'}
                />
              )}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: { xs: 0.5, sm: 1 } }}>
              Выберите дату: {selectedDate ? format(selectedDate, 'dd.MM.yyyy') : ''}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 2 } }}>
          <Button onClick={handleCloseDialog} fullWidth={isMobile} size={isMobile ? 'medium' : 'large'}>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

