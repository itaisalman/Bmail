import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchLabels,
  updateLabel,
  deleteLabel,
  getLabelByName,
} from "./apiLabels";

function LabelView() {
  const { labelName } = useParams();
  const [label, setLabel] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const loadLabels = async () => {
      const allLabels = await fetchLabels();
      const match = getLabelByName(allLabels, labelName);
      setLabel(match);
      setNewName(match?.name || "");
    };

    loadLabels();
  }, [labelName]);

  const handleUpdate = async () => {
    if (!label) return;
    await updateLabel(label.id, newName);
    alert("Label updated successfully");
  };

  const handleDelete = async () => {
    if (!label) return;
    await deleteLabel(label.id);
    alert("Label deleted");
  };

  return (
    <div>
      <h2>Label: {labelName}</h2>
    </div>
  );
}

export default LabelView;
