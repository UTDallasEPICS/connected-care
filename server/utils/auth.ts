import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { sendEmail } from "./email";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "sqlite",
	}),
	session: {
		modelName: "AuthSession",
	},
	plugins: [
		emailOTP({
			overrideDefaultEmailVerification: true,
			disableSignUp: true,
			async sendVerificationOTP({ email, otp, type }) {
				if (type !== "sign-in") {
					console.warn(
						`Unexpected OTP type "${type}" requested for ${email}`
					);
					return;
				}

				// Only send a code to emails that already exist as users
				const existingUser = await prisma.user.findUnique({
					where: { email },
				});
				if (!existingUser) {
					throw new Error(
						"No account found with this email address."
					);
				}

				const subject = "Your sign-in code";
				const text = `Your sign-in code is: ${otp}\n\nThis code will expire shortly. If you didn't request this, you can ignore this email.`;

				if (process.env.NODE_ENV === "development") {
					console.log(`[DEV] OTP for ${email} (sign-in): ${otp}`);
					return;
				}

				try {
					await sendEmail({ to: email, subject, text });
				} catch (err) {
					console.error(`Failed to send OTP email to ${email}:`, err);
					throw err;
				}
			},
		}),
	],
});
