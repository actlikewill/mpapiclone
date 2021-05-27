import { EUserRoles } from "../../../models";

export = [{
    email: 'user1@mailing.com',
    name: 'User One',
    password: 'Passw0rd',
    isEmailVerified: true,
    company: null,
    role: EUserRoles.Admin,
  },
  {
    email: 'user2@mailing.com',
    name: 'User Two',
    password: 'Passw0rd',
    isEmailVerified: false,
    company: null,
    role: EUserRoles.Employee,
  },
  {
    email: 'user3@mailing.com',
    name: 'User Three',
    password: 'Passw0rd',
    isEmailVerified: true,
    company: null,
    role: EUserRoles.Unassigned,
  },
  {
    email: 'user4@mailing.com',
    name: 'User Four',
    password: 'Passw0rd',
    isEmailVerified: false,
    company: null,
    role: EUserRoles.Employee,
  },
]
