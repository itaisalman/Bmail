import "./SearchResult.css";

function SearchResult({ result }) {
  return (
    <div
      className="search-result"
      onClick={(e) => alert(`You clicked on ${result.title}`)}
    >
      {result.title}
    </div>
  );
}

export default SearchResult;
