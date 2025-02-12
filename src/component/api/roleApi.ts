const roleApi = (() => {
    const BASE_URL = "http://localhost:8080/api";
  
    async function getRole() {
      const response = await fetch(`${BASE_URL}/roles/:id`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const responseJson = await response.json();
      return responseJson.data;
    }
  
    return {
      getRole,
    };
  })();
  
  export default roleApi;
  