export type MakeOptional<T, K extends keyof T> =
    Omit<T, K> & { [P in K]?: T[P] };

// type CustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
// export type MakeOPtional<T, K extends keyof T> = CustomOmit<T, K> & Partial<Pick<T, K>>;

// export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;