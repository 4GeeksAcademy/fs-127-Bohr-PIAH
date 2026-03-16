ALL_ROLES = ["admin", "head", "staff", "guest"]
PERMISSIONS = {
    "users:read": ALL_ROLES,
    "users:create": ["admin"],
    "users:update": ["admin"],
    "users:delete": ["admin"],

    "projects:read": ALL_ROLES,
    "projects:create": ["admin", "head"],
    "projects:update": ["admin", "head"],
    "projects:delete": ["admin", "head"],

    "work_packages:read": ALL_ROLES,
    "work_packages:create": ["admin", "head"],
    "work_packages:update": ["admin", "head"],
    "work_packages:delete": ["admin", "head"],

    "tasks:read": ALL_ROLES,
    "tasks:create": ["admin", "head", "staff"],
    "tasks:update": ["admin", "head", "staff"],
    "tasks:delete": ["admin", "head", "staff"],

    "departments:read": ALL_ROLES,
    "departments:create": ["admin"],
    "departments:update": ["admin"],
    "departments:delete": ["admin"],

    "reports_project:create": ALL_ROLES,
    "reports_department:create": ["admin", "head"],
    "reports_organization:create": ["admin"]
}
