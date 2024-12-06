export const checkPermission = async (userPermissions: string, requestedPath: string): Promise<boolean> => {
    return userPermissions.includes(requestedPath);
};
