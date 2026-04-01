enum AccessPermission {
	PUBLIC = "PUBLIC",
	USER = "USER",
	PATIENT = "PATIENT",
	PARENT = "PARENT",
	STAFF = "STAFF",
	THERAPIST = "THERAPIST",
	USER_SERVICE = "USER_SERVICE",
	ADMIN = "ADMIN",
}

/* 
	NOTE: 
		This does not check for extraneous APIs. Clean it yourself. Best to organize it in order when you expand all server/api folders.
		Also, careful when using / and /index. Include both to be safe.
*/

const pageAccessMap: { [routeName: string]: AccessPermission } = {
	// Public Pages
	index: AccessPermission.PUBLIC,
	login: AccessPermission.PUBLIC,
	contactForm: AccessPermission.PUBLIC,
	// All User Pages
	dashboard: AccessPermission.USER,
	scheduleView: AccessPermission.USER,
	// Patient Pages
	"myProfile-id": AccessPermission.PATIENT,
	patientDashboard: AccessPermission.PATIENT,
	// Parent Pages
	childSearch: AccessPermission.PARENT,
	parentDashboard: AccessPermission.PARENT,
	"childProfile-id": AccessPermission.PARENT,
	// All Staff Pages
	patientSearch: AccessPermission.STAFF,
	"patientProfile-id": AccessPermission.STAFF,
	viewContactForms: AccessPermission.STAFF,
	// Therapist Pages
	therapistDashboard: AccessPermission.THERAPIST,
	// User Service Pages
	userServiceDashboard: AccessPermission.USER_SERVICE,
	// Admin Pages
<<<<<<< HEAD:permissions.ts
	admin: AccessPermission.ADMIN,
	employeeSearch: AccessPermission.ADMIN,

	"dashboard-admin": AccessPermission.ADMIN,
	"admin-employeeSearch": AccessPermission.ADMIN,
	"admin-createAccount": AccessPermission.ADMIN,

=======
	"dashboard-admin": AccessPermission.ADMIN,
	"admin-userSearch": AccessPermission.ADMIN,
>>>>>>> parent of 7465499 (Merge pull request #182 from UTDallasEPICS/165-task-pages-for-about-and-contact-in-footer-not-implemented):types/permissions.ts
	// "admin-employeeSearch": AccessPermission.ADMIN,

	// testing:
	"patient-testingForm": AccessPermission.PATIENT,

	// Contact & About
	contact: AccessPermission.USER,
	about: AccessPermission.USER,
};

const apiAccessMap: {
	[route: string]: { [method: string]: AccessPermission };
} = {
	"/api/login": {
		POST: AccessPermission.PUBLIC,
	},
	"/api/updatePermissions": {
		GET: AccessPermission.PUBLIC,
	},
	"/api/contactForm/form": {
		POST: AccessPermission.PUBLIC,
	},
	"/api/session/create": {
		POST: AccessPermission.USER_SERVICE,
	},
	"/api/session/sessionType": {
		GET: AccessPermission.USER_SERVICE || AccessPermission.ADMIN,
	},
};

export { AccessPermission, pageAccessMap, apiAccessMap };
