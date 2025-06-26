import SearchResult from "../SearchResult/SearchReult";
import "./LiveSearchResult.css";

// This is the result screen dropdown component
function LiveSearchResult({ results, isLoading, setQuery, setResults }) {
  return (
    <div className="result-list">
      {isLoading ? (
        // Add css to the loading and no optins divs
        <div className="empty-search">Loading...</div>
      ) : results?.length ? (
        results.map((result, id) => {
          return (
            <SearchResult
              setQuery={setQuery}
              setResults={setResults}
              result={result}
              key={id}
            />
          );
        })
      ) : !results ? null : (
        <div className="empty-search">No Options.</div>
      )}
    </div>
  );
}

export default LiveSearchResult;
