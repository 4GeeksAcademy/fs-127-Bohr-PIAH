const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const fetchPdf = async (url, token) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    const text = await response.text();
    console.error("Backend error:", text);
    throw new Error("Error generating report");
  }

  if (!contentType || !contentType.includes("application/pdf")) {
    const text = await response.text();
    console.error("Response is not a PDF:", text);
    throw new Error("The server did not return a valid PDF");
  }

  return response.blob();
};

export const getProjectReport = (projectId, token) =>
  fetchPdf(`${BACKEND_URL}/api/reports/project/${projectId}`, token);

export const getDepartmentReport = (departmentId, token) =>
  fetchPdf(`${BACKEND_URL}/api/reports/department/${departmentId}`, token);

export const getOrganizationReport = (token) =>
  fetchPdf(`${BACKEND_URL}/api/reports/organization`, token);
