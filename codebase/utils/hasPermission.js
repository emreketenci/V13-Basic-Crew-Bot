function hasPermission(member, roleId) {
  return member.roles.cache.has(roleId)
    || Underline.config.developers.has(member.id)
    || member.permissions.has("ADMINISTRATOR")
}

module.exports = hasPermission;