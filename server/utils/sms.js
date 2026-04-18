async function sendSmsToUser(user, message) {
  console.log(`[SMS] to=${user.phone || user.organization || user.email} message="${message.substring(0,80)}..."`);
  return true;
}
module.exports = { sendSmsToUser };
