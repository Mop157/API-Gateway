exports.checkPermission = async (userPermissions, requestedPath) => {
    return userPermissions.includes(requestedPath);
};
