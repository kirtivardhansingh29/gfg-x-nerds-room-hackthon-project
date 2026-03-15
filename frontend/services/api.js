function getApiBaseUrl() {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const { hostname } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:8000";
    }
  }

  throw new Error(
    "Backend URL is not configured. Set NEXT_PUBLIC_API_BASE_URL to your deployed backend URL."
  );
}

async function parseResponse(response) {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.detail || "Something went wrong while calling the backend.");
  }

  return payload;
}

async function apiRequest(path, options = {}) {
  const apiBaseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, options);
    return await parseResponse(response);
  } catch (error) {
    const message = String(error?.message || error || "");

    if (message.includes("Failed to fetch")) {
      throw new Error(
        "Cannot reach the backend. Check NEXT_PUBLIC_API_BASE_URL, backend health, and BACKEND_CORS_ORIGINS."
      );
    }

    throw error;
  }
}

export async function fetchSchema() {
  return apiRequest("/schema");
}

export async function uploadDataset(file) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest("/upload", {
    method: "POST",
    body: formData,
  });
}

export async function runQuery(payload) {
  return apiRequest("/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
