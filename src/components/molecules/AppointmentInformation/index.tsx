import { User, UserPen, Calendar1, Timer } from 'lucide-react';
import { Appointment } from '@/types/Appointment';

type AppointmentInformationProps = {
  appointment?: Appointment;
};

const AppointmentInformation: React.FC<AppointmentInformationProps> = ({ appointment }) => {
  const client = appointment?.client;
  const receptionist = appointment?.reception;
  return (
    <div className="rounded-lg bg-white p-4 shadow-md sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-green-100 p-2">
            <User className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
          </div>
          <div>
            <p className="text-muted text-xs sm:text-sm">Cliente</p>
            <p className="text-sm font-medium sm:text-base">
              {client?.lastName || client?.firstName || '-'}
            </p>
          </div>
        </div>

        <div className="flex hidden items-center gap-3 md:flex">
          <div className="rounded-md bg-green-100 p-2">
            <UserPen className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
          </div>
          <div>
            <p className="text-muted text-xs sm:text-sm">Agente</p>
            <p className="text-sm font-medium sm:text-base">{receptionist?.agent?.name || '-'}</p>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="rounded-md bg-green-100 p-2">
            <Calendar1 className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
          </div>
          <div>
            <p className="text-muted text-xs sm:text-sm">Fecha Recepción</p>
            <p className="text-sm font-medium sm:text-base">{receptionist?.date || '-'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-md bg-green-100 p-2">
            <Timer className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
          </div>
          <div>
            <p className="text-muted text-xs sm:text-sm">Hora Recepción</p>
            <p className="text-sm font-medium sm:text-base">{receptionist?.time || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentInformation;
