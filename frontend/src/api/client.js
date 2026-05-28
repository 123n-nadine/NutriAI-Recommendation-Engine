export const fetchRecommendations = async (userContext) => {
  const response = await fetch(`http://127.0.0.1:8000/recommendations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userContext),
  });

  if (!response.ok) {
    let errorDetail = "Failed to fetch recommendations";
    try {
      const err = await response.json();
      errorDetail = err.detail || errorDetail;
    } catch {
      // Ignored
    }
    throw new Error(errorDetail);
  }

  return response.json();
};
