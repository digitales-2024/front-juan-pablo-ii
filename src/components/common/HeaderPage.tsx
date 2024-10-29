import { TitleSecction } from "./text/TitleSecction";

interface HeaderPageProps {
  title: string;
  description?: string;
}

export const HeaderPage = ({ title, description }: HeaderPageProps) => {
  return (
    <div>
      <TitleSecction text={title} />
      <span className="text-sm text-slate-600">{description}</span>
    </div>
  );
};
