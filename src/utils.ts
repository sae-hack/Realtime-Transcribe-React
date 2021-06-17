import { API, Auth } from "aws-amplify";

export const makeRequest = <T>(path: string): Promise<T> => {
  return Auth.currentSession().then((session) => {
    const jwtToken = session.getIdToken().getJwtToken();
    return API.get("SAMAPI", path, {
      headers: { Authorization: "Bearer " + jwtToken },
    });
  });
};
