import 'express-session';

// Session data extension
// This allows us to add intellisense and typing support to the session attribute
// Any properties added here will show up looking at the properties of an express.Request.session
declare module 'express-session' {
  interface SessionData {}
}
