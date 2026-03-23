"""
=============================================================================
                         CAPA DE CONTROLADORES
=============================================================================

Los controladores definen las rutas/endpoints de la API usando Blueprints.
Cada controlador se encarga de:
- Recibir la peticion HTTP
- Extraer los datos del request
- Llamar al servicio correspondiente
- Retornar la respuesta JSON con el codigo de estado adecuado

Cada controller es un sub-blueprint que se registra en el blueprint
principal 'api', por lo que todas las rutas quedan bajo /api/...
"""

from api.controllers.user_controller import user_bp
from api.controllers.department_controller import department_bp
from api.controllers.project_controller import project_bp
from api.controllers.task_controller import task_bp
from api.controllers.work_package_controller import work_package_bp
from api.controllers.auth_controller import auth_bp


def register_controllers(api):
    """
    Registra todos los sub-blueprints (controladores) en el blueprint principal.
    Se llama desde routes.py al inicializar la API.
    """
    api.register_blueprint(user_bp)
    api.register_blueprint(department_bp)
    api.register_blueprint(project_bp)
    api.register_blueprint(work_package_bp)
    api.register_blueprint(task_bp)
    api.register_blueprint(auth_bp)
