export const ResourceLinkItems = ({
  resources,
}: {
  resources: { label: string; url: string }[];
}) => {
  if (resources.length === 0) return null;
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium sm:text-base">Recursos:</h4>
      <ul className="text-primary list-disc space-y-1 pl-6">
        {resources.map((resource, idx) => (
          <li key={idx}>
            <a
              href={resource?.url}
              className="text-primary text-xs sm:text-base"
              target="_blank"
              rel="video_reference"
            >
              {resource?.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
