import { MegaphoneIcon } from 'lucide-react';

export const Conclusion = ({
  recommendations,
  nextSteps,
}: {
  recommendations: string[];
  nextSteps: string[];
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-md bg-purple-100 p-2">
          <MegaphoneIcon className="h-5 w-5 text-purple-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">CONCLUSIÓN Y SIGUIENTES PASOS</h2>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="mb-2 font-medium text-gray-800">Recomendaciones:</h3>
          <ul className="list-disc space-y-2 pl-6">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="text-muted">
                {recommendation}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 font-medium text-gray-800">Siguientes Pasos:</h3>
          <ul className="list-disc space-y-2 pl-6">
            {nextSteps.map((step, index) => (
              <li key={index} className="text-muted">
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
