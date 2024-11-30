const infoBussiness = {
    url: "https://trazo.com",
};
export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <div className="z-20 w-full border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-4 flex h-auto flex-col items-center sm:h-14 sm:justify-end md:mx-8 md:flex-row">
                <div className="mb-4 text-sm text-muted-foreground md:mb-0">
                    © {currentYear}{" "}
                    <a
                        href={infoBussiness.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary"
                    >
                        Juan Pablo II
                    </a>
                </div>
            </div>
        </div>
    );
}
