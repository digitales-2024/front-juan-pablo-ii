import { components } from "../api";

export type BaseApiResponse<T = any> = Omit<
	components["schemas"]["BaseApiResponse"],
	"data"
> & {
	data: T;
};
