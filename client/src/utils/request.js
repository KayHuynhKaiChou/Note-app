import { GRAPHQL_SERVER } from "./constants";

export const graphQL_Request = async (payload, options = {}) => {
    if (localStorage.getItem('accessToken')) {
        const res = await fetch(`${GRAPHQL_SERVER}/graphql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            ...options,
          },
          body: JSON.stringify(payload),
        });
        
        // Lỗi accessToken is expried
        if (!res.ok) { // res.ok return true khi status của res là từ 200 -> 299 tức là ko có lỗi
          if (res.status === 403) {
            return null;
          }
        }
    
        const { data } = await res.json();
        return data;
      }
    
      return null;
}