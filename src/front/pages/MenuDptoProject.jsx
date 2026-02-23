import { useState } from "react";


export const MenuDptoProject = () => {

  const handleMenuDptoProject = () => {
    console.log("Crear nuevo Departamento");
  };

  const handleDptoProjectClick = (projectName) => {
    console.log("Entrar a:", projectName);
  };

  // Estado del modal
  const [showModal, setShowModal] = useState(false);

  // Estado del formulario del modal
  const [dptoData, setDptoData] = useState({
    departmentName: "",
  });

  // Función para actualizar campos del modal
  const handleChange = (field, value) => {
    setDptoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container py-5">

      {/* ENCABEZADO SUPERIOR */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">Menu de mis proyectos</h2>
        <div className="d-flex">

          <button className="btn btn-success m-1" onClick={handleMenuDptoProject}>
            Crear nuevo departamento
          </button>
          <button className="btn btn-warning m-1" onClick={handleMenuDptoProject}>
            Crear nuevo Reporte
          </button>
        </div>
      </div>

      <div className="p-5"></div>

      {/* BOTONES DE PROYECTOS */}
      <div className="d-flex flex-column p-4 gap-2 bg-light rounded-4">

        <button
          className="btn btn-outline-primary py-3 fs-5 rounded-4"
          onClick={() => {
            handleDptoProjectClick("Proyecto uno");
            setShowModal(true);
          }}
        >
          Proyecto uno
        </button>

        <button
          className="btn btn-outline-primary py-3 fs-5 rounded-4"
          onClick={() => {
            handleDptoProjectClick("Proyecto uno");
            setShowModal(true);
          }}
        >
          Proyecto uno
        </button>

        <button
          className="btn btn-outline-primary py-3 fs-5 rounded-4"
          onClick={() => {
            handleDptoProjectClick("Proyecto uno");
            setShowModal(true);
          }}
        >
          Proyecto uno
        </button>

      </div>

      {/* Render del modal */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">

            {showModal && (
              <ModalProject
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                data={dptoData}
                onChange={handleChange}
                onAddUser={() => { }}
                onDeleteUser={() => { }}
                onSubmit={() => { }}
              />
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};
