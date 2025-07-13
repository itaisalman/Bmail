// Helper function that returns headers for fetch requests that require authentication with JWT
export const getAuthHeaders = (extraHeaders = {}) => {
  const token = sessionStorage.getItem("jwt");

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

export const createLabel = async (name) => {
  try {
    const res = await fetch("/api/labels", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    if (res.status === 201) {
      return data;
    }

    throw new Error(data.error || "Failed to create label");
  } catch (err) {
    throw err;
  }
};

export const updateLabel = async (label, name) => {
  try {
    const res = await fetch(`/api/labels/${label._id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name: name }),
    });

    if (res.status === 204) return;

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to update label");
    }

    return data;
  } catch (err) {
    throw err;
  }
};

export const deleteLabel = async (label) => {
  try {
    const res = await fetch(`/api/labels/${label._id}`, {
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

export async function assignLabelToMail(mail_id, label_id) {
  const res = await fetch(`/api/labels/${mail_id}/assign-label`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ label_id }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Failed to assign label to mail: " + error);
  }

  return;
}

// Assign a specific mail to label
export async function getSelectedLabelsOfMail(mail_id) {
  const res = await fetch(`/api/labels/mail/${mail_id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Failed to Selected Labels Of Mail: " + error);
  }
  const data = await res.json();
  return data;
}

export async function removeLabelFromMail(mail_id, label_id) {
  const res = await fetch(`/api/labels/mail/${mail_id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    body: JSON.stringify({ label_id }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Failed to remove label: " + error);
  }
}
