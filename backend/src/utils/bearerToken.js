export const getAccessToken = (req) => {
    const authorization = req.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
        return null;
    }

    const token = authorization.slice(7).trim();

    return token || null;
};