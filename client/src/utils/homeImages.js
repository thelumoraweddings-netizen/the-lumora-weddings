/**
 * homeImages.js
 * 
 * Vite's import.meta.glob automatically scans the src/assets/home_images folder.
 * To add images to the slider, place them in:
 *   client/public/images/homepage_image/
 * 
 * Since public/ files cannot be glob-imported, we use a manual list here
 * that mirrors the public folder contents. Add filenames to IMAGES array
 * whenever you add a new image to the folder.
 */

// All images from client/public/images/homepage_image/
// These are served directly by Vite at /images/homepage_image/<filename>
const IMAGE_NAMES = [
  'image_1.jpg',
  'image_2.jpg',
  'image_3.jpg',
  'image_4.jpg',
  'image_5.jpg',
  'image_6.jpg',
  'image_7.jpg',
  'image_8.jpg',
  'image_9.jpg',
  'image_10.jpg',
  'image_11.jpg',
  'image_12.jpg',
  'image_13.jpg',
  'image_14.jpg',
];

export const HOME_IMAGES = IMAGE_NAMES.map(name => `/images/homepage_image/${name}`);
