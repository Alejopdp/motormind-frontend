import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar as CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import styles from './Calendar.module.css';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { format } from 'date-fns';

interface CalendarProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  placeholder?: string;
  maxDate?: Date | undefined;
}

function Calendar({
  value,
  onChange,
  placeholder = 'Selecciona una fecha',
  maxDate,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date());

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  const filterDate = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const renderCustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
  }: {
    date: Date;
    decreaseMonth: () => void;
    increaseMonth: () => void;
  }) => {
    const month = format(date, 'MMMM', { locale: es });
    const year = format(date, 'yyyy');
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

    return (
      <div className="flex items-center justify-between px-3">
        <button onClick={decreaseMonth} className="hover:text-primary rounded" type="button">
          <ChevronLeftIcon className="!h-4 !w-4" />
        </button>
        <span className="text-sm font-semibold">
          {capitalizedMonth} {year}
        </span>
        <button onClick={increaseMonth} className="hover:text-primary rounded" type="button">
          <ChevronRightIcon className="!h-4 !w-4" />
        </button>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <Datepicker
        showIcon
        selected={value}
        onChange={onChange}
        className="bg-background h-10 w-full rounded-md border border-gray-300 !pl-9 text-sm focus:ring-0 focus:outline-none"
        icon={
          <CalendarIcon
            className={`${value ? 'text-black' : 'text-muted'} absolute top-1/2 left-1 !h-4 !w-4 -translate-y-1/2`}
          />
        }
        placeholderText={placeholder}
        locale={es}
        dateFormat="d 'de' MMMM 'de' yyyy"
        maxDate={maxDate}
        filterDate={filterDate}
        onMonthChange={handleMonthChange}
        renderCustomHeader={renderCustomHeader}
      />
    </div>
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };
