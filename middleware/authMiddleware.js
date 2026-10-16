const supabase = require("../supabaseClient");

async function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Missing or invalid Authorization header"
        });
    }

    const token = authHeader.slice("Bearer ".length).trim();

    if (!token) {
        return res.status(401).json({
            error: "Missing access token"
        });
    }

    try {
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({
                error: "Invalid or expired access token"
            });
        }

        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).json({
            error: "Unable to verify access token"
        });
    }
}

module.exports = requireAuth;