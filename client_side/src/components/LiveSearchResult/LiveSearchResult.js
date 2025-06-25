import "./LiveSearchResult.css";

function LiveSearchResult({ results }) {
  return (
    <div className="result-list">
      {results &&
        results.map((result, id) => {
          return <div key={id}>{result.title}</div>;
        })}
    </div>
  );
}

export default LiveSearchResult;
