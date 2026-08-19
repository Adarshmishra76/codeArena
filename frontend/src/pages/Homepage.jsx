import Problems from './Problems';

// Kept as a thin wrapper so existing routes/imports (App.jsx -> "./pages/Homepage")
// continue to work unchanged. All real implementation lives in Problems.jsx.
function Homepage() {
  return <Problems />;
}

export default Homepage;
