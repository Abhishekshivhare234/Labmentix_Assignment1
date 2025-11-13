import { supabaseUser, supabaseAdmin } from "../config/supabaseClient.js";

const ALLOWED_ROLES = ["student", "instructor", "admin"];

// -----------------------------
// SIGN UP HANDLER
// -----------------------------
export const userSignUpHandler = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: "email, password, name and role are required" });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ error: `role must be one of: ${ALLOWED_ROLES.join(', ')}` });
    }

    // ✅ Create user via Supabase Auth (anon client)
    const { data, error } = await supabaseUser.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
    });

    // Debug logging for signup result
    console.log('Supabase signUp response:', { data, error });

    if (error) {
      console.error("Supabase signup error:", error);
      return res.status(400).json({ error: error.message });
    }

    // ✅ Mirror user into public.users using admin key (bypasses RLS)
    if (data.user) {
      const { id, email: userEmail, user_metadata } = data.user;

      try {
        const { data: insertedUser, error: insertError } = await supabaseAdmin
          .from("users")
          .insert([
            {
              id,
              name: user_metadata?.name || name,
              email: userEmail,
              role: user_metadata?.role || role,
            },
          ])
          .select()
          .single();

        if (insertError) {
          console.error("Error inserting into users table:", insertError);
          // Don't expose DB internal error structure to the client
          return res.status(500).json({ error: 'Could not save user profile' });
        }

        console.log('Inserted user row:', insertedUser);
      } catch (e) {
        console.error('Exception while inserting user row:', e);
        return res.status(500).json({ error: 'Could not save user profile' });
      }
    } else {
      // If signup did not return a user object (e.g., magic link / confirmation flows), inform the client
      console.warn('Signup completed but no user object returned by Supabase. Response:', data);
      return res.status(200).json({ message: 'Signup initiated. Please check your email to confirm registration.', data });
    }

    // ✅ Set cookies if session returned
    if (data?.session) {
      const accessToken = data.session.access_token;
      const refreshToken = data.session.refresh_token;
      const expiresIn = data.session.expires_in ?? 7 * 24 * 60 * 60; // 7 days

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: expiresIn * 1000,
      };

      res.cookie("sb_access_token", accessToken, cookieOptions);
      if (refreshToken) res.cookie("sb_refresh_token", refreshToken, cookieOptions);
    }

    return res.status(201).json({
      message: "User registered successfully",
      user: data.user ?? null,
      session: data.session ?? null,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// -----------------------------
// SIGN IN HANDLER
// -----------------------------
export const signInHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    // ✅ Use supabaseUser for auth
    const { data, error } = await supabaseUser.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error during sign in:", error);
      return res.status(400).json({ error: error.message });
    }

    // ✅ Set cookies
    if (data?.session) {
      const accessToken = data.session.access_token;
      const refreshToken = data.session.refresh_token;
      const expiresIn = data.session.expires_in ?? 7 * 24 * 60 * 60;

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: expiresIn * 1000,
      };

      res.cookie("sb_access_token", accessToken, cookieOptions);
      if (refreshToken) res.cookie("sb_refresh_token", refreshToken, cookieOptions);
    }

    return res.status(200).json({
      message: "Login successful",
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    console.error("Sign in error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// -----------------------------
// GET PROFILE HANDLER
// -----------------------------
export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id) return res.status(401).json({ error: "Unauthorized" });

    // ✅ Use admin client (bypass RLS)
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ profile: data });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// -----------------------------
// LOGOUT HANDLER
// -----------------------------
export const logoutHandler = async (req, res) => {
  try {
    res.clearCookie("sb_access_token", { path: "/" });
    res.clearCookie("sb_refresh_token", { path: "/" });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
