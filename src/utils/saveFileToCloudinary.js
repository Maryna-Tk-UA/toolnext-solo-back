import { uploadBufferToCloudinary } from './uploadToCloudinary.js';

export function saveUserAvatarToCloudinary(buffer, userId) {
  return uploadBufferToCloudinary(buffer, {
    folder: 'toolnext-app/avatars',
    public_id: `avatar_${userId}`,
    overwrite: true,
    unique_filename: false,
  });
}

export function saveToolImageToCloudinary(buffer, toolId) {
  return uploadBufferToCloudinary(buffer, {
    folder: 'toolnext-app/tools',
    public_id: `tool_${toolId}`,
    overwrite: true,
    unique_filename: false,
  });
}
