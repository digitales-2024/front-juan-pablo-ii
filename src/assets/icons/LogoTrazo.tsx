import React, { SVGProps } from "react";

export const LogoJuanPablo = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={48}
        height={48}
        fill="none"
        {...props}
    >
        <path fill="url(#a)" d="M0 0h32v32H0z" />
        <defs>
            <pattern
                id="a"
                width={1}
                height={1}
                patternContentUnits="objectBoundingBox"
            >
                <use xlinkHref="#b" transform="scale(.01333)" />
            </pattern>
            <image
                xlinkHref="data:image/png;base64,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"
                id="b"
                width={75}
                height={75}
            />
        </defs>
    </svg>
);
