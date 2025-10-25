# Quick Testing Guide - Login Redirect Fix

## What Was Fixed

**The Bug:** After successful login, nothing happened - user stayed on login page with no redirect.

**The Root Cause:** Backend `authenticate()` function called `next()` after `res.send()`, corrupting the response.

**The Fix:** Removed the `next()` call from line 120 in `student.server.controller.js`.

---

## Before You Test

### 1. Restart Backend Server (REQUIRED!)

The backend must be restarted for the fix to take effect.

```powershell
# Open a terminal and navigate to the backend folder
cd c:\Users\ASUS\dbms_mini_project\DinaraSharipova_comp308_Lab3

# Kill any existing Node processes (if needed)
taskkill /F /IM node.exe

# Wait a moment
Start-Sleep -Seconds 2

# Start the backend
node server.js
```

**Expected output:**
```
MongoDB connection successful
Express server running on: http://localhost:5001
Socket.IO initialized
```

### 2. Keep Frontend Running

The React app should be running on `http://localhost:3000`. If not:

```powershell
cd c:\Users\ASUS\dbms_mini_project\DinaraSharipova_comp308_Lab3\react-client
npm start
```

---

## Testing Login

### Step 1: Prepare

1. Open `http://localhost:3000` in your browser
2. Open Developer Tools (F12)
3. Go to the "Console" tab
4. Clear any previous logs (helpful for clarity)

### Step 2: Have Valid Credentials Ready

You'll need:
- A **Student Number** that exists in your MongoDB
- The correct **Password** for that student

**Don't have one?** You can:
- Register a new account first, OR
- Manually check MongoDB to find an existing student

### Step 3: Enter Credentials and Login

1. Click on "Register here" link if needed, OR
2. Enter student number and password in the login form
3. Click the "Login" button

### Step 4: Watch the Console

You should see logs appearing in real-time:

```javascript
calling auth                                    ← auth() function started
Full response: {data: {...}, status: 200, ...}  ← Got response from backend
Response data: {screen: "STU001", student: {...}}  ← Response contains screen!
Screen value: STU001                            ← Extracted the student number
Screen is undefined? false                      ← It's NOT undefined ✓
Setting screen to: STU001                       ← About to update state
Setting student to: [Object]                    ← Student data stored
Login successful! Screen: STU001                ← Success message
Screen state changed to: STU001                 ← State updated confirmed
```

### Step 5: Check UI

**Expected Result:**
- Login form **disappears**
- Dashboard **appears** showing:
  - Welcome heading
  - Student number display
  - Button group: [Enroll into course] [My Courses] [Profile] [Log out]

**If this happens → ✅ LOGIN FIX WORKS!**

---

## If Login Still Doesn't Work

### Check the Console for Error Messages

1. Look in the browser console (F12 → Console tab)
2. Do you see any red error messages?

**Common errors and solutions:**

| Error | Likely Cause | Solution |
|-------|--------------|----------|
| `POST /signin 401` | Invalid student number or password | Use correct credentials from MongoDB |
| `Cannot read property 'screen' of undefined` | Response didn't include screen property | Check backend logs, restart backend |
| `ERR_CORS_POLICY` | CORS headers not configured | Verify config/express.js has correct origin |
| `Network Error` | Backend not running | Start backend with `node server.js` |

### Check Backend Console

Look at the terminal where the backend is running. You should see:

```
POST /signin
token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

If you don't see these logs, the backend isn't receiving the request.

### Check Network Tab

1. Open DevTools (F12)
2. Go to "Network" tab
3. Clear the log
4. Try login again
5. Look for a request to `/signin` (POST method)
6. Click on it and check:
   - **Status:** Should be 200
   - **Response:** Should show `{"screen":"STU001","student":{...}}`
   - **Cookies:** Should see a `token` cookie being set

### Verify Student Exists in MongoDB

1. Connect to MongoDB manually
2. Check the `students` collection
3. Verify a student exists with the number you're trying to login with
4. Check that password hash matches using bcrypt

Example MongoDB query:
```javascript
db.students.findOne({studentNumber: "STU001"})
```

---

## Success Indicators

### ✅ Login IS Working If:
1. Console shows "Screen state changed to: STU001" (or your student number)
2. UI switches from login form to dashboard
3. Dashboard displays "Welcome to Student Panel"
4. Student number displays correctly
5. Buttons appear: "Enroll into course", "My Courses", "Profile", "Log out"
6. DevTools → Cookies shows a `token` cookie
7. Backend console shows token creation log

### ❌ Login Is NOT Working If:
1. Console shows error like "Cannot read property 'screen' of undefined"
2. Login form stays on screen
3. No state change logs appear
4. No error message displayed
5. Network request shows 401 or 500 status
6. Backend console doesn't show token creation

---

## What's Happening Behind the Scenes

### Before This Fix:
```
Frontend sends login → Backend receives it → Backend tries to respond 
→ Backend calls next() after res.send() → Response corrupted 
→ Frontend receives broken data → Screen property missing 
→ Redirect doesn't happen
```

### After This Fix:
```
Frontend sends login → Backend receives it → Backend creates JWT token 
→ Backend sets cookie with JWT → Backend sends clean response 
→ Frontend receives {screen: "STU001", student: {...}} 
→ Frontend updates state 
→ Component re-renders with new state 
→ Conditional check: screen !== 'auth' → TRUE 
→ <View> component renders instead of login form 
→ Dashboard displays ✓
```

---

## Next Steps After Successful Login

1. **Try Dashboard Functions:**
   - Click "My Courses" to see enrolled courses
   - Click "Enroll into course" to enroll in a new course
   - Click "Profile" to see your details
   - Click "Log out" to logout

2. **Test Cookie Persistence:**
   - After login, refresh the page (F5)
   - You should stay logged in (dashboard still shows)
   - Check browser cookies to see JWT token

3. **Test Registration (Optional):**
   - Click the "Register here" link during login
   - Fill in the registration form
   - It should redirect to login after successful registration

---

## Troubleshooting Checklist

Before contacting support, verify:

- [ ] Backend restarted after code changes
- [ ] Frontend restarted or browser page refreshed
- [ ] CORS origin in config/express.js is `http://localhost:3000`
- [ ] Student credentials are valid (exist in MongoDB)
- [ ] Database connection is working (check backend logs)
- [ ] No JavaScript errors in browser console
- [ ] Token cookie is being set (check DevTools → Cookies)
- [ ] Network request to /signin shows status 200

---

**Created:** October 25, 2025
**Status:** Ready for testing
