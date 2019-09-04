/**
 * Returns a pong for your ping.
 */
export default async function ping({
  args,
  message,
}: {
  args?: string[]
  message: { author: { username: string }; channel: any }
}) {
  // Send the response to the channel it was sent from
  await message.channel.createMessage('pong')
}
