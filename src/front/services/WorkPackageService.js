const BASE_URL = import.meta.env.VITE_BACKEND_URL + "api/work_packages";

async function handleResponse(response) {
  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    console.log("Response is not JSON", error);
  }

  if (!response.ok) {
    const message =
      data?.description ||
      data?.message ||
      `Request failed with status ${response.status}`;

    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

function getAuthHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getWorkPackages(token) {
  const response = await fetch(BASE_URL, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  return handleResponse(response);
}

export async function getWorkPackageById(id, token) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  return handleResponse(response);
}

export async function createWorkPackage(payload, token) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({
      name: payload.name,
      project_id: payload.project_id,
    }),
  });

  return handleResponse(response);
}

export async function updateWorkPackage(id, payload, token) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function deleteWorkPackage(id, token) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  return handleResponse(response);
}

const workPackageService = {
  getWorkPackages,
  getWorkPackageById,
  createWorkPackage,
  updateWorkPackage,
  deleteWorkPackage,
};

export default workPackageService;
