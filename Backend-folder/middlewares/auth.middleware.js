import { supabaseUser,supabaseAdmin } from "../config/supabaseClient.js";

// Middleware to verify session stored in cookies and attach user to req.user
export const requireAuth = async (req, res, next) => {
  try {
    // Expect cookies to be parsed by cookie-parser middleware in server.js
    console.log('Auth middleware - cookies received:', req.cookies);
    const token = req.cookies?.sb_access_token;
    
    if (!token) {
      console.log('Auth middleware - no token found in cookies');
      return res.status(401).json({ error: 'Missing authentication token' });
    }
    
    console.log('Auth middleware - token found:', token.substring(0, 20) + '...');

    // Use Supabase auth to get user by access token
    const { data, error } = await supabaseUser.auth.getUser(token);

    if (error || !data?.user) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    console.log('Auth middleware - user verified:', data.user.email);
    req.user = data.user;
    return next();
  } catch (err) {
    console.error('Auth middleware unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
