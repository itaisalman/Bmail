import { useParams } from "react-router-dom";

function LabelView() {
  const { labelName } = useParams();

  return (
    <div>
      <h2>Label: {labelName}</h2>
    </div>
  );
}

export default LabelView;
