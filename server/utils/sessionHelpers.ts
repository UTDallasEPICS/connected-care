export const sessionWithDetailsInclude = {
	Type: true,
	Therapist: true,
	Patients: {
		include: {
			Patient: {
				include: {
					User: {
						include: {
							User: true,
						},
					},
				},
			},
		},
	},
} as const;
