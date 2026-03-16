import random
from datetime import datetime, timedelta

from faker import Faker

from api.models import db

from api.services.department_service import department_service
from api.services.user_service import user_service
from api.services.project_service import project_service
from api.services.work_package_service import work_package_service
from api.services.task_service import task_service

from api.models.UserProject import UserProject
from api.models.department import Department
from api.models.user import User
from api.models.project import Project
from api.models.work_package import WorkPackage

fake = Faker()

print("Starting DB seed...")
# to run:
# flask shell
# exec(open("seed_data.py").read())

# -------------------------------------------------
# 1. CREATE DEPARTMENTS
# -------------------------------------------------

department_names = [
    "Engineering",
    "Product",
    "Operations",
    "Marketing"
]

departments = []

for name in department_names:
    department_service.create({
        "name": name
    })

departments = Department.query.all()

print("Departments created")

# -------------------------------------------------
# 2. CREATE USERS
# -------------------------------------------------

roles = ["admin", "head", "staff"]

users = []

for _ in range(20):
    user_service.create({
        "first_name": fake.first_name(),
        "last_name": fake.last_name(),
        "email": fake.unique.email(),
        "password": "1234",
        "role": random.choice(roles)
    })

users = User.query.all()

print("Users created")

# -------------------------------------------------
# 3. ASSIGN USERS TO DEPARTMENTS
# -------------------------------------------------

for user in users:
    dept = random.choice(departments)

    user_service.update(user.id, {
        "department_id": dept.id
    })

print("Users assigned to departments")

# -------------------------------------------------
# 4. ASSIGN HEADS
# -------------------------------------------------

for dept in departments:

    candidates = [
        u for u in users
        if u.department_id == dept.id and u.role in ["head", "admin"]
    ]

    if not candidates:
        continue

    head = random.choice(candidates)

    department_service.update(dept.id, {
        "head_id": head.id
    })

print("Department heads assigned")

# reload
departments = Department.query.all()

# -------------------------------------------------
# 5. CREATE PROJECTS
# -------------------------------------------------

projects = []

for dept in departments:

    head = User.query.get(dept.head_id)

    for _ in range(random.randint(2, 3)):

        created_at = fake.date_time_between(
            start_date="-120d", end_date="-30d")

        deadline = created_at + timedelta(days=random.randint(30, 120))

        project_service.create({
            "name": fake.bs().title(),
            "department_id": dept.id,
            "created_by": head.id,
            "created_at": created_at.isoformat(),
            "deadline": deadline.isoformat(),
            "finalized": random.choice([False, False, False, True])
        })

projects = Project.query.all()

print("Projects created")

# -------------------------------------------------
# 6. ASSIGN PROJECT MEMBERS
# -------------------------------------------------

memberships = []

for project in projects:

    dept_users = User.query.filter_by(
        department_id=project.department_id
    ).all()

    members = random.sample(dept_users, min(
        len(dept_users), random.randint(3, 6)))

    for m in members:
        memberships.append(
            UserProject(user_id=m.id, project_id=project.id)
        )

db.session.add_all(memberships)
db.session.commit()

print("Project members assigned")

# -------------------------------------------------
# 7. CREATE WORK PACKAGES
# -------------------------------------------------

wps = []

wp_names = [
    "Backend",
    "Frontend",
    "Infrastructure",
    "Testing",
    "Documentation"
]

for project in projects:

    for name in random.sample(wp_names, random.randint(2, 4)):

        work_package_service.create({
            "name": name,
            "project_id": project.id
        })

wps = WorkPackage.query.all()

print("Work packages created")

# -------------------------------------------------
# 8. CREATE TASKS
# -------------------------------------------------

statuses = ["to_do", "in_progress", "in_review", "done"]

for wp in wps:

    project_members = UserProject.query.filter_by(
        project_id=wp.project_id
    ).all()

    member_ids = [m.user_id for m in project_members]

    if not member_ids:
        continue

    for _ in range(random.randint(8, 15)):

        created_at = fake.date_time_between(start_date="-90d", end_date="now")

        deadline = created_at + timedelta(days=random.randint(3, 40))

        task_service.create({
            "wp_id": wp.id,
            "name": fake.sentence(nb_words=4),
            "task_description": fake.text(max_nb_chars=120),
            "status": random.choice(statuses),
            "todo_by": random.choice(member_ids),
            "created_at": created_at.isoformat(),
            "deadline": deadline.isoformat(),
            "alert": random.choice([True, False, False])
        })

print("Tasks created")

print("Database seeded successfully!")
