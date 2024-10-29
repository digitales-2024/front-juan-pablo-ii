interface TitleSecctionProps {
    text: string;
  }
  
  export const TitleSecction = ({ text }: TitleSecctionProps) => {
    return <h1 className="text-3xl font-bold text-gray-900">{text}</h1>;
  };