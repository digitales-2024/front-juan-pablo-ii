import generator from "generate-password-ts";
/**
 * Generates a random password with the following characteristics:
 * - Length: 10
 * - Contains numbers
 * - Contains uppercase letters
 * @returns {string}
 */
export const generatePassword = (): string => {
	const maxAttempts = 10;
	let password: string;
	let attempts = 0;

	do {
		password = generator.generate({
			length: 10,
			numbers: true,
			uppercase: true,
		});
		attempts++;
	} while (!/\d/.test(password) && attempts < maxAttempts);

	if (!/\d/.test(password)) {
		throw new Error(
			"Failed to generate a valid password after maximum attempts"
		);
	}

	return password;
};
