const pluralize = (count: number, singular: string, plural: string = singular + 's'): string => {
  if (count === 1) {
    return singular
  } else {
    return plural
  }
}

export default pluralize
