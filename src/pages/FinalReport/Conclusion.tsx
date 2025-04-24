import { MegaphoneIcon } from 'lucide-react';

export const Conclusion = ({
  recommendations,
  nextSteps,
}: {
  recommendations: string[];
  nextSteps: string[];
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-3 flex items-center gap-2 sm:mb-4">
        <div className="rounded-md bg-purple-100 p-2">
          <MegaphoneIcon className="h-4 w-4 text-purple-600 sm:h-5 sm:w-5" />
        </div>
        <h2 className="text-sm font-semibold sm:text-lg">CONCLUSIÓN Y SIGUIENTES PASOS</h2>
      </div>

      <div className="space-y-2 sm:space-y-4">
        <div>
          <h3 className="mb-2 text-sm font-medium sm:text-base">Recomendaciones:</h3>
          <ul className="list-disc space-y-2 pl-4 sm:pl-6">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="text-muted text-xs sm:text-base">
                {recommendation}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium sm:text-base">Siguientes Pasos:</h3>
          <ul className="list-disc space-y-2 pl-4 sm:pl-6">
            {nextSteps.map((step, index) => (
              <li key={index} className="text-muted text-xs sm:text-base">
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
