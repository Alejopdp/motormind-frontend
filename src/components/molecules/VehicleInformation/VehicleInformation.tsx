type VehicleInformationProps = {
  car: {
    brand: string;
    model: string;
    year: number;
    vinCode: string;
    plate: string;
  };
};

const VehicleInformation: React.FC<VehicleInformationProps> = ({ car }) => {
  return (
    <div className="mt-4 rounded-lg border bg-white p-4 shadow">
      <h5 className="mb-2 text-lg font-medium">Información del vehículo</h5>
      <div className="container">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-0 text-sm text-gray-500">Marca</p>
            <p className="font-medium">{car.brand}</p>
          </div>
          <div>
            <p className="mb-0 text-sm text-gray-500">Modelo</p>
            <p className="font-medium">{car.model}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-0 text-sm text-gray-500">Año</p>
            <p className="font-medium">{car.year}</p>
          </div>
          <div>
            <p className="mb-0 text-sm text-gray-500">{car.plate ? 'Matrícula' : 'VIN'}</p>
            <p className="font-medium">{car.plate ? car.plate : car.vinCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleInformation;
