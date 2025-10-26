# Adding NIT Building Image to Login Page

## Instructions:

1. **Save the NIT building image** (from your attachment) as:
   ```
   C:\Users\ASUS\dbms_mini_project\dbms\react-client\public\assets\nit-building.jpg
   ```

2. **Update the CSS** to use the actual image by replacing the placeholder in `App.css`:

   Find this line in the `.login-image-section` class:
   ```css
   background: linear-gradient(45deg, rgba(44, 62, 80, 0.8), rgba(52, 152, 219, 0.6)), 
               url('data:image/svg+xml,...');
   ```

   Replace it with:
   ```css
   background: linear-gradient(45deg, rgba(44, 62, 80, 0.8), rgba(52, 152, 219, 0.6)), 
               url('/assets/nit-building.jpg');
   ```

## What You'll Get:

✅ **Split-screen login page** with NIT building image on the left
✅ **Clean login form** on the right side
✅ **Professional overlay** with "Academic Hub" branding
✅ **Responsive design** that works on mobile and desktop
✅ **Matches NIT theme** with navy blue colors and academic styling

## Alternative: Base64 Image

If you prefer, you can also convert the image to base64 and embed it directly in the CSS for faster loading.

The login page will look professional with the beautiful NIT building as the background!