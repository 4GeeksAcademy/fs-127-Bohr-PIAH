import random
from datetime import datetime, timedelta
from faker import Faker

from api.models import db

from api.services.department_service import DepartmentService
from api.services.user_service import UserService
from api.services.project_service import ProjectService
from api.services.work_package_service import WorkPackageService
from api.services.task_service import TaskService

from api.models.department import Department
from api.models.user import User
from api.models.project import Project
from api.models.work_package import WorkPackage
from api.models.UserProject import UserProject

fake = Faker()

print("Starting DB seed...")
# to run:
# pipenv shell
# flask shell
# exec(open("/workspaces/fs-127-Bohr-PIAH/src/api/db_populate/seed.py").read())


def get_user_by_email(email):
    return User.query.filter_by(email=email).first()


def get_department_by_name(name):
    return Department.query.filter_by(name=name).first()


def get_project_members(project_id):
    memberships = UserProject.query.filter_by(project_id=project_id).all()
    return [m.user_id for m in memberships]


print("Starting DB seed...")

# -------------------------------------------------
# 0. OPTIONAL SAFETY CHECK
# -------------------------------------------------
# Si no quieres duplicar datos al ejecutar varias veces, descomenta esto:
#
# if Department.query.first() or User.query.first() or Project.query.first():
#     print("Database already has data. Seed cancelled.")
#     raise SystemExit

# -------------------------------------------------
# 1. CREATE DEPARTMENTS
# -------------------------------------------------

department_names = [
    "Engineering",
    "Product",
    "Operations",
    "Marketing",
]

for dept_name in department_names:
    if not get_department_by_name(dept_name):
        DepartmentService.create({
            "name": dept_name
        })

departments = Department.query.order_by(Department.id).all()
print(f"Departments ready: {len(departments)}")

# -------------------------------------------------
# 2. CREATE ONE GLOBAL ADMIN
# -------------------------------------------------

admin_email = "admin@seed.local"
admin = get_user_by_email(admin_email)

if not admin:
    UserService.create({
        "first_name": "Global",
        "last_name": "Admin",
        "email": admin_email,
        "password": "1234",
        "role": "admin"
    })
    admin = get_user_by_email(admin_email)

print(f"Admin ready: {admin.email}")

# -------------------------------------------------
# 3. CREATE ONE HEAD PER DEPARTMENT
# -------------------------------------------------

department_heads = {}

for dept in departments:
    safe_name = dept.name.lower().replace(" ", "_")
    head_email = f"head_{safe_name}@seed.local"

    head_user = get_user_by_email(head_email)

    if not head_user:
        UserService.create({
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "email": head_email,
            "password": "1234",
            "role": "head"
        })
        head_user = get_user_by_email(head_email)

    if head_user.department_id != dept.id:
        UserService.update(head_user.id, {
            "department_id": dept.id
        })

    DepartmentService.update(dept.id, {
        "head_id": head_user.id
    })

    department_heads[dept.id] = head_user

print("Department heads assigned")

# -------------------------------------------------
# 4. ASSIGN ADMIN TO A DEPARTMENT
# -------------------------------------------------

engineering = get_department_by_name("Engineering")
if engineering and admin.department_id != engineering.id:
    UserService.update(admin.id, {
        "department_id": engineering.id
    })

# -------------------------------------------------
# 5. CREATE STAFF USERS
# -------------------------------------------------

target_staff_per_department = 5

for dept in departments:
    current_users = User.query.filter_by(department_id=dept.id).count()

    # ya hay al menos el head; además puede estar el admin en Engineering
    missing = max(0, target_staff_per_department + 1 - current_users)

    for _ in range(missing):
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = fake.unique.email()

        UserService.create({
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "password": "1234",
            "role": "staff"
        })

        created_user = get_user_by_email(email)

        UserService.update(created_user.id, {
            "department_id": dept.id
        })

users = User.query.all()
print(f"Users ready: {len(users)}")

# -------------------------------------------------
# 6. CREATE PROJECTS
# -------------------------------------------------

project_names_by_department = {
    "Engineering": [
        "Platform Rewrite",
        "Internal API Modernization",
        "Observability Upgrade",
    ],
    "Product": [
        "Roadmap Q2",
        "Feedback Intelligence",
        "Onboarding Improvements",
    ],
    "Operations": [
        "Vendor Consolidation",
        "Process Automation",
        "Support Workflow Refresh",
    ],
    "Marketing": [
        "Campaign Hub",
        "SEO Expansion",
        "Brand Asset Cleanup",
    ],
}

for dept in departments:
    head = department_heads.get(dept.id)
    if not head:
        continue

    names = project_names_by_department.get(dept.name, [])
    for name in names:
        existing = Project.query.filter_by(
            name=name,
            department_id=dept.id
        ).first()

        if existing:
            continue

        created_at = fake.date_time_between(
            start_date="-120d",
            end_date="-30d",
            tzinfo=None
        )
        deadline = created_at + timedelta(days=random.randint(30, 120))

        ProjectService.create({
            "name": name,
            "department_id": dept.id,
            "created_by": head.id,
            "created_at": created_at.isoformat(),
            "deadline": deadline.isoformat(),
            "finalized": random.choice([False, False, False, True])
        })

projects = Project.query.order_by(Project.id).all()
print(f"Projects ready: {len(projects)}")

# -------------------------------------------------
# 7. CREATE PROJECT MEMBERSHIPS
# -------------------------------------------------

for project in projects:
    dept_users = User.query.filter_by(
        department_id=project.department_id).all()

    if not dept_users:
        continue

    existing_member_ids = set(get_project_members(project.id))

    # añadimos siempre al owner
    candidate_ids = {project.user_id}

    # añadimos más miembros del mismo departamento
    selectable_users = [u.id for u in dept_users if u.id != project.user_id]
    extra_count = min(len(selectable_users), random.randint(2, 5))
    if extra_count > 0:
        candidate_ids.update(random.sample(selectable_users, extra_count))

    new_memberships = []
    for user_id in candidate_ids:
        if user_id not in existing_member_ids:
            new_memberships.append(
                UserProject(user_id=user_id, project_id=project.id)
            )

    if new_memberships:
        db.session.add_all(new_memberships)
        db.session.commit()

print("Project members assigned")

# -------------------------------------------------
# 8. CREATE WORK PACKAGES
# -------------------------------------------------

wp_names = [
    "Backend",
    "Frontend",
    "Infrastructure",
    "Testing",
    "Documentation",
]

for project in projects:
    existing_wp_names = {
        wp.name for wp in WorkPackage.query.filter_by(project_id=project.id).all()
    }

    selected_names = random.sample(wp_names, random.randint(2, 4))

    for wp_name in selected_names:
        if wp_name in existing_wp_names:
            continue

        WorkPackageService.create({
            "name": wp_name,
            "project_id": project.id
        })

wps = WorkPackage.query.order_by(WorkPackage.id).all()
print(f"Work packages ready: {len(wps)}")

# -------------------------------------------------
# 9. CREATE TASKS
# -------------------------------------------------

task_name_templates = [
    "Design endpoint contract",
    "Implement validation rules",
    "Fix authentication bug",
    "Prepare test dataset",
    "Refactor service layer",
    "Write API documentation",
    "Review merge request",
    "Add filtering support",
    "Improve error handling",
    "Create report section",
]

statuses = ["to_do", "in_progress", "in_review", "done"]

for wp in wps:
    member_ids = get_project_members(wp.project_id)

    if not member_ids:
        continue

    tasks_to_create = random.randint(8, 14)

    for _ in range(tasks_to_create):
        created_at = fake.date_time_between(
            start_date="-90d",
            end_date="now",
            tzinfo=None
        )
        deadline = created_at + timedelta(days=random.randint(3, 40))

        TaskService.create({
            "wp_id": wp.id,
            "name": random.choice(task_name_templates),
            "task_description": fake.text(max_nb_chars=140),
            "status": random.choice(statuses),
            "todo_by": random.choice(member_ids),
            "created_at": created_at.isoformat(),
            "deadline": deadline.isoformat(),
            "alert": random.choice([False, False, True])
        })

print("Tasks created")
print("Database seeded successfully!")
