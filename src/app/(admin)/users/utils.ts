import generator from "generate-password-ts";
/**
 * Generates a random password with the following characteristics:
 * - Length: 10
 * - Contains numbers
 * - Contains uppercase letters
 * @returns {string}
 */
export const generatePassword = (): string => {
	return generator.generate({
		length: 10,
		numbers: true,
		uppercase: true,
	});
};
