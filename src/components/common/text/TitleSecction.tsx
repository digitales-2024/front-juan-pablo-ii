interface TitleSecctionProps {
    text: string;
}

export const TitleSecction = ({ text }: TitleSecctionProps) => {
    return <h1 className="text-4xl font-bold">{text}</h1>;
};
