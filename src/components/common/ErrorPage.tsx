import { AlertOctagon, RefreshCw } from "lucide-react";

import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";

export const ErrorPage = () => {
    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div className="flex items-center justify-center">
            <Card className="w-full max-w-[350px] border-none text-center">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center space-x-2 text-slate-600">
                        <AlertOctagon
                            className="h-6 w-6 text-destructive"
                            aria-hidden="true"
                        />
                        <span>Ha ocurrido un problema</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Lo sentimos, ha ocurrido un error inesperado. Por favor,
                        intenta recargar la página.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button
                        onClick={handleReload}
                        variant="outline"
                        className="flex items-center space-x-2"
                    >
                        <RefreshCw className="h-4 w-4" aria-hidden="true" />
                        <span>Recargar página</span>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};
