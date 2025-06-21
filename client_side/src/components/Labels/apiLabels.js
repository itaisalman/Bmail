// Helper function that returns headers for fetch requests that require authentication with JWT
export const getAuthHeaders = (extraHeaders = {}) => {
  const token = sessionStorage.getItem("jwt");
  const userId = sessionStorage.getItem("userId");

  if (!token) {
    throw new Error("Missing authentication token");
  }

  return {
    authorization: "Bearer " + token,
    user: userId,
    "Content-Type": "application/json",
    ...extraHeaders,
  };
};
// Helper function for finding a label by name
export const getLabelByName = (labels, name) => {
  return labels.find(
    (label) => label.name.toLowerCase().trim() === name.toLowerCase().trim()
  );
};

export const fetchLabels = async () => {
  const res = await fetch("/api/labels", {
    headers: getAuthHeaders(),
  });
  return res.json();
};

// Create a new label
export const createLabel = async (name) => {
  const res = await fetch("/api/labels", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });

  if (res.status === 201) {
    // Extracts the Location header from the response – it contains the address of the new label
    const location = res.headers.get("Location");
    const newId = location.split("/").pop();
    return { id: Number(newId), name };
  }

  const data = await res.json();
  throw new Error(data.error || "Failed to create label");
};

// Update label name
export const updateLabel = async (id, name) => {
  const res = await fetch(`/api/labels/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });

  if (res.status !== 204) {
    const data = await res.json();
    throw new Error(data.error || "Failed to update label");
  }
};

// Delete label
export const deleteLabel = async (id) => {
  const res = await fetch(`/api/labels/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (res.status !== 204) {
    const data = await res.json();
    throw new Error(data.error || "Failed to delete label");
  }
};
