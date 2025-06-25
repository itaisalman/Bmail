import "./LiveSearchResult.css";

function LiveSearchResult({ results, onSelect }) {
  if (!results?.length) return null;

  return (
    <div className="live-search-results">
      {results.map((item, index) => (
        <div
          key={index}
          className="search-result-item"
          //   onClick={() => onSelect(item)}
        >
          {item.subject || item.title || item.content || "Untitled"}
        </div>
      ))}
    </div>
  );
}

export default LiveSearchResult;
