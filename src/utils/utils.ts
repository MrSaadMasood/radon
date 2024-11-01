
export function ttlExpirationValidator(storedTTLWithTimeStampAdded: number) {
  return Date.now() > storedTTLWithTimeStampAdded
}
