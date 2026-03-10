export const AUTH_ROLES = [
  {
    key: 'patient',
    label: 'Patient',
    loginPath: '/login/patient',
    registerPath: '/register/patient',
    dashboardPath: '/dashboard/patient',
  },
  {
    key: 'doctor',
    label: 'Doctor',
    loginPath: '/login/doctor',
    registerPath: '/register/doctor',
    dashboardPath: '/dashboard/doctor',
  },
  {
    key: 'hospital',
    label: 'Hospital',
    loginPath: '/login/hospital',
    registerPath: '/register/hospital',
    dashboardPath: '/dashboard/hospital',
  },
];

export const roleByKey = (roleKey) => AUTH_ROLES.find((role) => role.key === roleKey);
