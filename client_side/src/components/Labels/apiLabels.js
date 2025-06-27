// Helper function that returns headers for fetch requests that require authentication with JWT
export const getAuthHeaders = (extraHeaders = {}) => {
  const token = sessionStorage.getItem("jwt");

  if (!token) {
    throw new Error("Missing authentication token");
  }

  return {
    authorization: "Bearer " + token,
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
  try {
    const res = await fetch("/api/labels", {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to fetch labels");
    }

    return res.json();
  } catch (err) {
    throw err;
  }
};

// Create a new label
export const createLabel = async (name) => {
  try {
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
  } catch (err) {
    throw err;
  }
};

// Update label name
export const updateLabel = async (id, name) => {
  try {
    const res = await fetch(`/api/labels/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });

    if (res.status !== 204) {
      const data = await res.json();
      throw new Error(data.error || "Failed to update label");
    }
  } catch (err) {
    throw err;
  }
};

// Delete label
export const deleteLabel = async (id) => {
  try {
    const res = await fetch(`/api/labels/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (res.status !== 204) {
      const data = await res.json();
      throw new Error(data.error || "Failed to delete label");
    }
  } catch (err) {
    throw err;
  }
};

// Assign a specific mail to label
export async function assignLabelToMail(mailId, labelId) {
  const res = await fetch(`/api/mails/${mailId}/assign-label`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ labelId }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Failed to assign label: " + error);
  }

  return;
}
