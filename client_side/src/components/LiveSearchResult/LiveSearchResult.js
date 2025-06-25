import SearchResult from "../SearchResult/SearchReult";
import "./LiveSearchResult.css";

function LiveSearchResult({ results, isLoading }) {
  return (
    <div className="result-list">
      {isLoading ? (
        // Add css to the loading and no optins divs
        <div className="empty-search">Loading...</div>
      ) : results?.length ? (
        results.map((result, id) => {
          return <SearchResult result={result} key={id} />;
        })
      ) : !results ? null : (
        <div className="empty-search">No Options.</div>
      )}
    </div>
  );
}

export default LiveSearchResult;
