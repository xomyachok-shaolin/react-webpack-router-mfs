declare module '*.svg' {
    import * as React from 'react';

    export const ReactComponent: React.FunctionComponent<React.SVGProps<
        SVGSVGElement
    > & { title?: string }>;
}

declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.jpeg' {
    const value: string;
    export default value;
}

declare module '*.gif' {
    const value: string;
    export default value;
}

declare module '*.bmp' {
    const value: string;
    export default value;
}

declare module '*.tiff' {
    const value: string;
    export default value;
}

declare module '*.ico' {
    const value: string;
    export default value;
}

declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
  }
  

