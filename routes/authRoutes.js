
const express = require("express");
const supabase = require("../supabaseClient");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required"
        });
    }

    try {
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

    return res.status(201).json({
        user: data.user
    });
} catch (error) {
    return res.status(500).json({
        error: "Internal server error"
    });
}
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required"
        });
    }

    try {
        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password
            });

        if (error) {
            return res.status(401).json({
                error: "Invalid login credentials"
            });
        }

        return res.status(200).json({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
        });
    } catch (error) {
        return res.status(500).json({
            error: "Internal server error"
        });
    }
});


router.post("/logout", async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Access token required"
        });
    }

    const token = authHeader.slice("Bearer ".length).trim();

    if (!token) {
        return res.status(401).json({
            error: "Access token required"
        });
    }

    try {
        const { createClient } = require("@supabase/supabase-js");

        const userSupabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_PUBLISHABLE_KEY,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                },
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                    detectSessionInUrl: false
                }
            }
        );

        const { error } = await userSupabase.auth.signOut();

        if (error) {
            return res.status(401).json({
                error: "Unable to log out"
            });
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({
            error: "Internal server error"
        });
    }
});


router.get("/../public/info", (req, res) => {
    res.status(200).json({
        message: "Welcome stranger! This info is public."
    });
});


module.exports = router;
