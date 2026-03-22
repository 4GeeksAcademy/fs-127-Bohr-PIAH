const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("BACKEND_URL:", BACKEND_URL);

export const getProjectReport = async (projectId, token) => {
  const response = await fetch(
    `${BACKEND_URL}/api/reports/project/${projectId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const text = await response.text();
    console.error("Backend error:", text);
    throw new Error("Error generating report");
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/pdf")) {
    const text = await response.text();
    console.error("Response is not a PDF:", text);
    throw new Error("The server did not return a valid PDF");
  }

  return response.blob();
};
